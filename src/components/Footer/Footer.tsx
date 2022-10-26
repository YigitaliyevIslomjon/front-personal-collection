import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Typography } from "@mui/material";
export const pages = [
  { title: "home", link: "/" },
  { title: "personal", link: "/personal" },
  { title: "items", link: "/item" },
  { title: "collections", link: "/collection" },
];

function Footer() {
  const { t } = useTranslation();
  let loginUser = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <Box className="mt-auto">
      <AppBar
        position="static"
        sx={{ bgcolor: "", color: "text.primary" }}
        className="px-6 py-7 sm:px-3 md:px-7 md:py-7"
      >
        <Toolbar className="flex gap-x-1">
          <Grid container spacing={5}>
            <Grid
              xs={12}
              sm={12}
              md={4}
              className="flex flex-col gap-y-2 justify-center"
            >
              <Typography color="white" variant="h6">
                PERSONAL COLLECTION
              </Typography>
              <Typography color="white" variant="body2">
                Personal Collection is a direct selling company that provides
                high quality products and livelihood through its dealership
                network.
              </Typography>
            </Grid>
            <Grid xs={12} sm={12} md={4} className="flex flex-col gap-y-2">
              {pages.map((page, index) => {
                if (page.title === "personal") {
                  if (loginUser.role) {
                    return (
                      <NavLink
                        to={page.link}
                        key={index}
                        className="no-underline"
                      >
                        <Typography
                          color="white"
                          className="capitalize"
                          variant="body2"
                        >
                          {t(`${page.title}`)}
                        </Typography>
                      </NavLink>
                    );
                  } else {
                    return null;
                  }
                } else {
                  return (
                    <NavLink
                      to={page.link}
                      key={index}
                      className="no-underline"
                    >
                      <Typography
                        color="white"
                        className="capitalize"
                        variant="body2"
                      >
                        {t(`${page.title}`)}
                      </Typography>
                    </NavLink>
                  );
                }
              })}
            </Grid>

            <Grid xs={12} sm={12} md={4}>
              <Typography color="white" variant="body2">
                Ground Floor, Triumph Building 1610 Quezon Avenue, Diliman,
                Quezon City, 1104 Metro Manila
              </Typography>
              <Typography color="white" variant="body1">
                (02) 8 376 6888
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Box
        className="px-13 sm:px-7 md:px-14"
        sx={{ bgcolor: "#F3F2EF", fontSize: "10px" }}
      >
        Personal Collection Corporation © 2022
      </Box>
    </Box>
  );
}

export default Footer;
