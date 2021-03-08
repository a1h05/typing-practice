import {Role} from "../entities/role";
import {Admin} from "../entities/admin";
import {Client} from "../entities/client";
import {Moderator} from "../entities/moderator";
import type {User} from "../entities/user";
import type {RoleToUser} from "../entities/role-to-user";
import {PrivilegedUser} from "../entities/privileged-user";
import {AVAILABLE_OPERATIONS, AVAILABLE_OPERATIONS_TYPE} from "../entities/available-operations";

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

  async getUserByCredentials(email: string, password: string): Promise<Readonly<User>> {
    const users = await this.getAllUsers()
    const user = users.find(u => u.password === password && u.email === email)
    if (!user) {
      throw new Error('wrong credentials')
    }
    return user
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

  getAvailableOperations<R1 extends Role, R2 extends Role>(user: User & { role: R1 }, currentUser: PrivilegedUser & { role: R2 }): AVAILABLE_OPERATIONS_TYPE[R2][R1] {
    return AVAILABLE_OPERATIONS[currentUser.role][user.role];
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
