import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

function Layout() {
  return (
    <Box
      sx={{ bgcolor: "background.default", color: "text.primary" }}
      className="flex flex-col"
    >
      <Navbar />
      <Container
        maxWidth="xl"
        className="px-14"
        // className="px-10 py-7 sm:px-10 sm:py-7 md:px-14 md:py-9"
      >
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
}

export default Layout;
