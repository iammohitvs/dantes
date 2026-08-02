import Loader from "@/components/Loader";
import { AppSidebar } from "@/components/Sidebar";
import { useValidateAuth } from "@/hooks/auth.hooks";
import React, { useState } from "react";
import { Outlet } from "react-router";
import { useNavigate } from "react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const RootLayout = () => {
  const { data, error, isPending } = useValidateAuth();
  const navigate = useNavigate();

  if (isPending) {
    return <Loader type="full" />;
  }

  if (error) {
    navigate("/login");
  }

  if (data) {
    return (
      <section id="home" className="">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="p-8">
              <Outlet />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </section>
    );
  }
};

export default RootLayout;
