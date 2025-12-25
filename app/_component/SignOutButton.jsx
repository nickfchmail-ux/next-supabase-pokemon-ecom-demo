import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  VscSignOut
} from "react-icons/vsc";

import { handleSignOut } from "../_lib/actions";
export default function SignOutButton({view}) {
  return (
    <form action={handleSignOut} className="w-full">
      <button type="submit " >
        <ListItemButton className={`${view === "mobile" ? "flex gap-2":""}`} >
          {view !== "mobile" ? <>
            <ListItemIcon >{<VscSignOut />}</ListItemIcon>
            <ListItemText primary={"Sign out"} />
          </>
          :<>
          <VscSignOut /> <span className={`text-[12px] pt-2px`}>Sign out</span>
          </>
          }
        </ListItemButton>
      </button>
    </form>
  );
}

