import { UserRole } from "@/users/users.type";
import { SetMetadata } from "@nestjs/common";

export const USER_ROLES_KEY = "user-roles";

export const Roles = (...roles: UserRole[]) =>
  SetMetadata(USER_ROLES_KEY, roles);
