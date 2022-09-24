import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import AdminLayout from "./adminComponents/AdminLayout/AdminLayout";
import User from "./pages/User/User";

function App() {
  const [authenticated, setAuthenticated] = useState<string | null>(
    localStorage.getItem("access_token")
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (!authenticated) {
      navigate("/sign-in");
    }
  }, []);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div>salom</div>} />
        </Route>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<User />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
