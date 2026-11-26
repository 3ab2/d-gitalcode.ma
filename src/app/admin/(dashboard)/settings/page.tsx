"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { DEFAULT_SOCIAL_LINKS, type SocialPlatform } from "@/config/social-links";
import { GitHubIcon } from "@/components/social/GitHubIcon";
import { InstagramIcon } from "@/components/social/InstagramIcon";
import { KofiIcon } from "@/components/social/KofiIcon";
import { LinkedInIcon } from "@/components/social/LinkedInIcon";
import { YouTubeIcon } from "@/components/social/YouTubeIcon";
import { CURRENCY_OPTIONS, type CurrencyCode } from "@/lib/currency";
import { broadcastCurrencyUpdate } from "@/lib/currency/broadcast";
import type { SiteSettings } from "@/lib/site-settings";

interface SocialLinkForm {
  platform: SocialPlatform;
  url: string;
  label: string;
  enabled: boolean;
}

const platformMeta: Record<
  SocialPlatform,
  { name: string; color: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  instagram: { name: "Instagram", color: "text-pink-400", Icon: InstagramIcon },
  linkedin: { name: "LinkedIn", color: "text-[#0A66C2]", Icon: LinkedInIcon },
  github: { name: "GitHub", color: "text-white", Icon: GitHubIcon },
  youtube: { name: "YouTube", color: "text-[#FF0033]", Icon: YouTubeIcon },
  kofi: { name: "Ko-fi", color: "text-[#FF5E5B]", Icon: KofiIcon },
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLinkForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currencySaving, setCurrencySaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/settings").then((r) => r.json()),
      fetch("/api/admin/social-links").then((r) => r.json()),
    ]).then(([settingsData, socialData]) => {
      setSettings(settingsData);
      if (Array.isArray(socialData)) {
        setSocialLinks(
          socialData.map((l: SocialLinkForm) => ({
            platform: l.platform,
            url: l.url,
            label: l.label,
            enabled: l.enabled ?? true,
          }))
        );
      } else {
        setSocialLinks(
          DEFAULT_SOCIAL_LINKS.map((l) => ({
            platform: l.platform,
            url: l.url,
            label: l.label,
            enabled: l.enabled ?? true,
          }))
        );
      }
      setLoading(false);
    });
  }, []);

  const updateSocial = (
    platform: SocialPlatform,
    field: keyof SocialLinkForm,
    value: string | boolean
  ) => {
    setSocialLinks((prev) =>
      prev.map((l) => (l.platform === platform ? { ...l, [field]: value } : l))
    );
  };

  const handleCurrencyChange = async (currency: CurrencyCode) => {
    if (!settings || settings.defaultCurrency === currency) return;

    const previous = settings.defaultCurrency;
    setSettings({ ...settings, defaultCurrency: currency });
    setCurrencySaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/settings/currency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency }),
      });

      if (!res.ok) {
        throw new Error("Currency update failed");
      }

      const data = (await res.json()) as { currency: CurrencyCode };
      setSettings((current) =>
        current ? { ...current, defaultCurrency: data.currency } : current
      );
      broadcastCurrencyUpdate(data.currency);
      setMessage({
        type: "success",
        text: `Currency updated to ${data.currency}. All prices across the site now use the new symbol.`,
      });
      router.refresh();
    } catch {
      setSettings((current) =>
        current ? { ...current, defaultCurrency: previous } : current
      );
      setMessage({
        type: "error",
        text: "Failed to update currency. Please try again.",
      });
    } finally {
      setCurrencySaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setMessage(null);

    const [settingsRes, socialRes] = await Promise.all([
      fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      }),
      fetch("/api/admin/social-links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ links: socialLinks }),
      }),
    ]);

    if (settingsRes.ok && socialRes.ok) {
      const savedSettings = await settingsRes.json();
      setSettings(savedSettings);
      broadcastCurrencyUpdate(savedSettings.defaultCurrency);
      setMessage({ type: "success", text: "Settings saved successfully." });
      router.refresh();
    } else {
      setMessage({ type: "error", text: "Failed to save settings. Please try again." });
    }

    setSaving(false);
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Site Settings</h1>
        <p className="mt-2 text-sm text-white/50">
          Contact details, currency, social links and global SEO configuration.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Contact</h2>
          <Input
            id="contactEmail"
            label="Contact email"
            type="email"
            value={settings.contactEmail}
            onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
            required
          />
          <Input
            id="whatsappNumber"
            label="WhatsApp number (digits only, country code)"
            value={settings.whatsappNumber}
            onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
            required
          />
          <Input
            id="phone"
            label="Phone"
            value={settings.phone}
            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            required
          />
          <Textarea
            id="address"
            label="Address"
            rows={2}
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            required
          />
          <Input
            id="productDemoUrl"
            label="Product demo URL (footer link)"
            type="url"
            value={settings.productDemoUrl}
            onChange={(e) => setSettings({ ...settings, productDemoUrl: e.target.value })}
          />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Currency Management</h2>
          <p className="text-sm text-white/50">
            Default currency for service prices, packages, invoices, dashboard stats, and all
            pricing displays across the website and admin panel.
          </p>
          <div className="space-y-2">
            <label htmlFor="defaultCurrency" className="block text-sm font-medium text-white/80">
              Default currency
            </label>
            <select
              id="defaultCurrency"
              value={settings.defaultCurrency}
              disabled={currencySaving}
              onChange={(e) =>
                void handleCurrencyChange(e.target.value as CurrencyCode)
              }
              className="min-h-11 w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white transition-colors focus:border-brand-green/50 focus:outline-none focus:ring-2 focus:ring-brand-green/20 disabled:opacity-60"
            >
              {CURRENCY_OPTIONS.map((option) => (
                <option key={option.code} value={option.code} className="bg-brand-dark">
                  {option.code} — {option.name} ({option.symbol})
                </option>
              ))}
            </select>
            {currencySaving && (
              <p className="text-xs text-white/45">Applying currency globally…</p>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-white">Social Media</h2>
          {socialLinks.map((link) => {
            const meta = platformMeta[link.platform];
            const Icon = meta.Icon;
            return (
              <div
                key={link.platform}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ${meta.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-white">{meta.name}</span>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-white/60">
                    <input
                      type="checkbox"
                      checked={link.enabled}
                      onChange={(e) => updateSocial(link.platform, "enabled", e.target.checked)}
                    />
                    Enabled
                  </label>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    id={`${link.platform}-url`}
                    label="URL"
                    type="url"
                    value={link.url}
                    onChange={(e) => updateSocial(link.platform, "url", e.target.value)}
                    required
                  />
                  <Input
                    id={`${link.platform}-label`}
                    label="Label"
                    value={link.label}
                    onChange={(e) => updateSocial(link.platform, "label", e.target.value)}
                    required
                  />
                </div>
              </div>
            );
          })}
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Global SEO</h2>
          <Input
            id="seoTitle"
            label="Default title"
            value={settings.seoTitle}
            onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
            required
          />
          <Textarea
            id="seoDescription"
            label="Default description"
            rows={3}
            value={settings.seoDescription}
            onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
            required
          />
          <Input
            id="seoKeywords"
            label="Keywords (comma separated)"
            value={settings.seoKeywords}
            onChange={(e) => setSettings({ ...settings, seoKeywords: e.target.value })}
            required
          />
        </section>

        {message && (
          <p className={`text-sm ${message.type === "success" ? "text-brand-green" : "text-red-400"}`}>
            {message.text}
          </p>
        )}

        <Button type="submit" isLoading={saving}>
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </form>
    </div>
  );
}
