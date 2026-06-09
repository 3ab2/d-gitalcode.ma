"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type { ContactForm } from "./ContactForm";

function ContactFormSkeleton() {
  return (
    <div className="space-y-5" aria-hidden>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-[4.25rem] animate-pulse rounded-xl bg-white/5" />
      ))}
    </div>
  );
}

const ContactFormLazy = dynamic(
  () => import("./ContactForm").then((mod) => mod.ContactForm),
  { ssr: false, loading: () => <ContactFormSkeleton /> }
);

export function ClientContactForm(props: ComponentProps<typeof ContactForm>) {
  return <ContactFormLazy {...props} />;
}
