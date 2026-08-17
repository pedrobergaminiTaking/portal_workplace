export function FaqAccordion({
  items,
}: {
  items: { slug: string; title: string; content: string }[];
}) {
  return (
    <div className="flex flex-col divide-y divide-taking-gray-border rounded-lg border border-taking-gray-border bg-taking-white">
      {items.map((item) => (
        <details key={item.slug} className="group px-5 py-4">
          <summary className="cursor-pointer list-none font-bold text-taking-black marker:content-none">
            <span className="flex items-center justify-between gap-4">
              {item.title}
              <span className="text-taking-orange transition-transform group-open:rotate-45">+</span>
            </span>
          </summary>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-taking-text-body">
            {item.content}
          </p>
        </details>
      ))}
    </div>
  );
}
