"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/components/providers/PublicSettingsProvider";
import {
  BUDGET_RANGES,
  contactFormClientSchema,
  type ContactFormClientInput,
} from "@/lib/contact-validation";
import { sendAnalyticsEvent } from "@/lib/analytics/client";
import { type Locale } from "@/lib/i18n/settings";

interface ServiceOption {
  id: string;
  name: string;
}

interface ContactFormProps {
  locale: Locale;
  serviceId?: string;
  serviceName?: string;
  type?: "GENERAL" | "SERVICE_REQUEST";
  sourcePage?: string;
  serviceOptions?: ServiceOption[];
  onSuccess?: () => void;
}

const selectClassName =
  "min-h-11 w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white transition-colors focus:border-brand-green/50 focus:outline-none focus:ring-2 focus:ring-brand-green/20";

export function ContactForm({
  locale,
  serviceId,
  serviceName,
  type = "GENERAL",
  sourcePage = "/contact",
  serviceOptions = [],
  onSuccess,
}: ContactFormProps) {
  const { t } = useTranslation();
  const { formatBudgetRange } = useCurrency();
  const formLoadedAt = useRef(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    formLoadedAt.current = Date.now();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormClientInput>({
    resolver: zodResolver(contactFormClientSchema),
    defaultValues: {
      serviceInterest: serviceName ?? "",
    },
  });

  const onSubmit = useCallback(
    async (data: ContactFormClientInput) => {
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
            serviceName: serviceName || data.serviceInterest || undefined,
            sourcePage,
            formLoadedAt: formLoadedAt.current,
            website: data.website ?? "",
          }),
        });

        if (!res.ok) throw new Error("Failed");

        sendAnalyticsEvent("lead_form_submit", sourcePage, {
          type,
          locale,
          serviceName: serviceName ?? data.serviceInterest,
        });

        setStatus("success");
        formLoadedAt.current = Date.now();
        reset({
          name: "",
          email: "",
          phone: "",
          message: "",
          budgetRange: "",
          serviceInterest: serviceName ?? "",
        });
        onSuccess?.();
      } catch {
        setStatus("error");
      }
    },
    [locale, onSuccess, reset, serviceId, serviceName, sourcePage, type]
  );

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit(onSubmit)(event);
      }}
      className="relative space-y-5"
      autoComplete="off"
      data-lpignore="true"
    >
      <p className="text-sm text-white/60">{t("contact.microcopy.formIntro")}</p>

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

      {serviceOptions.length > 0 && !serviceName && (
        <div className="space-y-2">
          <label htmlFor="serviceInterest" className="block text-sm font-medium text-white/80">
            {t("contact.serviceInterest")}
          </label>
          <select
            id="serviceInterest"
            className={cn(selectClassName, errors.serviceInterest && "border-red-500/50")}
            {...register("serviceInterest")}
          >
            <option value="">{t("contact.serviceInterestPlaceholder")}</option>
            {serviceOptions.map((option) => (
              <option key={option.id} value={option.name} className="bg-brand-dark">
                {option.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="budgetRange" className="block text-sm font-medium text-white/80">
          {t("contact.budgetRange")}
        </label>
        <select id="budgetRange" className={selectClassName} {...register("budgetRange")}>
          <option value="">{t("contact.budgetPlaceholder")}</option>
          {BUDGET_RANGES.map((range) => (
            <option key={range} value={range} className="bg-brand-dark">
              {formatBudgetRange(range, locale)}
            </option>
          ))}
        </select>
      </div>

      <Textarea
        id="message"
        label={t("contact.message")}
        rows={5}
        error={errors.message ? t("validation.minLength", { count: 10 }) : undefined}
        {...register("message")}
      />

      <p className="text-xs text-white/40">{t("contact.microcopy.privacyNote")}</p>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website-honeypot">Leave blank</label>
        <input
          id="website-honeypot"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

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
