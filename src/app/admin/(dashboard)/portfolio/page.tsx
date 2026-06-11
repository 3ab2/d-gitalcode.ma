"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { LocaleTabs } from "@/components/admin/LocaleTabs";

interface Project {
  id: string;
  slug: string;
  image: string | null;
  url: string | null;
  githubUrl: string | null;
  technologies: string[];
  featured: boolean;
  published: boolean;
  order: number;
  translations: { locale: string; title: string; description: string; client?: string }[];
}

const emptyForm = () => ({
  slug: "", image: "", url: "", githubUrl: "", technologies: "", order: "0",
  featured: false, published: true, activeLocale: "fr",
  translations: {
    fr: { title: "", description: "", client: "" },
    en: { title: "", description: "", client: "" },
    ar: { title: "", description: "", client: "" },
  },
});

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    const res = await fetch("/api/admin/portfolio");
    setProjects(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const res = await fetch("/api/admin/portfolio");
      if (cancelled) return;
      setProjects(await res.json());
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setShowForm(true); };

  const openEdit = (project: Project) => {
    setEditing(project);
    const translations = { fr: { title: "", description: "", client: "" }, en: { title: "", description: "", client: "" }, ar: { title: "", description: "", client: "" } };
    project.translations.forEach((t) => {
      translations[t.locale as keyof typeof translations] = { title: t.title, description: t.description, client: t.client || "" };
    });
    setForm({
      slug: project.slug, image: project.image || "", url: project.url || "", githubUrl: project.githubUrl || "",
      technologies: project.technologies.join(", "), order: project.order.toString(),
      featured: project.featured, published: project.published, activeLocale: "fr", translations,
    });
    setShowForm(true);
  };

  const buildPayload = () => ({
    slug: form.slug, image: form.image || undefined, url: form.url || undefined,
    githubUrl: form.githubUrl || undefined,
    technologies: form.technologies.split(",").map((t) => t.trim()).filter(Boolean),
    order: parseInt(form.order) || 0, featured: form.featured, published: form.published,
    translations: (["fr", "en", "ar"] as const).map((locale) => ({
      locale, title: form.translations[locale].title || form.translations.fr.title,
      description: form.translations[locale].description || form.translations.fr.description,
      client: form.translations[locale].client || undefined,
    })),
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = buildPayload();
    const url = editing ? `/api/admin/portfolio/${editing.id}` : "/api/admin/portfolio";
    await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    setShowForm(false);
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
    fetchProjects();
  };

  const loc = form.activeLocale as "fr" | "en" | "ar";

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green border-t-transparent" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold text-white">Portfolio</h1><p className="text-sm text-white/50 mt-1">Manage projects and demos</p></div>
        <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4" /> Add Project</Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <form onSubmit={handleSave} className="relative w-full max-w-2xl my-8 rounded-2xl border border-white/10 bg-brand-card p-6 space-y-4">
            <button type="button" onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-white/50 hover:text-white"><X className="h-5 w-5" /></button>
            <h2 className="text-lg font-semibold text-white">{editing ? "Edit Project" : "New Project"}</h2>
            <div className="grid grid-cols-2 gap-4">
              <input className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
              <input className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm" placeholder="Display Order" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
              <input className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm" placeholder="Demo URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
              <input className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm" placeholder="GitHub URL" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
              <input className="col-span-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm" placeholder="Technologies (comma separated)" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} />
            </div>
            <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} folder="portfolio" />
            <LocaleTabs active={form.activeLocale} onChange={(l) => setForm({ ...form, activeLocale: l })} />
            <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm" placeholder="Title" value={form.translations[loc].title} onChange={(e) => setForm({ ...form, translations: { ...form.translations, [loc]: { ...form.translations[loc], title: e.target.value } } })} required />
            <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm" placeholder="Client" value={form.translations[loc].client} onChange={(e) => setForm({ ...form, translations: { ...form.translations, [loc]: { ...form.translations[loc], client: e.target.value } } })} />
            <textarea className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm" placeholder="Description" rows={3} value={form.translations[loc].description} onChange={(e) => setForm({ ...form, translations: { ...form.translations, [loc]: { ...form.translations[loc], description: e.target.value } } })} required />
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-white/70"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
              <label className="flex items-center gap-2 text-sm text-white/70"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label>
            </div>
            <Button type="submit" isLoading={saving}>{editing ? "Update" : "Create"} Project</Button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium text-white">{project.translations.find((t) => t.locale === "fr")?.title || project.slug}</h3>
                {project.featured && <Badge variant="green">Featured</Badge>}
                {!project.published && <Badge>Unpublished</Badge>}
              </div>
              <p className="text-sm text-white/40 mt-1">{project.technologies.join(", ")}</p>
              <div className="flex gap-3 mt-1">
                {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-green hover:underline flex items-center gap-1"><ExternalLink className="h-3 w-3" /> Demo</a>}
                {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-white/50 hover:underline flex items-center gap-1"><ExternalLink className="h-3 w-3" /> GitHub</a>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(project)} className="p-2 text-white/40 hover:text-brand-green"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(project.id)} className="p-2 text-white/40 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
