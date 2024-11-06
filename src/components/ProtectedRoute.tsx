import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { Rootstate } from "../redux/store/store";

// Protected Route for logged-in users
export const UserProtectedRoute = () => {
  const userInfo = useSelector((state: Rootstate) => state.user.userInfo);
  return userInfo ? <Outlet /> : <Navigate to="/login" />;
};

export const PublicUserProtectedRoute = () => {
  const userInfo = useSelector((state: Rootstate) => state.user.userInfo);
  return !userInfo ? <Outlet /> : <Navigate to="/dashboard" />;
};
