import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import AdminLayout from "./adminComponents/AdminLayout/AdminLayout";
import User from "./pages/User/User";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div>salom</div>} />
        </Route>
        <Route path="/login" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<User />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
