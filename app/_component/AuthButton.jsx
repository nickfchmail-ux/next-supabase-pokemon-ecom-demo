"use client"

import Avatar from "@mui/material/Avatar";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

function AuthButton({user}) {




  return (
    <div>
      {!user ? <Link href={"/login"}>Sign in</Link> : null}

      {user  && (
        <li className="text-sm flex place-items-center gap-2">
          <Avatar
            alt={user?.name}
            src={user?.image}
            sx={{ width: 30, height: 30 }}
          />

          <span>{user?.first_name}</span>
          <SignOutButton view={"mobile"}/>
        </li>
      )}
    </div>
  );
}
export default AuthButton;
