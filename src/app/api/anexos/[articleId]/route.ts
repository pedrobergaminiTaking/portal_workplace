import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { downloadArticleAttachment } from "@/lib/supabase-storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ articleId: string }> },
) {
  const { articleId } = await params;

  const article = await prisma.article.findUnique({
    where: { id: articleId, status: "PUBLISHED" },
    select: { attachmentUrl: true, attachmentName: true },
  });

  if (!article?.attachmentUrl) {
    return NextResponse.json({ message: "Anexo não encontrado." }, { status: 404 });
  }

  try {
    const file = await downloadArticleAttachment(articleId);
    const filename = article.attachmentName ?? `${articleId}.pdf`;
    const encodedFilename = encodeURIComponent(filename);

    return new NextResponse(file, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    // Diagnóstico temporário: expõe a mensagem real do erro para investigar
    // o 500 em produção. Remover assim que a causa for identificada.
    console.error("downloadArticleAttachment failed:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message: `DEBUG: ${message}` }, { status: 500 });
  }
}
