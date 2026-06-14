"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { LocaleTabs } from "@/components/admin/LocaleTabs";
import { formatDate } from "@/lib/utils";
import { sanitizeBlogHtml } from "@/lib/sanitize-html";

interface BlogPost {
  id: string;
  slug: string;
  published: boolean;
  featured: boolean;
  views: number;
  image: string | null;
  publishedAt: string | null;
  translations: { locale: string; title: string; excerpt?: string; content: string; metaTitle?: string; metaDescription?: string }[];
  categories: { category: { id: string; slug: string; translations: { locale: string; name: string }[] } }[];
  tags: { tag: { id: string; name: string } }[];
}

interface Category { id: string; slug: string; translations: { locale: string; name: string }[] }

const emptyForm = () => ({
  slug: "", image: "", published: false, featured: false, activeLocale: "fr",
  categoryIds: [] as string[], tagNames: "",
  translations: {
    fr: { title: "", excerpt: "", content: "", metaTitle: "", metaDescription: "" },
    en: { title: "", excerpt: "", content: "", metaTitle: "", metaDescription: "" },
    ar: { title: "", excerpt: "", content: "", metaTitle: "", metaDescription: "" },
  },
});

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const [postsRes, catsRes] = await Promise.all([
      fetch("/api/admin/blog"),
      fetch("/api/admin/categories"),
    ]);
    setPosts(await postsRes.json());
    const catsData = await catsRes.json();
    setCategories(catsData.categories || []);
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [postsRes, catsRes] = await Promise.all([
        fetch("/api/admin/blog"),
        fetch("/api/admin/categories"),
      ]);
      if (cancelled) return;
      setPosts(await postsRes.json());
      const catsData = await catsRes.json();
      setCategories(catsData.categories || []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setPreview(false); setShowForm(true); };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    const translations = { fr: { title: "", excerpt: "", content: "", metaTitle: "", metaDescription: "" }, en: { title: "", excerpt: "", content: "", metaTitle: "", metaDescription: "" }, ar: { title: "", excerpt: "", content: "", metaTitle: "", metaDescription: "" } };
    post.translations.forEach((t) => {
      translations[t.locale as keyof typeof translations] = { title: t.title, excerpt: t.excerpt || "", content: t.content, metaTitle: t.metaTitle || "", metaDescription: t.metaDescription || "" };
    });
    setForm({
      slug: post.slug, image: post.image || "", published: post.published, featured: post.featured, activeLocale: "fr",
      categoryIds: post.categories.map((c) => c.category.id),
      tagNames: post.tags.map((t) => t.tag.name).join(", "),
      translations,
    });
    setPreview(false);
    setShowForm(true);
  };

  const buildPayload = () => ({
    slug: form.slug, image: form.image || undefined, published: form.published, featured: form.featured,
    publishedAt: form.published ? new Date().toISOString() : undefined,
    categoryIds: form.categoryIds, tagNames: form.tagNames.split(",").map((t) => t.trim()).filter(Boolean),
    translations: (["fr", "en", "ar"] as const).map((locale) => ({
      locale, title: form.translations[locale].title || form.translations.fr.title,
      excerpt: form.translations[locale].excerpt, content: form.translations[locale].content || form.translations.fr.content,
      metaTitle: form.translations[locale].metaTitle, metaDescription: form.translations[locale].metaDescription,
    })),
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = buildPayload();
    const url = editing ? `/api/admin/blog/${editing.id}` : "/api/admin/blog";
    await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    setShowForm(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    fetchData();
  };

  const togglePublish = async (post: BlogPost) => {
    await fetch(`/api/admin/blog/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: post.slug, published: !post.published, publishedAt: !post.published ? new Date().toISOString() : post.publishedAt }),
    });
    fetchData();
  };

  const loc = form.activeLocale as "fr" | "en" | "ar";

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-green border-t-transparent" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold text-white">Blog</h1><p className="text-sm text-white/50 mt-1">Manage articles, categories and tags</p></div>
        <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4" /> New Post</Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <form onSubmit={handleSave} className="relative w-full max-w-3xl my-8 rounded-2xl border border-white/10 bg-brand-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">{editing ? "Edit Post" : "New Post"}</h2>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setPreview(!preview)}><Eye className="h-4 w-4" /> {preview ? "Edit" : "Preview"}</Button>
                <button type="button" onClick={() => setShowForm(false)} className="text-white/50 hover:text-white"><X className="h-5 w-5" /></button>
              </div>
            </div>

            {preview ? (
              <div className="prose-blog rounded-xl border border-white/10 p-6 bg-white/[0.02]">
                <h1 className="text-2xl font-bold text-white">{form.translations[loc].title}</h1>
                <p className="text-white/50 mt-2">{form.translations[loc].excerpt}</p>
                <div className="mt-6" dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(form.translations[loc].content) }} />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <input className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
                  <input className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm" placeholder="Tags (comma separated)" value={form.tagNames} onChange={(e) => setForm({ ...form, tagNames: e.target.value })} />
                </div>
                <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} folder="blog" />
                {categories.length > 0 && (
                  <div>
                    <label className="text-sm text-white/70 mb-2 block">Categories</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <label key={cat.id} className="flex items-center gap-1.5 text-sm text-white/60 cursor-pointer">
                          <input type="checkbox" checked={form.categoryIds.includes(cat.id)} onChange={(e) => setForm({ ...form, categoryIds: e.target.checked ? [...form.categoryIds, cat.id] : form.categoryIds.filter((id) => id !== cat.id) })} />
                          {cat.translations.find((t) => t.locale === "fr")?.name || cat.slug}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <LocaleTabs active={form.activeLocale} onChange={(l) => setForm({ ...form, activeLocale: l })} />
                <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm" placeholder="Title" value={form.translations[loc].title} onChange={(e) => setForm({ ...form, translations: { ...form.translations, [loc]: { ...form.translations[loc], title: e.target.value } } })} required />
                <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm" placeholder="Excerpt" value={form.translations[loc].excerpt} onChange={(e) => setForm({ ...form, translations: { ...form.translations, [loc]: { ...form.translations[loc], excerpt: e.target.value } } })} />
                <textarea className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm font-mono" placeholder="Content (HTML)" rows={10} value={form.translations[loc].content} onChange={(e) => setForm({ ...form, translations: { ...form.translations, [loc]: { ...form.translations[loc], content: e.target.value } } })} required />
                <div className="grid grid-cols-2 gap-4">
                  <input className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm" placeholder="SEO Title" value={form.translations[loc].metaTitle} onChange={(e) => setForm({ ...form, translations: { ...form.translations, [loc]: { ...form.translations[loc], metaTitle: e.target.value } } })} />
                  <input className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white text-sm" placeholder="SEO Description" value={form.translations[loc].metaDescription} onChange={(e) => setForm({ ...form, translations: { ...form.translations, [loc]: { ...form.translations[loc], metaDescription: e.target.value } } })} />
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-white/70"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Publish</label>
                  <label className="flex items-center gap-2 text-sm text-white/70"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
                </div>
              </>
            )}
            <Button type="submit" isLoading={saving}>{editing ? "Update" : "Create"} Post</Button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium text-white">{post.translations.find((t) => t.locale === "fr")?.title || post.slug}</h3>
                {post.published ? <Badge variant="green">Published</Badge> : <Badge>Draft</Badge>}
                {post.featured && <Badge variant="purple">Featured</Badge>}
              </div>
              <p className="text-sm text-white/40 mt-1">{post.views} views {post.publishedAt && `• ${formatDate(post.publishedAt)}`}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => togglePublish(post)} className="text-xs px-2 py-1 rounded-lg border border-white/10 text-white/50 hover:text-brand-green">{post.published ? "Unpublish" : "Publish"}</button>
              <button onClick={() => openEdit(post)} className="p-2 text-white/40 hover:text-brand-green"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(post.id)} className="p-2 text-white/40 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
