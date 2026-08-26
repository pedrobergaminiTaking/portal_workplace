import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const ATTACHMENTS_BUCKET = "article-attachments";

let supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin() {
  if (supabaseAdmin) return supabaseAdmin;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY não configurados.");
  }
  supabaseAdmin = createClient(url, serviceRoleKey);
  return supabaseAdmin;
}

export async function uploadArticleAttachment(articleId: string, file: File) {
  const supabase = getSupabaseAdmin();
  const path = `${articleId}.pdf`;

  const { error } = await supabase.storage.from(ATTACHMENTS_BUCKET).upload(path, file, {
    contentType: "application/pdf",
    upsert: true,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(ATTACHMENTS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteArticleAttachment(articleId: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(ATTACHMENTS_BUCKET).remove([`${articleId}.pdf`]);
  if (error) throw error;
}

export async function downloadArticleAttachment(articleId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(ATTACHMENTS_BUCKET)
    .download(`${articleId}.pdf`);
  if (error) {
    console.error(`downloadArticleAttachment(${articleId}) failed:`, error);
    throw new Error("Não foi possível baixar o anexo.");
  }
  return data;
}
