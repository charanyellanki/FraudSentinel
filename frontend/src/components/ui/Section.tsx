import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function Section({ id, eyebrow, title, description, children }: SectionProps) {
  return (
    <section id={id} className="border-t border-zinc-200/70 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 max-w-2xl">
          {eyebrow && (
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent-600">
              {eyebrow}
            </div>
          )}
          <h2 className="text-2xl font-semibold tracking-tight2 text-zinc-900 sm:text-3xl">{title}</h2>
          {description && <p className="mt-3 text-pretty text-sm text-zinc-600">{description}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
