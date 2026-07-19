import { apiClient, handleTryCatch } from "../utils/apiClient";
import type { GetJobs } from "./jobs.types";

const JOBS_BASE_API = "/job/";

export const getJobs = handleTryCatch(async (): Promise<GetJobs> => {
  const response = await apiClient.get(`${JOBS_BASE_API}`);
  const values: GetJobs = response.data as GetJobs;
  return values;
});

