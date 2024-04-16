import { useContext } from "react";
import { AuthContext } from "../context/auth.context";

export function useAuth() {
  const auth = useContext(AuthContext);
  if (auth == null) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return auth;
}
