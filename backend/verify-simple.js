const { PrismaClient } = require('@prisma/client');

// Crear instancia simple de Prisma sin middleware para evitar problemas
const prisma = new PrismaClient();

console.log('🔍 Iniciando verificación simple de la base de datos...\n');

async function verificarBasico() {
  try {
    console.log('🏗️  Verificando estructura de tablas');
    console.log('=' .repeat(60));
    
    // Verificar tablas básicas
    const candidateCount = await prisma.candidate.count();
    console.log(`✅ Tabla "Candidate": ${candidateCount} registros`);
    
    const educationCount = await prisma.education.count();
    console.log(`✅ Tabla "Education": ${educationCount} registros`);
    
    const companyCount = await prisma.company.count();
    console.log(`✅ Tabla "Company": ${companyCount} registros`);
    
    const positionCount = await prisma.position.count();
    console.log(`✅ Tabla "Position": ${positionCount} registros`);
    
    const applicationCount = await prisma.application.count();
    console.log(`✅ Tabla "Application": ${applicationCount} registros`);
    
    console.log('\n🎉 ¡Verificación completada exitosamente!');
    console.log('✅ Todas las tablas están accesibles');
    console.log('✅ El esquema de Prisma está funcionando correctamente');
    console.log('✅ La migración se aplicó exitosamente');
    
    if (candidateCount === 0 && applicationCount === 0) {
      console.log('\n💡 Las tablas están vacías, lo cual es normal para un proyecto nuevo');
      console.log('💡 Puedes empezar a añadir datos usando la API o insertando datos de prueba');
    }
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error.message);
    
    if (error.message.includes('P1001')) {
      console.log('💡 Asegúrate de que PostgreSQL esté ejecutándose');
    } else if (error.message.includes('does not exist')) {
      console.log('💡 Parece que falta ejecutar las migraciones de Prisma');
    }
  } finally {
    await prisma.$disconnect();
  }
}

verificarBasico();
