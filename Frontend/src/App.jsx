// frontend/src/App.jsx
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Friends from "./pages/Friends";
import FriendProfile from "./pages/FriendProfile";
import Feed from "./pages/Feed"; // ✅ ADD THIS

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* PROTECTED */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* FEED (same as Dashboard for now) */}
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        {/* FRIEND SYSTEM */}
        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <Friends />
            </ProtectedRoute>
          }
        />

        <Route
          path="/friend/:id"
          element={
            <ProtectedRoute>
              <FriendProfile />
            </ProtectedRoute>
          }
        />
        <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <Feed/>
          </ProtectedRoute>
        }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
