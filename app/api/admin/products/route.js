import { NextResponse } from 'next/server';
import { auth } from '../../../_lib/auth';
import { supabase } from '../../../_lib/supabase';

/**
 * Helper: verify admin access from session.
 */
async function guardAdmin() {
  const session = await auth();
  if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
    return false;
  }
  return true;
}

/**
 * GET /api/admin/products — List all products (admin only)
 */
export async function GET() {
  if (!(await guardAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('pokemons')
    .select('*, pokemons_selling(*)')
    .order('id', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

/**
 * PUT /api/admin/products — Update a product (admin only)
 */
export async function PUT(request) {
  if (!(await guardAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, name, species, price, hp, attack, defense, special_attack, special_defense, speed, description, image } = body;

    const { data: pokemon, error: pokemonError } = await supabase
      .from('pokemons')
      .update({
        name,
        species,
        descriptions: Array.isArray(description) ? description : [description],
        image: image || '',
        hp,
        attack,
        defense,
        special_attack,
        special_defense,
        speed,
      })
      .eq('id', id)
      .select()
      .single();

    if (pokemonError) {
      console.error('[PUT /api/admin/products] Supabase error:', JSON.stringify(pokemonError));
      throw new Error(pokemonError.message);
    }

    const { error: sellingError } = await supabase
      .from('pokemons_selling')
      .update({ regular_price: price })
      .eq('reference_id', id);

    if (sellingError) throw new Error(sellingError.message);

    return NextResponse.json({ success: true, data: pokemon });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/products — Create a new product
 */
export async function POST(request) {
  if (!(await guardAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const {
      name,
      species,
      price,
      hp,
      attack,
      defense,
      special_attack,
      special_defense,
      speed,
      description,
    } = body;

    // Convert JS array to PostgreSQL array literal
    const speciesLiteral = Array.isArray(species) ? `{${species.join(',')}}` : species;

    const { data: pokemon, error: pokemonError } = await supabase
      .from('pokemons')
      .insert([
        {
          name,
          species: speciesLiteral,
          descriptions: description,
          hp,
          attack,
          defense,
          special_attack,
          special_defense,
          speed,
          image: '',
        },
      ])
      .select()
      .single();

    if (pokemonError) throw new Error(pokemonError.message);

    const { error: sellingError } = await supabase
      .from('pokemons_selling')
      .insert([{ reference_id: pokemon.id, regular_price: price, discount: 0 }]);

    if (sellingError) throw new Error(sellingError.message);

    return NextResponse.json({ success: true, data: pokemon });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
