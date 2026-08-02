import { apiClient, handleTryCatch } from "../utils/apiClient";
import { JOBS_BASE_API } from "./constants";
import type { GetJob, GetJobs } from "./jobs.types";

export const getJobs = handleTryCatch(async (): Promise<GetJobs> => {
  const response = await apiClient.get(`${JOBS_BASE_API}`);
  const values: GetJobs = response.data as GetJobs;
  return values;
});

export const getJob = handleTryCatch(async (jobId: string): Promise<GetJob> => {
  const response = await apiClient.get(`${JOBS_BASE_API}/${jobId}`);
  const jobValue: GetJob = response.data as GetJob;
  return jobValue;
});
