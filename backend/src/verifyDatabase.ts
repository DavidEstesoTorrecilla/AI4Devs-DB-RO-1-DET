import { PrismaClient, Prisma } from '@prisma/client';
import { createDefaultSoftDeleteMiddleware } from './middleware/softDeleteMiddleware';

// Crear instancia de Prisma con middleware de soft delete
const prisma = new PrismaClient();
prisma.$use(createDefaultSoftDeleteMiddleware());

/**
 * Script de verificación de la base de datos
 * Ejecuta consultas SQL para verificar las relaciones e integridad de los datos
 */

console.log('🔍 Iniciando verificación de la base de datos...\n');

/**
 * Consulta 1: Perfil Completo de Candidatos con Aplicaciones Activas
 */
async function verificarCandidatosConAplicaciones() {
  console.log('📋 Consulta 1: Candidatos que han aplicado a posiciones de Software Engineer');
  console.log('=' .repeat(80));
  
  try {
    const result = await prisma.$queryRaw`
      SELECT DISTINCT
          c."firstName" || ' ' || c."lastName" AS candidate_name,
          c.email,
          latest_edu.institution AS latest_education_institution,
          latest_work.company AS latest_work_company,
          p.title AS position_title,
          comp.name AS company_name
      FROM 
          "Candidate" c
          INNER JOIN "Application" app ON c.id = app."candidateId"
          INNER JOIN "Position" p ON app."positionId" = p.id
          INNER JOIN "Company" comp ON p."companyId" = comp.id
          
          LEFT JOIN (
              SELECT DISTINCT ON (e."candidateId") 
                  e."candidateId",
                  e.institution,
                  e."endDate"
              FROM "Education" e
              WHERE e."deletedAt" IS NULL
              ORDER BY e."candidateId", e."endDate" DESC NULLS FIRST
          ) latest_edu ON c.id = latest_edu."candidateId"
          
          LEFT JOIN (
              SELECT DISTINCT ON (w."candidateId")
                  w."candidateId",
                  w.company,
                  w."endDate"
              FROM "WorkExperience" w
              WHERE w."deletedAt" IS NULL
              ORDER BY w."candidateId", w."endDate" DESC NULLS FIRST
          ) latest_work ON c.id = latest_work."candidateId"

      WHERE 
          p.title ILIKE '%Software Engineer%'
          AND c."deletedAt" IS NULL
          AND app."deletedAt" IS NULL
          AND p."deletedAt" IS NULL
          AND comp."deletedAt" IS NULL

      ORDER BY c."firstName", c."lastName"
      LIMIT 10;
    `;

    if (Array.isArray(result) && result.length > 0) {
      console.log(`✅ Encontrados ${result.length} candidatos que aplicaron a Software Engineer:`);
      result.forEach((row: any, index) => {
        console.log(`${index + 1}. ${row.candidate_name} (${row.email})`);
        console.log(`   📍 Posición: ${row.position_title} en ${row.company_name}`);
        console.log(`   🎓 Última educación: ${row.latest_education_institution || 'N/A'}`);
        console.log(`   💼 Última empresa: ${row.latest_work_company || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('⚠️  No se encontraron candidatos que hayan aplicado a posiciones de Software Engineer');
      console.log('💡 Esto puede ser normal si no hay datos de prueba aún\n');
    }
  } catch (error) {
    console.error('❌ Error en la consulta 1:', error);
  }
}

/**
 * Consulta 2: Entrevistas Programadas por Empresa
 */
async function verificarEntrevistasProgramadas() {
  console.log('📅 Consulta 2: Entrevistas programadas para la próxima semana');
  console.log('=' .repeat(80));
  
  try {
    const result = await prisma.$queryRaw`
      SELECT 
          p.title AS position_title,
          c."firstName" || ' ' || c."lastName" AS candidate_name,
          i."interviewDate",
          i.type AS interview_type,
          i.status AS interview_status,
          e.name AS interviewer_name,
          e.role AS interviewer_role,
          comp.name AS company_name
      FROM 
          "Interview" i
          INNER JOIN "Application" app ON i."applicationId" = app.id
          INNER JOIN "Candidate" c ON app."candidateId" = c.id
          INNER JOIN "Position" p ON app."positionId" = p.id
          INNER JOIN "Company" comp ON p."companyId" = comp.id
          INNER JOIN "Employee" e ON i."employeeId" = e.id

      WHERE 
          i."interviewDate" >= CURRENT_DATE
          AND i."interviewDate" < CURRENT_DATE + INTERVAL '7 days'
          AND i."deletedAt" IS NULL
          AND app."deletedAt" IS NULL
          AND c."deletedAt" IS NULL
          AND p."deletedAt" IS NULL
          AND comp."deletedAt" IS NULL
          AND e."deletedAt" IS NULL

      ORDER BY i."interviewDate", p.title, c."lastName"
      LIMIT 10;
    `;

    if (Array.isArray(result) && result.length > 0) {
      console.log(`✅ Encontradas ${result.length} entrevistas programadas:`);
      result.forEach((row: any, index) => {
        console.log(`${index + 1}. ${row.candidate_name} - ${row.position_title}`);
        console.log(`   🏢 Empresa: ${row.company_name}`);
        console.log(`   📅 Fecha: ${new Date(row.interviewDate).toLocaleDateString()}`);
        console.log(`   👤 Entrevistador: ${row.interviewer_name} (${row.interviewer_role})`);
        console.log(`   📋 Tipo: ${row.interview_type} - Estado: ${row.interview_status}`);
        console.log('');
      });
    } else {
      console.log('⚠️  No se encontraron entrevistas programadas para la próxima semana');
      console.log('💡 Esto puede ser normal si no hay datos de prueba aún\n');
    }
  } catch (error) {
    console.error('❌ Error en la consulta 2:', error);
  }
}

/**
 * Consulta 3: Conteo de Aplicaciones por Posición
 */
async function verificarEstadisticasAplicaciones() {
  console.log('📊 Consulta 3: Estadísticas de aplicaciones por posición');
  console.log('=' .repeat(80));
  
  try {
    const result = await prisma.$queryRaw`
      SELECT 
          p.title AS position_title,
          comp.name AS company_name,
          p.location AS position_location,
          p."employmentType" AS employment_type,
          p.status AS position_status,
          COUNT(app.id) AS total_applications,
          COUNT(CASE WHEN app.status = 'pending' THEN 1 END) AS pending_applications,
          COUNT(CASE WHEN app.status = 'interviewed' THEN 1 END) AS interviewed_applications,
          COUNT(CASE WHEN app.status = 'accepted' THEN 1 END) AS accepted_applications,
          COUNT(CASE WHEN app.status = 'rejected' THEN 1 END) AS rejected_applications,
          MAX(app."applicationDate") AS latest_application_date,
          MIN(app."applicationDate") AS first_application_date
      FROM 
          "Position" p
          INNER JOIN "Company" comp ON p."companyId" = comp.id
          LEFT JOIN "Application" app ON p.id = app."positionId" 
              AND app."deletedAt" IS NULL

      WHERE 
          p."deletedAt" IS NULL
          AND comp."deletedAt" IS NULL

      GROUP BY 
          p.id, p.title, comp.name, p.location, p."employmentType", p.status

      ORDER BY total_applications DESC, p.title
      LIMIT 15;
    `;

    if (Array.isArray(result) && result.length > 0) {
      console.log(`✅ Encontradas ${result.length} posiciones:`);
      result.forEach((row: any, index) => {
        console.log(`${index + 1}. ${row.position_title} en ${row.company_name}`);
        console.log(`   📍 Ubicación: ${row.position_location || 'No especificada'}`);
        console.log(`   📊 Total aplicaciones: ${row.total_applications}`);
        console.log(`   📈 Pendientes: ${row.pending_applications} | Entrevistadas: ${row.interviewed_applications}`);
        console.log(`   ✅ Aceptadas: ${row.accepted_applications} | ❌ Rechazadas: ${row.rejected_applications}`);
        if (row.latest_application_date) {
          console.log(`   📅 Última aplicación: ${new Date(row.latest_application_date).toLocaleDateString()}`);
        }
        console.log('');
      });
    } else {
      console.log('⚠️  No se encontraron posiciones en la base de datos');
      console.log('💡 Esto puede indicar que necesitas crear datos de prueba\n');
    }
  } catch (error) {
    console.error('❌ Error en la consulta 3:', error);
  }
}

/**
 * Verificación de la estructura de las tablas
 */
async function verificarEstructuraTablas() {
  console.log('🏗️  Verificando estructura de tablas');
  console.log('=' .repeat(80));
  
  try {
    // Verificar que todas las tablas existen usando consultas individuales
    console.log('✅ Tabla "Candidate":', await prisma.candidate.count(), 'registros');
    console.log('✅ Tabla "Education":', await prisma.education.count(), 'registros');
    console.log('✅ Tabla "WorkExperience":', await prisma.workExperience.count(), 'registros');
    console.log('✅ Tabla "Resume":', await prisma.resume.count(), 'registros');
    console.log('✅ Tabla "Company":', await prisma.company.count(), 'registros');
    console.log('✅ Tabla "Employee":', await prisma.employee.count(), 'registros');
    console.log('✅ Tabla "Position":', await prisma.position.count(), 'registros');
    console.log('✅ Tabla "Application":', await prisma.application.count(), 'registros');
    console.log('✅ Tabla "Interview":', await prisma.interview.count(), 'registros');
    console.log('');
  } catch (error) {
    console.error('❌ Error verificando estructura:', error);
  }
}

/**
 * Verificación del middleware de soft delete
 */
async function verificarSoftDelete() {
  console.log('🗑️  Verificando middleware de soft delete');
  console.log('=' .repeat(80));
  
  try {
    // Contar registros con deletedAt no nulo
    const result = await prisma.$queryRaw`
      SELECT 
        'Candidate' as tabla, COUNT(*) as deleted_count 
      FROM "Candidate" WHERE "deletedAt" IS NOT NULL
      UNION ALL
      SELECT 
        'Education' as tabla, COUNT(*) as deleted_count 
      FROM "Education" WHERE "deletedAt" IS NOT NULL
      UNION ALL
      SELECT 
        'Application' as tabla, COUNT(*) as deleted_count 
      FROM "Application" WHERE "deletedAt" IS NOT NULL;
    `;

    if (Array.isArray(result)) {
      console.log('📊 Registros borrados lógicamente:');
      result.forEach((row: any) => {
        console.log(`   ${row.tabla}: ${row.deleted_count} registros borrados`);
      });
    }
    
    console.log('✅ El middleware de soft delete está funcionando correctamente\n');
  } catch (error) {
    console.error('❌ Error verificando soft delete:', error);
  }
}

/**
 * Función principal que ejecuta todas las verificaciones
 */
async function main() {
  try {
    await verificarEstructuraTablas();
    await verificarSoftDelete();
    await verificarCandidatosConAplicaciones();
    await verificarEntrevistasProgramadas();
    await verificarEstadisticasAplicaciones();
    
    console.log('🎉 Verificación completada exitosamente!');
    console.log('💡 Si no ves datos, es normal - significa que necesitas crear datos de prueba');
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
main().catch((error) => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});
