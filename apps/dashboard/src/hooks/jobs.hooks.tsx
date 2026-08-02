import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getJob, getJobs } from "../services/jobs.services";
import type { GetJob, GetJobs } from "../services/jobs.types";

export const useGetJobs = () => {
  const queryClient = useQueryClient();

  const { data, error, isFetching, isPending, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });

  const refetchJobs = () => {
    queryClient.refetchQueries({ queryKey: ["jobs"] });
  };

  return {
    data: data as GetJobs,
    error,
    isFetching,
    isPending,
    isLoading,
    refetchJobs,
  };
};

export const useGetJob = (jobId: string) => {
  const queryClient = useQueryClient();

  const { data, error, isFetching, isPending, isLoading } = useQuery({
    queryKey: [`job-${jobId}`],
    queryFn: async () => await getJob(jobId),
  });

  const refetchJob = () => {
    queryClient.refetchQueries({ queryKey: [`job-${jobId}`] });
  };

  return {
    data: data as GetJob,
    error,
    isFetching,
    isLoading,
    isPending,
    refetchJob,
  };
};
