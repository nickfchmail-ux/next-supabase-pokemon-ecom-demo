import { notFound } from "next/navigation";
import { auth } from "./auth";
import { supabase } from "./supabase";
export async function getPokemons() {
  const { data, count, error } = await supabase
    .from("pokemons")
    .select("* , pokemons_selling(*)");

  if (error) {
    console.error(error);
    notFound();
  }

  return { data, count };
}

export async function getPokemonById(id) {
  const { data, error } = await supabase
    .from("pokemons")
    .select("* , pokemons_selling(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    notFound();
  }

  return data;
}

export async function getUser(email) {



  if (!email) return null

  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error(error);
  }

  return data;
}

export async function createMember(newMember) {
  const { data, error } = await supabase
    .from("members")
    .insert([newMember])
    .select()
    .single(); // Add .select() to return the inserted row

  if (error) {
    console.error("Supabase error creating member:", error);
    throw new Error("Member could not be created");
  }

  return data; // Returns the single created member object
}

export async function updateMember({ member, memberId }) {
  const { user } = await auth();
  console.log(
    `id in supabase:${JSON.stringify(
      user.id
    )}, id received from frontend:${memberId}, update data:${JSON.stringify(
      member
    )}`
  );
  if (memberId !== user.id) {
    throw new Error("you are not authorized to edit the user profile");
  }

  const { data, error } = await supabase
    .from("members")
    .update(member)
    .eq("id", memberId)
    .select()
    .single();

  if (error) {
    console.error("Supabase error creating member:", error);
    throw new Error("Member could not be created");
  }

  return data; // Returns the single created member object
}

export async function uploadImage({ filePath, image }) {
  const { user: id } = await auth();
  console.log("file: ", image);
  const { error: uploadError } = await supabase.storage
    .from("avatars") // your bucket name
    .upload(filePath, image);

  if (uploadError) {
    console.error("uplaod error:", uploadError);
    throw new Error("image could not be uploaded");
  }

  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}
