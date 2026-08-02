import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getJobs } from "../services/jobs.services";
import type { GetJobs } from "../services/jobs.types";

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
