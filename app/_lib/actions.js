"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { getPokemons, getUser, updateMember, uploadImage } from "./data-service";

export async function handleSignOut() {
  console.log("clicked sign out");
  await signOut();
}


export async function handleSignIn() {
  console.log("clicked sign in");
  await signIn("google", {redirectTo:"/account"});
}

export async function getUserAction(email) {

    return await getUser(email);
}

export async function updateMemberAction(formData) {
  if (!formData) {
    throw new Error("no data is provided");
  }

  const session = await auth();
  if (!session) {
    throw new Error("You must be logged in to update your profile.");
  }

  const { id } = await getUser(session.user.email);
  const image = formData?.get("image");
  let finalImagePath;

  // Check if a new file was uploaded (it will be a File object)
  if (image instanceof File && image.size > 0) {
    const filePath = `profile/${id}-${Math.random()}-${image.name?.replaceAll(
      /\s/g,
      "-"
    )}`;

    finalImagePath = await uploadImage({ filePath, image });
  } else {
    // If no new file, use the existing image URL (which is a string)
    finalImagePath = image;
  }

  const updatedData = {
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    gender: formData.get("gender"),
    address: formData.get("address"),
    // Use the finalImagePath directly
    image: finalImagePath,
  };

  await updateMember({ member: updatedData, memberId: id });

  revalidatePath("/account/profile");
}


export async function getPokemonAction(){
  return await getPokemons()
}
