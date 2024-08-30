// Root.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import LoginForm from "./components/LoginForm/LoginForm";
import Dashboard from "./components/Dashboard/Dashboard";
import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute";
import Logout from "./components/Logout/Logout";

function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        {/* <ProtectedRoute path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Root;
