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

export async function createRecipe(recipe) {
  const { data, error } = await supabase
    .from("recipes")
    .insert([recipe])
    .select()
    .single();

  if (error) {
    throw error;
  }

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
  const { data, error } = await supabase
    .from("recipes")
    .update(recipe)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
