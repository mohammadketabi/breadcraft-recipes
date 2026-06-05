import { supabase } from "../lib/supabaseClient";

export async function isRecipeBookmarked(recipeId, userId) {
  const { data } = await supabase
    .from("recipe_bookmarks")
    .select("id")
    .eq("recipe_id", recipeId)
    .eq("user_id", userId)
    .maybeSingle();
  return !!data;
}

export async function toggleBookmark(recipeId, userId) {
  const { data: existing } = await supabase
    .from("recipe_bookmarks")
    .select("id")
    .eq("recipe_id", recipeId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("recipe_bookmarks")
      .delete()
      .eq("recipe_id", recipeId)
      .eq("user_id", userId);
    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase
      .from("recipe_bookmarks")
      .insert({ recipe_id: recipeId, user_id: userId });
    if (error) throw error;
    return true;
  }
}

export async function getBookmarkedRecipes(userId) {
  const { data, error } = await supabase
    .from("recipe_bookmarks")
    .select("recipe:recipes(*, recipe_likes(count), recipe_comments(count))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map((b) => b.recipe).filter(Boolean);
}
