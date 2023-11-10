import React, {
  useState,
  createContext,
  FunctionComponent,
  useEffect,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  uuid: string;
  login: (id: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  uuid: "",
  login: () => {
    throw new Error("login function not implemented");
  },
  logout: () => {
    throw new Error("logout function not implemented");
  },
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: FunctionComponent<AuthProviderProps> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [uuid, setUuid] = useState<string>(localStorage.getItem("uuid") || "");

  const login = (id: string) => {
    setUuid(id);
    setIsAuthenticated(true);
    localStorage.setItem("uuid", id);
    localStorage.setItem("isAuthenticated", "true");
  };

  const logout = () => {
    setUuid("");
    setIsAuthenticated(false);
    localStorage.setItem("uuid", "");
    localStorage.setItem("isAuthenticated", "false");
  };
  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated.toString());
    localStorage.setItem("uuid", uuid);
  }, [isAuthenticated, uuid]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, uuid, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
