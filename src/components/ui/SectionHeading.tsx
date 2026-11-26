"use client";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  /** Use "h1" when this heading is the page title. */
  as?: "h1" | "h2";
}

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "text-center" : "text-start"}>
      <Heading className="text-3xl font-bold tracking-tight text-white md:text-4xl">
        {title}
      </Heading>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/60">
          {subtitle}
        </p>
      )}
    </div>
  );
}
