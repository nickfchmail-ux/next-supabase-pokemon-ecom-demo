import { LiaUserCogSolid } from "react-icons/lia";
import { LuMenu } from "react-icons/lu";
import AuthButton from "../_component/AuthButton";
import { getUserAction } from "../_lib/actions";
import { auth } from "../_lib/auth";
import Logo from "./Logo";
import { Modal, Open, Window } from "./Modal";
import NavigationLink from "./NavigationLink";
import SideBar from "./SideBar";
async function Nav() {
  let user

  const session = await auth()

  if (session){
    console.log("session",session)
user = await getUserAction(session.user?.email)
  }



  return (
    <nav className="h-min border-b border-b-amber-600">
      <div className="flex items-center  max-w-7xl mx-auto justify-between">
        <Logo />
        <ul className="flex items-center gap-6 p-4">
          <div className="hidden sm:hidden md:flex rounded-base shadow-xs -space-x-px">
            <NavigationLink />
          </div>

          <div className="flex flex-col md:hidden">
            <Modal>
              <Open name={"nav"}>
                <button><LuMenu /></button>
              </Open>
              <Window name={"nav"}>
                <NavigationLink view={"mobile"} />
              </Window>
              {user && <Open name={"account"}>
                <button><LiaUserCogSolid /></button>
              </Open>}
              <Window name={"account"}>
                <SideBar />
              </Window>
            </Modal>
          </div>

          <AuthButton  user={user}/>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
