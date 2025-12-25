"use client";

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

const LIMIT = 12;

export async function getPokemons({ pageParam = 0, species = [] }) {
  const speciesArray = Array.isArray(species)
    ? species
    : [species].filter(Boolean);

  // Main query for paginated data
  let dataQuery = supabase
    .from("pokemons")
    .select("*, pokemons_selling(*)")
    .order("id", { ascending: true })
    .limit(LIMIT);

  if (pageParam) dataQuery = dataQuery.gt("id", pageParam);
  if (speciesArray.length > 0)
    dataQuery = dataQuery.contains("species", speciesArray);

  // Separate count query (no limit!)
  let countQuery = supabase
    .from("pokemons")
    .select("species", { count: "exact" }); // head: true = only count, no data

  if (speciesArray.length > 0)
    countQuery = countQuery.contains("species", speciesArray);

  const [
    { data, error: dataError },
    { data: countData, count, error: countError },
  ] = await Promise.all([dataQuery, countQuery]);

  if (dataError) throw dataError;
  if (countError) throw countError;

  const nextPage =
    data && data.length === LIMIT ? data[data.length - 1].id : undefined;

  const speciesMULTI = countData?.reduce((acc, pokemon) => {
    pokemon?.species?.forEach((s) => acc.add(s));
    return acc;
  }, new Set());

  return {
    pokemons: data ?? [],
    nextPage,
    totalCount: count ?? 0, // This is the full total!
    speciesList: speciesMULTI ? Array.from(speciesMULTI) : [],
  };
}
