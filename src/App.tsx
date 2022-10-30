import { useState, useMemo, createContext } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import AdminLayout from "./adminComponents/AdminLayout/AdminLayout";
import User from "./pages/User/User";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AuthLayout from "./components/AuthLayout/AuthLayout";
import AdminSignIn from "./pages/AdminSignIn/AdminSignIn";
import Collection from "./pages/Collection/Collection";
import Item from "./pages/Item/Item";
import AdminCollection from "./pages/AdminTopic/AdminTopic";
import ViewCollection from "./pages/ViewCollection/ViewCollection";
import ViewItem from "./pages/ViewItem/ViewItem";
import Home from "./pages/Home/Home";
import Personal from "./pages/Personal/Personal";
import CollectionItemTable from "./pages/CollectionItemTable/CollectionItemTable";
import { Box } from "@mui/material";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        typography: {
          button: {
            textTransform: "capitalize",
          },
        },
      }),
    [mode]
  );
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  return (
    <Box id="app">
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="item" element={<Item />} />
              <Route path="item-view/:id" element={<ViewItem />} />
              <Route path="collection" element={<Collection />} />
              <Route path="collection-view/:id" element={<ViewCollection />} />
              <Route
                path="collection-item-table/:id"
                element={<CollectionItemTable />}
              />
              <Route path="personal" element={<Personal />} />
              <Route path="*" element={<div>Not fo und</div>} />
            </Route>
            <Route path="/sign" element={<AuthLayout />}>
              <Route path="in" element={<SignIn />} />
              <Route path="up" element={<SignUp />} />
              <Route path="in/admin" element={<AdminSignIn />} />
            </Route>

            <Route path="/admin" element={<AdminLayout />}>
              <Route path="user" element={<User />} />
              <Route path="topic" element={<AdminCollection />} />
              <Route path="*" element={<div>Not found</div>} />
            </Route>
          </Routes>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </Box>
  );
}

export default App;
