import { Logo } from "@/components/brand/Logo";
import { RingsPattern } from "@/components/brand/RingsPattern";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-taking-charcoal">
      <div className="h-[3px] bg-gradient-to-r from-taking-orange via-taking-orange/40 to-transparent" />
      <div className="absolute inset-0 opacity-[0.06]" aria-hidden="true">
        <RingsPattern variant="dark" />
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Logo className="mb-3" />
          <p className="text-sm font-bold text-taking-white">Take over your knowledge.</p>
        </div>
        <p className="text-sm text-[#999999]">
          © {new Date().getFullYear()} Grupo Taking. Portal de conhecimento interno.
        </p>
      </div>
    </footer>
  );
}
