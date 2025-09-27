// route-guards.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function PrivateRoute() {
  const { loggedIn } = useAuth();
  return loggedIn ? <Outlet /> : <Navigate to="/signin" replace />;
}

export function PublicOnly() {
  const { loggedIn } = useAuth();
  return loggedIn ? <Navigate to="/vps" replace /> : <Outlet />;
}
