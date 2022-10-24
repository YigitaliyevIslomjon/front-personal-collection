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
import { Drawer, InputBase, Select } from "@mui/material";
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
import { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "react-i18next";

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
  { title: "home", link: "/" },
  { title: "personal", link: "/personal" },
  { title: "items", link: "/item" },
  { title: "collections", link: "/collection" },
];

const settings = [
  { title: "adminPenel", link: "sign/in/admin" },
  { title: "logout", link: "/" },
];

function Navbar() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();
  let loginUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [userMenuVisible, setUserMenuVisible] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>(
    localStorage.getItem("i18nextLng") || "eng"
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleOpenUserMenu = () => {
    setUserMenuVisible(true);
  };

  const handleCloseUserMenu = (url: string) => {
    setAnchorEl(null);
    if (url === "/") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("admin_token");
      localStorage.removeItem("user");
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
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

  const changeLanguage = (e: SelectChangeEvent) => {
    setLanguage(e.target.value);
    i18n.changeLanguage(e.target.value);
    // console.log("e", e);
  };
  const drawerWidth = 240;

  return (
    <div>
      <AppBar position="fixed" className="px-6">
        <Toolbar className="flex gap-x-1">
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
              onClose={handleDrawerOpen}
            >
              <Box sx={{ width: 250 }}>
                <div className="flex justify-end py-2 px-4">
                  <IconButton onClick={handleDrawerClose}>
                    {mobileOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                  </IconButton>
                </div>
                <Divider />
                <List className="blcok md:hidden">
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
                </List>

                <List>
                  {pages.map((item, index) => (
                    <ListItem key={item.title} disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Link to={item.link} className="no-underline">
                              {t(`${item.title}`)}
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
          {/* <img src={logo} alt="ram" /> */}
          <Box className="hidden md:flex md:gap-x-4">
            {pages.map((page, index) => {
              if (page.title === "personal") {
                if (loginUser.role) {
                  return (
                    <NavLink
                      to={page.link}
                      key={index}
                      className="no-underline"
                    >
                      <Button className="text-base text-white">
                        {t(`${page.title}`)}
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
                      {t(`${page.title}`)}
                    </Button>
                  </NavLink>
                );
              }
            })}
          </Box>
          <Box className="flex items-center ml-auto">
            <Select
              className="text-white"
              sx={{
                ".MuiOutlinedInput-notchedOutline": { border: 0 },
              }}
              size="small"
              value={language}
              onChange={(e) => changeLanguage(e)}
            >
              <MenuItem value={"en"}>en</MenuItem>
              <MenuItem value={"uz"}>uz</MenuItem>
            </Select>
            {Object.keys(loginUser).length === 0 ? (
              <>
                <Link to={"/sign/in"} className="no-underline">
                  <Button
                    className="text-base"
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {t("signin")}
                  </Button>
                </Link>
                <Link to={"/sign/up"} className="no-underline">
                  <Button
                    className="text-base"
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {t("signup")}
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
                placeholder={t("search")}
                inputProps={{ "aria-label": "" }}
              />
            </Search>
            <IconButton
              onClick={colorMode.toggleColorMode}
              color="inherit"
              className="hidden md:block"
            >
              {theme.palette.mode === "dark" ? (
                <LightModeIcon />
              ) : (
                <Brightness3Icon />
              )}
            </IconButton>
            <Typography
              variant="body1"
              className="capitalize mr-1 hidden md:block"
            >
              {loginUser.user_name}
            </Typography>
            <Box className="hidden md:block">
              <Tooltip title="Open settings">
                <IconButton onClick={handleClick} sx={{ p: 0 }}>
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
                open={open}
                onClose={handleCloseUserMenu}
                className="hidden md:block"
                anchorEl={anchorEl}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting.title}
                    onClick={() => handleCloseUserMenu(setting.link)}
                  >
                    <Link className="no-underline" to={setting.link}>
                      {t(`${setting.title}`)}
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
