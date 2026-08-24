"use client";

import { useState } from "react";

type Status = "idle" | "downloading" | "done" | "error";

export function DownloadPdfButton({
  articleId,
  attachmentName,
}: {
  articleId: string;
  attachmentName: string | null;
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleClick() {
    if (status === "downloading") return;
    setStatus("downloading");

    try {
      const response = await fetch(`/api/anexos/${articleId}`);
      if (!response.ok) throw new Error("download failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = attachmentName ?? `${articleId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setStatus("done");
      window.setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "downloading"}
        className="group inline-flex items-center gap-3 rounded-md border border-taking-gray-border px-4 py-2.5 text-sm font-bold text-taking-black transition-all hover:-translate-y-0.5 hover:border-taking-orange hover:shadow-md disabled:pointer-events-none disabled:opacity-70"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-taking-orange transition-transform group-hover:scale-105">
          {status === "downloading" ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-taking-black/30 border-t-taking-black" />
          ) : status === "done" ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="text-taking-black"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="text-taking-black"
            >
              <path d="M12 3v12" />
              <path d="M7 10l5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
          )}
        </span>
        {status === "downloading"
          ? "Baixando..."
          : status === "done"
            ? "Baixado!"
            : `Baixar PDF${attachmentName ? `: ${attachmentName}` : ""}`}
      </button>

      {status === "error" && (
        <p className="animate-fade-in-up text-xs font-medium text-red-600">
          Não foi possível baixar o arquivo. Tente novamente.
        </p>
      )}
    </div>
  );
}
