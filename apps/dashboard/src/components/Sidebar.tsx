import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import Logout from "./Logout";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Core",
      url: "#",
      items: [
        {
          title: "Jobs",
          url: "/",
        },
        {
          title: "Queues",
          url: "/queues",
        },
      ],
    },
    {
      title: "Docs",
      items: [
        {
          title: "GitHub",
          url: "https://github.com/iammohitvs/dantes/",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="text-3xl font-light tracking-wider font-mono mx-1 mt-1 p-1  rounded-md">
          <a href="/">Dantes 🧭</a>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col">
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {/* @ts-ignore */}
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <div className="flex-1" />
        <Logout />
      </SidebarContent>
    </Sidebar>
  );
}
