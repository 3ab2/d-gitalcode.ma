-- CreateIndex
CREATE INDEX "AnalyticsEvent_event_createdAt_idx" ON "AnalyticsEvent"("event", "createdAt");

-- CreateIndex
CREATE INDEX "ClientMessage_status_createdAt_idx" ON "ClientMessage"("status", "createdAt");

-- CreateIndex
CREATE INDEX "MessageReply_messageId_createdAt_idx" ON "MessageReply"("messageId", "createdAt");
