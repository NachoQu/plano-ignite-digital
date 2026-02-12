import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export function createAdminClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

export async function uploadImage(
  imageBase64: string,
  slug: string
): Promise<string> {
  const supabase = createAdminClient();

  const imageBuffer = Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0));
  const fileName = `${slug}-${Date.now()}.webp`;

  const { error: uploadError } = await supabase.storage
    .from('blog-images')
    .upload(fileName, imageBuffer, {
      contentType: 'image/webp',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Storage upload error: ${uploadError.message}`);
  }

  const { data } = supabase.storage
    .from('blog-images')
    .getPublicUrl(fileName);

  return data.publicUrl;
}
