import { FC, ReactNode } from "react";
import AuthenticationProvider from "./AuthProvider";

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <AuthenticationProvider>{children}</AuthenticationProvider>;
};

export default AppProvider;
