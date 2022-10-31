import { useState, useContext } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Menu,
  Container,
  Select,
} from "@mui/material";
import { googleLogout } from "@react-oauth/google";
import SearchIcon from "@mui/icons-material/Search";
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
import { Search, SearchIconWrapper, StyledInputBase } from "./Style";
import MobileMenu from "./MobileMenu";

export const pages = [
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

  const [language, setLanguage] = useState<string>(
    localStorage.getItem("i18nextLng") || "en-US"
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleCloseUserMenu = (url: string) => {
    setAnchorEl(null);
    if (url === "/") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      googleLogout();
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const fullTextSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    api
      .post("search", {
        search: event.target.value,
        url: window.location.pathname,
      })
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
              created_at: item.created_at,
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
              created_at: item.created_at,
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
              created_at: item.created_at,
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
  };

  return (
    <Box>
      <AppBar
        position="fixed"
        // className="px-3 sm:px-3 md:px-7"
      >
        <Container maxWidth="xl">
          <Toolbar className="flex gap-x-1">
            <MobileMenu fullTextSearch={fullTextSearch} />
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
                <MenuItem value={"en-US"}>en</MenuItem>
                <MenuItem value={"uz"}>uz</MenuItem>
              </Select>
              {Object.keys(loginUser).length === 0 ? (
                <>
                  <Link to={"/sign/in"} className="no-underline">
                    <Button
                      className="text-sm sm:text-base"
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      {t("signin")}
                    </Button>
                  </Link>
                  <Link to={"/sign/up"} className="no-underline">
                    <Button
                      className="text-sm sm:text-base"
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      {t("signup")}
                    </Button>
                  </Link>
                </>
              ) : null}

              <Search className="mr-2 hidden md:block">
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  onChange={fullTextSearch}
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
              <Box>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleClick} sx={{ p: 0 }}>
                    <Avatar
                      className="uppercase"
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
                  anchorEl={anchorEl}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting.title}
                      onClick={() => handleCloseUserMenu(setting.link)}
                    >
                      <Link className="no-underline" to={setting.link}>
                        <Typography
                          variant="body1"
                          color="textPrimary"
                          className="first-letter:uppercase"
                        >
                          {t(`${setting.title}`)}
                        </Typography>
                      </Link>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar />

      <ToastContainer />
    </Box>
  );
}

export default Navbar;
