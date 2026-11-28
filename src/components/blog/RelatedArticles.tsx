import { BlogCard, type BlogCardPost } from "@/components/blog/BlogCard";

export function RelatedArticles({
  posts,
  basePath,
  locale,
  title,
  readMoreLabel,
  minReadLabel,
}: {
  posts: BlogCardPost[];
  basePath: string;
  locale: string;
  title: string;
  readMoreLabel: string;
  minReadLabel: string;
}) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-line pt-12">
      <h2 className="text-subheading text-ink">{title}</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <BlogCard
            key={post.id}
            post={post}
            basePath={basePath}
            locale={locale}
            readMoreLabel={readMoreLabel}
            minReadLabel={minReadLabel}
          />
        ))}
      </div>
    </section>
  );
}
