import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const MainLayout = () => {
  return (
    <>
      {/* <Navbar /> */}
      <div className="bg-background text-foreground">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
