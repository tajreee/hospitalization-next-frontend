import { CustomFetchBaseResponse } from "@/components/utils/customFetch/interface";
import { extend } from "zod/v4-mini";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignInResponse extends CustomFetchBaseResponse{
    token: string;
    user: User;
}

export interface AuthContextInterface {
  user: User | undefined;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  login: (payload: SignInPayload) => Promise<SignInResponse>;
  logout: () => Promise<void>;
}

export interface AuthContextProviderProps {
  children: React.ReactNode;
  user?: User;
}