import React, {
  useState,
  createContext,
  FunctionComponent,
  useEffect,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  uuid: string;
  pw: string;
  login: (id: string, pass: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  uuid: "",
  pw: "",
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
    sessionStorage.getItem("isAuthenticated") === "true"
  );
  const [uuid, setUuid] = useState<string>(
    sessionStorage.getItem("uuid") || ""
  );
  const [pw, setPassword] = useState<string>(
    sessionStorage.getItem("mpw") || ""
  );

  const login = (id: string, pass: string) => {
    setUuid(id);
    setIsAuthenticated(true);
    setPassword(pass);
    sessionStorage.setItem("uuid", id);
    sessionStorage.setItem("mpw", pass);
    sessionStorage.setItem("isAuthenticated", "true");
  };

  const logout = () => {
    setUuid("");
    setIsAuthenticated(false);
    setPassword("");
    sessionStorage.setItem("uuid", "");
    sessionStorage.setItem("mpw", "");
    sessionStorage.setItem("isAuthenticated", "false");
  };
  useEffect(() => {
    sessionStorage.setItem("isAuthenticated", isAuthenticated.toString());
    sessionStorage.setItem("uuid", uuid);
    sessionStorage.setItem("mpw", pw);
  }, [isAuthenticated, uuid]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, uuid, pw, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
