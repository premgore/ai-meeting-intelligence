import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

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

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("access_token");
  });

  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("access_token");

      console.log(
        "[Auth] Stored token:",
        storedToken ? "YES" : "NO"
      );

      if (!storedToken) {
        setToken(null);
        setUser(null);
        setIsLoading(false);
        return;
      }

      setToken(storedToken);

      try {
        /*
         * The current backend /users/ endpoint returns
         * the available users rather than a dedicated
         * current-user endpoint.
         *
         * We don't need this request to decide whether
         * the user is authenticated.
         */

        try {
          const response = await api.get("/users/");

          if (
            response.data &&
            Array.isArray(response.data) &&
            response.data.length > 0
          ) {
            const currentUser = response.data.find(
              (item: User) => item.email
            );

            if (currentUser) {
              setUser(currentUser);
            }
          }
        } catch (error) {
          /*
           * Don't log the user out just because the
           * optional profile request fails.
           */
          console.warn(
            "[Auth] Could not load user profile:",
            error
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (
    newToken: string,
    userData?: User
  ) => {
    console.log("[Auth] Login successful");

    /*
     * Store token first.
     */
    localStorage.setItem(
      "access_token",
      newToken
    );

    /*
     * Update React state immediately.
     */
    setToken(newToken);

    if (userData) {
      setUser(userData);
    }

    console.log(
      "[Auth] Token stored:",
      localStorage.getItem("access_token")
        ? "YES"
        : "NO"
    );
  };

  const logout = () => {
    console.log("[Auth] Logging out");

    localStorage.removeItem("access_token");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token),
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
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
};

export default AuthContext;
