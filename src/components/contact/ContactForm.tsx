"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { type Locale } from "@/lib/i18n/settings";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
});

type FormData = z.infer<typeof schema>;

interface ContactFormProps {
  locale: Locale;
  serviceId?: string;
  serviceName?: string;
  type?: "GENERAL" | "SERVICE_REQUEST";
  onSuccess?: () => void;
}

export function ContactForm({
  locale,
  serviceId,
  serviceName,
  type = "GENERAL",
  onSuccess,
}: ContactFormProps) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          locale,
          type,
          method: "FORM",
          serviceId,
          serviceName,
        }),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      reset();
      onSuccess?.();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      autoComplete="off"
      data-lpignore="true"
    >
      <Input
        id="name"
        label={t("contact.name")}
        error={errors.name ? t("validation.required") : undefined}
        {...register("name")}
      />
      <Input
        id="email"
        type="email"
        label={t("contact.email")}
        error={errors.email ? t("validation.email") : undefined}
        {...register("email")}
      />
      <Input id="phone" label={t("contact.phone")} {...register("phone")} />
      <Textarea
        id="message"
        label={t("contact.message")}
        rows={5}
        error={errors.message ? t("validation.minLength", { count: 10 }) : undefined}
        {...register("message")}
      />

      {status === "success" && (
        <p className="text-brand-green text-sm">{t("contact.success")}</p>
      )}
      {status === "error" && (
        <p className="text-red-400 text-sm">{t("contact.error")}</p>
      )}

      <Button type="submit" isLoading={status === "loading"} className="w-full">
        {status === "loading" ? t("contact.sending") : t("contact.send")}
      </Button>
    </form>
  );
}
