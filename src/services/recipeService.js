import { supabase } from "../lib/supabaseClient";

export async function getRecipes() {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}