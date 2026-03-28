import { useContext } from "react";

import { SessionContext } from "../context";

// This hook can be used to access the user info.
export const useSession = () => useContext(SessionContext);
