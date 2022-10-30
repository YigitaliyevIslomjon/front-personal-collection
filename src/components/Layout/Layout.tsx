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
        className="px-14 py-7 sm:py-7 md:py-9"
        sx={{ bgcolor: "background.default", color: "text.primary" }}
      >
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
}

export default Layout;
