import React from "react";
import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <section id="home" className="">
      <Outlet />
    </section>
  );
};

export default RootLayout;
