import { createBrowserRouter } from "react-router-dom";
import { LoginRoute } from "./pages/Login.page";
import { RootLayout } from "./layuots/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [{ path: "/login", ...LoginRoute }],
  },
]);
