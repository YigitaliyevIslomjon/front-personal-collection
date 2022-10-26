import React, { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { People } from "@mui/icons-material";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";

function AdminLayout() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const isAdmin =
    JSON.parse(localStorage.getItem("user") || "{}").role === "admin";

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };
  const logoutUser = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const drawerWidth = 240;
  const drawer = (
    <div id="menu">
      <Toolbar>
        <IconButton />
      </Toolbar>
      <Divider />
      <List>
        {[
          { title: "Users", icon: <People />, link: "user" },
          { title: "Collection", icon: <People />, link: "collection" },
        ].map((text, index) => (
          <NavLink className="no-underline" key={index} to={text.link}>
            <ListItem key={text.title} disablePadding>
              <ListItemButton>
                <ListItemIcon>{text.icon}</ListItemIcon>
                <ListItemText primary={text.title} />
              </ListItemButton>
            </ListItem>
          </NavLink>
        ))}
      </List>
    </div>
  );

  useEffect(() => {
    if (!(token && isAdmin)) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Box
      className="flex"
      sx={{ bgcolor: "background.default", color: "text.primary" }}
    >
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar className="flex gap-x-2">
          <Link to="/" className="no-underline">
            <Button className="text-base" sx={{ color: "white" }}>
              home
            </Button>
          </Link>

          <Typography variant="body1" className="ml-auto">
            {JSON.parse(localStorage.getItem("user") || "{}").user_name}
          </Typography>
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar alt="" src="/static/images/avatar/2.jpg" />
          </IconButton>
          <Menu
            sx={{ mt: "45px" }}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={open}
            onClose={handleUserMenuClose}
            anchorEl={anchorEl}
          >
            <MenuItem onClick={logoutUser}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },

          flexShrink: { sm: 0 },
        }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 3 },
          mt: { xs: 7 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default AdminLayout;
