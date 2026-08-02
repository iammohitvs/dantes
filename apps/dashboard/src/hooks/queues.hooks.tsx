import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getQueues } from "../services/queues.services";
import type { GetQueues } from "../services/queues.types";

export const useGetQueues = () => {
  const queryClient = useQueryClient();

  const { data, error, isFetching, isPending, isLoading } = useQuery({
    queryKey: ["queues"],
    queryFn: getQueues,
  });

  const refetchQueues = () => {
    queryClient.refetchQueries({ queryKey: ["queues"] });
  };

  return {
    data: data as GetQueues,
    error,
    isFetching,
    isPending,
    isLoading,
    refetchQueues,
  };
};
