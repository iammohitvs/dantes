import { Logout03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";
import { Button } from "./ui/button";
import { useLogout } from "@/hooks/auth.hooks";

const Logout = () => {
  const { logoutMutation, isPending } = useLogout();

  const handleLogout = async () => {
    await logoutMutation.mutate();
  };

  return (
    <Button
      className="m-3 flex flex-row gap-2 hover:cursor-pointer"
      variant="outline"
      disabled={isPending}
      onClick={handleLogout}
    >
      Logout <HugeiconsIcon icon={Logout03Icon} size={24} />
    </Button>
  );
};

export default Logout;
