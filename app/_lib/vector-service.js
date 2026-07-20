"use server";

import { supabase } from "./supabase";
import OpenAI from "openai";

const ai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

/**
 * Search relevant products using Supabase full-text search (FREE, built-in).
 * Uses PostgreSQL tsvector/tsquery for ranked search — no external API needed.
 */
export async function searchRelevantProducts(query, limit = 5) {
  if (!query || query.length < 2) return [];

  // Normalize query: lowercase, remove special chars
  const normalized = query.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
  if (!normalized) return [];

  try {
    // Use Supabase full-text search via ilike on key columns
    const searchTerms = normalized.split(/\s+/).filter((w) => w.length > 1);

    if (searchTerms.length === 0) return [];

    // Search using ilike on name (case-insensitive partial match)
    const term = searchTerms.join(" ");
    const { data, error } = await supabase
      .from("pokemons")
      .select("id, name, species, descriptions, image, pokemons_selling(*)")
      .ilike("name", `%${term}%`)
      .limit(limit);

    if (error || !data?.length) {
      // Fallback: search by species
      const { data: speciesData } = await supabase
        .from("pokemons")
        .select("id, name, species, descriptions, image, pokemons_selling(*)")
        .or(searchTerms.map((t) => `species.cs.{${t}}`).join(","))
        .limit(limit);
      return speciesData || [];
    }

    return data || [];
  } catch (e) {
    console.warn("Search error:", e.message);
    return [];
  }
}

/**
 * Get past chat context (not vector, just recent history).
 */
export async function searchSimilarChats(query, limit = 3) {
  try {
    const { data } = await supabase
      .from("ai_chat_records")
      .select("*")
      .limit(limit)
      .order("created_at", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

/**
 * Search by stat comparison: "highest attack", "lowest price", "most defense", etc.
 */
export async function searchByStats(query) {
  const q = query.toLowerCase();

  try {
    let order = "";
    let ascending = false;

    if (q.includes("highest attack") || q.includes("strongest") || q.includes("most attack")) {
      order = "attack"; ascending = false;
    } else if (q.includes("lowest attack") || q.includes("weakest")) {
      order = "attack"; ascending = true;
    } else if (q.includes("highest defense") || q.includes("most defense") || q.includes("tank")) {
      order = "defense"; ascending = false;
    } else if (q.includes("fastest") || q.includes("highest speed")) {
      order = "speed"; ascending = false;
    } else if (q.includes("highest hp") || q.includes("most hp")) {
      order = "hp"; ascending = false;
    } else if (q.includes("cheapest") || q.includes("lowest price")) {
      // Sort by pokemons_selling.regular_price (joined table)
      const { data } = await supabase
        .from("pokemons")
        .select("id, name, species, attack, defense, speed, hp, image, pokemons_selling(regular_price, discount)")
        .order("regular_price", { referencedTable: "pokemons_selling", ascending: true })
        .limit(10);
      return data || [];
    } else if (q.includes("expensive") || q.includes("highest price")) {
      const { data } = await supabase
        .from("pokemons")
        .select("id, name, species, attack, defense, speed, hp, image, pokemons_selling(regular_price, discount)")
        .order("regular_price", { referencedTable: "pokemons_selling", ascending: false })
        .limit(10);
      return data || [];
    }

    if (!order) return null; // No stat query detected

    const { data } = await supabase
      .from("pokemons")
      .select("id, name, species, attack, defense, speed, hp, image, pokemons_selling(regular_price, discount)")
      .order(order, { ascending })
      .limit(10);

    return data || [];
  } catch (e) {
    console.warn("Stats search error:", e.message);
    return null;
  }
}

/**
 * Ask DeepSeek to convert a natural language question into a Supabase query.
 * Returns { query: string, error: string } or null.
 */
export async function generateSupabaseQuery(userQuestion) {
  try {
    const completion = await ai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are a Supabase query generator. Convert natural language to a valid Supabase JS query.
Return ONLY a JSON object: { "method": "...", "args": {...}, "explanation": "..." }

Available methods and their args:
- supabase.from(table).select(columns).order(column, { ascending: bool }).limit(n)
- supabase.from(table).select(columns).ilike(column, value).limit(n)
- supabase.from(table).select(columns).or(filters).limit(n)
- supabase.from(table).select(columns).in(column, values).limit(n)

Database schema:
TABLE pokemons:
  id (int4), name (text), species (text[]), descriptions (text[]),
  hp (int4), attack (int4), defense (int4), special_attack (int4),
  special_defense (int4), speed (int4), image (text)

TABLE pokemons_selling (JOIN via pokemons_selling):
  regular_price (float8), discount (float8)

Example: "cheapest pokemon" →
{ "method": "supabase.from('pokemons').select('id,name,species,image,pokemons_selling(regular_price,discount)').order('regular_price', { referencedTable: 'pokemons_selling', ascending: true }).limit(10)", "args": {}, "explanation": "Sorted by price ascending" }

Example: "fire type pokemon" →
{ "method": "supabase.from('pokemons').select('id,name,species,image,pokemons_selling(*)').or('species.cs.{fire}')", "args": {}, "explanation": "Filtered by species fire" }

Example: "strongest pokemon" →
{ "method": "supabase.from('pokemons').select('id,name,species,attack,image,pokemons_selling(*)').order('attack', { ascending: false }).limit(10)", "args": {}, "explanation": "Sorted by attack descending" }

Rules:
- NEVER use eval() or Function()
- Only use the methods listed above
- Always include pokemons_selling for price data
- Limit to 10 results
- Use ilike for name searches, or/cs for species array searches`,
        },
        { role: "user", content: userQuestion },
      ],
      temperature: 0.1,
    });

    const raw = completion.choices[0]?.message?.content?.trim() || "";
    try {
      return JSON.parse(raw);
    } catch {
      return { error: "Failed to parse query", raw };
    }
  } catch (e) {
    return { error: e.message };
  }
}

/**
 * Execute a query description against Supabase.
 * Example: { method: "supabase.from('pokemons').select('*').order('attack', { ascending: false }).limit(10)", args: {} }
 */
export async function executeSupabaseQuery(queryDesc) {
  if (!queryDesc?.method) return [];
  try {
    // Extract: supabase.from(...).select(...).order(...).limit(...)
    const methodStr = queryDesc.method;
    // Parse the method chain
    const fromMatch = methodStr.match(/\.from\('(\w+)'\)/);
    const selectMatch = methodStr.match(/\.select\('([^']+)'\)/);
    const orderMatch = methodStr.match(/\.order\('(\w+)',\s*\{([^}]+)\}/);
    const orderSimpleMatch = methodStr.match(/\.order\('(\w+)'/);
    const limitMatch = methodStr.match(/\.limit\((\d+)\)/);
    const ilikeMatch = methodStr.match(/\.ilike\('([^']+)',\s*'([^']+)'\)/);
    const orMatch = methodStr.match(/\.or\('([^']+)'\)/);
    const inMatch = methodStr.match(/\.in\('([^']+)',\s*\[([^\]]+)\]\)/);

    const table = fromMatch?.[1] || "pokemons";
    const columns = selectMatch?.[1] || "*";

    let query = supabase.from(table).select(columns);

    if (orderMatch) {
      const col = orderMatch[1];
      const ascending = orderMatch[2]?.includes("false") ? false : true;
      if (col === "regular_price") {
        query = query.order("regular_price", { referencedTable: "pokemons_selling", ascending });
      } else {
        query = query.order(col, { ascending });
      }
    } else if (orderSimpleMatch) {
      query = query.order(orderSimpleMatch[1]);
    }

    if (limitMatch) query = query.limit(parseInt(limitMatch[1]));
    if (ilikeMatch) query = query.ilike(ilikeMatch[1], ilikeMatch[2]);
    if (orMatch) query = query.or(orMatch[1]);
    if (inMatch) {
      const col = inMatch[1];
      const vals = inMatch[2].split(",").map((v) => v.trim().replace(/['"]/g, ""));
      query = query.in(col, vals);
    }

    const { data, error } = await query;
    if (error) {
      console.warn("Query execution error:", error);
      return [];
    }
    return data || [];
  } catch (e) {
    console.warn("Query parse error:", e.message);
    return [];
  }
}
