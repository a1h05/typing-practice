import Services from "../services";
import { useContext } from "react";
import type { User } from "../entities/user";
import {PrivilegedUser} from "../entities/privileged-user";

export default function useOperations(user: User, currentUser: User) {
  const { userService } = useContext(Services);
  return userService.getAvailableOperations(user, PrivilegedUser.check(currentUser));
}
