import { type HTMLAttributes, type ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className = "", children, ...rest }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`border-b border-zinc-100 px-6 py-4 ${className}`}>{children}</div>;
}

export function CardTitle({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <h3 className={`text-sm font-semibold tracking-tight2 text-zinc-900 ${className}`}>{children}</h3>
  );
}

export function CardDescription({ className = "", children }: { className?: string; children: ReactNode }) {
  return <p className={`mt-1 text-xs text-zinc-500 ${className}`}>{children}</p>;
}

export function CardContent({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
}
