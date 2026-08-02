export type LoginReturnType = { status: boolean; message: string };

export type VerifyTokenReturnType =
  | { status: false }
  | { status: true; message: string };

export type LoginBody = { username: string; password: string };
