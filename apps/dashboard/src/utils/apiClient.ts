import axios from "axios";

export const apiClient = axios.create({ baseURL: "http://localhost:6969" });

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

export const handleTryCatch = <T>(
  func: () => Promise<T>
): (() => Promise<T>) => {
  return async () => {
    try {
      return await func();
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  };
};
