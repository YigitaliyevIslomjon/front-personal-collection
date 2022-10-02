import React, { useEffect, useState, useMemo, createContext } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import AdminLayout from "./adminComponents/AdminLayout/AdminLayout";
import User from "./pages/User/User";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AuthLayout from "./components/AuthLayout/AuthLayout";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (!localStorage.getItem("access_token")) {
  //     navigate("/sign-in");
  //   } else {
  //     navigate("/");
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  const [mode, setMode] = useState<"light" | "dark">("light");
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        components: {
          MuiInputLabel: {
            defaultProps: {
              sx: {
                fontSize: "15px",
              },
            },
          },
          MuiOutlinedInput: {
            defaultProps: {
              sx: {
                fontSize: "15px",
              },
            },
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
    <div className="App">
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<div>salom</div>} />
              <Route path="*" element={<div>Not fo und</div>} />
            </Route>
            <Route path="/sign" element={<AuthLayout />}>
              <Route path="in" element={<SignIn />} />
              <Route path="up" element={<SignUp />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="user" element={<User />} />
              <Route path="*" element={<div>Not found</div>} />
            </Route>
          </Routes>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </div>
  );
}

export default App;
