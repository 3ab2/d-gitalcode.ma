-- Remove support messaging data and client accounts
DELETE FROM "Notification" WHERE "type" IN ('SUPPORT_REPLY', 'NEW_MESSAGE');
DELETE FROM "Notification" WHERE "userId" IN (SELECT "id" FROM "User" WHERE "role" IN ('CLIENT', 'USER'));

DROP TABLE IF EXISTS "SupportAttachment";
DROP TABLE IF EXISTS "MessageReply";
DROP TABLE IF EXISTS "ClientMessage";

DELETE FROM "Session" WHERE "userId" IN (SELECT "id" FROM "User" WHERE "role" IN ('CLIENT', 'USER'));
DELETE FROM "Account" WHERE "userId" IN (SELECT "id" FROM "User" WHERE "role" IN ('CLIENT', 'USER'));
DELETE FROM "User" WHERE "role" IN ('CLIENT', 'USER');

ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'ADMIN';

CREATE TYPE "UserRole_new" AS ENUM ('ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
DROP TYPE "UserRole";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";

CREATE TYPE "NotificationType_new" AS ENUM ('NEW_LEAD', 'SYSTEM', 'ACCOUNT', 'PROJECT_UPDATE');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
DROP TYPE "NotificationType";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";

DROP TYPE IF EXISTS "MessageStatus";

DROP TABLE IF EXISTS "Session";
DROP TABLE IF EXISTS "Account";
DROP TABLE IF EXISTS "VerificationToken";
