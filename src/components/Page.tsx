import type { ReactNode } from "react";

export function Page({ children }: { children: ReactNode }) {
  return <div className="page">{children}</div>;
}

export function PageHeader({
  title,
  lede,
  meta,
}: {
  title: ReactNode;
  lede?: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <header className="page-head">
      <h1>{title}</h1>
      {lede ? <p className="page-lede">{lede}</p> : null}
      {meta ? <p className="page-meta">{meta}</p> : null}
    </header>
  );
}

export function Section({
  title,
  id,
  children,
}: {
  title?: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section className="doc-section" id={id}>
      {title ? <h2>{title}</h2> : null}
      {children}
    </section>
  );
}
