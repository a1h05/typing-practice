import UserService from "./user-service";
import {ValidPassword} from "../entities/valid-password";
import {ValidEmail} from "../entities/valid-email";
import {User} from "../entities/user";

export default class LoginService {
  static ensureValidCredentials(email: string, password: string) {
    return {email: ValidEmail.check(email), password: ValidPassword.check(password)}
  }

  public async login(email: ValidEmail, password: ValidPassword): Promise<User> {
    const rawUser = await this.userService.getUserByCredentials(email, password)
    return this.userService.parseUser(rawUser)
  }

  constructor(private userService: UserService) {
  }
}
