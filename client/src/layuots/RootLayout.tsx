import { Outlet } from "react-router-dom";
import { AuthProvider } from "../features/authentication/context/auth.context";

export const RootLayout = () => {
  return (
    <AuthProvider>
      <main className="bg-secondary flex flex-col min-h-screen">
        <Outlet />
      </main>
    </AuthProvider>
  );
};
