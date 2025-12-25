"use client";

import Image from "next/image";
import { handleSignIn } from "../_lib/actions";

const style =
  "px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition text-sm flex gap-2 items-center justify-center";

export default function SignInButton() {
  return (
    <form action={handleSignIn}>
      <button className="flex items-center gap-6 text-lg border border-black px-10 py-4 font-medium">
        <Image
          src="https://authjs.dev/img/providers/google.svg"
          alt="Google Logo"
          width={20}
          height={20}
        />{" "}
        <span>Continue with Google</span>
      </button>
    </form>
  );
}
