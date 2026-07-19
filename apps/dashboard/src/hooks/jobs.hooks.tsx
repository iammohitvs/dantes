import { useQuery } from "@tanstack/react-query";
import { getJobs } from "../services/jobs.services";
import type { GetJobs } from "../services/jobs.types";

export const useGetJobs = () => {
  const { data, error, isFetching, isPending, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });

  return { data: data as GetJobs, error, isFetching, isPending, isLoading };
};
