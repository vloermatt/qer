import { lazy } from "react";
import { RouteDetail } from "../utils/types";

const Login = lazy(() => import("../pages/authentication/login"));
const SignUp = lazy(() => import("../pages/authentication/signUp"));
const VerifyCode = lazy(() => import("../pages/authentication/verifyCode"));

export const PublicRoutes: RouteDetail[] = [
  {
    path: "/login",
    element: <Login />,
    label: "Login",
  },
  {
    path: "/signup",
    element: <SignUp />,
    label: "Sign Up",
  },
  {
    path: "/verifyCode",
    element: <VerifyCode />,
    label: "Verify Code",
  },
];
