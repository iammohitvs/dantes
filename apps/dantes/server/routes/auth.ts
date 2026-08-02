import { FastifyInstance } from "fastify";
import { login, LoginBody, verifyToken } from "../../packages-tunnel/auth.ts";

const generateExpiresDate = (): Date => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + 30);
  return date;
};

export const authRoute = async (fastify: FastifyInstance) => {
  fastify.post("/login", async (req, res) => {
    const { username, password } = req.body as LoginBody;

    const loginResponse = await login(username, password);

    if (!loginResponse.status) {
      return res
        .status(500)
        .send({ status: "error", message: loginResponse.message });
    }

    return res
      .status(200)
      .setCookie("token", loginResponse.message, {
        expires: generateExpiresDate(),
        path: "/",
      })
      .send({ status: "success", message: "login successful" });
  });

  fastify.get("/verify", async (req, res) => {
    const { token } = req.cookies;

    if (!token) {
      return res
        .status(401)
        .send({ status: "error", message: "no token cookie" });
    }

    const result = verifyToken(token);

    if (!result.status) {
      return res
        .status(401)
        .send({ status: "error", message: "token could not be verified" });
    }

    return res
      .status(200)
      .setCookie("token", result.message, {
        expires: generateExpiresDate(),
        path: "/",
      })
      .send({ status: "success", message: "token verified" });
  });

  fastify.post("/logout", async (req, res) => {
    return res
      .status(200)
      .clearCookie("token")
      .send({ status: "success", message: "logout successful" });
  });
};
