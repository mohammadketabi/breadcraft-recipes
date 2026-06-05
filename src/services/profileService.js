import { supabase } from "../lib/supabaseClient";

export async function uploadProfileImage(file) {
  const fileExt = file.name.split(".").pop();

  const fileName = `avatar-${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("profile-images")
    .upload(fileName, file);

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from("profile-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}
