import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthLayout } from "./components/layout/AuthLayout";
import { MainLayout } from "./components/layout/MainLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Meetings from "./pages/meetings/Meetings";
import MeetingDetails from "./pages/meetings/MeetingDetails";
import Chat from "./pages/chat/Chat";
import ActionItems from "./pages/action-items/ActionItems";
import Upload from "./pages/upload/Upload";
import Analytics from "./pages/analytics/Analytics";
import Reports from "./pages/reports/Reports";
import Settings from "./pages/settings/Settings";
import Profile from "./pages/profile/Profile";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Unauthenticated Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Authenticated Dashboard Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/meetings/:id" element={<MeetingDetails />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/action-items" element={<ActionItems />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Root fallback redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
