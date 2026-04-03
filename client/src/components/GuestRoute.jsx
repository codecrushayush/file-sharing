import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { PageSpinner } from "./PageSpinner.jsx";

export function GuestRoute() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <PageSpinner label="Loading session…" />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
