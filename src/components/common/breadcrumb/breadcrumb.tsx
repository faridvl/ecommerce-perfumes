import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-xs text-neutral-400 flex-wrap">
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          {index > 0 && <ChevronRight size={12} className="shrink-0" />}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-neutral-700 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-neutral-600 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
