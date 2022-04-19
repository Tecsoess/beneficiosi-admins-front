import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { getAuth, setAuth } from "../helpers/auth";

type customAlertProps = {
  show: boolean;
  message: string;
  severity: "success" | "error" | "info";
}

type AuthContextValue = {
  isAuthenticated: boolean;
  setAuthInfo?: Dispatch<SetStateAction<AuthContextValue>>;
  user: any | null;
  token: string | null;
  customLoading?: { show: boolean, message: string };
  setLoading?: Dispatch<SetStateAction<{ show: boolean, message: string }>>;
  customAlert?: customAlertProps;
  setCustomAlert?: Dispatch<SetStateAction<customAlertProps>>
}

const AuthContext = createContext<AuthContextValue>({ isAuthenticated: false, user: null, token: null });

type AuthProviderProps = {
  children: ReactNode;
};

const lsItem = getAuth();
const defaultData = lsItem ? JSON.parse(lsItem) : { isAuthenticated: false, user: null, token: null };

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authInfo, setAuthInfo] = useState(defaultData);
  const [customLoading, setLoading] = useState({ show: false, message: "" });
  const [customAlert, setCustomAlert] = useState<customAlertProps>({ show: false, message: "", severity: "success" });

  useEffect(() => {
    setAuth(JSON.stringify(authInfo));
  }, [authInfo]);

  return <AuthContext.Provider value={{
    customLoading,
    setLoading,
    user: authInfo.user,
    token: authInfo.token,
    isAuthenticated: authInfo.isAuthenticated,
    setAuthInfo,
    customAlert,
    setCustomAlert
  }}>
    {children}
  </AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
