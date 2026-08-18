"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { uploadArticleAttachment, deleteArticleAttachment } from "@/lib/supabase-storage";

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;

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

export async function createArticleAction(formData: FormData) {
  const session = await auth();
  if (session?.user.role !== "EDITOR" && session?.user.role !== "ADMIN") {
    throw new Error("Não autorizado.");
  }

  const categoryId = formData.get("categoryId") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const attachment = formData.get("attachment") as File | null;
  const hasAttachment = attachment instanceof File && attachment.size > 0;

  if (hasAttachment) {
    if (attachment.type !== "application/pdf") {
      throw new Error("O anexo precisa ser um arquivo PDF.");
    }
    if (attachment.size > MAX_ATTACHMENT_SIZE) {
      throw new Error("O PDF anexado excede o limite de 10MB.");
    }
  }

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

  redirect(`/${category.slug}/${article.slug}`);
}

export async function deleteArticleAction(formData: FormData) {
  const session = await auth();
  if (session?.user.role !== "EDITOR" && session?.user.role !== "ADMIN") {
    throw new Error("Não autorizado.");
  }

  const articleId = formData.get("articleId") as string;
  const article = await prisma.article.findUniqueOrThrow({
    where: { id: articleId },
    include: { category: { select: { slug: true } } },
  });

  if (article.attachmentUrl) {
    await deleteArticleAttachment(articleId);
  }

  await prisma.article.delete({ where: { id: articleId } });

  redirect(`/${article.category.slug}`);
}
