import { ReactNode, createContext, useEffect, useState } from "react";
import { UserIdentifier } from "../constants/types";
import { useNavigate } from "react-router-dom";
import * as AuthService from "../services/auth.service";

type AuthContext = {
  login: (username: string, password: string) => Promise<void>;
  // signup: (username: string, email: string, password: string) => void;
  user?: UserIdentifier;
  isLoadingUser: boolean;
};

export const AuthContext = createContext<AuthContext | null>(null);

interface IAuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [user, setUser] = useState<UserIdentifier>();
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoadingUser(true);
    AuthService.getCurrentUser().then((res) => console.log("user", res));
  }, []);

  function login(username: string, password: string) {
    return AuthService.login(username, password).then((user) => {
      setUser({ id: user.id, username: user.username });
      navigate("/");
    });
  }

  return (
    <AuthContext.Provider value={{ login, user, isLoadingUser }}>
      {children}
    </AuthContext.Provider>
  );
};
