import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-taking-white">
      <header className="bg-taking-charcoal">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
          <Logo />
          <Link
            href="/"
            className="text-[13px] text-[#cccccc] transition-colors hover:text-taking-white"
          >
            Voltar ao portal
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
    </div>
  );
}
