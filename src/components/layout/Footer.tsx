export function Footer() {
  return (
    <footer className="border-t border-taking-gray-border bg-taking-gray">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-taking-text-faint">
        © {new Date().getFullYear()} Grupo Taking. Portal de conhecimento interno.
      </div>
    </footer>
  );
}
