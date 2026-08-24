export function FaqAccordion({
  items,
}: {
  items: { slug: string; title: string; content: string }[];
}) {
  return (
    <div className="flex flex-col divide-y divide-taking-gray-border overflow-hidden rounded-lg border border-taking-gray-border bg-taking-white">
      {items.map((item) => (
        <details key={item.slug} className="group px-5 py-4 transition-colors open:bg-taking-gray/60">
          <summary className="-mx-5 -my-4 cursor-pointer list-none px-5 py-4 font-bold text-taking-black marker:content-none">
            <span className="flex items-center justify-between gap-4">
              {item.title}
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-taking-gray text-taking-orange transition-all group-open:rotate-45 group-open:bg-taking-orange group-open:text-taking-black">
                +
              </span>
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
