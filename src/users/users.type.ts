export enum UserRole {
  SYSTEM = "SYSTEM",
  ADMIN = "ADMIN",
  USER = "USER",
}

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};
