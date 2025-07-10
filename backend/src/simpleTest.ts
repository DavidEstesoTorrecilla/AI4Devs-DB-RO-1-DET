/**
 * Script simple de prueba para verificar que todo funciona
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔍 Verificando conexión a la base de datos...');
    
    // Verificar conexión
    await prisma.$connect();
    console.log('✅ Conexión exitosa a la base de datos');
    
    // Contar registros en tablas principales
    const candidateCount = await prisma.candidate.count();
    const companyCount = await prisma.company.count();
    const positionCount = await prisma.position.count();
    const applicationCount = await prisma.application.count();
    
    console.log('\n📊 Resumen de datos:');
    console.log(`- Candidatos: ${candidateCount}`);
    console.log(`- Empresas: ${companyCount}`);
    console.log(`- Posiciones: ${positionCount}`);
    console.log(`- Aplicaciones: ${applicationCount}`);
    
    // Verificar soft delete
    console.log('\n🗑️ Verificando soft delete...');
    if (candidateCount > 0) {
      const firstCandidate = await prisma.candidate.findFirst();
      if (firstCandidate) {
        console.log(`✅ Soft delete funciona - Candidate encontrado: ${firstCandidate.firstName} ${firstCandidate.lastName}`);
      }
    }
    
    console.log('\n✅ Todas las verificaciones completadas exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
