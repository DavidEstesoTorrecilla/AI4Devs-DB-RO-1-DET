# Prompts de Usuario - Sesión DET



# Prompt 1
DavidEstesoTorrecilla:  Eres un experto en prisma y bases de datos postgreSQL. Realiza un analisis profundo del uso de la base de datos. Su estructura y cualquier cosa relatiba con la misma que nos sea de utilidad para conocer mejor como funcionan en este proyecto y poder realizar cambios, mantenerla y optimizarla en un futuro

Workspace: Recopilando información del área de trabajo# Análisis Profundo de la Base de Datos PostgreSQL con Prisma

# Prompt 2
Genera un archivo Analisis-bbdd.md con toda esta información para poder tenerla de contexto

# Prompt 3: Fusionar y Expandir Schema de Prisma

## ROL
Eres un Arquitecto de Bases de Datos experto y desarrollador senior especializado en Prisma ORM y PostgreSQL. Tu tarea es expandir un esquema de base de datos existente de manera robusta, normalizada y optimizada.

## CONTEXTO
Estoy expandiendo mi aplicación, que ya cuenta con un `schema.prisma` para gestionar candidatos y sus perfiles. Necesito integrar un nuevo flujo de trabajo para gestionar posiciones, aplicaciones y entrevistas.

Tengo dos fuentes de información:
1.  Mi `schema.prisma` **existente**.
2.  Un **ERD** con las nuevas entidades que debo añadir.

**1. Schema de Prisma Existente:**
en el archivo schema.prisma
**2. ERD con Nuevas Entidades:**
```mermaid
erDiagram
    COMPANY { int id, string name }
    EMPLOYEE { int id, int company_id, string name, string email, string role, boolean is_active }
    POSITION { int id, int company_id, string title, text description, text company_description }
    APPLICATION { int id, int position_id, int candidate_id, date application_date, string status }
    INTERVIEW { int id, int application_id, int employee_id, date interview_date }
    // ... y otras tablas relacionadas como INTERVIEW_FLOW, STEP, TYPE
    CANDIDATE ||--o{ APPLICATION : submits
    POSITION ||--o{ APPLICATION : receives
    COMPANY ||--o{ POSITION : offers
```

## TAREA
Analiza ambas fuentes y genera un único fichero `schema.prisma` **actualizado** que cumpla con los siguientes requisitos:

1.  **Conservar Modelos Existentes**: Mantén los modelos `Candidate`, `Education`, `WorkExperience` y `Resume` con su estructura actual de IDs (`Int @id @default(autoincrement())`) para no romper la compatibilidad con los datos existentes.

2.  **Añadir Auditoría y Soft Delete**:
    - **Añade** a los modelos existentes (`Candidate`, `Education`, etc.) los siguientes campos: `createdAt DateTime @default(now())`, `updatedAt DateTime @updatedAt` y `deletedAt DateTime?`.
    - Esto implementará la auditoría y el borrado lógico de forma no destructiva.

3.  **Añadir y Normalizar Nuevos Modelos**:
    - Incorpora **todos** los nuevos modelos del ERD (`COMPANY`, `EMPLOYEE`, `POSITION`, `APPLICATION`, `INTERVIEW`, `INTERVIEW_FLOW`, `INTERVIEW_STEP`, `INTERVIEW_TYPE`).
    - Aplica buenas prácticas a estos **nuevos** modelos:
        - Usa `String @id @default(cuid())` como clave primaria para mantener un estándar moderno.
        - Añade los campos de auditoría (`createdAt`, `updatedAt`) y borrado lógico (`deletedAt`).
        - Normaliza los datos (ej., elimina `POSITION.company_description` y confía en la relación con `COMPANY`).
        - Usa tipos de datos apropiados de Prisma (`Decimal` para salarios, etc.).

4.  **Integrar Relaciones**:
    - Conecta los nuevos modelos entre sí de forma correcta (`@relation`).
    - Crucialmente, establece la relación entre `APPLICATION` y el modelo **existente** `Candidate`. La clave foránea en `Application` (`candidateId`) debe ser de tipo `Int` para coincidir con `Candidate.id`.

5.  **Índices**:
    - Añade índices (`@@index([...])`) a todas las claves foráneas en los nuevos modelos.
    - Asegúrate de que los campos `email` en `EMPLOYEE` sean `@unique`.

## SALIDA
Un único bloque de código con el contenido completo del fichero `schema.prisma` final, fusionado y listo para ser usado.


# Prompt 4: Fusionar y Expandir Schema de Prisma

## ROL
Eres un Arquitecto de Bases de Datos experto y desarrollador senior especializado en Prisma ORM y PostgreSQL. Tu tarea es expandir un esquema de base de datos existente de manera robusta, normalizada y optimizada.

## CONTEXTO
Estoy expandiendo mi aplicación, que ya cuenta con un `schema.prisma` para gestionar candidatos y sus perfiles. Necesito integrar un nuevo flujo de trabajo para gestionar posiciones, aplicaciones y entrevistas.

Tengo dos fuentes de información:
1.  Mi `schema.prisma` **existente**.
2.  Un **ERD** con las nuevas entidades que debo añadir.

**1. Schema de Prisma Existente:**
en el archivo 'schema.prisma'
**2. ERD con Nuevas Entidades:**
```mermaid
erDiagram
    COMPANY { int id, string name }
    EMPLOYEE { int id, int company_id, string name, string email, string role, boolean is_active }
    POSITION { int id, int company_id, string title, text description, text company_description }
    APPLICATION { int id, int position_id, int candidate_id, date application_date, string status }
    INTERVIEW { int id, int application_id, int employee_id, date interview_date }
    // ... y otras tablas relacionadas como INTERVIEW_FLOW, STEP, TYPE
    CANDIDATE ||--o{ APPLICATION : submits
    POSITION ||--o{ APPLICATION : receives
    COMPANY ||--o{ POSITION : offers
```

## TAREA
Analiza ambas fuentes y genera un único fichero `schema.prisma` **actualizado** que cumpla con los siguientes requisitos:

1.  **Conservar Modelos Existentes**: Mantén los modelos `Candidate`, `Education`, `WorkExperience` y `Resume` con su estructura actual de IDs (`Int @id @default(autoincrement())`) para no romper la compatibilidad con los datos existentes.

2.  **Añadir Auditoría y Soft Delete**:
    - **Añade** a los modelos existentes (`Candidate`, `Education`, etc.) los siguientes campos: `createdAt DateTime @default(now())`, `updatedAt DateTime @updatedAt` y `deletedAt DateTime?`.
    - Esto implementará la auditoría y el borrado lógico de forma no destructiva.

3.  **Añadir y Normalizar Nuevos Modelos**:
    - Incorpora **todos** los nuevos modelos del ERD (`COMPANY`, `EMPLOYEE`, `POSITION`, `APPLICATION`, `INTERVIEW`, `INTERVIEW_FLOW`, `INTERVIEW_STEP`, `INTERVIEW_TYPE`).
    - Aplica buenas prácticas a estos **nuevos** modelos:
        - Usa `String @id @default(cuid())` como clave primaria para mantener un estándar moderno.
        - Añade los campos de auditoría (`createdAt`, `updatedAt`) y borrado lógico (`deletedAt`).
        - Normaliza los datos (ej., elimina `POSITION.company_description` y confía en la relación con `COMPANY`).
        - Usa tipos de datos apropiados de Prisma (`Decimal` para salarios, etc.).

4.  **Integrar Relaciones**:
    - Conecta los nuevos modelos entre sí de forma correcta (`@relation`).
    - Crucialmente, establece la relación entre `APPLICATION` y el modelo **existente** `Candidate`. La clave foránea en `Application` (`candidateId`) debe ser de tipo `Int` para coincidir con `Candidate.id`.

5.  **Índices**:
    - Añade índices (`@@index([...])`) a todas las claves foráneas en los nuevos modelos.
    - Asegúrate de que los campos `email` en `EMPLOYEE` sean `@unique`.

## SALIDA
Un único bloque de código con el contenido completo del fichero `schema.prisma` final, fusionado y listo para ser usado.

# Prompt 5: Crear Middleware de Prisma para Soft Delete Genérico

## ROL
Eres un desarrollador experto en TypeScript y Prisma, especializado en la creación de middleware para extender la funcionalidad del Prisma Client.

## CONTEXTO
[cite_start]En mi `schema.prisma` unificado, ahora todos mis modelos (`Candidate`, `Education`, `WorkExperience`, `Resume`, `Company`, `Employee`, `Position`, `Application`, `Interview`) incluyen un campo `deletedAt DateTime?` para implementar el borrado lógico (soft delete)[cite: 198, 545]. Quiero crear un middleware genérico para gestionar este comportamiento de forma centralizada.

## TAREA
Crea una función de middleware de Prisma en TypeScript que logre lo siguiente:

1.  **Configuración de Modelos**: El middleware debe poder aplicarse a una lista configurable de modelos para que sea reutilizable.

2.  **Interceptar Borrados**:
    - [cite_start]Para las acciones `delete` y `deleteMany`, el middleware debe cambiarlas a `update` y `updateMany`[cite: 312, 316].
    - [cite_start]La operación de actualización debe establecer el campo `deletedAt` a la fecha y hora actual (`new Date()`)[cite: 313, 320].

3.  **Interceptar Lecturas**:
    - [cite_start]Para las acciones `findUnique`, `findFirst`, `findMany` y sus variantes `...OrThrow`, el middleware debe añadir automáticamente una condición `where` para filtrar los registros ya borrados (`deletedAt: null`)[cite: 485, 506].
    - Debe ser posible **incluir** los registros borrados si en la consulta se pasa un parámetro `includeDeleted: true`. El middleware debe detectar este parámetro para omitir el filtro `deletedAt: null`.

4.  **Prevenir Actualizaciones en Borrados**:
    - [cite_start]Para `update` y `updateMany`, el middleware debe añadir una condición al `where` para evitar la modificación de registros ya marcados como borrados (`deletedAt: null`)[cite: 458].

## SALIDA
Un único bloque de código TypeScript que contenga la implementación completa del middleware de borrado lógico. El código debe estar bien comentado, ser robusto y fácil de adaptar.

# Prompt 6: Generar Consultas SQL de Verificación Integrada

## ROL
Eres un Analista de Datos experto en PostgreSQL con una profunda comprensión de consultas complejas, `JOINs` y optimización.

## CONTEXTO
He expandido mi base de datos de PostgreSQL. Ahora contiene tablas de un sistema de seguimiento de candidatos (ATS) (`Company`, `Position`, `Application`, `Interview`, etc.) que están integradas con mis tablas originales de perfiles de candidatos (`Candidate`, `Education`, `WorkExperience`). Necesito consultas SQL para verificar que las relaciones entre los datos nuevos y los antiguos funcionan correctamente.

## TAREA
Escribe 3 consultas SQL para PostgreSQL que realicen lo siguiente:

1.  **Consulta 1: Perfil Completo de Candidatos con Aplicaciones Activas**:
    - Obtener una lista de candidatos (`Candidate`) que hayan aplicado a la posición de 'Software Engineer'.
    - Para cada candidato, mostrar su nombre completo, email, el nombre de la institución de su última titulación (`Education`), y el nombre de la empresa de su última experiencia laboral (`WorkExperience`).
    - Utiliza `INNER JOIN` para conectar `Candidate` con `Application` y `Position`, y `LEFT JOIN` con `Education` y `WorkExperience` para incluir a todos los candidatos aplicantes, incluso si no tienen perfil educativo o laboral.

2.  **Consulta 2: Entrevistas Programadas por Empresa**:
    - Obtener todas las entrevistas (`Interview`) programadas para la próxima semana para la empresa 'Tech Solutions Inc.'.
    - La consulta debe devolver el título de la posición (`Position`), el nombre del candidato (`Candidate`), la fecha de la entrevista, el nombre de la fase (`InterviewStep`) y el nombre del empleado (`Employee`) que la realizará.
    - Esta consulta requiere múltiples `JOINs` a través de `Company`, `Position`, `Application`, `Interview`, `Candidate`, `Employee` y `InterviewStep`.

3.  **Consulta 3: Conteo de Aplicaciones por Posición**:
    - Generar un reporte que muestre cada posición (`Position`) junto con el número total de aplicaciones (`Application`) que ha recibido.
    - Ordena el resultado de mayor a menor número de aplicaciones para ver las posiciones más populares.
    - Utiliza `GROUP BY` en el título de la posición y `COUNT` sobre las aplicaciones.

## SALIDA
Tres bloques de código SQL, cada uno con una consulta. Añade comentarios (`--`) a cada consulta para explicar su propósito y la lógica de los `JOINs`.

# Prompt 7: 
Me gustaría que comprobases que se aplican buenas practicas en la base de datos como la definición de Indices y la normalización de la base de datos

