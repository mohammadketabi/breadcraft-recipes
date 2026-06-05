import { supabase } from "../lib/supabaseClient";

export async function getRecipeLikes(recipeId) {
  const { data, error } = await supabase
    .from("recipe_likes")
    .select("user_id")
    .eq("recipe_id", recipeId);
  if (error) throw error;
  return data;
}

export async function toggleLike(recipeId, userId) {
  const { data: existing } = await supabase
    .from("recipe_likes")
    .select("id")
    .eq("recipe_id", recipeId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("recipe_likes")
      .delete()
      .eq("recipe_id", recipeId)
      .eq("user_id", userId);
    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase
      .from("recipe_likes")
      .insert({ recipe_id: recipeId, user_id: userId });
    if (error) throw error;
    return true;
  }
}
