// ProtectedRoute.tsx
import React from "react";
import { Route, Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  path: string;
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  path,
  element,
}) => {
  const isAuthenticated = localStorage.getItem("authToken");

  return isAuthenticated ? (
    <Route path={path} element={element} />
  ) : (
    <Navigate to="/" replace={true} />
  );
};

export default ProtectedRoute;
