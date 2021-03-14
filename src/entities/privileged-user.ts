import * as t from "runtypes";
import {Admin} from "./admin";
import {Moderator} from "./moderator";

export const PrivilegedUser = t.Union(Admin, Moderator)
export type PrivilegedUser = t.Static<typeof PrivilegedUser>
