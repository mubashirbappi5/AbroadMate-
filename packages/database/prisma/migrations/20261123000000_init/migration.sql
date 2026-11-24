-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "AppRole" AS ENUM ('STUDENT', 'SUPER_ADMIN', 'DATA_MANAGER', 'VERIFICATION_MANAGER', 'SUPPORT_ADMIN', 'CONTENT_MANAGER');

-- CreateEnum
CREATE TYPE "LanguagePreference" AS ENUM ('BN', 'EN');

-- CreateEnum
CREATE TYPE "DegreeLevel" AS ENUM ('BACHELOR', 'MASTER', 'PHD', 'DIPLOMA');

-- CreateEnum
CREATE TYPE "SubjectCategory" AS ENUM ('COMPUTER_SCIENCE_IT', 'DATA_SCIENCE_AI', 'ENGINEERING_TECHNOLOGY', 'BUSINESS_MANAGEMENT', 'HEALTH_MEDICAL_SCIENCES', 'NATURAL_SCIENCES', 'SOCIAL_SCIENCES_HUMANITIES', 'LAW_LEGAL_STUDIES');

-- CreateEnum
CREATE TYPE "FavoriteCategory" AS ENUM ('AMBITIOUS', 'TARGET', 'SAFE');

-- CreateEnum
CREATE TYPE "FavoriteItemType" AS ENUM ('UNIVERSITY', 'PROGRAM');

-- CreateEnum
CREATE TYPE "IntakeSeason" AS ENUM ('FALL', 'SPRING', 'SUMMER');

-- CreateEnum
CREATE TYPE "EnglishTestType" AS ENUM ('IELTS', 'TOEFL', 'PTE', 'DUOLINGO', 'MOI', 'NOT_TAKEN');

-- CreateEnum
CREATE TYPE "AcademicEducationLevel" AS ENUM ('SSC', 'HSC', 'O_LEVEL', 'A_LEVEL', 'DIPLOMA', 'BACHELOR', 'MASTER', 'PHD');

-- CreateEnum
CREATE TYPE "SponsorRelationship" AS ENUM ('SELF', 'FATHER', 'MOTHER', 'SPOUSE', 'SIBLING', 'ORGANIZATION', 'GOVERNMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('VERIFIED', 'PENDING_REVIEW', 'REJECTED', 'DEPRECATED', 'NEEDS_UPDATE', 'UNVERIFIED');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'VERIFY', 'APPROVE', 'REJECT', 'LOGIN', 'LOGOUT', 'DOWNLOAD');

-- CreateEnum
CREATE TYPE "DocumentCategory" AS ENUM ('ACADEMIC_TRANSCRIPT', 'DEGREE_CERTIFICATE', 'LANGUAGE_TEST_TRF', 'BANK_SOLVENCY', 'BANK_STATEMENT_28DAY', 'SPONSOR_AFFIDAVIT', 'PASSPORT_BIOPAGE', 'NATIONAL_ID', 'POLICE_CLEARANCE', 'TUBERCULOSIS_TEST', 'SOP_ESSAY', 'RESUME_CV', 'RECOMMENDATION_LETTER', 'OFFER_LETTER', 'CAS_OR_I20', 'OTHER');

-- CreateEnum
CREATE TYPE "ScholarshipProviderType" AS ENUM ('GOVERNMENT', 'UNIVERSITY', 'FOUNDATION_TRUST', 'EXTERNAL_ORGANIZATION');

-- CreateEnum
CREATE TYPE "ScholarshipFundingType" AS ENUM ('FULL_FUNDED', 'TUITION_ONLY', 'PARTIAL_WAIVER', 'STIPEND_ONLY', 'FIXED_GRANT');

-- CreateEnum
CREATE TYPE "FundingChoiceType" AS ENUM ('SCHOLARSHIP_FUNDED', 'SELF_FUNDED');

-- CreateEnum
CREATE TYPE "RequirementMandatoryStatus" AS ENUM ('MANDATORY', 'CONDITIONAL', 'NOT_APPLICABLE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "VisaAssessmentVerdict" AS ENUM ('PRELIMINARY_ELIGIBLE', 'REQUIREMENTS_MISSING', 'FINANCIAL_GAP', 'DOCUMENTS_MISSING', 'CONDITIONAL_REQUIREMENTS', 'UNABLE_TO_DETERMINE');

-- CreateEnum
CREATE TYPE "ReminderChannel" AS ENUM ('EMAIL', 'IN_APP', 'SMS');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'WAITING', 'COMPLETED', 'BLOCKED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "DeadlineType" AS ENUM ('APPLICATION_DEADLINE', 'SCHOLARSHIP_DEADLINE', 'IELTS_TEST_DATE', 'TUITION_DEPOSIT_DEADLINE', 'VISA_SUBMISSION_DEADLINE', 'BIOMETRICS_APPOINTMENT', 'MEDICAL_APPOINTMENT', 'PASSPORT_EXPIRY', 'ENROLLMENT_DEADLINE', 'CUSTOM_REMINDER');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'WARNING', 'DEADLINE_ALERT', 'SCHOLARSHIP_MATCH', 'VISA_POLICY_UPDATE', 'SYSTEM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "supabaseId" TEXT,
    "passwordHash" TEXT,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "primaryRole" "AppRole" NOT NULL DEFAULT 'STUDENT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoleAssignment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "AppRole" NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,

    CONSTRAINT "UserRoleAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "preferredLang" "LanguagePreference" NOT NULL DEFAULT 'BN',
    "currencyPreference" TEXT NOT NULL DEFAULT 'BDT',
    "deadlineAlertsEmail" BOOLEAN NOT NULL DEFAULT true,
    "deadlineAlertsWeb" BOOLEAN NOT NULL DEFAULT true,
    "scholarshipAlerts" BOOLEAN NOT NULL DEFAULT true,
    "visaRuleUpdates" BOOLEAN NOT NULL DEFAULT true,
    "weeklyRoadmapChecklist" BOOLEAN NOT NULL DEFAULT false,
    "telegramAlerts" BOOLEAN NOT NULL DEFAULT false,
    "telegramChatId" TEXT,
    "customReminderDays" INTEGER[] DEFAULT ARRAY[30, 14, 7, 3, 1]::INTEGER[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserConsent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "consentType" TEXT NOT NULL,
    "consentVersion" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "UserConsent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSessionMetadata" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceType" TEXT,
    "browserName" TEXT,
    "operatingSys" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "cityLocation" TEXT,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSessionMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "nationality" TEXT NOT NULL DEFAULT 'Bangladeshi',
    "currentCountry" TEXT NOT NULL DEFAULT 'Bangladesh',
    "currentCity" TEXT,
    "hasPassport" BOOLEAN NOT NULL DEFAULT false,
    "passportNumber" TEXT,
    "passportExpiryDate" TIMESTAMP(3),
    "alternatePhone" TEXT,
    "currentLevel" TEXT NOT NULL,
    "targetDegreeLevel" "DegreeLevel" NOT NULL DEFAULT 'MASTER',
    "targetField" TEXT,
    "targetIntakeSeason" "IntakeSeason" NOT NULL DEFAULT 'FALL',
    "targetIntakeYear" INTEGER NOT NULL DEFAULT 2026,
    "completionPercentage" INTEGER NOT NULL DEFAULT 25,
    "onboardingStep" INTEGER NOT NULL DEFAULT 1,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicRecord" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "level" "AcademicEducationLevel" NOT NULL,
    "institutionName" TEXT NOT NULL,
    "boardOrAuthority" TEXT,
    "groupOrMajor" TEXT,
    "gpaOrCgpa" DOUBLE PRECISION NOT NULL,
    "scale" DOUBLE PRECISION NOT NULL DEFAULT 4.0,
    "startYear" INTEGER,
    "passingYear" INTEGER NOT NULL,
    "resultStatus" TEXT NOT NULL DEFAULT 'PASSED',
    "hasBacklogs" BOOLEAN NOT NULL DEFAULT false,
    "backlogsCount" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "certificateDocId" TEXT,
    "transcriptDocId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LanguageTestRecord" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "testType" "EnglishTestType" NOT NULL DEFAULT 'IELTS',
    "overallScore" DOUBLE PRECISION,
    "listeningScore" DOUBLE PRECISION,
    "readingScore" DOUBLE PRECISION,
    "writingScore" DOUBLE PRECISION,
    "speakingScore" DOUBLE PRECISION,
    "testDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "trfNumber" TEXT,
    "plannedTestDate" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "certificateDocId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LanguageTestRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmploymentRecord" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmploymentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialProfile" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "annualTuitionBudget" DOUBLE PRECISION NOT NULL,
    "budgetCurrencyCode" TEXT NOT NULL DEFAULT 'BDT',
    "liquidSavingsAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "savingsCurrencyCode" TEXT NOT NULL DEFAULT 'BDT',
    "primaryBankName" TEXT,
    "accountHoldingMonths" INTEGER NOT NULL DEFAULT 0,
    "fundingStrategyType" TEXT NOT NULL DEFAULT 'SELF_AND_FAMILY',
    "hasSponsor" BOOLEAN NOT NULL DEFAULT true,
    "scholarshipPreference" TEXT,
    "educationLoanInterest" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sponsor" (
    "id" TEXT NOT NULL,
    "financialProfileId" TEXT NOT NULL,
    "relationship" "SponsorRelationship" NOT NULL DEFAULT 'SELF',
    "name" TEXT NOT NULL,
    "occupation" TEXT,
    "annualIncomeAmount" DOUBLE PRECISION,
    "incomeCurrencyCode" TEXT NOT NULL DEFAULT 'BDT',
    "committedAmount" DOUBLE PRECISION,
    "fundsCurrencyCode" TEXT NOT NULL DEFAULT 'BDT',
    "affidavitDocId" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sponsor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'আমার স্টাডি বাজেট',
    "countryCode" TEXT NOT NULL,
    "programId" TEXT,
    "degreeLevel" TEXT NOT NULL DEFAULT 'MASTERS',
    "studyDurationYears" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "currencyCode" TEXT NOT NULL,
    "exchangeRateToBdt" DOUBLE PRECISION NOT NULL,
    "exchangeRateSource" TEXT NOT NULL DEFAULT 'বাংলাদেশ ব্যাংক / ওপেন মার্কেট রেফারেন্স',
    "exchangeRateTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appFeeTotalLocal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "languageTestFeeBdt" DOUBLE PRECISION NOT NULL DEFAULT 23500,
    "documentPrepFeeBdt" DOUBLE PRECISION NOT NULL DEFAULT 8000,
    "medicalExamFeeBdt" DOUBLE PRECISION NOT NULL DEFAULT 13500,
    "flightTicketBdt" DOUBLE PRECISION NOT NULL DEFAULT 90000,
    "initialSettlementLocal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "visaApplicationFeeLocal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "biometricsFeeLocal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "healthInsuranceLocal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "countrySpecificCostsLocal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "grossTuitionAnnualLocal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tuitionDepositPaidLocal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "livingCostAnnualLocal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "accommodationAnnualLocal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "foodAnnualLocal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "transportAnnualLocal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "emergencyFundLocal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "studentSavingsLocal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sponsorContributionLocal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "educationLoanLocal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "scholarshipDeductionLocal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monthlySavingsCapacityBdt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monthsUntilDeparture" INTEGER NOT NULL DEFAULT 6,
    "firstYearTotalCostLocal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "firstYearTotalCostBdt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalDegreeCostLocal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalDegreeCostBdt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAvailableFundsLocal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAvailableFundsBdt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fundingGapLocal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fundingGapBdt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "targetMonthlySavingsBdt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "savingsFeasibility" TEXT NOT NULL DEFAULT 'FEASIBLE',
    "versionNumber" INTEGER NOT NULL DEFAULT 1,
    "revisionNotes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BudgetPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetPlanRevision" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "changeSummaryBn" TEXT NOT NULL,
    "snapshotJson" TEXT NOT NULL,
    "fundingGapBdt" DOUBLE PRECISION NOT NULL,
    "firstYearTotalBdt" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BudgetPlanRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangeRateAudit" (
    "id" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "rateToBdt" DOUBLE PRECISION NOT NULL,
    "sourceProvider" TEXT NOT NULL DEFAULT 'Bangladesh Bank Reference',
    "isVerified" BOOLEAN NOT NULL DEFAULT true,
    "effectiveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExchangeRateAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImmigrationHistory" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "hasTravelHistory" BOOLEAN NOT NULL DEFAULT false,
    "travelHistorySummary" TEXT,
    "countryCode" TEXT NOT NULL,
    "visaTypeApplied" TEXT,
    "applicationYear" INTEGER,
    "outcomeStatus" TEXT NOT NULL DEFAULT 'NONE',
    "hasPreviousRefusal" BOOLEAN NOT NULL DEFAULT false,
    "refusalReasonNotice" TEXT,
    "hasViolations" BOOLEAN NOT NULL DEFAULT false,
    "violationDetails" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImmigrationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyPreference" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "desiredDegreeLevel" "DegreeLevel",
    "preferredSubject" TEXT,
    "preferredIntakeSeason" "IntakeSeason",
    "preferredIntakeYear" INTEGER,
    "desiredStartDate" TIMESTAMP(3),
    "studyMode" TEXT NOT NULL DEFAULT 'FULL_TIME',
    "targetCountryCodes" TEXT[],
    "preferredCityType" TEXT NOT NULL DEFAULT 'AFFORDABLE_STUDENT_TOWN',
    "pswWorkImportance" TEXT NOT NULL DEFAULT 'HIGH',
    "priorityRankingRange" TEXT,
    "academicGoals" TEXT,
    "careerGoals" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "code" TEXT NOT NULL,
    "iso2" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameBn" TEXT NOT NULL,
    "flagEmoji" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "currencySymbol" TEXT NOT NULL,
    "approxBdtRate" DOUBLE PRECISION NOT NULL,
    "officialLanguage" TEXT NOT NULL DEFAULT 'English',
    "commonStudyLanguages" TEXT[] DEFAULT ARRAY['English']::TEXT[],
    "educationSystemOverviewBn" TEXT,
    "degreeStructuresJson" TEXT,
    "tuitionCostRangesBn" TEXT,
    "livingCostInfoBn" TEXT,
    "officialEducationUrl" TEXT,
    "officialImmigrationUrl" TEXT NOT NULL,
    "dhakaEmbassyName" TEXT NOT NULL,
    "dhakaEmbassyUrl" TEXT NOT NULL,
    "postStudyWorkDurationBn" TEXT NOT NULL,
    "avgMonthlyLivingCost" DOUBLE PRECISION NOT NULL,
    "blockedAccountRequired" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastVerifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "CountryPolicyVersion" (
    "id" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL DEFAULT 1,
    "effectiveFromDate" TIMESTAMP(3) NOT NULL,
    "effectiveToDate" TIMESTAMP(3),
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "changeSummaryBn" TEXT NOT NULL,
    "officialGazetteUrl" TEXT,
    "livingCostMonthlyLocal" DOUBLE PRECISION,
    "livingCostCurrencyCode" TEXT,
    "blockedAccountRequired" BOOLEAN NOT NULL DEFAULT false,
    "blockedAccountAmount" DOUBLE PRECISION,
    "pswDurationMonths" INTEGER,
    "weeklyWorkHoursPermit" INTEGER DEFAULT 20,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CountryPolicyVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisaType" (
    "id" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "visaCode" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameBn" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "applicantType" TEXT NOT NULL DEFAULT 'STUDENT',
    "purpose" TEXT,
    "officialImmigrationUrl" TEXT,
    "applicationAuthority" TEXT,
    "officialFeeAmount" DOUBLE PRECISION NOT NULL,
    "feeCurrencyCode" TEXT NOT NULL,
    "processingDaysAvg" INTEGER NOT NULL DEFAULT 21,
    "lastVerifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisaType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "University" (
    "id" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameBn" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "stateOrProvince" TEXT,
    "worldRank" INTEGER,
    "websiteUrl" TEXT NOT NULL,
    "admissionsUrl" TEXT,
    "applicationUrl" TEXT,
    "institutionType" TEXT NOT NULL DEFAULT 'PUBLIC_RESEARCH',
    "accreditationDetailsBn" TEXT,
    "recognizingAuthority" TEXT,
    "institutionRegistryCode" TEXT,
    "internationalStudentUrl" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'VERIFIED',
    "isRecognized" BOOLEAN NOT NULL DEFAULT true,
    "logoUrl" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "officialSourceUrl" TEXT NOT NULL,
    "lastVerifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleBn" TEXT NOT NULL,
    "degreeLevel" "DegreeLevel" NOT NULL DEFAULT 'MASTER',
    "subjectCategory" "SubjectCategory" NOT NULL DEFAULT 'COMPUTER_SCIENCE_IT',
    "department" TEXT NOT NULL,
    "durationMonths" INTEGER NOT NULL DEFAULT 12,
    "studyMode" TEXT NOT NULL DEFAULT 'FULL_TIME',
    "annualTuitionAmount" DOUBLE PRECISION NOT NULL,
    "tuitionCurrencyCode" TEXT NOT NULL,
    "prerequisitesBn" TEXT,
    "officialProgramUrl" TEXT,
    "officialSourceUrl" TEXT NOT NULL,
    "lastVerifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdmissionRequirement" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'VERIFIED',
    "verifiedAt" TIMESTAMP(3),
    "verifiedByAdminId" TEXT,
    "officialSourceUrl" TEXT NOT NULL DEFAULT 'https://www.gov.uk/student-visa',
    "sourceNotes" TEXT,
    "requiredDegreeLevel" "DegreeLevel" NOT NULL DEFAULT 'BACHELOR',
    "acceptedQualifications" TEXT[],
    "requiredDisciplines" TEXT[],
    "minGpaOrCgpa" DOUBLE PRECISION NOT NULL DEFAULT 3.0,
    "gpaScale" DOUBLE PRECISION NOT NULL DEFAULT 4.0,
    "minPercentage" DOUBLE PRECISION,
    "minUkDegreeClassification" TEXT,
    "maxGermanGrade" DOUBLE PRECISION,
    "minIeltsOverall" DOUBLE PRECISION NOT NULL DEFAULT 6.5,
    "minIeltsEachBand" DOUBLE PRECISION NOT NULL DEFAULT 6.0,
    "minIeltsListening" DOUBLE PRECISION DEFAULT 6.0,
    "minIeltsReading" DOUBLE PRECISION DEFAULT 6.0,
    "minIeltsWriting" DOUBLE PRECISION DEFAULT 6.0,
    "minIeltsSpeaking" DOUBLE PRECISION DEFAULT 6.0,
    "minPteOverall" INTEGER,
    "minPteEachBand" INTEGER,
    "minToeflIbtOverall" INTEGER,
    "minToeflEachBand" INTEGER,
    "duolingoAccepted" BOOLEAN NOT NULL DEFAULT false,
    "minDuolingoScore" INTEGER,
    "greRequired" BOOLEAN NOT NULL DEFAULT false,
    "minGreScore" INTEGER,
    "minGreQuant" INTEGER,
    "minGreVerbal" INTEGER,
    "gmatRequired" BOOLEAN NOT NULL DEFAULT false,
    "minGmatScore" INTEGER,
    "workExperienceMonths" INTEGER NOT NULL DEFAULT 0,
    "workExperienceRequired" BOOLEAN NOT NULL DEFAULT false,
    "workExperienceField" TEXT,
    "portfolioRequired" BOOLEAN NOT NULL DEFAULT false,
    "prerequisiteCoursesJson" TEXT,
    "requiredDocumentsJson" TEXT,
    "notesBn" TEXT,
    "allowsConditionalAdmission" BOOLEAN NOT NULL DEFAULT true,
    "preSessionalEnglishAvailable" BOOLEAN NOT NULL DEFAULT true,
    "equivalencyNotesBn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdmissionRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdmissionRequirementVersion" (
    "id" TEXT NOT NULL,
    "requirementId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedByAdminId" TEXT,
    "officialSourceUrl" TEXT NOT NULL,
    "changeSummaryBn" TEXT,
    "snapshotData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdmissionRequirementVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramIntake" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "season" "IntakeSeason" NOT NULL,
    "year" INTEGER NOT NULL,
    "applicationDeadline" TIMESTAMP(3) NOT NULL,
    "sessionStartDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramIntake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scholarship" (
    "id" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "universityId" TEXT,
    "titleEn" TEXT NOT NULL,
    "titleBn" TEXT NOT NULL,
    "providerName" TEXT NOT NULL DEFAULT 'Government Authority',
    "providerType" "ScholarshipProviderType" NOT NULL DEFAULT 'GOVERNMENT',
    "fundingType" "ScholarshipFundingType" NOT NULL DEFAULT 'FULL_FUNDED',
    "coverageType" TEXT NOT NULL DEFAULT 'FULL_FUNDED',
    "tuitionCoveragePercent" DOUBLE PRECISION NOT NULL DEFAULT 100.0,
    "tuitionCoverageMaxAmount" DOUBLE PRECISION,
    "tuitionCoverageCurrency" TEXT,
    "livingStipendMonthly" DOUBLE PRECISION,
    "livingStipendAnnual" DOUBLE PRECISION,
    "livingStipendCurrency" TEXT,
    "stipendMonthlyAmount" DOUBLE PRECISION,
    "stipendCurrencyCode" TEXT,
    "travelSupport" BOOLEAN NOT NULL DEFAULT false,
    "travelSupportDetailsBn" TEXT,
    "accommodationSupport" BOOLEAN NOT NULL DEFAULT false,
    "accommodationDetailsBn" TEXT,
    "healthInsuranceCovered" BOOLEAN NOT NULL DEFAULT false,
    "visaFeeCovered" BOOLEAN NOT NULL DEFAULT false,
    "otherBenefitsBn" TEXT,
    "coverageDescriptionBn" TEXT NOT NULL,
    "eligibilityCriteriaBn" TEXT NOT NULL,
    "applicationDeadline" TIMESTAMP(3),
    "deadlineType" TEXT NOT NULL DEFAULT 'ANNUAL_RECURRING',
    "deadlineMonth" INTEGER,
    "deadlineDay" INTEGER,
    "deadlineNotice" TEXT,
    "requiredDocumentsJson" TEXT,
    "officialPortalUrl" TEXT NOT NULL,
    "effectiveDate" TIMESTAMP(3),
    "lastVerifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'VERIFIED',
    "verifiedByAdminId" TEXT,
    "notesBn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scholarship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScholarshipEligibilityRule" (
    "id" TEXT NOT NULL,
    "scholarshipId" TEXT NOT NULL,
    "eligibleDegreeLevels" "DegreeLevel"[],
    "eligibleDisciplines" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "targetNationalities" TEXT[] DEFAULT ARRAY['BD']::TEXT[],
    "minCgpaRequired" DOUBLE PRECISION DEFAULT 3.0,
    "gpaScale" DOUBLE PRECISION NOT NULL DEFAULT 4.0,
    "minPercentage" DOUBLE PRECISION,
    "minUkDegreeClassification" TEXT,
    "minIeltsRequired" DOUBLE PRECISION DEFAULT 6.5,
    "minIeltsEachBand" DOUBLE PRECISION DEFAULT 6.0,
    "minPteRequired" INTEGER,
    "minToeflRequired" INTEGER,
    "duolingoAccepted" BOOLEAN NOT NULL DEFAULT false,
    "workExperienceMonths" INTEGER NOT NULL DEFAULT 0,
    "workExperienceRequired" BOOLEAN NOT NULL DEFAULT false,
    "minAge" INTEGER,
    "maxAge" INTEGER,
    "ruleDescriptionBn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScholarshipEligibilityRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundingDecisionLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "choiceType" "FundingChoiceType" NOT NULL,
    "scholarshipId" TEXT,
    "coveredTuitionAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "coveredLivingAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "uncoveredExpensesBdt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currencyCode" TEXT NOT NULL DEFAULT 'BDT',
    "notesBn" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "decidedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FundingDecisionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisaRequirement" (
    "id" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "visaTypeId" TEXT NOT NULL,
    "isCurrentActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisaRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisaRequirementVersion" (
    "id" TEXT NOT NULL,
    "visaRequirementId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL DEFAULT 1,
    "previousVersionId" TEXT,
    "effectiveFromDate" TIMESTAMP(3) NOT NULL,
    "effectiveToDate" TIMESTAMP(3),
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "changeSummaryBn" TEXT NOT NULL,
    "officialGazetteUrl" TEXT NOT NULL,
    "sourceOrganization" TEXT NOT NULL DEFAULT 'Official Immigration Authority',
    "publishedDate" TIMESTAMP(3),
    "lastCheckedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'VERIFIED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisaRequirementVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisaFinancialRule" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "requiredLivingFunds" DOUBLE PRECISION NOT NULL,
    "tuitionFeeRuleBn" TEXT NOT NULL DEFAULT 'প্রথম বর্ষের অবশিষ্ট পূর্ণ টিউশন ফি',
    "fundsCurrencyCode" TEXT NOT NULL,
    "maintenancePeriodDays" INTEGER NOT NULL DEFAULT 28,
    "bankStatementPeriodMonths" INTEGER NOT NULL DEFAULT 1,
    "travelExpenseLocal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dependentExpenseMonthly" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "blockedAccountRequired" BOOLEAN NOT NULL DEFAULT false,
    "monthlyLivingRate" DOUBLE PRECISION,
    "acceptedEvidenceBn" TEXT NOT NULL DEFAULT 'অনুমোদিত সিডিউল ব্যাংক একাউন্টে সেভিংস বা ফিক্সড ডিপোজিট',
    "sponsorConditionsBn" TEXT NOT NULL DEFAULT 'শিক্ষার্থী নিজে অথবা পিতা-মাতার স্পনসরশিপ',
    "scholarshipConditionsBn" TEXT,
    "acceptableInstrumentsBn" TEXT NOT NULL,
    "unacceptableFundsBn" TEXT,
    "sourceUrl" TEXT,
    "effectiveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisaFinancialRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisaDocumentRequirement" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "category" "DocumentCategory" NOT NULL,
    "documentType" TEXT NOT NULL DEFAULT 'OTHER',
    "titleEn" TEXT NOT NULL,
    "titleBn" TEXT NOT NULL,
    "isMandatory" BOOLEAN NOT NULL DEFAULT true,
    "requirementStatus" "RequirementMandatoryStatus" NOT NULL DEFAULT 'MANDATORY',
    "conditionRuleBn" TEXT,
    "attestationRuleBn" TEXT,
    "notesBn" TEXT,
    "officialSourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisaDocumentRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisaGeneralRequirement" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameBn" TEXT NOT NULL,
    "descriptionBn" TEXT NOT NULL,
    "requirementStatus" "RequirementMandatoryStatus" NOT NULL DEFAULT 'MANDATORY',
    "applicableApplicant" TEXT NOT NULL DEFAULT 'STUDENT',
    "applicableDegree" TEXT NOT NULL DEFAULT 'ALL',
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveUntil" TIMESTAMP(3),
    "officialSourceUrl" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'VERIFIED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisaGeneralRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisaWorkflowStep" (
    "id" TEXT NOT NULL,
    "visaTypeId" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "stepOrder" INTEGER NOT NULL,
    "stageCode" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleBn" TEXT NOT NULL,
    "descriptionBn" TEXT NOT NULL,
    "estimatedDurationDays" INTEGER NOT NULL DEFAULT 7,
    "localAuthorityOrCenter" TEXT,
    "officialPortalUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisaWorkflowStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountryVisaGuide" (
    "id" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "visaOverviewBn" TEXT NOT NULL,
    "eligibilityBn" TEXT NOT NULL,
    "financialReqBn" TEXT NOT NULL,
    "sponsorRulesBn" TEXT NOT NULL,
    "requiredDocumentsBn" TEXT NOT NULL,
    "applicationProcessBn" TEXT NOT NULL,
    "biometricsBn" TEXT NOT NULL,
    "medicalReqBn" TEXT NOT NULL,
    "feesBn" TEXT NOT NULL,
    "processingTimeBn" TEXT NOT NULL,
    "interviewGuideBn" TEXT NOT NULL,
    "workRightsBn" TEXT NOT NULL,
    "postStudyOptionsBn" TEXT NOT NULL,
    "refusalReapplyBn" TEXT NOT NULL,
    "officialSourcesBn" TEXT NOT NULL,
    "lastVerifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CountryVisaGuide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisaAssessmentLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "visaCode" TEXT NOT NULL,
    "verdictStatus" "VisaAssessmentVerdict" NOT NULL,
    "tuitionRemaining" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "livingFundsRequired" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalFundsRequired" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "availableFundsTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "financialGapAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currencyCode" TEXT NOT NULL DEFAULT 'BDT',
    "missingRequirementsJson" TEXT,
    "missingDocumentsJson" TEXT,
    "conditionsJson" TEXT,
    "summaryBn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisaAssessmentLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InformationSource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authorityName" TEXT NOT NULL,
    "officialUrl" TEXT NOT NULL,
    "countryCode" TEXT,
    "universityId" TEXT,
    "programId" TEXT,
    "scholarshipId" TEXT,
    "visaRequirementId" TEXT,
    "sourceCategory" TEXT DEFAULT 'GOVERNMENT_IMMIGRATION',
    "nextReviewDate" TIMESTAMP(3),
    "status" "VerificationStatus" NOT NULL DEFAULT 'VERIFIED',
    "lastVerifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InformationSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceRecord" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "snapshotHash" TEXT NOT NULL,
    "rawContent" TEXT,
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SourceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceChangeLog" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "fieldChanged" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requiresHumanReview" BOOLEAN NOT NULL DEFAULT true,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SourceChangeLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationRecord" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "verifiedByUserId" TEXT NOT NULL,
    "verificationMethod" TEXT NOT NULL,
    "verificationNotes" TEXT,
    "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGoal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetCountryCodes" TEXT[],
    "targetDegreeLevel" "DegreeLevel" NOT NULL DEFAULT 'MASTER',
    "targetMajor" TEXT NOT NULL,
    "targetIntakeSeason" "IntakeSeason" NOT NULL DEFAULT 'FALL',
    "targetIntakeYear" INTEGER NOT NULL DEFAULT 2026,
    "annualBudgetAmount" DOUBLE PRECISION NOT NULL,
    "budgetCurrencyCode" TEXT NOT NULL DEFAULT 'BDT',
    "fundingStrategy" TEXT NOT NULL DEFAULT 'PARTIAL_SCHOLARSHIP',
    "postStudyPriority" TEXT NOT NULL DEFAULT 'HIGH',
    "campusPreference" TEXT NOT NULL DEFAULT 'AFFORDABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roadmap" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetCountryCode" TEXT NOT NULL,
    "targetUniversityId" TEXT,
    "targetProgramId" TEXT,
    "targetIntakeSeason" "IntakeSeason" NOT NULL,
    "targetIntakeYear" INTEGER NOT NULL,
    "fundingChoice" "FundingChoiceType" NOT NULL DEFAULT 'SELF_FUNDED',
    "scholarshipId" TEXT,
    "currentStageNumber" INTEGER NOT NULL DEFAULT 1,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "versionNumber" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Roadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapPhase" (
    "id" TEXT NOT NULL,
    "roadmapId" TEXT NOT NULL,
    "phaseNumber" INTEGER NOT NULL,
    "phaseKey" TEXT NOT NULL DEFAULT 'PREPARATION',
    "timeframeNoticeBn" TEXT NOT NULL,
    "titleBn" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoadmapPhase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapTask" (
    "id" TEXT NOT NULL,
    "phaseId" TEXT NOT NULL,
    "taskCode" TEXT NOT NULL DEFAULT 'TASK_GENERAL',
    "titleBn" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "description" TEXT,
    "bengaliExplanation" TEXT,
    "whyItMattersBn" TEXT,
    "requiredDocumentsJson" TEXT,
    "estimatedCostBdt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "costCurrency" TEXT NOT NULL DEFAULT 'BDT',
    "estimatedDurationDays" INTEGER NOT NULL DEFAULT 7,
    "startDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "TaskStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "dependenciesJson" TEXT,
    "officialSourceUrl" TEXT,
    "officialSourceOrg" TEXT,
    "completionCriteriaBn" TEXT,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "actionUrl" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoadmapTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapVersionHistory" (
    "id" TEXT NOT NULL,
    "roadmapId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "changeReasonBn" TEXT NOT NULL,
    "snapshotJson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoadmapVersionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDocument" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bucketName" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "category" "DocumentCategory" NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SOPDocument" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "targetCountryCode" TEXT,
    "targetUniversity" TEXT,
    "targetProgram" TEXT,
    "degreeLevel" "DegreeLevel" NOT NULL DEFAULT 'MASTER',
    "content" TEXT NOT NULL,
    "sectionsJson" TEXT,
    "versionNumber" INTEGER NOT NULL DEFAULT 1,
    "toneStyle" TEXT NOT NULL DEFAULT 'ACADEMIC',
    "aiFeedbackJson" TEXT,
    "critiqueScore" INTEGER,
    "isFinalized" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SOPDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SOPDocumentRevision" (
    "id" TEXT NOT NULL,
    "sopDocumentId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "changeSummary" TEXT NOT NULL,
    "contentSnapshot" TEXT NOT NULL,
    "sectionsSnapshot" TEXT,
    "wordCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SOPDocumentRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIConversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL DEFAULT 'নতুন কথোপকথন',
    "targetCountry" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "citedSourcesJson" TEXT,
    "tokenUsage" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AITokenUsageLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "featureName" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "promptTokens" INTEGER NOT NULL,
    "completionTokens" INTEGER NOT NULL,
    "totalTokens" INTEGER NOT NULL,
    "estimatedCostUsd" DOUBLE PRECISION NOT NULL,
    "latencyMs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AITokenUsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemType" "FavoriteItemType" NOT NULL DEFAULT 'UNIVERSITY',
    "universityId" TEXT,
    "programId" TEXT,
    "category" "FavoriteCategory" NOT NULL DEFAULT 'TARGET',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deadline" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "titleBn" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "deadlineType" "DeadlineType" NOT NULL DEFAULT 'APPLICATION_DEADLINE',
    "category" TEXT NOT NULL,
    "countryCode" TEXT,
    "deadlineDate" TIMESTAMP(3) NOT NULL,
    "officialUrl" TEXT,
    "notesBn" TEXT,
    "isGlobal" BOOLEAN NOT NULL DEFAULT true,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deadline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deadlineId" TEXT,
    "customTitle" TEXT,
    "reminderDate" TIMESTAMP(3) NOT NULL,
    "channel" "ReminderChannel" NOT NULL DEFAULT 'EMAIL',
    "isTriggered" BOOLEAN NOT NULL DEFAULT false,
    "triggeredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'INFO',
    "actionUrl" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "AppRole" NOT NULL,
    "permissions" TEXT[],
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" "AuditAction" NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "previousValue" TEXT,
    "newValue" TEXT,
    "changesJson" TEXT,
    "approvalStatus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataReview" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "reviewerId" TEXT,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "reviewNotes" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PolicyChangeApproval" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "proposedByUserId" TEXT NOT NULL,
    "approvedByUserId" TEXT,
    "approvalStatus" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "decisionComment" TEXT,
    "evidenceComparisonJson" TEXT,
    "affectedStudentsCount" INTEGER DEFAULT 0,
    "notifiedStudentsCount" INTEGER DEFAULT 0,
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PolicyChangeApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationDispatchLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "referenceId" TEXT NOT NULL,
    "thresholdDays" INTEGER,
    "idempotencyKey" TEXT NOT NULL,
    "recipientEmail" TEXT,
    "dispatchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationDispatchLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FailedJobLog" (
    "id" TEXT NOT NULL,
    "queueName" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "jobName" TEXT NOT NULL,
    "payloadJson" TEXT NOT NULL,
    "failedReason" TEXT NOT NULL,
    "attemptsMade" INTEGER NOT NULL,
    "failedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "FailedJobLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_supabaseId_key" ON "User"("supabaseId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_supabaseId_idx" ON "User"("supabaseId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_primaryRole_idx" ON "User"("primaryRole");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- CreateIndex
CREATE INDEX "UserRoleAssignment_userId_idx" ON "UserRoleAssignment"("userId");

-- CreateIndex
CREATE INDEX "UserRoleAssignment_role_idx" ON "UserRoleAssignment"("role");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoleAssignment_userId_role_key" ON "UserRoleAssignment"("userId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- CreateIndex
CREATE INDEX "UserSettings_userId_idx" ON "UserSettings"("userId");

-- CreateIndex
CREATE INDEX "UserConsent_userId_idx" ON "UserConsent"("userId");

-- CreateIndex
CREATE INDEX "UserConsent_consentType_idx" ON "UserConsent"("consentType");

-- CreateIndex
CREATE INDEX "UserSessionMetadata_userId_idx" ON "UserSessionMetadata"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "StudentProfile"("userId");

-- CreateIndex
CREATE INDEX "StudentProfile_userId_idx" ON "StudentProfile"("userId");

-- CreateIndex
CREATE INDEX "StudentProfile_targetDegreeLevel_idx" ON "StudentProfile"("targetDegreeLevel");

-- CreateIndex
CREATE INDEX "StudentProfile_targetIntakeSeason_targetIntakeYear_idx" ON "StudentProfile"("targetIntakeSeason", "targetIntakeYear");

-- CreateIndex
CREATE INDEX "StudentProfile_onboardingCompleted_idx" ON "StudentProfile"("onboardingCompleted");

-- CreateIndex
CREATE INDEX "AcademicRecord_profileId_idx" ON "AcademicRecord"("profileId");

-- CreateIndex
CREATE INDEX "AcademicRecord_level_idx" ON "AcademicRecord"("level");

-- CreateIndex
CREATE INDEX "LanguageTestRecord_profileId_idx" ON "LanguageTestRecord"("profileId");

-- CreateIndex
CREATE INDEX "LanguageTestRecord_testType_idx" ON "LanguageTestRecord"("testType");

-- CreateIndex
CREATE INDEX "EmploymentRecord_profileId_idx" ON "EmploymentRecord"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "FinancialProfile_profileId_key" ON "FinancialProfile"("profileId");

-- CreateIndex
CREATE INDEX "FinancialProfile_profileId_idx" ON "FinancialProfile"("profileId");

-- CreateIndex
CREATE INDEX "Sponsor_financialProfileId_idx" ON "Sponsor"("financialProfileId");

-- CreateIndex
CREATE INDEX "BudgetPlan_userId_idx" ON "BudgetPlan"("userId");

-- CreateIndex
CREATE INDEX "BudgetPlan_countryCode_idx" ON "BudgetPlan"("countryCode");

-- CreateIndex
CREATE INDEX "BudgetPlan_isActive_idx" ON "BudgetPlan"("isActive");

-- CreateIndex
CREATE INDEX "BudgetPlanRevision_planId_idx" ON "BudgetPlanRevision"("planId");

-- CreateIndex
CREATE INDEX "BudgetPlanRevision_versionNumber_idx" ON "BudgetPlanRevision"("versionNumber");

-- CreateIndex
CREATE INDEX "ExchangeRateAudit_currencyCode_idx" ON "ExchangeRateAudit"("currencyCode");

-- CreateIndex
CREATE INDEX "ExchangeRateAudit_effectiveDate_idx" ON "ExchangeRateAudit"("effectiveDate");

-- CreateIndex
CREATE INDEX "ImmigrationHistory_profileId_idx" ON "ImmigrationHistory"("profileId");

-- CreateIndex
CREATE INDEX "ImmigrationHistory_countryCode_idx" ON "ImmigrationHistory"("countryCode");

-- CreateIndex
CREATE UNIQUE INDEX "StudyPreference_profileId_key" ON "StudyPreference"("profileId");

-- CreateIndex
CREATE INDEX "StudyPreference_profileId_idx" ON "StudyPreference"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Country_iso2_key" ON "Country"("iso2");

-- CreateIndex
CREATE INDEX "Country_code_idx" ON "Country"("code");

-- CreateIndex
CREATE INDEX "CountryPolicyVersion_countryCode_idx" ON "CountryPolicyVersion"("countryCode");

-- CreateIndex
CREATE INDEX "CountryPolicyVersion_isArchived_idx" ON "CountryPolicyVersion"("isArchived");

-- CreateIndex
CREATE INDEX "VisaType_countryCode_idx" ON "VisaType"("countryCode");

-- CreateIndex
CREATE UNIQUE INDEX "VisaType_countryCode_visaCode_key" ON "VisaType"("countryCode", "visaCode");

-- CreateIndex
CREATE INDEX "University_countryCode_idx" ON "University"("countryCode");

-- CreateIndex
CREATE INDEX "University_nameEn_idx" ON "University"("nameEn");

-- CreateIndex
CREATE INDEX "University_worldRank_idx" ON "University"("worldRank");

-- CreateIndex
CREATE INDEX "University_verificationStatus_idx" ON "University"("verificationStatus");

-- CreateIndex
CREATE INDEX "Program_universityId_idx" ON "Program"("universityId");

-- CreateIndex
CREATE INDEX "Program_degreeLevel_idx" ON "Program"("degreeLevel");

-- CreateIndex
CREATE INDEX "Program_subjectCategory_idx" ON "Program"("subjectCategory");

-- CreateIndex
CREATE UNIQUE INDEX "AdmissionRequirement_programId_key" ON "AdmissionRequirement"("programId");

-- CreateIndex
CREATE INDEX "AdmissionRequirement_programId_idx" ON "AdmissionRequirement"("programId");

-- CreateIndex
CREATE INDEX "AdmissionRequirement_verificationStatus_idx" ON "AdmissionRequirement"("verificationStatus");

-- CreateIndex
CREATE INDEX "AdmissionRequirementVersion_requirementId_idx" ON "AdmissionRequirementVersion"("requirementId");

-- CreateIndex
CREATE INDEX "AdmissionRequirementVersion_version_idx" ON "AdmissionRequirementVersion"("version");

-- CreateIndex
CREATE INDEX "ProgramIntake_programId_idx" ON "ProgramIntake"("programId");

-- CreateIndex
CREATE INDEX "ProgramIntake_year_season_idx" ON "ProgramIntake"("year", "season");

-- CreateIndex
CREATE INDEX "Scholarship_countryCode_idx" ON "Scholarship"("countryCode");

-- CreateIndex
CREATE INDEX "Scholarship_providerType_idx" ON "Scholarship"("providerType");

-- CreateIndex
CREATE INDEX "Scholarship_fundingType_idx" ON "Scholarship"("fundingType");

-- CreateIndex
CREATE INDEX "Scholarship_verificationStatus_idx" ON "Scholarship"("verificationStatus");

-- CreateIndex
CREATE INDEX "ScholarshipEligibilityRule_scholarshipId_idx" ON "ScholarshipEligibilityRule"("scholarshipId");

-- CreateIndex
CREATE INDEX "FundingDecisionLog_userId_idx" ON "FundingDecisionLog"("userId");

-- CreateIndex
CREATE INDEX "FundingDecisionLog_choiceType_idx" ON "FundingDecisionLog"("choiceType");

-- CreateIndex
CREATE INDEX "FundingDecisionLog_isActive_idx" ON "FundingDecisionLog"("isActive");

-- CreateIndex
CREATE INDEX "VisaRequirement_countryCode_idx" ON "VisaRequirement"("countryCode");

-- CreateIndex
CREATE INDEX "VisaRequirement_visaTypeId_idx" ON "VisaRequirement"("visaTypeId");

-- CreateIndex
CREATE INDEX "VisaRequirementVersion_visaRequirementId_idx" ON "VisaRequirementVersion"("visaRequirementId");

-- CreateIndex
CREATE INDEX "VisaRequirementVersion_isArchived_idx" ON "VisaRequirementVersion"("isArchived");

-- CreateIndex
CREATE INDEX "VisaFinancialRule_versionId_idx" ON "VisaFinancialRule"("versionId");

-- CreateIndex
CREATE INDEX "VisaDocumentRequirement_versionId_idx" ON "VisaDocumentRequirement"("versionId");

-- CreateIndex
CREATE INDEX "VisaDocumentRequirement_category_idx" ON "VisaDocumentRequirement"("category");

-- CreateIndex
CREATE INDEX "VisaDocumentRequirement_documentType_idx" ON "VisaDocumentRequirement"("documentType");

-- CreateIndex
CREATE INDEX "VisaGeneralRequirement_versionId_idx" ON "VisaGeneralRequirement"("versionId");

-- CreateIndex
CREATE INDEX "VisaWorkflowStep_visaTypeId_idx" ON "VisaWorkflowStep"("visaTypeId");

-- CreateIndex
CREATE INDEX "VisaWorkflowStep_countryCode_idx" ON "VisaWorkflowStep"("countryCode");

-- CreateIndex
CREATE INDEX "VisaWorkflowStep_stepOrder_idx" ON "VisaWorkflowStep"("stepOrder");

-- CreateIndex
CREATE UNIQUE INDEX "CountryVisaGuide_countryCode_key" ON "CountryVisaGuide"("countryCode");

-- CreateIndex
CREATE INDEX "CountryVisaGuide_countryCode_idx" ON "CountryVisaGuide"("countryCode");

-- CreateIndex
CREATE INDEX "VisaAssessmentLog_userId_idx" ON "VisaAssessmentLog"("userId");

-- CreateIndex
CREATE INDEX "VisaAssessmentLog_countryCode_idx" ON "VisaAssessmentLog"("countryCode");

-- CreateIndex
CREATE INDEX "VisaAssessmentLog_verdictStatus_idx" ON "VisaAssessmentLog"("verdictStatus");

-- CreateIndex
CREATE INDEX "InformationSource_officialUrl_idx" ON "InformationSource"("officialUrl");

-- CreateIndex
CREATE INDEX "InformationSource_status_idx" ON "InformationSource"("status");

-- CreateIndex
CREATE INDEX "InformationSource_nextReviewDate_idx" ON "InformationSource"("nextReviewDate");

-- CreateIndex
CREATE INDEX "SourceRecord_sourceId_idx" ON "SourceRecord"("sourceId");

-- CreateIndex
CREATE INDEX "SourceChangeLog_sourceId_idx" ON "SourceChangeLog"("sourceId");

-- CreateIndex
CREATE INDEX "SourceChangeLog_requiresHumanReview_idx" ON "SourceChangeLog"("requiresHumanReview");

-- CreateIndex
CREATE INDEX "VerificationRecord_sourceId_idx" ON "VerificationRecord"("sourceId");

-- CreateIndex
CREATE INDEX "VerificationRecord_verifiedByUserId_idx" ON "VerificationRecord"("verifiedByUserId");

-- CreateIndex
CREATE INDEX "UserGoal_userId_idx" ON "UserGoal"("userId");

-- CreateIndex
CREATE INDEX "Roadmap_userId_idx" ON "Roadmap"("userId");

-- CreateIndex
CREATE INDEX "RoadmapPhase_roadmapId_idx" ON "RoadmapPhase"("roadmapId");

-- CreateIndex
CREATE INDEX "RoadmapPhase_phaseKey_idx" ON "RoadmapPhase"("phaseKey");

-- CreateIndex
CREATE INDEX "RoadmapTask_phaseId_idx" ON "RoadmapTask"("phaseId");

-- CreateIndex
CREATE INDEX "RoadmapTask_taskCode_idx" ON "RoadmapTask"("taskCode");

-- CreateIndex
CREATE INDEX "RoadmapTask_status_idx" ON "RoadmapTask"("status");

-- CreateIndex
CREATE INDEX "RoadmapVersionHistory_roadmapId_idx" ON "RoadmapVersionHistory"("roadmapId");

-- CreateIndex
CREATE INDEX "UserDocument_userId_idx" ON "UserDocument"("userId");

-- CreateIndex
CREATE INDEX "UserDocument_category_idx" ON "UserDocument"("category");

-- CreateIndex
CREATE INDEX "UserDocument_deletedAt_idx" ON "UserDocument"("deletedAt");

-- CreateIndex
CREATE INDEX "SOPDocument_userId_idx" ON "SOPDocument"("userId");

-- CreateIndex
CREATE INDEX "SOPDocumentRevision_sopDocumentId_idx" ON "SOPDocumentRevision"("sopDocumentId");

-- CreateIndex
CREATE INDEX "AIConversation_userId_idx" ON "AIConversation"("userId");

-- CreateIndex
CREATE INDEX "AIMessage_conversationId_idx" ON "AIMessage"("conversationId");

-- CreateIndex
CREATE INDEX "AITokenUsageLog_userId_idx" ON "AITokenUsageLog"("userId");

-- CreateIndex
CREATE INDEX "AITokenUsageLog_featureName_idx" ON "AITokenUsageLog"("featureName");

-- CreateIndex
CREATE INDEX "AITokenUsageLog_createdAt_idx" ON "AITokenUsageLog"("createdAt");

-- CreateIndex
CREATE INDEX "SavedFavorite_userId_idx" ON "SavedFavorite"("userId");

-- CreateIndex
CREATE INDEX "SavedFavorite_userId_itemType_idx" ON "SavedFavorite"("userId", "itemType");

-- CreateIndex
CREATE INDEX "SavedFavorite_category_idx" ON "SavedFavorite"("category");

-- CreateIndex
CREATE INDEX "Deadline_deadlineDate_idx" ON "Deadline"("deadlineDate");

-- CreateIndex
CREATE INDEX "Deadline_category_idx" ON "Deadline"("category");

-- CreateIndex
CREATE INDEX "Deadline_userId_idx" ON "Deadline"("userId");

-- CreateIndex
CREATE INDEX "Reminder_userId_idx" ON "Reminder"("userId");

-- CreateIndex
CREATE INDEX "Reminder_reminderDate_idx" ON "Reminder"("reminderDate");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE UNIQUE INDEX "AdminRole_userId_key" ON "AdminRole"("userId");

-- CreateIndex
CREATE INDEX "AdminRole_userId_idx" ON "AdminRole"("userId");

-- CreateIndex
CREATE INDEX "AdminRole_role_idx" ON "AdminRole"("role");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_resourceType_resourceId_idx" ON "AuditLog"("resourceType", "resourceId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "DataReview_entityType_entityId_idx" ON "DataReview"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "DataReview_status_idx" ON "DataReview"("status");

-- CreateIndex
CREATE INDEX "PolicyChangeApproval_versionId_idx" ON "PolicyChangeApproval"("versionId");

-- CreateIndex
CREATE INDEX "PolicyChangeApproval_approvalStatus_idx" ON "PolicyChangeApproval"("approvalStatus");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationDispatchLog_idempotencyKey_key" ON "NotificationDispatchLog"("idempotencyKey");

-- CreateIndex
CREATE INDEX "NotificationDispatchLog_userId_idx" ON "NotificationDispatchLog"("userId");

-- CreateIndex
CREATE INDEX "NotificationDispatchLog_idempotencyKey_idx" ON "NotificationDispatchLog"("idempotencyKey");

-- CreateIndex
CREATE INDEX "FailedJobLog_queueName_idx" ON "FailedJobLog"("queueName");

-- CreateIndex
CREATE INDEX "FailedJobLog_isResolved_idx" ON "FailedJobLog"("isResolved");

-- AddForeignKey
ALTER TABLE "UserRoleAssignment" ADD CONSTRAINT "UserRoleAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserConsent" ADD CONSTRAINT "UserConsent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSessionMetadata" ADD CONSTRAINT "UserSessionMetadata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicRecord" ADD CONSTRAINT "AcademicRecord_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LanguageTestRecord" ADD CONSTRAINT "LanguageTestRecord_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmploymentRecord" ADD CONSTRAINT "EmploymentRecord_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialProfile" ADD CONSTRAINT "FinancialProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sponsor" ADD CONSTRAINT "Sponsor_financialProfileId_fkey" FOREIGN KEY ("financialProfileId") REFERENCES "FinancialProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetPlan" ADD CONSTRAINT "BudgetPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetPlan" ADD CONSTRAINT "BudgetPlan_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetPlanRevision" ADD CONSTRAINT "BudgetPlanRevision_planId_fkey" FOREIGN KEY ("planId") REFERENCES "BudgetPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImmigrationHistory" ADD CONSTRAINT "ImmigrationHistory_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyPreference" ADD CONSTRAINT "StudyPreference_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryPolicyVersion" ADD CONSTRAINT "CountryPolicyVersion_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "Country"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisaType" ADD CONSTRAINT "VisaType_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "Country"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "University" ADD CONSTRAINT "University_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "Country"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmissionRequirement" ADD CONSTRAINT "AdmissionRequirement_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmissionRequirementVersion" ADD CONSTRAINT "AdmissionRequirementVersion_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "AdmissionRequirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramIntake" ADD CONSTRAINT "ProgramIntake_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scholarship" ADD CONSTRAINT "Scholarship_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "Country"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scholarship" ADD CONSTRAINT "Scholarship_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarshipEligibilityRule" ADD CONSTRAINT "ScholarshipEligibilityRule_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "Scholarship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundingDecisionLog" ADD CONSTRAINT "FundingDecisionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundingDecisionLog" ADD CONSTRAINT "FundingDecisionLog_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "Scholarship"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisaRequirement" ADD CONSTRAINT "VisaRequirement_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "Country"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisaRequirement" ADD CONSTRAINT "VisaRequirement_visaTypeId_fkey" FOREIGN KEY ("visaTypeId") REFERENCES "VisaType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisaRequirementVersion" ADD CONSTRAINT "VisaRequirementVersion_visaRequirementId_fkey" FOREIGN KEY ("visaRequirementId") REFERENCES "VisaRequirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisaFinancialRule" ADD CONSTRAINT "VisaFinancialRule_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "VisaRequirementVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisaDocumentRequirement" ADD CONSTRAINT "VisaDocumentRequirement_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "VisaRequirementVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisaGeneralRequirement" ADD CONSTRAINT "VisaGeneralRequirement_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "VisaRequirementVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisaWorkflowStep" ADD CONSTRAINT "VisaWorkflowStep_visaTypeId_fkey" FOREIGN KEY ("visaTypeId") REFERENCES "VisaType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisaWorkflowStep" ADD CONSTRAINT "VisaWorkflowStep_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "Country"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryVisaGuide" ADD CONSTRAINT "CountryVisaGuide_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "Country"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisaAssessmentLog" ADD CONSTRAINT "VisaAssessmentLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InformationSource" ADD CONSTRAINT "InformationSource_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "Country"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InformationSource" ADD CONSTRAINT "InformationSource_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InformationSource" ADD CONSTRAINT "InformationSource_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InformationSource" ADD CONSTRAINT "InformationSource_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "Scholarship"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InformationSource" ADD CONSTRAINT "InformationSource_visaRequirementId_fkey" FOREIGN KEY ("visaRequirementId") REFERENCES "VisaRequirement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceRecord" ADD CONSTRAINT "SourceRecord_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "InformationSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceChangeLog" ADD CONSTRAINT "SourceChangeLog_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "InformationSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRecord" ADD CONSTRAINT "VerificationRecord_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "InformationSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRecord" ADD CONSTRAINT "VerificationRecord_verifiedByUserId_fkey" FOREIGN KEY ("verifiedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGoal" ADD CONSTRAINT "UserGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_targetUniversityId_fkey" FOREIGN KEY ("targetUniversityId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_targetProgramId_fkey" FOREIGN KEY ("targetProgramId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "Scholarship"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapPhase" ADD CONSTRAINT "RoadmapPhase_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapTask" ADD CONSTRAINT "RoadmapTask_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "RoadmapPhase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapVersionHistory" ADD CONSTRAINT "RoadmapVersionHistory_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDocument" ADD CONSTRAINT "UserDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SOPDocument" ADD CONSTRAINT "SOPDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SOPDocumentRevision" ADD CONSTRAINT "SOPDocumentRevision_sopDocumentId_fkey" FOREIGN KEY ("sopDocumentId") REFERENCES "SOPDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIConversation" ADD CONSTRAINT "AIConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIMessage" ADD CONSTRAINT "AIMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "AIConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AITokenUsageLog" ADD CONSTRAINT "AITokenUsageLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedFavorite" ADD CONSTRAINT "SavedFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedFavorite" ADD CONSTRAINT "SavedFavorite_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedFavorite" ADD CONSTRAINT "SavedFavorite_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deadline" ADD CONSTRAINT "Deadline_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_deadlineId_fkey" FOREIGN KEY ("deadlineId") REFERENCES "Deadline"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminRole" ADD CONSTRAINT "AdminRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataReview" ADD CONSTRAINT "DataReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PolicyChangeApproval" ADD CONSTRAINT "PolicyChangeApproval_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "VisaRequirementVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PolicyChangeApproval" ADD CONSTRAINT "PolicyChangeApproval_proposedByUserId_fkey" FOREIGN KEY ("proposedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PolicyChangeApproval" ADD CONSTRAINT "PolicyChangeApproval_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationDispatchLog" ADD CONSTRAINT "NotificationDispatchLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

