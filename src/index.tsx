import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StyledEngineProvider } from "@mui/material";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/store";
import "react-toastify/dist/ReactToastify.css";
import "./index.scss";
import "./i18n";
import "sweetalert2/src/sweetalert2.scss";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
let fallback = (
  <div className="flex items-center justify-center h-screen">
    <CircularProgress />
  </div>
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <BrowserRouter>
          <Suspense fallback={fallback}>
            <GoogleOAuthProvider
              clientId={process.env.REACT_APP_GOOGLE_ID || ""}
            >
              <App />
            </GoogleOAuthProvider>
          </Suspense>
        </BrowserRouter>
      </StyledEngineProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
