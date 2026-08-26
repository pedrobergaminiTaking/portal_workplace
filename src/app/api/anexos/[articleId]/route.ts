import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildCompanyVisibilityWhere } from "@/lib/visibility";
import { downloadArticleAttachment } from "@/lib/supabase-storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ articleId: string }> },
) {
  const { articleId } = await params;

  const session = await auth();
  const visibilityWhere = buildCompanyVisibilityWhere(session);

  const article = await prisma.article.findFirst({
    where: { id: articleId, status: "PUBLISHED", ...visibilityWhere },
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
    console.error("GET /api/anexos failed:", error);
    return NextResponse.json({ message: "Não foi possível baixar o anexo." }, { status: 500 });
  }
}
