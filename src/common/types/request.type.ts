import { User } from "@/users/users.type";

export type RequestUser = Pick<User, "id" | "role">;
