# Análisis Profundo de la Base de Datos PostgreSQL con Prisma

## 1. Estructura General de la Base de Datos

### Configuración de Conexión
La base de datos está configurada en `.env` con los siguientes parámetros:
- **Host**: localhost
- **Puerto**: 5432 (puerto estándar de PostgreSQL)
- **Base de datos**: LTIdb
- **Usuario**: LTIdbUser
- **Contraseña**: D1ymf8wyQEGthFR1E9xhCq

### Esquema Prisma
El esquema se define en `backend/prisma/schema.prisma` con:
- **Proveedor**: PostgreSQL
- **Cliente**: prisma-client-js
- **Targets binarios**: native y debian-openssl-3.0.x (para compatibilidad con Docker)

## 2. Modelo de Datos y Relaciones

### Entidades Principales

#### **Candidate** (Tabla central)
```prisma
model Candidate {
  id                Int               @id @default(autoincrement())
  firstName         String            @db.VarChar(100)
  lastName          String            @db.VarChar(100)
  email             String            @unique @db.VarChar(255)
  phone             String?           @db.VarChar(15)
  address           String?           @db.VarChar(100)
  educations        Education[]
  workExperiences   WorkExperience[]
  resumes           Resume[]
}
```

**Análisis**:
- **Clave primaria**: `id` auto-incremental
- **Campos obligatorios**: firstName, lastName, email
- **Restricción única**: email (evita duplicados)
- **Campos opcionales**: phone, address
- **Relaciones**: 1:N con Education, WorkExperience y Resume

#### **Education** (Historial académico)
```prisma
model Education {
  id            Int       @id @default(autoincrement())
  institution   String    @db.VarChar(100)
  title         String    @db.VarChar(250)
  startDate     DateTime
  endDate       DateTime?
  candidateId   Int
  candidate     Candidate @relation(fields: [candidateId], references: [id])
}
```

**Análisis**:
- **Relación**: N:1 con Candidate
- **Campos obligatorios**: institution, title, startDate
- **Campo opcional**: endDate (para estudios en curso)
- **Longitud title**: 250 caracteres (mayor que otros campos)

#### **WorkExperience** (Experiencia laboral)
```prisma
model WorkExperience {
  id          Int       @id @default(autoincrement())
  company     String    @db.VarChar(100)
  position    String    @db.VarChar(100)
  description String?   @db.VarChar(200)
  startDate   DateTime
  endDate     DateTime?
  candidateId Int
  candidate   Candidate @relation(fields: [candidateId], references: [id])
}
```

**Análisis**:
- **Relación**: N:1 con Candidate
- **Campo opcional**: description y endDate
- **Longitud description**: 200 caracteres (para detalles del puesto)

#### **Resume** (Currículums)
```prisma
model Resume {
  id          Int       @id @default(autoincrement())
  filePath    String    @db.VarChar(500)
  fileType    String    @db.VarChar(50)
  uploadDate  DateTime
  candidateId Int
  candidate   Candidate @relation(fields: [candidateId], references: [id])
}
```

**Análisis**:
- **Relación**: N:1 con Candidate
- **filePath**: 500 caracteres (para rutas largas)
- **Metadatos**: fileType y uploadDate para gestión de archivos

## 3. Implementación del ORM

### Modelos de Dominio

#### **`backend/src/domain/models/Candidate.ts`**
```typescript
export class Candidate {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    education: Education[];
    workExperience: WorkExperience[];
    resumes: Resume[];
}
```

**Patrón implementado**:
- **Active Record**: Cada modelo tiene su método `save()`
- **Validación**: Campos opcionales con `?`
- **Relaciones**: Arrays para relaciones 1:N

#### **Gestión de Transacciones**
En `candidateService.ts`:
```typescript
export const addCandidate = async (candidateData: any) => {
    const candidate = new Candidate(candidateData);
    const savedCandidate = await candidate.save();
    const candidateId = savedCandidate.id;
    
    // Guardar entidades relacionadas
    if (candidateData.educations) {
        for (const education of candidateData.educations) {
            const educationModel = new Education(education);
            educationModel.candidateId = candidateId;
            await educationModel.save();
        }
    }
    // ... más relaciones
};
```

**Problema identificado**: No hay transacciones explícitas, lo que puede causar inconsistencias si falla una operación intermedia.

## 4. Patrones de Uso y Optimizaciones

### Conexión a la Base de Datos
```typescript
// En index.ts
const prisma = new PrismaClient();
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});
```

**Patrón singleton**: Una sola instancia de PrismaClient compartida.

### Validaciones
El sistema implementa validaciones en `validator.ts`:
- **Regex patterns**: Para email, teléfono, nombres
- **Longitud**: Validaciones acorde al esquema de DB
- **Fechas**: Formato YYYY-MM-DD

## 5. Problemas Identificados y Recomendaciones

### 🔴 Problemas Críticos

1. **Falta de Transacciones**
   ```typescript
   // Problema actual: operaciones separadas
   await candidate.save();
   await education.save();
   await workExperience.save();
   ```
   
   **Solución recomendada**:
   ```typescript
   await prisma.$transaction(async (tx) => {
     const candidate = await tx.candidate.create({...});
     await tx.education.createMany({...});
     await tx.workExperience.createMany({...});
   });
   ```

2. **Múltiples Instancias de PrismaClient**
   Cada modelo crea su propia instancia:
   ```typescript
   const prisma = new PrismaClient(); // ❌ En cada modelo
   ```
   
   **Solución**: Inyección de dependencias o singleton global.

3. **Manejo de Errores Inconsistente**
   ```typescript
   } catch (error: any) {
     if (error.code === 'P2002') {
       throw new Error('The email already exists in the database');
     }
   }
   ```

### 🟡 Mejoras Recomendadas

1. **Índices de Base de Datos**
   ```prisma
   model Candidate {
     email String @unique @db.VarChar(255)
     @@index([lastName]) // Para búsquedas por apellido
     @@index([email])    // Ya existe por @unique
   }
   ```

2. **Soft Deletes**
   ```prisma
   model Candidate {
     deletedAt DateTime?
     @@map("candidates")
   }
   ```

3. **Timestamps Automáticos**
   ```prisma
   model Candidate {
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```

4. **Paginación en Consultas**
   ```typescript
   const candidates = await prisma.candidate.findMany({
     skip: (page - 1) * pageSize,
     take: pageSize,
   });
   ```

## 6. Configuración de Producción

### Docker Compose
El proyecto incluye `docker-compose.yml`:
```yaml
services:
  db:
    image: postgres
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - ${DB_PORT}:5432
```

### Migraciones
- **Lock file**: migration_lock.toml
- **Proveedor**: PostgreSQL
- **Scripts**: `prisma:generate` y `prisma:init` en package.json

## 7. Monitoreo y Mantenimiento

### Logging
Actualmente limitado a:
```typescript
console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
```

### Recomendaciones de Monitoreo
1. **Query logging** en Prisma
2. **Connection pooling** para producción
3. **Métricas de rendimiento**
4. **Backup automático**

## 8. Escalabilidad

### Limitaciones Actuales
- Sin cache (Redis)
- Sin read replicas
- Sin particionado de tablas
- Sin optimización de consultas N+1

### Roadmap de Escalabilidad
1. **Nivel 1**: Índices y optimización de consultas
2. **Nivel 2**: Connection pooling y cache
3. **Nivel 3**: Read replicas y sharding
4. **Nivel 4**: Microservicios y event sourcing

## 9. Diagrama de Relaciones

```
Candidate (1) ──────── (N) Education
    │
    ├─────────────────── (N) WorkExperience
    │
    └─────────────────── (N) Resume
```

## 10. Comandos Útiles

### Prisma CLI
```bash
# Generar cliente
npx prisma generate

# Crear migración
npx prisma migrate dev --name init

# Resetear base de datos
npx prisma migrate reset

# Visualizar base de datos
npx prisma studio
```

### PostgreSQL
```sql
-- Verificar conexiones activas
SELECT * FROM pg_stat_activity WHERE datname = 'LTIdb';

-- Verificar tamaño de tablas
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public';
```

## 11. Conclusiones

La base de datos está bien estructurada para un MVP, pero necesita mejoras significativas en:
- **Transacciones** para garantizar consistencia
- **Manejo de errores** estandarizado
- **Optimizaciones** para escalabilidad
- **Monitoreo** para producción

**Prioridades de mejora**:
1. Implementar transacciones en operaciones complejas
2. Añadir índices para optimizar consultas
3. Implementar timestamps automáticos
4. Configurar connection pooling
5. Añadir logging estructurado

---

*Documento generado el 7 de julio de 2025*
*Versión: 1.0*
