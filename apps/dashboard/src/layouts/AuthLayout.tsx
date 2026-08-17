import Loader from "@/components/Loader";
import { useValidateAuth } from "@/hooks/auth.hooks";
import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router";

const AuthLayout = () => {
  const { data, error, isPending } = useValidateAuth();
  const navigate = useNavigate();

  if (isPending) {
    return <Loader type="full" />;
  }

  if (!error) {
    return <Navigate to={"/"} replace />;
  }
  return <Outlet />;
};

export default AuthLayout;
