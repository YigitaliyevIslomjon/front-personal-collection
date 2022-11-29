import { useState, useMemo, createContext } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Root from "./route/Root";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const queryClient = new QueryClient();

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
      <QueryClientProvider client={queryClient}>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <Root />
          </ThemeProvider>
        </ColorModeContext.Provider>
      </QueryClientProvider>
    </Box>
  );
}

export default App;
