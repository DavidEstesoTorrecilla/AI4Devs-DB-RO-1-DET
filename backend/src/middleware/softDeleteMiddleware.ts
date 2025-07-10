import { Prisma, PrismaClient } from '@prisma/client';

/**
 * Configuración del middleware de soft delete
 */
interface SoftDeleteConfig {
  models: string[]; // Lista de modelos que implementan soft delete
}

/**
 * Parámetros extendidos para consultas que pueden incluir registros borrados
 */
interface ExtendedArgs {
  includeDeleted?: boolean;
  [key: string]: any;
}

/**
 * Middleware genérico para implementar soft delete en Prisma
 * 
 * @param config - Configuración que especifica qué modelos usan soft delete
 * @returns Función middleware para Prisma Client
 */
export function createSoftDeleteMiddleware(config: SoftDeleteConfig) {
  return async (params: any, next: any) => {
    const { model, action, args = {} } = params;
    
    // Solo aplicar el middleware a los modelos configurados
    if (!model || !config.models.includes(model)) {
      return next(params);
    }

    const extendedArgs = args as ExtendedArgs;

    switch (action) {
      // ===========================
      // INTERCEPTAR BORRADOS FÍSICOS
      // ===========================
      case 'delete':
        // Convertir delete a update con deletedAt
        params.action = 'update';
        params.args = {
          ...args,
          data: {
            deletedAt: new Date(),
          },
        };
        break;

      case 'deleteMany':
        // Convertir deleteMany a updateMany con deletedAt
        params.action = 'updateMany';
        params.args = {
          ...args,
          data: {
            deletedAt: new Date(),
          },
        };
        break;

      // ===========================
      // INTERCEPTAR LECTURAS
      // ===========================
      case 'findUnique':
      case 'findUniqueOrThrow':
        if (!extendedArgs.includeDeleted) {
          params.args = {
            ...args,
            where: {
              ...args.where,
              deletedAt: null,
            },
          };
        }
        // Limpiar el parámetro custom antes de enviar a Prisma
        if (extendedArgs.includeDeleted !== undefined) {
          delete extendedArgs.includeDeleted;
        }
        break;

      case 'findFirst':
      case 'findFirstOrThrow':
        if (!extendedArgs.includeDeleted) {
          params.args = {
            ...args,
            where: {
              ...args.where,
              deletedAt: null,
            },
          };
        }
        // Limpiar el parámetro custom antes de enviar a Prisma
        if (extendedArgs.includeDeleted !== undefined) {
          delete extendedArgs.includeDeleted;
        }
        break;

      case 'findMany':
        if (!extendedArgs.includeDeleted) {
          params.args = {
            ...args,
            where: {
              ...args.where,
              deletedAt: null,
            },
          };
        }
        // Limpiar el parámetro custom antes de enviar a Prisma
        if (extendedArgs.includeDeleted !== undefined) {
          delete extendedArgs.includeDeleted;
        }
        break;

      case 'count':
        if (!extendedArgs.includeDeleted) {
          params.args = {
            ...args,
            where: {
              ...args.where,
              deletedAt: null,
            },
          };
        }
        // Limpiar el parámetro custom antes de enviar a Prisma
        if (extendedArgs.includeDeleted !== undefined) {
          delete extendedArgs.includeDeleted;
        }
        break;

      // ===========================
      // PREVENIR ACTUALIZACIONES EN BORRADOS
      // ===========================
      case 'update':
      case 'updateMany':
        // Añadir condición para evitar actualizar registros ya borrados
        params.args = {
          ...args,
          where: {
            ...args.where,
            deletedAt: null,
          },
        };
        break;

      // ===========================
      // OPERACIONES DE AGREGACIÓN
      // ===========================
      case 'aggregate':
      case 'groupBy':
        if (!extendedArgs.includeDeleted) {
          params.args = {
            ...args,
            where: {
              ...args.where,
              deletedAt: null,
            },
          };
        }
        // Limpiar el parámetro custom antes de enviar a Prisma
        if (extendedArgs.includeDeleted !== undefined) {
          delete extendedArgs.includeDeleted;
        }
        break;

      // ===========================
      // OPERACIONES SIN MODIFICAR
      // ===========================
      default:
        // Para create, createMany, upsert, etc. no hacer nada
        break;
    }

    return next(params);
  };
}

/**
 * Configuración por defecto con todos los modelos que implementan soft delete
 */
export const defaultSoftDeleteConfig: SoftDeleteConfig = {
  models: [
    'Candidate',
    'Education', 
    'WorkExperience',
    'Resume',
    'Company',
    'Employee',
    'Position',
    'Application',
    'Interview',
    'InterviewType',
    'InterviewFlow',
    'InterviewStep'
  ]
};

/**
 * Función helper para crear el middleware con la configuración por defecto
 */
export function createDefaultSoftDeleteMiddleware() {
  return createSoftDeleteMiddleware(defaultSoftDeleteConfig);
}

/**
 * Tipos extendidos para usar en las consultas con includeDeleted
 */
export type FindManyArgsWithDeleted<T> = T & { includeDeleted?: boolean };
export type FindUniqueArgsWithDeleted<T> = T & { includeDeleted?: boolean };
export type FindFirstArgsWithDeleted<T> = T & { includeDeleted?: boolean };
export type CountArgsWithDeleted<T> = T & { includeDeleted?: boolean };