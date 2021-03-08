import Services from "../services";
import { useContext } from "react";
import type { User } from "../entities/user";
import {Admin} from "../entities/admin";
import {Moderator} from "../entities/moderator";
import or from "../utils/or";

export default function useOperations(user: User, currentUser: User) {
  const { userService } = useContext(Services);
  return userService.getAvailableOperations(user, or(Admin, Moderator)(user));
}
