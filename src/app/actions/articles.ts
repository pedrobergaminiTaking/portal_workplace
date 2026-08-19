"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { uploadArticleAttachment, deleteArticleAttachment } from "@/lib/supabase-storage";

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;

export type ArticleActionState = { error?: string };

function validateAttachment(attachment: File | null): attachment is File {
  if (!(attachment instanceof File) || attachment.size === 0) return false;
  if (attachment.type !== "application/pdf") {
    throw new Error("O anexo precisa ser um arquivo PDF.");
  }
  if (attachment.size > MAX_ATTACHMENT_SIZE) {
    throw new Error("O PDF anexado excede o limite de 10MB.");
  }
  return true;
}

async function requireManager() {
  const session = await auth();
  if (session?.user.role !== "EDITOR" && session?.user.role !== "ADMIN") {
    throw new Error("Não autorizado.");
  }
  return session;
}

async function generateUniqueSlug(categoryId: string, title: string) {
  const base = slugify(title);
  let slug = base;
  let attempt = 2;

  while (
    await prisma.article.findUnique({
      where: { categoryId_slug: { categoryId, slug } },
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

    const category = await prisma.category.findUniqueOrThrow({ where: { id: categoryId } });
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
      const attachmentUrl = await uploadArticleAttachment(article.id, attachment);
      await prisma.article.update({
        where: { id: article.id },
        data: { attachmentUrl, attachmentName: attachment.name },
      });
    }

    revalidateContentPaths([category.slug]);
    redirect(`/${category.slug}/${article.slug}`);
  } catch (error) {
    if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
      return { error: error.message };
    }
    throw error;
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
      include: { category: { select: { slug: true } } },
    });
    const category = await prisma.category.findUniqueOrThrow({ where: { id: categoryId } });

    const article = await prisma.article.update({
      where: { id: articleId },
      data: { categoryId, title, content },
    });

    if (hasNewAttachment) {
      const attachmentUrl = await uploadArticleAttachment(article.id, attachment);
      await prisma.article.update({
        where: { id: article.id },
        data: { attachmentUrl, attachmentName: attachment.name },
      });
    }

    revalidateContentPaths([previous.category.slug, category.slug]);
    redirect(`/${category.slug}/${article.slug}`);
  } catch (error) {
    if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
      return { error: error.message };
    }
    throw error;
  }
}

export async function deleteArticleAction(formData: FormData) {
  await requireManager();

  const articleId = formData.get("articleId") as string;
  const article = await prisma.article.findUniqueOrThrow({
    where: { id: articleId },
    include: { category: { select: { slug: true } } },
  });

  if (article.attachmentUrl) {
    await deleteArticleAttachment(articleId);
  }

  await prisma.article.delete({ where: { id: articleId } });

  revalidateContentPaths([article.category.slug]);
  redirect(`/${article.category.slug}`);
}
