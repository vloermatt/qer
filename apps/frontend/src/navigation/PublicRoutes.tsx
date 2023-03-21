import { lazy } from "react";
import { RouteDetail } from "../utils/types";

const Login = lazy(() => import("../pages/login"));

export const PublicRoutes: RouteDetail[] = [
  {
    path: "/login",
    element: <Login />,
    label: "Login",
  },
];
