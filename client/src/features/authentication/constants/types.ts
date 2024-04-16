export type User = {
  id: number;
  email: string;
  password: string;
  username: string;
};

export type UserSignupInputs = Omit<User, "id">;

export type UserIdentifier = Pick<User, "id" | "username">;
