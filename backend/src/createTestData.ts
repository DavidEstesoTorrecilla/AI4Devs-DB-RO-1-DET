/**
 * Script para generar datos de prueba para verificar el rendimiento
 * Crea datos realistas para todas las entidades del sistema ATS
 */

import { PrismaClient } from '@prisma/client';
import '../middleware/softDeleteMiddleware';

const prisma = new PrismaClient();

// Datos de ejemplo
const COMPANIES = [
  { name: 'TechCorp Solutions', description: 'Leading technology company', industry: 'Technology', size: 'large' },
  { name: 'StartupFlow', description: 'Innovative startup', industry: 'Software', size: 'small' },
  { name: 'GlobalConsulting', description: 'International consulting firm', industry: 'Consulting', size: 'large' },
  { name: 'DataAnalytics Inc', description: 'Data science company', industry: 'Analytics', size: 'medium' },
  { name: 'GreenTech Innovations', description: 'Sustainable technology solutions', industry: 'CleanTech', size: 'medium' }
];

const SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C#', 'SQL', 'PostgreSQL', 'MongoDB',
  'AWS', 'Docker', 'Kubernetes', 'Git', 'Agile', 'Scrum', 'Project Management', 'Leadership', 'Communication',
  'Problem Solving', 'Data Analysis', 'Machine Learning', 'DevOps', 'CI/CD', 'Testing', 'Angular', 'Vue.js'
];

const POSITIONS_DATA = [
  { title: 'Senior Full Stack Developer', department: 'Engineering', experienceLevel: 'Senior', employmentType: 'Full-time' },
  { title: 'Frontend Developer', department: 'Engineering', experienceLevel: 'Mid', employmentType: 'Full-time' },
  { title: 'Data Scientist', department: 'Analytics', experienceLevel: 'Senior', employmentType: 'Full-time' },
  { title: 'DevOps Engineer', department: 'Infrastructure', experienceLevel: 'Mid', employmentType: 'Full-time' },
  { title: 'Product Manager', department: 'Product', experienceLevel: 'Senior', employmentType: 'Full-time' },
  { title: 'Junior Developer', department: 'Engineering', experienceLevel: 'Junior', employmentType: 'Full-time' },
  { title: 'UX Designer', department: 'Design', experienceLevel: 'Mid', employmentType: 'Full-time' },
  { title: 'QA Engineer', department: 'Quality', experienceLevel: 'Mid', employmentType: 'Contract' }
];

const CANDIDATE_NAMES = [
  { firstName: 'Alice', lastName: 'Johnson' },
  { firstName: 'Bob', lastName: 'Smith' },
  { firstName: 'Carol', lastName: 'Davis' },
  { firstName: 'David', lastName: 'Wilson' },
  { firstName: 'Emma', lastName: 'Brown' },
  { firstName: 'Frank', lastName: 'Miller' },
  { firstName: 'Grace', lastName: 'Garcia' },
  { firstName: 'Henry', lastName: 'Martinez' },
  { firstName: 'Isabel', lastName: 'Rodriguez' },
  { firstName: 'Jack', lastName: 'Anderson' },
  { firstName: 'Karen', lastName: 'Taylor' },
  { firstName: 'Luis', lastName: 'Hernandez' },
  { firstName: 'Maria', lastName: 'Lopez' },
  { firstName: 'Nathan', lastName: 'Gonzalez' },
  { firstName: 'Olivia', lastName: 'Perez' }
];

async function createTestCompanies() {
  console.log('🏢 Creando empresas de prueba...');
  
  const companies = [];
  for (const companyData of COMPANIES) {
    const company = await prisma.company.create({
      data: {
        name: companyData.name,
        description: companyData.description,
        industry: companyData.industry,
        size: companyData.size,
        website: `https://www.${companyData.name.toLowerCase().replace(/\s+/g, '')}.com`,
        location: 'Madrid, Spain',
        foundedYear: 2000 + Math.floor(Math.random() * 24)
      }
    });
    companies.push(company);
  }
  
  console.log(`✅ Creadas ${companies.length} empresas`);
  return companies;
}

async function createTestSkills() {
  console.log('🛠️  Creando habilidades de prueba...');
  
  const skills = [];
  for (const skillName of SKILLS) {
    const skill = await prisma.skill.create({
      data: {
        name: skillName,
        category: getSkillCategory(skillName),
        description: `Habilidad en ${skillName}`
      }
    });
    skills.push(skill);
  }
  
  console.log(`✅ Creadas ${skills.length} habilidades`);
  return skills;
}

function getSkillCategory(skillName: string): string {
  if (['JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js'].includes(skillName)) return 'Frontend';
  if (['Node.js', 'Python', 'Java', 'C#'].includes(skillName)) return 'Backend';
  if (['PostgreSQL', 'MongoDB', 'SQL'].includes(skillName)) return 'Database';
  if (['AWS', 'Docker', 'Kubernetes', 'DevOps', 'CI/CD'].includes(skillName)) return 'Infrastructure';
  if (['Project Management', 'Leadership', 'Communication', 'Agile', 'Scrum'].includes(skillName)) return 'Soft Skills';
  if (['Data Analysis', 'Machine Learning'].includes(skillName)) return 'Data Science';
  return 'Technical';
}

async function createTestPositions(companies: any[]) {
  console.log('💼 Creando posiciones de prueba...');
  
  const positions = [];
  for (const company of companies) {
    for (const positionData of POSITIONS_DATA.slice(0, 3)) { // 3 posiciones por empresa
      const position = await prisma.position.create({
        data: {
          companyId: company.id,
          title: positionData.title,
          description: `Exciting opportunity for a ${positionData.title} at ${company.name}. Join our ${positionData.department} team!`,
          requirements: `We are looking for a ${positionData.experienceLevel} level professional with excellent skills in their field.`,
          location: company.location,
          isRemote: Math.random() > 0.5,
          employmentType: positionData.employmentType,
          experienceLevel: positionData.experienceLevel,
          department: positionData.department,
          salary: 40000 + Math.floor(Math.random() * 80000),
          salaryMax: 60000 + Math.floor(Math.random() * 100000),
          currency: 'EUR',
          status: Math.random() > 0.2 ? 'active' : 'closed',
          openings: 1 + Math.floor(Math.random() * 3),
          publishedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
        }
      });
      positions.push(position);
    }
  }
  
  console.log(`✅ Creadas ${positions.length} posiciones`);
  return positions;
}

async function createTestCandidates() {
  console.log('👥 Creando candidatos de prueba...');
  
  const candidates = [];
  for (let index = 0; index < CANDIDATE_NAMES.length; index++) {
    const nameData = CANDIDATE_NAMES[index];
    const candidate = await prisma.candidate.create({
      data: {
        firstName: nameData.firstName,
        lastName: nameData.lastName,
        email: `${nameData.firstName.toLowerCase()}.${nameData.lastName.toLowerCase()}@email.com`,
        phone: `+34 6${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
        address: `Calle ${nameData.lastName} ${index + 1}, Madrid, Spain`
      }
    });
    candidates.push(candidate);
  }
  
  console.log(`✅ Creados ${candidates.length} candidatos`);
  return candidates;
}

async function createTestEducationAndExperience(candidates: any[]) {
  console.log('🎓 Creando educación y experiencia laboral...');
  
  const universities = ['Universidad Complutense Madrid', 'Universidad Politécnica Madrid', 'IE University', 'Universidad Carlos III'];
  const companies = ['Microsoft', 'Google', 'Amazon', 'IBM', 'Oracle', 'Salesforce', 'Adobe'];
  const degrees = ['Bachelor', 'Master', 'PhD'];
  const fields = ['Computer Science', 'Software Engineering', 'Data Science', 'Information Technology'];
  
  for (const candidate of candidates) {
    // Crear educación
    const numEducations = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numEducations; i++) {
      await prisma.education.create({
        data: {
          candidateId: candidate.id,
          institution: universities[Math.floor(Math.random() * universities.length)],
          title: `${degrees[Math.floor(Math.random() * degrees.length)]} in ${fields[Math.floor(Math.random() * fields.length)]}`,
          degree: degrees[Math.floor(Math.random() * degrees.length)],
          fieldOfStudy: fields[Math.floor(Math.random() * fields.length)],
          startDate: new Date(2015 + Math.floor(Math.random() * 5), 8, 1),
          endDate: new Date(2019 + Math.floor(Math.random() * 5), 5, 30),
          isCompleted: true,
          gpa: 3.0 + Math.random() * 1.0
        }
      });
    }
    
    // Crear experiencia laboral
    const numExperiences = 1 + Math.floor(Math.random() * 4);
    for (let i = 0; i < numExperiences; i++) {
      const startDate = new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), 1);
      const endDate = Math.random() > 0.3 ? new Date(startDate.getTime() + Math.floor(Math.random() * 2 * 365 * 24 * 60 * 60 * 1000)) : null;
      
      await prisma.workExperience.create({
        data: {
          candidateId: candidate.id,
          company: companies[Math.floor(Math.random() * companies.length)],
          position: POSITIONS_DATA[Math.floor(Math.random() * POSITIONS_DATA.length)].title,
          description: 'Responsible for developing and maintaining software applications.',
          industry: 'Technology',
          location: 'Madrid, Spain',
          employmentType: 'Full-time',
          startDate,
          endDate,
          isCurrent: endDate === null
        }
      });
    }
  }
  
  console.log('✅ Creada educación y experiencia laboral');
}

async function createTestCandidateSkills(candidates: any[], skills: any[]) {
  console.log('🔧 Asignando habilidades a candidatos...');
  
  for (const candidate of candidates) {
    // Cada candidato tendrá entre 3-8 habilidades
    const numSkills = 3 + Math.floor(Math.random() * 6);
    const candidateSkills = skills.sort(() => 0.5 - Math.random()).slice(0, numSkills);
    
    for (const skill of candidateSkills) {
      await prisma.candidateSkill.create({
        data: {
          candidateId: candidate.id,
          skillId: skill.id,
          proficiencyLevel: ['Beginner', 'Intermediate', 'Advanced', 'Expert'][Math.floor(Math.random() * 4)],
          yearsOfExperience: Math.floor(Math.random() * 10) + 1
        }
      });
    }
  }
  
  console.log('✅ Habilidades asignadas a candidatos');
}

async function createTestApplications(candidates: any[], positions: any[]) {
  console.log('📝 Creando aplicaciones de prueba...');
  
  const statuses = ['pending', 'reviewing', 'interviewed', 'rejected', 'accepted'];
  const sources = ['website', 'linkedin', 'referral', 'recruiter', 'job_board'];
  
  for (const candidate of candidates) {
    // Cada candidato aplicará a 1-3 posiciones
    const numApplications = 1 + Math.floor(Math.random() * 3);
    const candidatePositions = positions.sort(() => 0.5 - Math.random()).slice(0, numApplications);
    
    for (const position of candidatePositions) {
      const applicationDate = new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000);
      
      await prisma.application.create({
        data: {
          positionId: position.id,
          candidateId: candidate.id,
          applicationDate,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          source: sources[Math.floor(Math.random() * sources.length)],
          coverLetter: `Dear Hiring Manager, I am very interested in the ${position.title} position at your company...`,
          score: 60 + Math.floor(Math.random() * 40),
          reviewedAt: Math.random() > 0.5 ? new Date(applicationDate.getTime() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000) : null
        }
      });
    }
  }
  
  console.log('✅ Aplicaciones creadas');
}

async function createTestInterviews() {
  console.log('🗣️  Creando entrevistas de prueba...');
  
  const applications = await prisma.application.findMany({
    where: { status: { in: ['reviewing', 'interviewed'] } }
  });
  
  const interviewTypes = await prisma.interviewType.findMany();
  if (interviewTypes.length === 0) {
    // Crear tipos de entrevista si no existen
    await prisma.interviewType.createMany({
      data: [
        { name: 'Technical Interview', description: 'Assess technical skills' },
        { name: 'HR Interview', description: 'Cultural fit and soft skills' },
        { name: 'Panel Interview', description: 'Multiple interviewers' }
      ]
    });
  }
  
  const types = await prisma.interviewType.findMany();
  
  for (const application of applications.slice(0, 10)) { // Solo las primeras 10 aplicaciones
    const interviewDate = new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
    
    await prisma.interview.create({
      data: {
        applicationId: application.id,
        interviewTypeId: types[Math.floor(Math.random() * types.length)].id,
        scheduledAt: interviewDate,
        duration: 30 + Math.floor(Math.random() * 90),
        location: Math.random() > 0.5 ? 'Office - Conference Room A' : 'Online - Zoom',
        status: ['scheduled', 'completed', 'cancelled'][Math.floor(Math.random() * 3)],
        notes: 'Interview scheduled successfully.'
      }
    });
  }
  
  console.log('✅ Entrevistas creadas');
}

async function main() {
  console.log('🚀 Iniciando creación de datos de prueba...\n');
  
  try {
    // Verificar si ya existen datos
    const existingCandidates = await prisma.candidate.count();
    if (existingCandidates > 0) {
      console.log('⚠️  Ya existen datos en la base de datos. ¿Desea continuar y añadir más datos?');
      console.log(`Candidatos existentes: ${existingCandidates}`);
    }
    
    const companies = await createTestCompanies();
    const skills = await createTestSkills();
    const positions = await createTestPositions(companies);
    const candidates = await createTestCandidates();
    
    await createTestEducationAndExperience(candidates);
    await createTestCandidateSkills(candidates, skills);
    await createTestApplications(candidates, positions);
    await createTestInterviews();
    
    console.log('\n✅ Datos de prueba creados exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`- ${companies.length} empresas`);
    console.log(`- ${skills.length} habilidades`);
    console.log(`- ${positions.length} posiciones`);
    console.log(`- ${candidates.length} candidatos`);
    
    const totalApplications = await prisma.application.count();
    const totalInterviews = await prisma.interview.count();
    console.log(`- ${totalApplications} aplicaciones`);
    console.log(`- ${totalInterviews} entrevistas`);
    
  } catch (error) {
    console.error('❌ Error creando datos de prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  main().catch(console.error);
}

export { main as createTestData };
