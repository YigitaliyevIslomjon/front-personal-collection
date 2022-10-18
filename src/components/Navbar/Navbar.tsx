import { useState, useContext } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Menu from "@mui/material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Drawer, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import { ColorModeContext } from "../../App";
import { useTheme } from "@mui/material/styles";
import Brightness3Icon from "@mui/icons-material/Brightness3";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Link, NavLink } from "react-router-dom";
import api from "../../utils/api";
import { useDispatch } from "react-redux";
import {
  setSearchUrl,
  setSerachCollectionList,
  setSerachCommentList,
  setSerachItemList,
} from "../../store/slice/searchSlice";
import "./Navbar.scss";
import { toastifyMessage } from "../ToastifyNotification/ToastifyNotification";
import { ToastContainer } from "react-toastify";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const pages = [
  { title: "Home", link: "/" },
  { title: "Personal", link: "/personal" },
  { title: "Items", link: "/item" },
  { title: "Collections", link: "/collection" },
];

const settings = [
  { title: "Admin panel", link: "sign/in/admin" },
  { title: "Logout", link: "/" },
];

function Navbar() {
  const colorMode = useContext(ColorModeContext);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [userMenuVisible, setUserMenuVisible] = useState<boolean>(false);
  const dispatch = useDispatch();
  const theme = useTheme();
  let loginUser = JSON.parse(localStorage.getItem("user") || "{}");

  const handleOpenUserMenu = () => {
    setUserMenuVisible(true);
  };
  const handleCloseUserMenu = (url: string) => {
    setUserMenuVisible(false);
    if (url === "/") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("admin_token");
      localStorage.removeItem("user");
    }
  };

  const handleDrawerOpen = () => {
    setMobileOpen(true);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const fullTextSearch = (e: string) => {
    api
      .post("search", { search: e, url: window.location.pathname })
      .then((res) => {
        dispatch(setSearchUrl(res.data.searchUrl));
        dispatch(
          setSerachCollectionList(
            res.data.collection.map((item: any, index: any) => ({
              collection_name: item.collection_name,
              user_name: item.user_id?.user_name,
              id: item._id,
              path: item.path,
              item_count: item.item_count,
              topic_name: item.topic_id?.topic_name,
            }))
          )
        );
        dispatch(
          setSerachItemList(
            res.data.item.map((item: any) => ({
              item_name: item.item_name,
              collection_name: item.collection_id?.collection_name,
              user_name: item.user_id?.user_name,
              id: item._id,
              path: item.path,
              tags: item.tags.map((item: any) => item.tag_name),
            }))
          )
        );
        dispatch(
          setSerachCommentList(
            res.data.comment.map((item: any) => ({
              item_name: item.item_id.item_name,
              item_id: item.item_id?._id,
              text: item.text,
              user_name: item.user_id?.user_name,
            }))
          )
        );
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      })
      .finally(() => {});
  };

  const drawerWidth = 240;

  return (
    <div>
      <AppBar position="fixed" className="px-6">
        <Toolbar className="flex gap-x-1">
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton size="large" onClick={handleDrawerOpen} color="inherit">
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor={"left"}
              sx={{
                display: { xs: "block", sm: "none" },
                "& .MuiDrawer-paper": {
                  width: drawerWidth,
                },
              }}
              open={mobileOpen}
              onClose={handleDrawerOpen}
            >
              <Box sx={{ width: 250 }} role="presentation">
                <div className="flex justify-end py-2 px-4">
                  <IconButton onClick={handleDrawerClose}>
                    {mobileOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                  </IconButton>
                </div>
                <Divider />
                <List>
                  {pages.map((item, index) => (
                    <ListItem key={item.title} disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                        </ListItemIcon>
                        <ListItemText primary={item.title} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </Box>
          {/* <img src={logo} alt="ram" /> */}
          <Box className="xs:hidden md:flex gap-x-4">
            {pages.map((page, index) => {
              if (page.title === "Personal") {
                if (loginUser.role) {
                  return (
                    <NavLink
                      to={page.link}
                      key={index}
                      className="no-underline"
                    >
                      <Button className="text-base text-white">
                        {page.title}
                      </Button>
                    </NavLink>
                  );
                } else {
                  return null;
                }
              } else {
                return (
                  <NavLink to={page.link} key={index} className="no-underline">
                    <Button className="text-base text-white">
                      {page.title}
                    </Button>
                  </NavLink>
                );
              }
            })}
          </Box>
          <Box className="flex items-center ml-auto">
            {Object.keys(loginUser).length === 0 ? (
              <>
                <Link to={"/sign/in"} className="no-underline">
                  <Button
                    className="text-base"
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    Sign in
                  </Button>
                </Link>
                <Link to={"/sign/up"} className="no-underline">
                  <Button
                    className="text-base"
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : null}

            <Search className="mr-2">
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                onChange={(e) => {
                  fullTextSearch(e.target.value);
                }}
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
            <IconButton onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === "dark" ? (
                <LightModeIcon />
              ) : (
                <Brightness3Icon />
              )}
            </IconButton>
            <Typography variant="body1" className="capitalize mr-1">
              {loginUser.user_name}
            </Typography>
            <Box>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    className="capitalize"
                    alt={loginUser.user_name}
                    src="/static/images/avatar/2.jpg"
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={userMenuVisible}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting.title}
                    onClick={() => handleCloseUserMenu(setting.link)}
                  >
                    <Link className="no-underline" to={setting.link}>
                      {setting.title}
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <ToastContainer />
    </div>
  );
}

export default Navbar;
