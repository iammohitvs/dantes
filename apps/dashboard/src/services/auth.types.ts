export type LoginBody = {
  username: string;
  password: string;
};

export type LoginResponse = { status: "success"; message: "login successful" };
