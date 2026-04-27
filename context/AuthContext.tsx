// contexts/AuthContext.tsx
"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  businessName: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (userData: User, token?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    const userData = localStorage.getItem("debtpadi_user");
    const savedToken = localStorage.getItem("debtpadi_token");

    if (userData && savedToken) {
      try {
        setUser(JSON.parse(userData));
        setToken(savedToken);
      } catch {
        localStorage.removeItem("debtpadi_user");
        localStorage.removeItem("debtpadi_token");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: User, tokenData?: string) => {
    localStorage.setItem("debtpadi_user", JSON.stringify(userData));
    if (tokenData) {
      localStorage.setItem("debtpadi_token", tokenData);
      setToken(tokenData);
    }
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("debtpadi_user");
    localStorage.removeItem("debtpadi_token");
    setUser(null);
    setToken(null);
    window.location.href = "/auth/signin";
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
