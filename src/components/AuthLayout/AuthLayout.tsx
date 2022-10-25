import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import "./Authlayout.scss";

function AuthLayout() {
  let { t } = useTranslation();
  return (
    <div className="h-screen authLayout">
      <Link to={"/"} className="no-underline fixed ml-12 mt-5">
        <Button className="text-white" variant="outlined" type="button">
          {t("home")}
        </Button>
      </Link>
      <div className="flex justify-center items-center h-full">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
