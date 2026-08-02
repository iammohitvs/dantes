import { login, logout, validateAuth } from "@/services/auth.services";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "@/components/ui/toast";
import { useNavigate } from "react-router";

const TOAST_TIMEOUT = 5 * 1000;

export const useValidateAuth = () => {
  const { data, error, isFetching, isPending, isLoading } = useQuery({
    queryKey: ["validate-auth"],
    queryFn: validateAuth,
    
  });

  return { data: data as true, error, isFetching, isPending, isLoading };
};

export const useLogin = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const clearForm = () => {
    setUsername("");
    setPassword("");
  };

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async () => await login({ username, password }),
    onSuccess: () => {
      toast.add({ title: "login successful", timeout: TOAST_TIMEOUT });
      navigate("/");
    },
    onError: () => {
      toast.add({
        title: "login failed",
        type: "error",
        timeout: TOAST_TIMEOUT,
      });
    },
  });

  return {
    username,
    setUsername,
    password,
    setPassword,
    clearForm,
    loginMutation,
    isPending: loginMutation.isPending,
  };
};

export const useLogout = () => {
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => await logout(),
    onSuccess: () => {
      toast.add({ title: "logout successful", timeout: TOAST_TIMEOUT });
      navigate("/login");
    },
    onError: () => {
      toast.add({
        title: "logout failed",
        type: "error",
        timeout: TOAST_TIMEOUT,
      });
    },
  });

  return {
    logoutMutation,
    isPending: logoutMutation.isPending,
  };
};
