import { SupportChat } from "@/components/messages/SupportChat";

export const metadata = {
  title: "Support",
};

export default function SupportPage() {
  return (
    <section className="flex min-h-[calc(100dvh-var(--header-height))] flex-col">
      <div className="mx-auto flex w-full max-w-2xl min-h-0 flex-1 flex-col px-0 pb-[env(safe-area-inset-bottom)] sm:px-4 sm:py-4">
        <SupportChat />
      </div>
    </section>
  );
}
