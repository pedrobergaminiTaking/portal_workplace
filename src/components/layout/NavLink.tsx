"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "border-b-2 border-transparent pb-1 text-[13px] text-[#cccccc] transition-colors hover:text-taking-white",
        isActive && "border-taking-orange font-bold text-taking-orange",
      )}
    >
      {children}
    </Link>
  );
}
