import {Role} from "../entities/role";
import {Admin} from "../entities/admin";
import {Client} from "../entities/client";
import {Moderator} from "../entities/moderator";
import {Operation} from "../entities/operation";
import type {User} from "../entities/user";
import type {RoleToUser} from "../entities/role-to-user";
import or from "../utils/or";

const adminOperations = {
  [Role.ADMIN]: [Operation.UPDATE_TO_CLIENT, Operation.UPDATE_TO_MODERATOR],
  [Role.CLIENT]: [Operation.UPDATE_TO_ADMIN, Operation.UPDATE_TO_MODERATOR],
  [Role.MODERATOR]: [Operation.UPDATE_TO_ADMIN, Operation.UPDATE_TO_CLIENT],
} as const

type AdminOperations = typeof adminOperations

const moderatorOperations = {
  [Role.MODERATOR]: [Operation.UPDATE_TO_CLIENT],
  [Role.CLIENT]: [Operation.UPDATE_TO_MODERATOR],
  [Role.ADMIN]: [],
} as const

type ModeratorOperations = typeof moderatorOperations


export default class UserService {
  private users: readonly User[] = [];

  parseUser = (u: any) => {
    const User = this.getConstructorByRole(u.role);
    return User.from(u);
  };

  async getAllUsers(): Promise<readonly User[]> {
    if (this.users.length !== 0) {
      return this.users;
    }
    const response = await this.fetch();
    this.users = response.default.map(this.parseUser);
    return this.users;
  }

  private fetch(): Promise<any> {
    return import("../mocks/users.json");
  }

  async updateUserRole<R extends Role>(
    user: Readonly<RoleToUser[R]>,
    newRole: R
  ) {
    const User = this.getConstructorByRole(newRole);
    this.users = this.users.map((u) => (u.id === user.id ? User.from(u) : u));
    return this.users;
  }

  private getAvailableOperationForModerator<R extends Role>(currentUser: Moderator, role: R): ModeratorOperations[R] {
    return moderatorOperations[role]
  }
  private getAvailableOperationForAdmin<R extends Role>(currentUser: Admin, role: R): AdminOperations[R] {
    return adminOperations[role]
  }

  getAvailableOperations(user: User, currenUser: User): Readonly<Operation[]> {
    const concreteUser = or(Admin, Moderator)(currenUser)

    switch (concreteUser.role) {
      case Role.ADMIN:
        return this.getAvailableOperationForAdmin(concreteUser, user.role)
      case Role.MODERATOR:
        return this.getAvailableOperationForModerator(concreteUser, user.role)
    }
  }

  getConstructorByRole(role: Role) {
    switch (role) {
      case Role.ADMIN:
        return Admin;
      case Role.CLIENT:
        return Client;
      case Role.MODERATOR:
        return Moderator;
    }
  }
}
