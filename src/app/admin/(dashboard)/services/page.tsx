"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { LocaleTabs } from "@/components/admin/LocaleTabs";

interface Translation {
  locale: string;
  title: string;
  description: string;
  shortDesc?: string;
  features?: string[];
}

interface Service {
  id: string;
  slug: string;
  type: string;
  price: number | null;
  priceLabel: string | null;
  featured: boolean;
  published: boolean;
  image: string | null;
  demoUrl: string | null;
  order: number;
  translations: Translation[];
}

const emptyForm = () => ({
  slug: "",
  type: "WORDPRESS_PLUGINS",
  price: "",
  priceLabel: "",
  image: "",
  demoUrl: "",
  order: "0",
  featured: false,
  published: true,
  activeLocale: "fr",
  translations: {
    fr: { title: "", description: "", shortDesc: "", features: "" },
    en: { title: "", description: "", shortDesc: "", features: "" },
    ar: { title: "", description: "", shortDesc: "", features: "" },
  },
});

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    const res = await fetch("/api/admin/services");
    setServices(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const res = await fetch("/api/admin/services");
      if (cancelled) return;
      setServices(await res.json());
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const openEdit = (service: Service) => {
    setEditing(service);
    const translations = { fr: { title: "", description: "", shortDesc: "", features: "" }, en: { title: "", description: "", shortDesc: "", features: "" }, ar: { title: "", description: "", shortDesc: "", features: "" } };
    service.translations.forEach((t) => {
      translations[t.locale as keyof typeof translations] = {
        title: t.title,
        description: t.description,
        shortDesc: t.shortDesc || "",
        features: (t.features || []).join(", "),
      };
    });
    setForm({
      slug: service.slug,
      type: service.type,
      price: service.price?.toString() || "",
      priceLabel: service.priceLabel || "",
      image: service.image || "",
      demoUrl: service.demoUrl || "",
      order: service.order.toString(),
      featured: service.featured,
      published: service.published,
      activeLocale: "fr",
      translations,
    });
    setShowForm(true);
  };

  const buildPayload = () => ({
    slug: form.slug,
    type: form.type,
    price: form.price ? parseFloat(form.price) : undefined,
    priceLabel: form.priceLabel || undefined,
    image: form.image || undefined,
    demoUrl: form.demoUrl || undefined,
    order: parseInt(form.order) || 0,
    featured: form.featured,
    published: form.published,
    translations: (["fr", "en", "ar"] as const).map((locale) => ({
      locale,
      title: form.translations[locale].title || form.translations.fr.title,
      description: form.translations[locale].description || form.translations.fr.description,
      shortDesc: form.translations[locale].shortDesc,
      features: form.translations[locale].features.split(",").map((f) => f.trim()).filter(Boolean),
    })),
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = buildPayload();
    const url = editing ? `/api/admin/services/${editing.id}` : "/api/admin/services";
    const method = editing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    setShowForm(false);
    fetchServices();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    fetchServices();
  };

  const loc = form.activeLocale as "fr" | "en" | "ar";

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green border-t-transparent" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-sm text-white/50 mt-1">Manage all services and pricing</p>
        </div>
        <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4" /> Add Service</Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <form onSubmit={handleSave} className="relative w-full max-w-2xl my-8 rounded-2xl border border-white/10 bg-brand-card p-6 space-y-4">
            <button type="button" onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-white/50 hover:text-white"><X className="h-5 w-5" /></button>
            <h2 className="text-lg font-semibold text-white">{editing ? "Edit Service" : "New Service"}</h2>

            <div className="grid grid-cols-2 gap-4">
              <input className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
              <select className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="WEB_DEVELOPMENT">Web Development</option>
                <option value="MOBILE_APPS">Mobile Apps</option>
                <option value="WORDPRESS_PLUGINS">WordPress Plugins</option>
                <option value="WORDPRESS_TEMPLATES">WordPress Templates</option>
              </select>
              <input className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm" placeholder="Price (MAD)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <input className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm" placeholder="Price Label" value={form.priceLabel} onChange={(e) => setForm({ ...form, priceLabel: e.target.value })} />
              <input className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm" placeholder="Demo URL" value={form.demoUrl} onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} />
              <input className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm" placeholder="Display Order" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
            </div>

            <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} folder="services" />

            <LocaleTabs active={form.activeLocale} onChange={(l) => setForm({ ...form, activeLocale: l })} />
            <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm" placeholder="Title" value={form.translations[loc].title} onChange={(e) => setForm({ ...form, translations: { ...form.translations, [loc]: { ...form.translations[loc], title: e.target.value } } })} required />
            <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm" placeholder="Short description" value={form.translations[loc].shortDesc} onChange={(e) => setForm({ ...form, translations: { ...form.translations, [loc]: { ...form.translations[loc], shortDesc: e.target.value } } })} />
            <textarea className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm" placeholder="Description" rows={3} value={form.translations[loc].description} onChange={(e) => setForm({ ...form, translations: { ...form.translations, [loc]: { ...form.translations[loc], description: e.target.value } } })} required />
            <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm" placeholder="Features (comma separated)" value={form.translations[loc].features} onChange={(e) => setForm({ ...form, translations: { ...form.translations, [loc]: { ...form.translations[loc], features: e.target.value } } })} />

            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-white/70"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
              <label className="flex items-center gap-2 text-sm text-white/70"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label>
            </div>

            <Button type="submit" isLoading={saving}>{editing ? "Update" : "Create"} Service</Button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium text-white">{service.translations.find((t) => t.locale === "fr")?.title || service.slug}</h3>
                {service.featured && <Badge variant="green">Featured</Badge>}
                {!service.published && <Badge>Unpublished</Badge>}
                <Badge variant="default">#{service.order}</Badge>
              </div>
              <p className="text-sm text-white/40 mt-1">{service.type} • {service.priceLabel || (service.price ? `${service.price} MAD` : "No price")}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(service)} className="p-2 text-white/40 hover:text-brand-green"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(service.id)} className="p-2 text-white/40 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
