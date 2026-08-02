import { apiClient, handleTryCatch } from "../utils/apiClient";
import { JOBS_BASE_API } from "./constants";
import type { GetJobs } from "./jobs.types";

export const getJobs = handleTryCatch(async (): Promise<GetJobs> => {
  const response = await apiClient.get(`${JOBS_BASE_API}`);
  const values: GetJobs = response.data as GetJobs;
  return values;
});

