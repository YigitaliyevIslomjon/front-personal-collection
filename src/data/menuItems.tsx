import Menu from "@mui/material/Menu";
import { FunctionComponent, lazy } from "react";

const Home = lazy(() => import("../pages/Home/Home"));
const Layout = lazy(() => import("../components/Layout/Layout"));
const SignIn = lazy(() => import("../pages/SignIn/SignIn"));
const SignUp = lazy(() => import("../pages/SignUp/SignUp"));
const AdminLayout = lazy(() => import("../components/AdminLayout/AdminLayout"));
const User = lazy(() => import("../pages/User/User"));
const AuthLayout = lazy(() => import("../components/AuthLayout/AuthLayout"));
const AdminSignIn = lazy(() => import("../pages/AdminSignIn/AdminSignIn"));
const Item = lazy(() => import("../pages/Item/Item"));
const Collection = lazy(() => import("../pages/Collection/Collection"));
const AdminCollection = lazy(() => import("../pages/AdminTopic/AdminTopic"));
const ViewCollection = lazy(
  () => import("../pages/ViewCollection/ViewCollection")
);
const ViewItem = lazy(() => import("../pages/ViewItem/ViewItem"));
const Personal = lazy(() => import("../pages/Personal/Personal"));
const CollectionItemTable = lazy(
  () => import("../pages/CollectionItemTable/CollectionItemTable")
);

export interface MenuItem {
  id: string;
  path: string;
  Element: FunctionComponent<any>;
  name: string;
  children: {
    id: string;
    path: string;
    Element: FunctionComponent<any>;
    name: string;
  }[];
}

export const menuItems: MenuItem[] = [
  {
    id: "1",
    path: "/",
    Element: Layout,
    name: "Layout",
    children: [
      {
        id: "2",
        path: "/",
        Element: Home,
        name: "Home",
      },
      {
        id: "3",
        path: "item",
        Element: Item,
        name: "Item",
      },
      {
        id: "4",
        path: "item-view/:id",
        Element: ViewItem,
        name: "ViewItem",
      },
      {
        id: "5",
        path: "collection",
        Element: Collection,
        name: "Collection",
      },
      {
        id: "6",
        path: "collection-view/:id",
        Element: ViewCollection,
        name: "ViewCollection",
      },
      {
        id: "7",
        path: "collection-item-table/:id",
        Element: CollectionItemTable,
        name: "CollectionItemTable",
      },
      {
        id: "8",
        path: "personal",
        Element: Personal,
        name: "Personal",
      },
      {
        id: "9",
        path: "*",
        Element: Home,
        name: "notFound",
      },
    ],
  },
  {
    id: "10",
    path: "/sign",
    Element: AuthLayout,
    name: "AuthLayout",

    children: [
      {
        id: "11",
        path: "in",
        Element: SignIn,
        name: "SignIn",
      },
      {
        id: "12",
        path: "up",
        Element: SignUp,
        name: "SignUp",
      },
      {
        id: "13",
        path: "in/admin",
        Element: AdminSignIn,
        name: "AdminSignIn",
      },
    ],
  },
  {
    id: "14",
    path: "/admin",
    Element: AdminLayout,
    name: "AdminLayout",

    children: [
      {
        id: "15",
        path: "user",
        Element: User,
        name: "User",
      },
      {
        id: "16",
        path: "topic",
        Element: AdminCollection,
        name: "AdminCollection",
      },
    ],
  },
];
