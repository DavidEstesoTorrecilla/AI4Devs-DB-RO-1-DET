/**
 * Script de verificación de rendimiento del esquema optimizado
 * Analiza el uso de índices y el rendimiento de consultas críticas
 */

import { PrismaClient } from '@prisma/client';
import '../middleware/softDeleteMiddleware';

const prisma = new PrismaClient();

// Tipos para los resultados de las consultas
interface QueryPlan {
  'QUERY PLAN': Array<{
    'Plan': any;
    'Planning Time': number;
    'Execution Time': number;
    'Triggers'?: any[];
  }>;
}

interface IndexStat {
  tablename: string;
  indexname: string;
  idx_tup_read: string;
  idx_tup_fetch: string;
}

interface TableStat {
  tablename: string;
  seq_scan: string;
  idx_scan: string;
  n_tup_ins: string;
  n_tup_upd: string;
  n_tup_del: string;
}

async function analyzeQueryPlan(query: string, description: string) {
  console.log(`\n🔍 Analizando: ${description}`);
  console.log(`Query: ${query}`);
  
  try {
    const explainQuery = `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) ${query}`;
    const result = await prisma.$queryRawUnsafe(explainQuery) as QueryPlan[];
    
    if (result && result.length > 0) {
      const plan = result[0]['QUERY PLAN'][0];
      console.log('📊 Plan de ejecución:');
      console.log(`- Tiempo total: ${plan['Execution Time']}ms`);
      console.log(`- Tiempo de planificación: ${plan['Planning Time']}ms`);
      
      // Analizar el nodo principal
      const mainNode = plan['Plan'];
      console.log(`- Tipo de operación: ${mainNode['Node Type']}`);
      console.log(`- Costo total: ${mainNode['Total Cost']}`);
      console.log(`- Filas estimadas: ${mainNode['Plan Rows']}`);
      console.log(`- Filas reales: ${mainNode['Actual Rows']}`);
      
      // Verificar uso de índices
      if (mainNode['Index Name']) {
        console.log(`✅ Usando índice: ${mainNode['Index Name']}`);
      } else if (mainNode['Node Type'] === 'Seq Scan') {
        console.log(`⚠️  Scan secuencial detectado - considerar optimización`);
      }
    }
  } catch (error) {
    console.error(`❌ Error analizando consulta: ${error}`);
  }
}

async function checkIndexUsage() {
  console.log('\n📈 === ANÁLISIS DE USO DE ÍNDICES ===\n');
  
  try {
    const indexStats = await prisma.$queryRaw<IndexStat[]>`
      SELECT 
        schemaname,
        tablename,
        indexname,
        idx_tup_read::text,
        idx_tup_fetch::text
      FROM pg_stat_user_indexes 
      WHERE schemaname = 'public'
      ORDER BY idx_tup_read::bigint DESC;
    `;
    
    console.log('🔍 Estadísticas de uso de índices:');
    indexStats.forEach((stat: IndexStat) => {
      console.log(`- ${stat.tablename}.${stat.indexname}: ${stat.idx_tup_read} lecturas, ${stat.idx_tup_fetch} fetches`);
    });
    
  } catch (error) {
    console.error(`❌ Error obteniendo estadísticas de índices: ${error}`);
  }
}

async function checkTableStats() {
  console.log('\n📊 === ESTADÍSTICAS DE TABLAS ===\n');
  
  try {
    const tableStats = await prisma.$queryRaw<TableStat[]>`
      SELECT 
        schemaname,
        tablename,
        n_tup_ins::text,
        n_tup_upd::text,
        n_tup_del::text,
        seq_scan::text,
        seq_tup_read::text,
        idx_scan::text,
        idx_tup_fetch::text
      FROM pg_stat_user_tables 
      WHERE schemaname = 'public'
      ORDER BY seq_scan::bigint DESC;
    `;
    
    console.log('📋 Estadísticas por tabla:');
    tableStats.forEach((stat: TableStat) => {
      const seqScans = parseInt(stat.seq_scan);
      const idxScans = parseInt(stat.idx_scan);
      const scanRatio = idxScans > 0 ? (seqScans / (seqScans + idxScans) * 100).toFixed(1) : '100.0';
      
      console.log(`\n- Tabla: ${stat.tablename}`);
      console.log(`  Inserts: ${stat.n_tup_ins}, Updates: ${stat.n_tup_upd}, Deletes: ${stat.n_tup_del}`);
      console.log(`  Seq scans: ${stat.seq_scan}, Index scans: ${stat.idx_scan}`);
      console.log(`  % Seq scans: ${scanRatio}% ${seqScans > idxScans ? '⚠️' : '✅'}`);
    });
    
  } catch (error) {
    console.error(`❌ Error obteniendo estadísticas de tablas: ${error}`);
  }
}

async function testCriticalQueries() {
  console.log('\n🚀 === ANÁLISIS DE CONSULTAS CRÍTICAS ===\n');
  
  // 1. Búsqueda de candidatos por nombre y estado activo
  await analyzeQueryPlan(
    `SELECT * FROM "Candidate" WHERE "lastName" ILIKE '%Smith%' AND "deletedAt" IS NULL ORDER BY "lastName", "firstName"`,
    'Búsqueda de candidatos activos por apellido'
  );
  
  // 2. Aplicaciones por posición y estado
  await analyzeQueryPlan(
    `SELECT * FROM "Application" WHERE "positionId" = 'any-position-id' AND "status" = 'pending' AND "deletedAt" IS NULL`,
    'Aplicaciones pendientes por posición'
  );
  
  // 3. Posiciones activas por empresa
  await analyzeQueryPlan(
    `SELECT * FROM "Position" WHERE "companyId" = 'any-company-id' AND "status" = 'active' AND "deletedAt" IS NULL`,
    'Posiciones activas por empresa'
  );
  
  // 4. Experiencia laboral por candidato ordenada por fecha
  await analyzeQueryPlan(
    `SELECT * FROM "WorkExperience" WHERE "candidateId" = 1 AND "deletedAt" IS NULL ORDER BY "startDate" DESC`,
    'Experiencia laboral por candidato'
  );
  
  // 5. Entrevistas programadas
  await analyzeQueryPlan(
    `SELECT * FROM "Interview" WHERE "scheduledAt" >= NOW() AND "status" = 'scheduled' AND "deletedAt" IS NULL ORDER BY "scheduledAt"`,
    'Entrevistas programadas'
  );
  
  // 6. Candidatos con habilidades específicas
  await analyzeQueryPlan(
    `SELECT DISTINCT c.* FROM "Candidate" c 
     JOIN "CandidateSkill" cs ON c.id = cs."candidateId" 
     JOIN "Skill" s ON cs."skillId" = s.id 
     WHERE s.name = 'JavaScript' AND c."deletedAt" IS NULL AND cs."deletedAt" IS NULL`,
    'Candidatos con habilidad específica'
  );
}

async function checkConstraintsAndRelations() {
  console.log('\n🔗 === VERIFICACIÓN DE CONSTRAINTS Y RELACIONES ===\n');
  
  try {
    // Verificar constraints únicos
    const uniqueConstraints = await prisma.$queryRaw`
      SELECT 
        tc.constraint_name,
        tc.table_name,
        kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.constraint_type = 'UNIQUE' 
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name, tc.constraint_name;
    `;
    
    console.log('🔐 Constraints únicos encontrados:');
    uniqueConstraints.forEach((constraint: any) => {
      console.log(`- ${constraint.table_name}.${constraint.column_name} (${constraint.constraint_name})`);
    });
    
    // Verificar foreign keys
    const foreignKeys = await prisma.$queryRaw`
      SELECT 
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage ccu 
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name;
    `;
    
    console.log('\n🔗 Foreign keys encontradas:');
    foreignKeys.forEach((fk: any) => {
      console.log(`- ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
    });
    
  } catch (error) {
    console.error(`❌ Error verificando constraints: ${error}`);
  }
}

async function generatePerformanceReport() {
  console.log('\n📋 === REPORTE DE RENDIMIENTO ===\n');
  
  try {
    // Tamaño de las tablas
    const tableSizes = await prisma.$queryRaw`
      SELECT 
        schemaname,
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
        pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
    `;
    
    console.log('💾 Tamaño de tablas:');
    tableSizes.forEach((table: any) => {
      console.log(`- ${table.tablename}: ${table.size}`);
    });
    
    // Índices más grandes
    const indexSizes = await prisma.$queryRaw`
      SELECT 
        indexname,
        tablename,
        pg_size_pretty(pg_relation_size(indexname)) as size
      FROM pg_indexes 
      WHERE schemaname = 'public'
      ORDER BY pg_relation_size(indexname) DESC 
      LIMIT 10;
    `;
    
    console.log('\n📊 Índices más grandes:');
    indexSizes.forEach((index: any) => {
      console.log(`- ${index.tablename}.${index.indexname}: ${index.size}`);
    });
    
  } catch (error) {
    console.error(`❌ Error generando reporte: ${error}`);
  }
}

async function main() {
  console.log('🚀 Iniciando verificación de rendimiento del esquema optimizado...\n');
  
  try {
    await checkTableStats();
    await checkIndexUsage();
    await testCriticalQueries();
    await checkConstraintsAndRelations();
    await generatePerformanceReport();
    
    console.log('\n✅ Verificación de rendimiento completada exitosamente!');
    console.log('\n💡 Recomendaciones:');
    console.log('- Monitorear regularmente las estadísticas de uso de índices');
    console.log('- Si hay muchos seq scans, considerar añadir más índices');
    console.log('- Revisar consultas que tomen más de 100ms');
    console.log('- Actualizar estadísticas con ANALYZE periódicamente');
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  main().catch(console.error);
}

export { main as verifyPerformance };
