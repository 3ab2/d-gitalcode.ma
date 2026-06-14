-- Lead management: new fields, statuses, and notification type

ALTER TYPE "SubmissionStatus" ADD VALUE IF NOT EXISTS 'IN_PROGRESS';

ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'NEW_LEAD';

ALTER TABLE "ContactSubmission" ADD COLUMN IF NOT EXISTS "budgetRange" TEXT;
ALTER TABLE "ContactSubmission" ADD COLUMN IF NOT EXISTS "sourcePage" TEXT;
ALTER TABLE "ContactSubmission" ADD COLUMN IF NOT EXISTS "serviceInterest" TEXT;

CREATE INDEX IF NOT EXISTS "ContactSubmission_email_createdAt_idx" ON "ContactSubmission"("email", "createdAt");
CREATE INDEX IF NOT EXISTS "ContactSubmission_status_createdAt_idx" ON "ContactSubmission"("status", "createdAt");
