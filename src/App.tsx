import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import AdminPanel from "./pages/AdminPanel/AdminPanel";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div>salom</div>} />
        </Route>
        <Route path="/login" element={<div>salom</div>} />
        <Route path="/sign-up" element={<div>salom</div>} />
        <Route path="/admin">
          <Route index element={<AdminPanel />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
