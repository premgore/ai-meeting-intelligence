import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";
import api from "../lib/api";

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData?: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("access_token"));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        // Attempt to fetch current user profile if endpoint exists
        const res = await api.get("/users/");
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setUser(res.data[0]);
        }
      } catch (err) {
        console.warn("Could not fetch user profile", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, [token]);

  const login = (newToken: string, userData?: User) => {
    localStorage.setItem("access_token", newToken);
    setToken(newToken);
    if (userData) setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
