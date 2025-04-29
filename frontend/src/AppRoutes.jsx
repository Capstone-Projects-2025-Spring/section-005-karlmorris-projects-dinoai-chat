import { Route, Routes, Navigate } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

function isAuthenticated() {
  return !!localStorage.getItem("token");
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated() ? <Home /> : <Navigate to="/login" replace />
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/chat/:sessionId"
        element={
          isAuthenticated() ? <Home /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/profile"
        element={
          isAuthenticated() ? <Profile /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}
