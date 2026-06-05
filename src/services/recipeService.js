import { supabase } from "../lib/supabaseClient";
import { parseTimeToMinutes } from "../utils/parseTime";

export async function getRecipes({ page = 0, pageSize = 12, search = "", categorySlug = null, maxMinutes = null } = {}) {
  let query = supabase
    .from("recipes")
    .select("*, recipe_likes(count), recipe_comments(count)")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .range(page * pageSize, page * pageSize + pageSize - 1);

  if (search) query = query.ilike("title", `%${search}%`);
  if (categorySlug) query = query.eq("category_slug", categorySlug);
  if (maxMinutes !== null) {
    query = query
      .not("time_minutes", "is", null)
      .lte("time_minutes", maxMinutes);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getFeaturedRecipes(categorySlug = null) {
  let query = supabase
    .from("recipes")
    .select("*, recipe_likes(count), recipe_comments(count)")
    .eq("is_public", true)
    .eq("featured", true)
    .order("created_at", { ascending: false });

  if (categorySlug) query = query.eq("category_slug", categorySlug);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createRecipe(recipe) {
  const { data, error } = await supabase
    .from("recipes")
    .insert([{ ...recipe, time_minutes: parseTimeToMinutes(recipe.time) }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteRecipe(id) {
  const { error } = await supabase.from("recipes").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

export async function getRecipeById(id) {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateRecipe(id, recipe) {
  const payload = recipe.time !== undefined
    ? { ...recipe, time_minutes: parseTimeToMinutes(recipe.time) }
    : recipe;

  const { data, error } = await supabase
    .from("recipes")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAllRecipes() {
  const { data, error } = await supabase
    .from("recipes")
    .select("*, recipe_likes(count), recipe_comments(count)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getMyRecipes(userId) {
  const { data, error } = await supabase
    .from("recipes")
    .select("*, recipe_likes(count), recipe_comments(count)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function uploadRecipeImage(file) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("recipe-images")
    .upload(fileName, file);

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from("recipe-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}
