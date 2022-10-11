import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Button } from "@mui/material";

import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import "./AuthLayout.scss";

function AuthLayout() {
  const [age, setAge] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <Box sx={{ flexGrow: 1 }} className="h-screen authLayout">
      <AppBar position="fixed">
        <Toolbar className="flex justify-between">
          <Link to={"/"} className="no-underline">
            <Button
              className="menu"
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Home
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
      <div className="flex justify-center items-center h-full">
        <Outlet />
      </div>
    </Box>
  );
}

export default AuthLayout;
