import React from "react";
import { useGetJobs } from "../hooks/jobs.hooks";
import { useValidationLoop } from "@/hooks/auth.hooks";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { LinkSquare02Icon, CopyLinkIcon } from "@hugeicons/core-free-icons";
import { NavLink } from "react-router";
import { Separator } from "@/components/ui/separator";
import copy from "copy-to-clipboard";
import { toast } from "@/components/ui/toast";

const Homepage = () => {
  useValidationLoop();
  const { data: jobs, isFetching } = useGetJobs();

  if (isFetching) return null;

  return (
    <section id="jobs" className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold tracking-wide">All Jobs</h1>

      <div className="flex flex-col gap-4">
        {jobs.jobs.map(({ job, queue }) => (
          <Card key={job.id}>
            <CardContent className="flex flex-col gap-3">
              <CardTitle>Job Details</CardTitle>
              <div className="flex flex-row gap-3">
                <Badge variant="outline">{job.id}</Badge>

                <Badge variant="default">{job.type}</Badge>

                <Badge variant="outline">{job.status}</Badge>

                <NavLink to={`/job/${job.id}`} className="ml-auto">
                  <Button variant="link" className="hover:cursor-pointer">
                    Visit Job <HugeiconsIcon icon={LinkSquare02Icon} />
                  </Button>
                </NavLink>
              </div>

              <div className="grid grid-cols-2 grid-rows-2 gap-x-4">
                {job.payload ? (
                  <div className="row-span-2 col-span-1">
                    <p className="mb-3">Payload: </p>
                    <Textarea
                      id="textarea-disabled"
                      placeholder="Type your message here."
                      disabled
                      className="font-mono"
                    >
                      {job.payload}
                    </Textarea>
                  </div>
                ) : (
                  <div className="row-span-2 col-span-1" />
                )}

                <div>
                  {job.currentRetryCount ? (
                    <div className="row-span-2 col-span-1">
                      Current Retry Count: {job.currentRetryCount}
                    </div>
                  ) : (
                    <div className="row-span-2 col-span-1" />
                  )}

                  {job.cronExpression ? (
                    <div className="row-span-2 col-span-1">
                      CRON Expression: {job.cronExpression}
                    </div>
                  ) : (
                    <div className="row-span-2 col-span-1" />
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {job.nextExecution ? (
                <p>
                  Next Execution:{" "}
                  <span className="text-muted-foreground">
                    {job.nextExecution.toLocaleString()}
                  </span>
                </p>
              ) : (
                <div />
              )}
              {job.lastExecution ? (
                <p className="ml-auto">
                  Last Executed:{" "}
                  <span className="text-muted-foreground">
                    {job.lastExecution
                      ? job.lastExecution.toLocaleString()
                      : ""}
                  </span>
                </p>
              ) : (
                <div className="ml-auto" />
              )}
            </CardFooter>

            <Separator />

            <CardContent className="flex flex-col gap-3">
              <CardTitle>Queue Details</CardTitle>
              <div className="flex flex-row gap-2">
                Queue ID: <Badge variant="outline">{queue.id}</Badge>
              </div>
              <div className="flex flex-row gap-2">
                Queue Name:{" "}
                <p className="text-primary font-bold tracking-wide">
                  {queue.name}
                </p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                Queue Callback URL:{" "}
                <p className="font-mono font-extralight tracking-wide">
                  {queue.callbackUrl}
                </p>
                <Button
                  variant="outline"
                  onClick={async () => {
                    await copy(queue.callbackUrl);
                    toast.add({ title: "callback URL copied to clipboard" });
                  }}
                >
                  <HugeiconsIcon icon={CopyLinkIcon} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Homepage;
