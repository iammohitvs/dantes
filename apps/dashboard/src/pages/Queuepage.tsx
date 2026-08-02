import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useGetQueues } from "@/hooks/queues.hooks";
import { CopyLinkIcon, Refresh04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import copy from "copy-to-clipboard";
import { toast } from "@/components/ui/toast";

const Queuepage = () => {
  const { data: queues, isFetching, refetchQueues } = useGetQueues();

  if (isFetching) return <Loader type="full" loadingText="Loading Queues..." />;

  return (
    <section id="queues">
      <div className="flex flex-row justify-between mb-4">
        <h1 className="text-3xl font-semibold tracking-wide">
          All Queues ({queues.queuesCount})
        </h1>
        <Button
          size="lg"
          variant="secondary"
          onClick={() => refetchQueues()}
          className="hover:cursor-pointer"
        >
          <HugeiconsIcon icon={Refresh04Icon} /> Refetch All Queues
        </Button>
      </div>

      {queues.queues.map((queue) => (
        <Card key={queue.id}>
          <CardTitle className="px-4">Queue Details</CardTitle>

          <Separator />

          <CardContent className="flex flex-col gap-3">
            <Badge variant="outline">{queue.id}</Badge>

            <p>
              Queue Name:{" "}
              <span className="text-primary font-bold tracking-wide">
                {queue.name}
              </span>
            </p>

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

            <p>
              Response Wait Time:{" "}
              <span className="text-primary font-bold tracking-wide">
                {queue.responseWaitTimeMs} ms
              </span>
            </p>

            <p>
              Retry Count:{" "}
              <span className="tracking-wide">{queue.retryCount}</span>
            </p>
          </CardContent>
          
          <Separator />

          <CardContent className="flex flex-col gap-3">
            <p>
              Created At:{" "}
              <span className="text-muted-foreground">
                {queue.createdAt.toLocaleString()}
              </span>
            </p>

            <p>
              Updated At:{" "}
              <span className="text-muted-foreground">
                {queue.updatedAt.toLocaleString()}
              </span>
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};

export default Queuepage;
