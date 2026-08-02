import { apiClient, handleTryCatch } from "@/utils/apiClient";
import { AUTH_BASE_API } from "./constants";
import type { LoginBody, LoginResponse } from "./auth.types";

export const validateAuth = handleTryCatch(async (): Promise<true> => {
  const validateResponse = await apiClient.get(`${AUTH_BASE_API}/verify`);
  return true;
});

export const login = handleTryCatch(
  async (body: LoginBody): Promise<string> => {
    const loginResponse = await apiClient.post(`${AUTH_BASE_API}/login`, body);
    const { message } = (await loginResponse.data) as LoginResponse;
    return message;
  }
);

export const logout = handleTryCatch(async (): Promise<true> => {
  const logoutResponse = await apiClient.post(`${AUTH_BASE_API}/logout`);
  return true;
});
