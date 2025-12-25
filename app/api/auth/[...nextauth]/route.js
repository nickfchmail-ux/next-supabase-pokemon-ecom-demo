import { handlers } from "../../../_lib/auth"; // or wherever your NextAuth config is

export const { GET, POST } = handlers;
// OR if using the old style: export { GET, POST } from "auth";
