// AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type AuthCtx = {
  loggedIn: boolean;
  email: string;
  role: string,
  login: (token: string, email: string, role: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const login = (token: string, email: string, role: string) => {
    localStorage.setItem("token", token);
    setLoggedIn(true);
    setEmail(email);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    window.location.href = "/signin";
  };

  // 🔹 Sprawdzenie tokena przy starcie aplikacji
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const checkAuthentication = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/check`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Unauthorized");
        }
        const data = await res.json();
        setEmail(data.email);
        setRole(data.role);
        setLoggedIn(true); // jeśli odpowiedź OK, token jest ważny
      } catch (error) {
        localStorage.removeItem("token");
        setLoggedIn(false);
        window.location.href = "/";
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication(); // <-- wywołanie funkcji po jej deklaracji
  }, []);

  // 🔹 Nasłuchiwanie zmian w localStorage (inne karty)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "token") setLoggedIn(!!e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (loading) return <div>Ładowanie...</div>; // lub spinner

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout, email, role }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};
