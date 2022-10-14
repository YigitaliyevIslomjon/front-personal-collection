import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./slice/searchSlice";

const store = configureStore({
  reducer: {
    search: searchReducer,
  },
});

export default store;
