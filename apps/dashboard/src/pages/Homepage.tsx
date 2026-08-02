import React from "react";
import { useGetJobs } from "../hooks/jobs.hooks";
import { useValidationLoop } from "@/hooks/auth.hooks";

const Homepage = () => {
  useValidationLoop();
  const { data: jobs, isFetching } = useGetJobs();

  if (isFetching) return null;

  return (
    <div>
      {jobs.jobs.map(({ job, queue }) => (
        <div>
          <p>{job.id}</p>
          <p>{job.payload}</p>
        </div>
      ))}
    </div>
  );
};

export default Homepage;
