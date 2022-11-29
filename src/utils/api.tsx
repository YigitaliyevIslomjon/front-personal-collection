import axios from "axios";
import { toastifyMessage } from "../components/ToastifyNotification/ToastifyNotification";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_URL_LOCAL
      : process.env.REACT_APP_URL,
});

// Add a request interceptor
api.interceptors.request.use(
  async (config) => {
    // Do something before request is sent
    let access_token = localStorage.getItem("access_token");
    config.headers = {
      authorization: `Bearer ${access_token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
// Add a response interceptor
api.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    if (error.response.status !== 401) {
      toastifyMessage({ type: "error", message: error.response.data.error });
    } else {
      toastifyMessage({ type: "error", message: "unAthenticated" });
    }

    return Promise.reject(error);
  }
);

export default api;
