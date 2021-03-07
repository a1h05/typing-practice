import {Moderator} from "../entities/moderator";
import {Admin} from "../entities/admin";
import or from "../utils/or";
import UserService from "./user-service";

type UserThatCanEnter = Admin | Moderator

class ValidEmail {
  private readonly type = Symbol('validEmail')
  readonly value!: string
  constructor(str: any) {
    if (typeof str !== 'string' || !(/^[^\s@]+@[^\s@]+$/).test(str)) {
      throw new Error('Invalid email')
    }
    this.value = str
  }
}

class ValidPassword {
  private readonly type = Symbol('validPassword')
  readonly value!: string
  constructor(str: any) {
    if (typeof str !== 'string' || str.length <= 4) {
      throw new Error('Invalid password')
    }
    this.value = str
  }
}

export default class LoginService {
  static async ensureValidCredentials(email: string, password: string) {
    return {email: new ValidEmail(email), password: new ValidPassword(password)}
  }
  private static ensureAdminOrModerator = or(Admin, Moderator);

  public async login(email: ValidEmail, password: ValidPassword): Promise<UserThatCanEnter> {
    const rawUser = await LoginService.makeMockRequest(email.value, password.value)
    const user = this.userService.parseUser(rawUser)

    return LoginService.ensureAdminOrModerator(user)
  }

  private static async makeMockRequest(email: string, password: string): Promise<any> {
    const users = (await import("../mocks/users.json")).default;
    const user = users.find(u => u.password === password && u.email === email)
    if (!user) {
      throw new Error('wrong credentials')
    }
    return user
  }

  constructor(private userService: UserService) {
  }
}
