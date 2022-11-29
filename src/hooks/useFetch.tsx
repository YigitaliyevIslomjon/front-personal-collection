import React, { useState } from "react";
import api from "../utils/api";
import axios, { AxiosResponse, AxiosError } from "axios";

type Methods = "head" | "options" | "put" | "post" | "patch" | "delete" | "get";

function useFetch<T>(method: Methods, url: string, body: any) {
  const [data, setData] = useState<T>(null as T);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  api[method]<T>(url, body)
    .then((res) => {
      setLoading(true);
      setData(res.data);
    })
    .catch((err) => {
      // check if the error was thrown from axios
      let message;
      if (axios.isAxiosError(error)) {
        console.log("err", err.reponse.data.error);
        message = err.reponse.data.error
      } else {
        console.log("err", err);
        message = error
      }
      setError(message)
    })
    .finally(() => {
      setLoading(false);
    });

  return [data, setData, loading, error];
}

export default useFetch;
