import { supabase } from "../lib/supabaseClient";

export async function deleteProfile(userId) {
  const { error } = await supabase.from("profiles").delete().eq("id", userId);
  if (error) throw error;
}

export async function getProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

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
