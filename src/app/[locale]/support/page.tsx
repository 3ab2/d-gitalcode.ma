import { SupportChat } from "@/components/messages/SupportChat";

export const metadata = {
  title: "Support",
};

export default function SupportPage() {
  return (
    <section className="py-6 pb-8 md:py-8">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <SupportChat />
      </div>
    </section>
  );
}
