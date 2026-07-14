import Link from "next/link";
import { T } from "./I18nProvider";

export interface Crumb {
  /** Spanish label. Required. */
  es: string;
  /** English label. Optional — falls back to `es` when missing. */
  en?: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs uppercase tracking-[0.18em]">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const label = <T es={item.es} en={item.en ?? item.es} />;
          return (
            <li key={`${item.es}-${idx}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-muted hover:text-foreground-strong transition-colors duration-150"
                >
                  {label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="text-foreground"
                >
                  {label}
                </span>
              )}
              {!isLast && (
                <span aria-hidden="true" className="text-muted">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
