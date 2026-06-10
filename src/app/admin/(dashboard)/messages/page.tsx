import { Suspense } from "react";
import { AdminInbox } from "@/components/messages/AdminInbox";

export const metadata = {
  title: "Support",
};

function InboxFallback() {
  return (
    <div className="flex h-[calc(100dvh-7rem)] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
    </div>
  );
}

export default function AdminMessagesPage() {
  return (
    <Suspense fallback={<InboxFallback />}>
      <AdminInbox />
    </Suspense>
  );
}
