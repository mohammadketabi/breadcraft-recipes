import { supabase } from "../lib/supabaseClient";

export async function getComments(recipeId) {
  const { data, error } = await supabase
    .from("recipe_comments")
    .select("*, author:profiles(full_name, avatar_url)")
    .eq("recipe_id", recipeId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function addComment(recipeId, userId, content) {
  const { data, error } = await supabase
    .from("recipe_comments")
    .insert({ recipe_id: recipeId, user_id: userId, content })
    .select("*, author:profiles(full_name, avatar_url)")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteComment(commentId) {
  const { error } = await supabase
    .from("recipe_comments")
    .delete()
    .eq("id", commentId);
  if (error) throw error;
}
