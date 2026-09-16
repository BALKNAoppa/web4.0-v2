"use client";

import Link from "next/link";
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";

import { resolveHref, type Owner } from "@/lib/brand";

type SmartLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  owner?: Owner;
  children: ReactNode;
};

export const SmartLink = forwardRef<HTMLAnchorElement, SmartLinkProps>(function SmartLink(
  { href, owner, children, ...rest },
  ref,
) {
  const resolved = resolveHref(href, owner);

  if (resolved.external) {
    return (
      <a
        ref={ref}
        href={resolved.href}
        {...(resolved.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link ref={ref} href={resolved.href} {...rest}>
      {children}
    </Link>
  );
});
