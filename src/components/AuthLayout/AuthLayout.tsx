import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Button } from "@mui/material";

import "./AuthLayout.scss";

function AuthLayout() {
  return (
    <div className="h-screen authLayout">
      <Link to={"/"} className="no-underline fixed ml-12 mt-5">
        <Button className="text-white" variant="outlined" type="button">
          Home
        </Button>
      </Link>
      <div className="flex justify-center items-center h-full">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
