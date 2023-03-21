import { lazy } from "react";
import { RouteDetail } from "../utils/types";

const Dashboard = lazy(() => import("../pages/dashboard"));

export const PrivateRoutes: RouteDetail[] = [
  {
    path: "/dashboard",
    element: <Dashboard />,
    label: "Dashboard",
  },
];
