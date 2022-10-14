import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

function Layout() {
  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <Navbar />
      <Box className="py-5 px-12">
        <Box className="">
          <Outlet />
        </Box>
      </Box>
      {/* <Footer /> */}
    </Box>
  );
}

export default Layout;
