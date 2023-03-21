import { CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";
import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRecoilState } from "recoil";
import {
  isAuthenticatedState,
  isAuthenticatingState,
  userState,
} from "../../state";
import { UserProfile } from "../../utils/types";
import { userPool } from "./cognito";

interface ContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthenticating: boolean;
  setIsAuthenticating: React.Dispatch<React.SetStateAction<boolean>>;
  authResponseType: string;
  setAuthResponseType: React.Dispatch<React.SetStateAction<string>>;
  cognitoUser: CognitoUser;
  setCognitoUser: React.Dispatch<React.SetStateAction<CognitoUser>>;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}
const DEFAULT_STATE = {
  isAuthenticated: false,
  setIsAuthenticated: () => false,
  isAuthenticating: false,
  setIsAuthenticating: () => false,
  authResponseType: "",
  setAuthResponseType: () => "",
  cognitoUser: new CognitoUser({
    Username: "",
    Pool: userPool,
  }),
  setCognitoUser: () => undefined,
  userProfile: {
    sub: "",
    email: "",
    phone_number: "",
    groups: [],
  },
  setUserProfile: () => {
    return {
      sub: "",
      email: "",
      phone_number: "",
      groups: [],
    };
  },
};

export const AuthenticationContext = createContext<ContextType>(DEFAULT_STATE);
export const useAuthContext = () => useContext(AuthenticationContext);

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  /** states */
  const [isAuthenticated, setIsAuthenticated] =
    useRecoilState(isAuthenticatedState);
  const [isAuthenticating, setIsAuthenticating] = useRecoilState(
    isAuthenticatingState
  );
  const [cognitoUser, setCognitoUser] = useState<CognitoUser>(
    DEFAULT_STATE.cognitoUser
  );
  const [userProfile, setUserProfile] = useRecoilState(userState);
  const [authResponseType, setAuthResponseType] = useState(
    DEFAULT_STATE.authResponseType
  );

  useEffect(() => {
    const checkAuthStatus = () => {
      setIsAuthenticating(true);
      const user = userPool.getCurrentUser();
      if (user) {
        user.getSession(
          (err: Error | null, session: CognitoUserSession | null) => {
            if (session) {
              if (session.isValid()) {
                /**
                 * User session is still valid & can remain authenticated
                 */
                setCognitoUser(user);
                setIsAuthenticated(true);
                setIsAuthenticating(false);
              }
            } else {
              /**
               * User session is invalid & requires re-authentication
               */
              setCognitoUser(DEFAULT_STATE.cognitoUser);
              setIsAuthenticated(false);
              setIsAuthenticating(false);
            }
          }
        );
      } else {
        /**
         * No previous user session found
         */
        setCognitoUser(DEFAULT_STATE.cognitoUser);
        setIsAuthenticated(false);
        setIsAuthenticating(false);
      }
    };
    checkAuthStatus();
  }, [isAuthenticated]);

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isAuthenticating,
        setIsAuthenticating,
        authResponseType,
        setAuthResponseType,
        cognitoUser,
        setCognitoUser,
        userProfile,
        setUserProfile,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthProvider;
