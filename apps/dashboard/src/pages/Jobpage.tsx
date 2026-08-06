import Loader from "@/components/Loader";
import { useGetJob } from "@/hooks/jobs.hooks";
import React from "react";
import { NavLink, useParams } from "react-router";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft01Icon, Refresh04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type JobPageParams = {
  jobId: string;
};

const Jobpage = () => {
  const params = useParams<JobPageParams>();

  const { data: job, isFetching, refetchJob } = useGetJob(params.jobId!);

  if (isFetching) return <Loader loadingText="Loading job..." type="full" />;

  return (
    <section id="job" className="grid place-content-center">
      <div className="mb-4 flex flex-row justify-between">
        <NavLink to="/">
          <Button variant="outline" size="lg" className="hover:cursor-pointer">
            <HugeiconsIcon icon={ArrowLeft01Icon} /> Go Back
          </Button>
        </NavLink>

        <Button
          variant="outline"
          size="lg"
          className="hover:cursor-pointer"
          onClick={() => refetchJob()}
        >
          <HugeiconsIcon icon={Refresh04Icon} /> Refresh Job
        </Button>
      </div>

      <Card className="min-w-5xl max-w-5xl">
        <CardContent>
          <Table>
            <TableCaption>Job ID: {params.jobId}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="">Key</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Job Type</TableCell>
                <TableCell className="text-right">
                  {job.job.job.type ? job.job.job.type : ""}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Job Status</TableCell>
                <TableCell className="text-right">
                  {job.job.job.status ? job.job.job.status : ""}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Job Payload</TableCell>
                <TableCell className="text-right">
                  <Textarea className="font-mono" disabled>
                    {job.job.job.payload}
                  </Textarea>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  CRON EXPRESSION (ONLY FOR CRON JOBS)
                </TableCell>
                <TableCell className="text-right">
                  {job.job.job.cronExpression ? job.job.job.cronExpression : ""}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Current Retry Count
                </TableCell>
                <TableCell className="text-right">
                  {job.job.job.currentRetryCount
                    ? job.job.job.currentRetryCount
                    : ""}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Next Execution</TableCell>
                <TableCell className="text-right">
                  {job.job.job.nextExecution
                    ? job.job.job.nextExecution.toLocaleString()
                    : ""}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Last Execution</TableCell>
                <TableCell className="text-right">
                  {job.job.job.lastExecution
                    ? job.job.job.lastExecution.toLocaleString()
                    : ""}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Created On</TableCell>
                <TableCell className="text-right">
                  {job.job.job.createdAt
                    ? job.job.job.createdAt.toLocaleString()
                    : ""}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Updated On</TableCell>
                <TableCell className="text-right">
                  {job.job.job.updatedAt
                    ? job.job.job.updatedAt.toLocaleString()
                    : ""}
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter></TableFooter>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
};

export default Jobpage;
