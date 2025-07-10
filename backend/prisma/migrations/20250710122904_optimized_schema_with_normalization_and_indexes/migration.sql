/*
  Warnings:

  - A unique constraint covering the columns `[positionId,candidateId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileName` to the `Resume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "decidedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "score" INTEGER,
ADD COLUMN     "source" VARCHAR(100);

-- AlterTable
ALTER TABLE "Candidate" ALTER COLUMN "phone" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Education" ADD COLUMN     "degree" VARCHAR(100),
ADD COLUMN     "fieldOfStudy" VARCHAR(255),
ADD COLUMN     "gpa" DECIMAL(3,2),
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "institution" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "meetingLink" VARCHAR(500),
ADD COLUMN     "recommendation" VARCHAR(50),
ADD COLUMN     "round" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Position" ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "department" VARCHAR(100),
ADD COLUMN     "experienceLevel" VARCHAR(50),
ADD COLUMN     "isRemote" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "openings" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "priority" VARCHAR(20) NOT NULL DEFAULT 'medium',
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "salaryMax" DECIMAL(12,2),
ALTER COLUMN "salary" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "fileName" VARCHAR(255) NOT NULL,
ADD COLUMN     "fileSize" BIGINT,
ADD COLUMN     "isLatest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "WorkExperience" ADD COLUMN     "employmentType" VARCHAR(50),
ADD COLUMN     "industry" VARCHAR(100),
ADD COLUMN     "isCurrent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "location" VARCHAR(255),
ALTER COLUMN "company" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "position" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "description" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Industry" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "category" VARCHAR(50),
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateSkill" (
    "id" TEXT NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "skillId" TEXT NOT NULL,
    "level" VARCHAR(50),
    "yearsExp" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CandidateSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PositionSkill" (
    "id" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "priority" VARCHAR(20) NOT NULL DEFAULT 'medium',
    "minLevel" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PositionSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationStatus" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFinal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Industry_name_key" ON "Industry"("name");

-- CreateIndex
CREATE INDEX "Industry_name_idx" ON "Industry"("name");

-- CreateIndex
CREATE INDEX "Industry_deletedAt_idx" ON "Industry"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- CreateIndex
CREATE INDEX "Skill_name_idx" ON "Skill"("name");

-- CreateIndex
CREATE INDEX "Skill_category_idx" ON "Skill"("category");

-- CreateIndex
CREATE INDEX "Skill_deletedAt_idx" ON "Skill"("deletedAt");

-- CreateIndex
CREATE INDEX "CandidateSkill_candidateId_idx" ON "CandidateSkill"("candidateId");

-- CreateIndex
CREATE INDEX "CandidateSkill_skillId_idx" ON "CandidateSkill"("skillId");

-- CreateIndex
CREATE INDEX "CandidateSkill_level_idx" ON "CandidateSkill"("level");

-- CreateIndex
CREATE INDEX "CandidateSkill_deletedAt_idx" ON "CandidateSkill"("deletedAt");

-- CreateIndex
CREATE INDEX "CandidateSkill_candidateId_skillId_idx" ON "CandidateSkill"("candidateId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateSkill_candidateId_skillId_key" ON "CandidateSkill"("candidateId", "skillId");

-- CreateIndex
CREATE INDEX "PositionSkill_positionId_idx" ON "PositionSkill"("positionId");

-- CreateIndex
CREATE INDEX "PositionSkill_skillId_idx" ON "PositionSkill"("skillId");

-- CreateIndex
CREATE INDEX "PositionSkill_required_idx" ON "PositionSkill"("required");

-- CreateIndex
CREATE INDEX "PositionSkill_priority_idx" ON "PositionSkill"("priority");

-- CreateIndex
CREATE INDEX "PositionSkill_deletedAt_idx" ON "PositionSkill"("deletedAt");

-- CreateIndex
CREATE INDEX "PositionSkill_positionId_required_idx" ON "PositionSkill"("positionId", "required");

-- CreateIndex
CREATE UNIQUE INDEX "PositionSkill_positionId_skillId_key" ON "PositionSkill"("positionId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationStatus_name_key" ON "ApplicationStatus"("name");

-- CreateIndex
CREATE INDEX "ApplicationStatus_name_idx" ON "ApplicationStatus"("name");

-- CreateIndex
CREATE INDEX "ApplicationStatus_order_idx" ON "ApplicationStatus"("order");

-- CreateIndex
CREATE INDEX "ApplicationStatus_isActive_idx" ON "ApplicationStatus"("isActive");

-- CreateIndex
CREATE INDEX "ApplicationStatus_isFinal_idx" ON "ApplicationStatus"("isFinal");

-- CreateIndex
CREATE INDEX "Application_source_idx" ON "Application"("source");

-- CreateIndex
CREATE INDEX "Application_score_idx" ON "Application"("score");

-- CreateIndex
CREATE INDEX "Application_positionId_status_idx" ON "Application"("positionId", "status");

-- CreateIndex
CREATE INDEX "Application_candidateId_status_idx" ON "Application"("candidateId", "status");

-- CreateIndex
CREATE INDEX "Application_status_applicationDate_idx" ON "Application"("status", "applicationDate");

-- CreateIndex
CREATE INDEX "Application_positionId_applicationDate_idx" ON "Application"("positionId", "applicationDate");

-- CreateIndex
CREATE INDEX "Application_deletedAt_status_idx" ON "Application"("deletedAt", "status");

-- CreateIndex
CREATE INDEX "Application_source_applicationDate_idx" ON "Application"("source", "applicationDate");

-- CreateIndex
CREATE INDEX "Application_score_status_idx" ON "Application"("score", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Application_positionId_candidateId_key" ON "Application"("positionId", "candidateId");

-- CreateIndex
CREATE INDEX "Candidate_lastName_firstName_idx" ON "Candidate"("lastName", "firstName");

-- CreateIndex
CREATE INDEX "Candidate_deletedAt_lastName_idx" ON "Candidate"("deletedAt", "lastName");

-- CreateIndex
CREATE INDEX "Candidate_createdAt_deletedAt_idx" ON "Candidate"("createdAt", "deletedAt");

-- CreateIndex
CREATE INDEX "Education_degree_idx" ON "Education"("degree");

-- CreateIndex
CREATE INDEX "Education_fieldOfStudy_idx" ON "Education"("fieldOfStudy");

-- CreateIndex
CREATE INDEX "Education_candidateId_deletedAt_idx" ON "Education"("candidateId", "deletedAt");

-- CreateIndex
CREATE INDEX "Education_degree_fieldOfStudy_idx" ON "Education"("degree", "fieldOfStudy");

-- CreateIndex
CREATE INDEX "Education_candidateId_endDate_idx" ON "Education"("candidateId", "endDate");

-- CreateIndex
CREATE INDEX "Interview_round_idx" ON "Interview"("round");

-- CreateIndex
CREATE INDEX "Interview_rating_idx" ON "Interview"("rating");

-- CreateIndex
CREATE INDEX "Interview_recommendation_idx" ON "Interview"("recommendation");

-- CreateIndex
CREATE INDEX "Interview_applicationId_round_idx" ON "Interview"("applicationId", "round");

-- CreateIndex
CREATE INDEX "Interview_employeeId_interviewDate_idx" ON "Interview"("employeeId", "interviewDate");

-- CreateIndex
CREATE INDEX "Interview_status_interviewDate_idx" ON "Interview"("status", "interviewDate");

-- CreateIndex
CREATE INDEX "Interview_type_status_idx" ON "Interview"("type", "status");

-- CreateIndex
CREATE INDEX "Interview_deletedAt_status_idx" ON "Interview"("deletedAt", "status");

-- CreateIndex
CREATE INDEX "Interview_recommendation_rating_idx" ON "Interview"("recommendation", "rating");

-- CreateIndex
CREATE INDEX "Position_experienceLevel_idx" ON "Position"("experienceLevel");

-- CreateIndex
CREATE INDEX "Position_department_idx" ON "Position"("department");

-- CreateIndex
CREATE INDEX "Position_isRemote_idx" ON "Position"("isRemote");

-- CreateIndex
CREATE INDEX "Position_status_deletedAt_idx" ON "Position"("status", "deletedAt");

-- CreateIndex
CREATE INDEX "Position_companyId_status_idx" ON "Position"("companyId", "status");

-- CreateIndex
CREATE INDEX "Position_employmentType_experienceLevel_idx" ON "Position"("employmentType", "experienceLevel");

-- CreateIndex
CREATE INDEX "Position_department_status_idx" ON "Position"("department", "status");

-- CreateIndex
CREATE INDEX "Position_publishedAt_status_idx" ON "Position"("publishedAt", "status");

-- CreateIndex
CREATE INDEX "Position_isRemote_employmentType_idx" ON "Position"("isRemote", "employmentType");

-- CreateIndex
CREATE INDEX "Position_salary_salaryMax_idx" ON "Position"("salary", "salaryMax");

-- CreateIndex
CREATE INDEX "Resume_fileType_idx" ON "Resume"("fileType");

-- CreateIndex
CREATE INDEX "Resume_isLatest_idx" ON "Resume"("isLatest");

-- CreateIndex
CREATE INDEX "Resume_candidateId_deletedAt_idx" ON "Resume"("candidateId", "deletedAt");

-- CreateIndex
CREATE INDEX "Resume_candidateId_isLatest_idx" ON "Resume"("candidateId", "isLatest");

-- CreateIndex
CREATE INDEX "Resume_candidateId_version_idx" ON "Resume"("candidateId", "version");

-- CreateIndex
CREATE INDEX "Resume_uploadDate_deletedAt_idx" ON "Resume"("uploadDate", "deletedAt");

-- CreateIndex
CREATE INDEX "WorkExperience_company_idx" ON "WorkExperience"("company");

-- CreateIndex
CREATE INDEX "WorkExperience_industry_idx" ON "WorkExperience"("industry");

-- CreateIndex
CREATE INDEX "WorkExperience_isCurrent_idx" ON "WorkExperience"("isCurrent");

-- CreateIndex
CREATE INDEX "WorkExperience_candidateId_deletedAt_idx" ON "WorkExperience"("candidateId", "deletedAt");

-- CreateIndex
CREATE INDEX "WorkExperience_candidateId_startDate_idx" ON "WorkExperience"("candidateId", "startDate");

-- CreateIndex
CREATE INDEX "WorkExperience_industry_position_idx" ON "WorkExperience"("industry", "position");

-- CreateIndex
CREATE INDEX "WorkExperience_company_deletedAt_idx" ON "WorkExperience"("company", "deletedAt");

-- AddForeignKey
ALTER TABLE "CandidateSkill" ADD CONSTRAINT "CandidateSkill_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateSkill" ADD CONSTRAINT "CandidateSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionSkill" ADD CONSTRAINT "PositionSkill_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionSkill" ADD CONSTRAINT "PositionSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
