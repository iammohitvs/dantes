import React from "react";
import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div className="bg-black text-white">
      <Outlet />
    </div>
  );
};

export default RootLayout;
