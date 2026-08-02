import { hash } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { LoginReturnType, VerifyTokenReturnType } from "./types.ts";

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

const HASH_ROUNDS = Number(process.env.HASH_ROUNDS ?? 12);
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECTER is missing from envs");
}

const generateToken = () => {
  return sign({ username: USERNAME }, JWT_SECRET, {
    algorithm: "RS256",
    expiresIn: "30 minutes",
  });
};

export const login = async (
  username: string,
  password: string
): Promise<LoginReturnType> => {
  try {
    if (!USERNAME && !PASSWORD) {
      return {
        status: false,
        message: "username and password are not deinefd in the environment",
      };
    }

    if (username !== USERNAME) {
      return {
        status: false,
        message: "username and/or password are incorrect",
      };
    }

    const hashedPassword = await hash(password, HASH_ROUNDS);
    if (hashedPassword !== PASSWORD) {
      return {
        status: false,
        message: "username and/or password are incorrect",
      };
    }

    const signedToken = generateToken();

    return { status: true, message: signedToken };
  } catch (error) {
    return {
      status: false,
      message: "something went wrong in trying to log you in",
    };
  }
};

export const verifyToken = (token: string): VerifyTokenReturnType => {
  try {
    const payload = verify(token, JWT_SECRET);

    const newSignedToken = generateToken();

    return { status: true, message: newSignedToken };
  } catch (error) {
    return { status: false };
  }
};
