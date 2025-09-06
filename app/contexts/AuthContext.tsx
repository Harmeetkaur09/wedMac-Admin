// app/contexts/AuthContext.tsx  (replace current file)
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id?: string | number;
  email?: string;
  name?: string;
  role?: string;
  [k: string]: any;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  loginWithToken: (token: string, userObj?: User | null) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // restore saved user & token (if any)
    try {
      const savedUser = localStorage.getItem("atlas_admin_user");
      const token =
        typeof window !== "undefined"
          ? sessionStorage.getItem("accessToken")
          : null;
      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error("Restore auth failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // POST to login endpoint
      const resp = await fetch(
        "https://api.wedmacindia.com/api/superadmin/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      if (!resp.ok) {
        const txt = await resp.text();
        console.error("Login failed:", resp.status, txt);
        setIsLoading(false);
        return false;
      }

      const data = await resp.json();

      const token =
        data?.token ||
        data?.access ||
        data?.access_token ||
        data?.jwt ||
        data?.authToken ||
        data?.data?.token ||
        data?.tokens?.access ||
        null;

      if (token) {
        sessionStorage.setItem("accessToken", token);
      }

      const userObj = data?.user ||
        data?.data?.user ||
        (data?.data && typeof data.data === "object" && data.data) ||
        {
          id: data?.user_id || data?.id || undefined,
          email: data?.email || username,
          name: data?.name || username,
          role: data?.role || "admin",
        };

      setUser(userObj);
      try {
        localStorage.setItem("atlas_admin_user", JSON.stringify(userObj));
      } catch (err) {
        console.warn("Failed to persist user to localStorage", err);
      }

      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error("Login error:", err);
      setIsLoading(false);
      return false;
    }
  };

  // NEW: loginWithToken — call this after OTP verify success
  const loginWithToken = async (token: string, userObj?: User | null) => {
    try {
      setIsLoading(true);
      if (token) {
        sessionStorage.setItem("accessToken", token);
      }
      if (userObj) {
        setUser(userObj);
        try {
          localStorage.setItem("atlas_admin_user", JSON.stringify(userObj));
        } catch (err) {
          console.warn("Failed to persist user to localStorage", err);
        }
      } else {
        // if no user provided, try to read existing saved user
        const saved = localStorage.getItem("atlas_admin_user");
        if (saved) setUser(JSON.parse(saved));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("atlas_admin_user");
      sessionStorage.removeItem("accessToken");
    } catch (err) {
      console.warn("Error clearing storage", err);
    }
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithToken, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
