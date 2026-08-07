import { Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./routes/ProtectedRoute";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

import Login from "./pages/auth/Login";

import Dashboard from "./pages/dashboard/Dashboard";

import Meetings from "./pages/meetings/Meetings";
import MeetingDetails from "./pages/meetings/MeetingDetails";

import Upload from "./pages/upload/Upload";

import Chat from "./pages/chat/Chat";

import Reports from "./pages/reports/Reports";

import Settings from "./pages/settings/Settings";

export default function App() {
  return (
    <AuthProvider>

      <Routes>

        <Route element={<AuthLayout />}>

          <Route
            path="/login"
            element={<Login />}
          />

        </Route>

        <Route
          element={
            <ProtectedRoute>

              <MainLayout />

            </ProtectedRoute>
          }
        >

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/meetings"
            element={<Meetings />}
          />

          <Route
            path="/meetings/:id"
            element={<MeetingDetails />}
          />

          <Route
            path="/upload"
            element={<Upload />}
          />

          <Route
            path="/chat"
            element={<Chat />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>

        <Route
          path="/"
          element={<Navigate to="/dashboard" />}
        />

      </Routes>

    </AuthProvider>
  );
}