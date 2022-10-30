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
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import CollectionsIcon from "@mui/icons-material/Collections";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

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
  const getMatchPageIcon = (val: string) => {
    if (val === "personal") {
      return <AccountCircleIcon />;
    } else if (val === "home") {
      return <HomeIcon />;
    } else if (val === "collections") {
      return <CollectionsIcon />;
    } else {
      return <VideoLabelIcon />;
    }
  };
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
            {Object.keys(loginUser).length > 0 ? <>
              <ListItem disablePadding onClick={handleDrawerClose}>
              <ListItemButton>
                <ListItemIcon>
                  <AccountBoxIcon />
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
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding onClick={handleDrawerClose}>
              <ListItemButton>
                <ListItemIcon>
                  <IconButton
                  
                    color="inherit"
                    className="pl-0"
                  >
                    {theme.palette.mode === "dark" ? (
                      <LightModeIcon />
                    ) : (
                      <Brightness3Icon />
                    )}
                  </IconButton>
                </ListItemIcon>
                <ListItemText
                  primary={
                      <Typography
                      onClick={colorMode.toggleColorMode}
                        variant="body1"
                        className="capitalize mr-1"
                        color="textPrimary"
                      >
                        {theme.palette.mode === "dark" ? "lignt" : "dark" }
                      </Typography>
                    
                  }
                />
              </ListItemButton>
            </ListItem>
            </> : null}
      
          
            {pages.map((page, index) => {
              if (page.title === "personal") {
                if (loginUser.role) {
                  return (
                    <ListItem
                      key={page.title}
                      disablePadding
                      onClick={handleDrawerClose}
                    >
                      <ListItemButton>
                        <ListItemIcon>
                          {getMatchPageIcon(page.title)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Link to={page.link} className="no-underline">
                              <Typography
                                variant="body1"
                                className="capitalize"
                                color="textPrimary"
                              >
                                {t(`${page.title}`)}
                              </Typography>
                            </Link>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                } else {
                  return null;
                }
              } else {
                return (
                  <ListItem
                    key={page.title}
                    disablePadding
                    onClick={handleDrawerClose}
                  >
                    <ListItemButton>
                      <ListItemIcon>
                        {getMatchPageIcon(page.title)}{" "}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Link to={page.link} className="no-underline">
                            <Typography
                              variant="body1"
                              className="capitalize"
                              color="textPrimary"
                            >
                              {t(`${page.title}`)}
                            </Typography>
                          </Link>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                );
              }
            })}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}

export default MobileMenu;
