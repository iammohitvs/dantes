import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.MODE === "production" ? "/api" : "http://localhost:6969",
  withCredentials: true,
});

apiClient.interceptors.response.use((config) => {
  return config;
});

export const handleAxiosError = (error: any) => {
  if (error.response) {
    console.error("Status:", error.response.status);
    console.error("Data:", error.response.data);
    console.error("Headers:", error.response.headers);

    throw new Error(error.response.data);
  } else if (error.request) {
    console.error("No response received:", error.request);

    throw new Error("No response received");
  } else {
    console.error("Error message:", error.message);
    throw new Error(error.message);
  }
};

export const handleTryCatch = <T, Args extends unknown[]>(
  func: (...args: Args) => Promise<T>
): ((...args: Args) => Promise<T>) => {
  return async (...args: Args) => {
    try {
      return await func(...args);
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  };
};
