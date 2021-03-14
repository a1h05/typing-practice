import * as t from "runtypes";
import UserService from "./user-service";
import {PrivilegedUser} from "../entities/privileged-user";

const ValidEmail = t.String
    .withBrand('ValidEmail')
    .withConstraint(str => (/^[^\s@]+@[^\s@]+$/).test(str) || 'Invalid email');
type ValidEmail = t.Static<typeof ValidEmail>

const ValidPassword = t.String
    .withBrand('ValidPassword')
    .withConstraint(str => str.length >= 4 || 'Invalid password');
type ValidPassword = t.Static<typeof ValidPassword>

export default class LoginService {
  static ensureValidCredentials(email: string, password: string) {
    return {email: ValidEmail.check(email), password: ValidPassword.check(password)}
  }

  public async login(email: ValidEmail, password: ValidPassword): Promise<PrivilegedUser> {
    const rawUser = await this.userService.getUserByCredentials(email, password)
    const user = this.userService.parseUser(rawUser)

    try {
      return PrivilegedUser.check(user)
    } catch (e) {
      throw new Error('Only Admin or Moderator can enter')
    }
  }

  constructor(private userService: UserService) {
  }
}
