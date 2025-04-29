import { Navigate, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Vocab from './pages/Vocabulary';

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
      <Route
        path="/vocabulary"
        element={
          isAuthenticated() ? <Vocab /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}