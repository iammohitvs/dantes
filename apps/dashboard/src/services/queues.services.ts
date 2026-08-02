import { apiClient, handleTryCatch } from "../utils/apiClient";
import { QUEUES_BASE_API } from "./constants";
import type { GetQueues } from "./queues.types";

export const getQueues = handleTryCatch(async (): Promise<GetQueues> => {
  const response = await apiClient.get(`${QUEUES_BASE_API}`);
  const values: GetQueues = response.data as GetQueues;
  return values;
});
