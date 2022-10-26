import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Drawer,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import Brightness3Icon from "@mui/icons-material/Brightness3";
import LightModeIcon from "@mui/icons-material/LightMode";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Search, SearchIconWrapper, StyledInputBase } from "./Style";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "../../App";
import { pages } from "./Navbar";

type MobileMenuType = {
  fullTextSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
function MobileMenu({ fullTextSearch }: MobileMenuType) {
  const { t } = useTranslation();
  let loginUser = JSON.parse(localStorage.getItem("user") || "{}");
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const handleDrawerOpen = () => {
    setMobileOpen(true);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const drawerWidth = 240;

  return (
    <Box className="flex md:hidden">
      <IconButton size="large" onClick={handleDrawerOpen} color="inherit">
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor={"left"}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
        className="block md:hidden"
        open={mobileOpen}
        onClose={handleDrawerClose}
      >
        <Box sx={{ width: 250 }}>
          <div className="flex justify-end py-2 px-4">
            <IconButton onClick={handleDrawerClose}>
              {mobileOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              onChange={fullTextSearch}
              placeholder={t("search")}
              inputProps={{ "aria-label": "" }}
            />
          </Search>
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <MailIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box className="flex gap-x-2 items-center">
                      <Typography
                        variant="body1"
                        className="capitalize mr-1"
                        color="textPrimary"
                      >
                        {loginUser.user_name}
                      </Typography>
                      <IconButton
                        onClick={colorMode.toggleColorMode}
                        color="inherit"
                      >
                        {theme.palette.mode === "dark" ? (
                          <LightModeIcon />
                        ) : (
                          <Brightness3Icon />
                        )}
                      </IconButton>
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
            {pages.map((item, index) => (
              <ListItem key={item.title} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Link to={item.link} className="no-underline">
                        <Typography
                          variant="body1"
                          className="capitalize"
                          color="textPrimary"
                        >
                          {t(`${item.title}`)}
                        </Typography>
                      </Link>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}

export default MobileMenu;
