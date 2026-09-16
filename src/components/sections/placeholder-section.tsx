export function PlaceholderSection({
  id,
  title,
  note,
  minHeight = "min-h-[220px]",
}: {
  id: string;
  title: string;
  note: string;
  minHeight?: string;
}) {
  return (
    <section aria-labelledby={`${id}-title`} className="bg-background w-full">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-8 lg:py-12">
        <div
          className={`border-border bg-card flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-10 text-center ${minHeight}`}
        >
          <h2
            id={`${id}-title`}
            className="text-foreground text-xl font-bold tracking-tight md:text-2xl"
          >
            {title}
          </h2>
          <p className="text-muted-foreground max-w-md text-sm leading-relaxed">{note}</p>
          <span className="text-muted-foreground/70 mt-1 text-xs font-semibold tracking-wider uppercase">
            Дизайн хүлээгдэж байна
          </span>
        </div>
      </div>
    </section>
  );
}
