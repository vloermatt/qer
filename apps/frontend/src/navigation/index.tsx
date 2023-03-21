import { Fragment, Suspense } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { useAuthContext } from "../context/AuthProvider";
import { PrivateRoutes } from "./PrivateRoutes";
import { PublicRoutes } from "./PublicRoutes";

// TODO - save last page visited
export function RequireAuth({
  children,
  allowedGroups,
}: {
  children: JSX.Element;
  allowedGroups?: string[];
}) {
  const { isAuthenticating, isAuthenticated, userProfile } = useAuthContext();
  if (
    (!isAuthenticating && !isAuthenticated) ||
    (allowedGroups &&
      (!userProfile.groups ||
        !allowedGroups.some((group) => userProfile.groups.includes(group))))
  ) {
    // redirect to login page
    return <Navigate to="/login" />;
  }
  return <Fragment>{children}</Fragment>;
}

const Navigation = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading ...</div>}>
        <Routes>
          {PublicRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          {PrivateRoutes.map((route) => (
            <Route
              key={route.path}
              element={
                <RequireAuth allowedGroups={route.allowedGroups}>
                  <Outlet />
                </RequireAuth>
              }
            >
              <Route
                path={route.path}
                key={route.path}
                element={route.element}
              />
            </Route>
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Navigation;
