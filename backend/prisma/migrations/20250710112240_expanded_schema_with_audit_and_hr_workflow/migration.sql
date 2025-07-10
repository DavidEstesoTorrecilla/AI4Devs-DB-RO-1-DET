-- CreateTable
CREATE TABLE "Candidate" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(15),
    "address" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" SERIAL NOT NULL,
    "institution" VARCHAR(100) NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "candidateId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkExperience" (
    "id" SERIAL NOT NULL,
    "company" VARCHAR(100) NOT NULL,
    "position" VARCHAR(100) NOT NULL,
    "description" VARCHAR(200),
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "candidateId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WorkExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resume" (
    "id" SERIAL NOT NULL,
    "filePath" VARCHAR(500) NOT NULL,
    "fileType" VARCHAR(50) NOT NULL,
    "uploadDate" TIMESTAMP(3) NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "website" VARCHAR(255),
    "industry" VARCHAR(100),
    "size" VARCHAR(50),
    "location" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "role" VARCHAR(100) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT,
    "location" VARCHAR(255),
    "employmentType" VARCHAR(50),
    "salary" DECIMAL(10,2),
    "currency" VARCHAR(3),
    "status" VARCHAR(50) NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "applicationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "coverLetter" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "interviewDate" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER,
    "location" VARCHAR(255),
    "type" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'scheduled',
    "feedback" TEXT,
    "rating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewType" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "duration" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "InterviewType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewFlow" (
    "id" TEXT NOT NULL,
    "positionId" TEXT,
    "companyId" TEXT,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "InterviewFlow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewStep" (
    "id" TEXT NOT NULL,
    "flowId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "estimatedDuration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "InterviewStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_email_key" ON "Candidate"("email");

-- CreateIndex
CREATE INDEX "Candidate_lastName_idx" ON "Candidate"("lastName");

-- CreateIndex
CREATE INDEX "Candidate_email_idx" ON "Candidate"("email");

-- CreateIndex
CREATE INDEX "Candidate_deletedAt_idx" ON "Candidate"("deletedAt");

-- CreateIndex
CREATE INDEX "Education_candidateId_idx" ON "Education"("candidateId");

-- CreateIndex
CREATE INDEX "Education_deletedAt_idx" ON "Education"("deletedAt");

-- CreateIndex
CREATE INDEX "WorkExperience_candidateId_idx" ON "WorkExperience"("candidateId");

-- CreateIndex
CREATE INDEX "WorkExperience_deletedAt_idx" ON "WorkExperience"("deletedAt");

-- CreateIndex
CREATE INDEX "Resume_candidateId_idx" ON "Resume"("candidateId");

-- CreateIndex
CREATE INDEX "Resume_deletedAt_idx" ON "Resume"("deletedAt");

-- CreateIndex
CREATE INDEX "Company_name_idx" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Company_industry_idx" ON "Company"("industry");

-- CreateIndex
CREATE INDEX "Company_deletedAt_idx" ON "Company"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE INDEX "Employee_companyId_idx" ON "Employee"("companyId");

-- CreateIndex
CREATE INDEX "Employee_email_idx" ON "Employee"("email");

-- CreateIndex
CREATE INDEX "Employee_isActive_idx" ON "Employee"("isActive");

-- CreateIndex
CREATE INDEX "Employee_deletedAt_idx" ON "Employee"("deletedAt");

-- CreateIndex
CREATE INDEX "Position_companyId_idx" ON "Position"("companyId");

-- CreateIndex
CREATE INDEX "Position_title_idx" ON "Position"("title");

-- CreateIndex
CREATE INDEX "Position_status_idx" ON "Position"("status");

-- CreateIndex
CREATE INDEX "Position_employmentType_idx" ON "Position"("employmentType");

-- CreateIndex
CREATE INDEX "Position_deletedAt_idx" ON "Position"("deletedAt");

-- CreateIndex
CREATE INDEX "Application_positionId_idx" ON "Application"("positionId");

-- CreateIndex
CREATE INDEX "Application_candidateId_idx" ON "Application"("candidateId");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE INDEX "Application_applicationDate_idx" ON "Application"("applicationDate");

-- CreateIndex
CREATE INDEX "Application_deletedAt_idx" ON "Application"("deletedAt");

-- CreateIndex
CREATE INDEX "Interview_applicationId_idx" ON "Interview"("applicationId");

-- CreateIndex
CREATE INDEX "Interview_employeeId_idx" ON "Interview"("employeeId");

-- CreateIndex
CREATE INDEX "Interview_interviewDate_idx" ON "Interview"("interviewDate");

-- CreateIndex
CREATE INDEX "Interview_type_idx" ON "Interview"("type");

-- CreateIndex
CREATE INDEX "Interview_status_idx" ON "Interview"("status");

-- CreateIndex
CREATE INDEX "Interview_deletedAt_idx" ON "Interview"("deletedAt");

-- CreateIndex
CREATE INDEX "InterviewType_name_idx" ON "InterviewType"("name");

-- CreateIndex
CREATE INDEX "InterviewType_order_idx" ON "InterviewType"("order");

-- CreateIndex
CREATE INDEX "InterviewType_deletedAt_idx" ON "InterviewType"("deletedAt");

-- CreateIndex
CREATE INDEX "InterviewFlow_positionId_idx" ON "InterviewFlow"("positionId");

-- CreateIndex
CREATE INDEX "InterviewFlow_companyId_idx" ON "InterviewFlow"("companyId");

-- CreateIndex
CREATE INDEX "InterviewFlow_isActive_idx" ON "InterviewFlow"("isActive");

-- CreateIndex
CREATE INDEX "InterviewFlow_deletedAt_idx" ON "InterviewFlow"("deletedAt");

-- CreateIndex
CREATE INDEX "InterviewStep_flowId_idx" ON "InterviewStep"("flowId");

-- CreateIndex
CREATE INDEX "InterviewStep_typeId_idx" ON "InterviewStep"("typeId");

-- CreateIndex
CREATE INDEX "InterviewStep_order_idx" ON "InterviewStep"("order");

-- CreateIndex
CREATE INDEX "InterviewStep_deletedAt_idx" ON "InterviewStep"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewStep_flowId_order_key" ON "InterviewStep"("flowId", "order");

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewStep" ADD CONSTRAINT "InterviewStep_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "InterviewFlow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewStep" ADD CONSTRAINT "InterviewStep_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "InterviewType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
