"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { uploadArticleAttachment, deleteArticleAttachment } from "@/lib/supabase-storage";
import { requireManager } from "@/lib/admin-auth";
import { UserFacingError, toActionError } from "@/lib/errors";

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;
const PDF_SIGNATURE = "%PDF-";

function validateAttachment(attachment: File | null): attachment is File {
  if (!(attachment instanceof File) || attachment.size === 0) return false;
  if (attachment.type !== "application/pdf") {
    throw new UserFacingError("O anexo precisa ser um arquivo PDF.");
  }
  if (attachment.size > MAX_ATTACHMENT_SIZE) {
    throw new UserFacingError("O PDF anexado excede o limite de 10MB.");
  }
  return true;
}

// O tipo MIME enviado pelo navegador pode ser forjado — confere a assinatura
// real do arquivo (%PDF-) além do Content-Type declarado.
async function assertPdfSignature(file: File) {
  const header = new Uint8Array(await file.slice(0, PDF_SIGNATURE.length).arrayBuffer());
  const signature = String.fromCharCode(...header);
  if (signature !== PDF_SIGNATURE) {
    throw new UserFacingError("O arquivo enviado não parece ser um PDF válido.");
  }
}

export type ArticleActionState = { error?: string };

function getSelectedCompanyIds(formData: FormData) {
  return formData.getAll("companyIds").filter((value): value is string => typeof value === "string");
}

async function setArticleCompanies(articleId: string, companyIds: string[]) {
  await prisma.articleCompany.deleteMany({ where: { articleId } });
  if (companyIds.length > 0) {
    await prisma.articleCompany.createMany({
      data: companyIds.map((companyId) => ({ articleId, companyId })),
    });
  }
}

async function generateUniqueSlug(categoryId: string, title: string) {
  const base = slugify(title);
  let slug = base;
  let attempt = 2;

  while (
    await prisma.article.findUnique({
      where: { categoryId_slug: { categoryId, slug } },
      select: { id: true },
    })
  ) {
    slug = `${base}-${attempt}`;
    attempt += 1;
  }

  return slug;
}

function revalidateContentPaths(categorySlugs: Iterable<string>) {
  revalidatePath("/");
  revalidatePath("/buscar");
  revalidatePath("/admin");
  for (const slug of new Set(categorySlugs)) {
    revalidatePath(`/${slug}`);
  }
}

export async function createArticleAction(
  _prevState: ArticleActionState,
  formData: FormData,
): Promise<ArticleActionState> {
  try {
    const session = await requireManager();

    const categoryId = formData.get("categoryId") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const attachment = formData.get("attachment") as File | null;

    if (!categoryId || !title.trim() || !content.trim()) {
      return { error: "Categoria, título e corpo do texto são obrigatórios." };
    }
    const hasAttachment = validateAttachment(attachment);

    const category = await prisma.category.findUniqueOrThrow({
      where: { id: categoryId },
      select: { slug: true },
    });
    const slug = await generateUniqueSlug(categoryId, title);

    const article = await prisma.article.create({
      data: {
        categoryId,
        title,
        content,
        slug,
        status: "PUBLISHED",
        publishedAt: new Date(),
        authorId: session.user.id,
      },
    });

    if (hasAttachment) {
      await assertPdfSignature(attachment);
      const attachmentUrl = await uploadArticleAttachment(article.id, attachment);
      await prisma.article.update({
        where: { id: article.id },
        data: { attachmentUrl, attachmentName: attachment.name },
      });
    }

    await setArticleCompanies(article.id, getSelectedCompanyIds(formData));

    revalidateContentPaths([category.slug]);
    redirect(`/${category.slug}/${article.slug}`);
  } catch (error) {
    return toActionError(error, "Não foi possível salvar o conteúdo. Tente novamente.", "createArticleAction");
  }
}

export async function updateArticleAction(
  _prevState: ArticleActionState,
  formData: FormData,
): Promise<ArticleActionState> {
  try {
    await requireManager();

    const articleId = formData.get("articleId") as string;
    const categoryId = formData.get("categoryId") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const attachment = formData.get("attachment") as File | null;

    if (!categoryId || !title.trim() || !content.trim()) {
      return { error: "Categoria, título e corpo do texto são obrigatórios." };
    }
    const hasNewAttachment = validateAttachment(attachment);

    const previous = await prisma.article.findUniqueOrThrow({
      where: { id: articleId },
      select: { category: { select: { slug: true } } },
    });
    const category = await prisma.category.findUniqueOrThrow({
      where: { id: categoryId },
      select: { slug: true },
    });

    const article = await prisma.article.update({
      where: { id: articleId },
      data: { categoryId, title, content },
    });

    if (hasNewAttachment) {
      await assertPdfSignature(attachment);
      const attachmentUrl = await uploadArticleAttachment(article.id, attachment);
      await prisma.article.update({
        where: { id: article.id },
        data: { attachmentUrl, attachmentName: attachment.name },
      });
    }

    await setArticleCompanies(article.id, getSelectedCompanyIds(formData));

    revalidateContentPaths([previous.category.slug, category.slug]);
    redirect(`/${category.slug}/${article.slug}`);
  } catch (error) {
    return toActionError(error, "Não foi possível salvar o conteúdo. Tente novamente.", "updateArticleAction");
  }
}

export async function deleteArticleAction(formData: FormData) {
  const articleId = formData.get("articleId") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/admin";

  // Falhas aqui (permissão, item já excluído, storage indisponível) são
  // logadas mas nunca propagadas — o usuário sempre volta para a tela
  // anterior em vez de cair na tela de erro genérica do Next.js.
  try {
    await requireManager();

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { attachmentUrl: true, category: { select: { slug: true } } },
    });

    if (article) {
      if (article.attachmentUrl) {
        try {
          await deleteArticleAttachment(articleId);
        } catch (error) {
          console.error("Falha ao remover anexo do Storage:", error);
        }
      }

      await prisma.article.delete({ where: { id: articleId } });
      revalidateContentPaths([article.category.slug]);
    }
  } catch (error) {
    console.error("deleteArticleAction failed:", error);
  }

  redirect(redirectTo);
}
