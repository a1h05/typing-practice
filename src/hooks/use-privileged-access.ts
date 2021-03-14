import {redirectTo} from "@reach/router";
import useCurrentUser from "./use-current-user";
import {PrivilegedUser} from "../entities/privileged-user";

export default function usePrivilegedAccess(): PrivilegedUser {
  const currentUser = useCurrentUser();
  try {
    return PrivilegedUser.check(currentUser)
  } catch (e) {
    redirectTo("/no-access");
    throw e
  }
}

