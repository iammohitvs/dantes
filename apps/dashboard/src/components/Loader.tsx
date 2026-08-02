import React from "react";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type LoaderProps = { type?: "full" | "scoped"; loadingText?: string };

const Loader = ({
  type = "scoped",
  loadingText = "Loading...",
}: LoaderProps) => {
  return (
    <div
      className={
        type === "full"
          ? "w-full h-screen flex flex-col gap-2 justify-center items-center"
          : "h-full w-full flex flex-col gap-2 justify-center items-center"
      }
    >
      <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
      <p className="text-muted-foreground">{loadingText}</p>
    </div>
  );
};

export default Loader;
