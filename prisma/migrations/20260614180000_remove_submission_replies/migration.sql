-- Remove tracked admin reply storage (leads now use WhatsApp / mailto only)

DROP TABLE IF EXISTS "SubmissionReply";

DROP TYPE IF EXISTS "ReplyStatus";
