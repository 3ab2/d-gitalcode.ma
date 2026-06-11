"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DEFAULT_SOCIAL_LINKS, type SocialPlatform } from "@/config/social-links";
import { GitHubIcon } from "@/components/social/GitHubIcon";
import { InstagramIcon } from "@/components/social/InstagramIcon";
import { KofiIcon } from "@/components/social/KofiIcon";
import { LinkedInIcon } from "@/components/social/LinkedInIcon";

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
  kofi: { name: "Ko-fi", color: "text-[#FF5E5B]", Icon: KofiIcon },
};

export default function AdminSocialPage() {
  const [links, setLinks] = useState<SocialLinkForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchLinks = async () => {
    const res = await fetch("/api/admin/social-links");
    const data = await res.json();
    if (res.ok) {
      setLinks(
        data.map((l: SocialLinkForm) => ({
          platform: l.platform,
          url: l.url,
          label: l.label,
          enabled: l.enabled ?? true,
        }))
      );
    } else {
      setLinks(
        DEFAULT_SOCIAL_LINKS.map((l) => ({
          platform: l.platform,
          url: l.url,
          label: l.label,
          enabled: l.enabled ?? true,
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const res = await fetch("/api/admin/social-links");
      const data = await res.json();
      if (cancelled) return;
      if (res.ok) {
        setLinks(
          data.map((l: SocialLinkForm) => ({
            platform: l.platform,
            url: l.url,
            label: l.label,
            enabled: l.enabled ?? true,
          }))
        );
      } else {
        setLinks(
          DEFAULT_SOCIAL_LINKS.map((l) => ({
            platform: l.platform,
            url: l.url,
            label: l.label,
            enabled: l.enabled ?? true,
          }))
        );
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateLink = (platform: SocialPlatform, field: keyof SocialLinkForm, value: string | boolean) => {
    setLinks((prev) =>
      prev.map((l) => (l.platform === platform ? { ...l, [field]: value } : l))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await fetch("/api/admin/social-links", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ links }),
    });

    if (res.ok) {
      setMessage({ type: "success", text: "Social links updated successfully!" });
      fetchLinks();
    } else {
      setMessage({ type: "error", text: "Failed to update social links." });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Social Media</h1>
        <p className="mt-2 text-sm text-white/50">
          Manage social links displayed in the footer and contact page.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
        {links.map((link) => {
          const meta = platformMeta[link.platform];
          const Icon = meta.Icon;
          return (
            <div
              key={link.platform}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ${meta.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-white">{meta.name}</h3>
                </div>
                <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={link.enabled}
                    onChange={(e) => updateLink(link.platform, "enabled", e.target.checked)}
                    className="rounded border-white/20"
                  />
                  Enabled
                </label>
              </div>

              <div className="space-y-4">
                <Input
                  id={`${link.platform}-url`}
                  label="URL"
                  type="url"
                  value={link.url}
                  onChange={(e) => updateLink(link.platform, "url", e.target.value)}
                  required
                />
                <Input
                  id={`${link.platform}-label`}
                  label="Label"
                  value={link.label}
                  onChange={(e) => updateLink(link.platform, "label", e.target.value)}
                  required
                />
              </div>
            </div>
          );
        })}

        {message && (
          <p className={`text-sm ${message.type === "success" ? "text-brand-green" : "text-red-400"}`}>
            {message.text}
          </p>
        )}

        <Button type="submit" isLoading={saving}>
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </form>
    </div>
  );
}
