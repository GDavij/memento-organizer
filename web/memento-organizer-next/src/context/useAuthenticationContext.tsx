'use client';
import { User } from '@/models/data/user';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import usersService from '@/services/user.service';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
type TAuthenticationContext = {
  login: (email: string, password: string) => Promise<void>;
  loginAsAdmin: (email:string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string) => Promise<void>;
  isAdmin: boolean | null;
};

const AuthenticationContext = createContext({} as TAuthenticationContext);

type TBackdropProps = {
  children: ReactNode;
};

export function AutheticationProvider({ children }: TBackdropProps) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  async function getIsAdmin() {
    try {
      const isAdmin = await usersService.checkIsAdmin();
      setIsAdmin(isAdmin);
    } catch (er) {}
  }

  async function login(email: string, passphrase: string) {
    try {
      const loginUserRequest = usersService.loginUser({ email, passphrase });
      toast.promise(loginUserRequest, {
        pending: 'Logging user',
        success: 'User logged with sucess',
        error: 'Email or password is invalid',
      });
      const token = await loginUserRequest;
      localStorage.setItem('token', token);
      await getIsAdmin();
      return router.push('/dashboard/home');
    } catch (err) {}
  }

  async function loginAsAdmin(email: string, passphrase: string) {
    try {
      const loginUserRequest = usersService.loginAdmin({ email, passphrase });
      toast.promise(loginUserRequest, {
        pending: 'Logging user',
        success: 'User logged with sucess',
        error: 'Email or password is invalid',
      });
      const token = await loginUserRequest;
      localStorage.setItem('token', token);
      await getIsAdmin();
      return router.push('/dashboard/home');
    } catch (err) {}
  }

  function logout() {
    localStorage.clear();
    return router.push('/');
  }

  async function signup(email: string, passphrase: string) {
    try {
      const signupUserRequest = usersService.signUpUser({ email, passphrase });
      toast.promise(signupUserRequest, {
        pending: 'Signing up user',
        success: 'User signed up with sucess',
        error: 'User Already Exists',
      });
      await signupUserRequest;
      router.push('/login');
    } catch (err) {}
  }

  useEffect(() => {
    getIsAdmin();
  }, []);
  return (
    <AuthenticationContext.Provider value={{ login, loginAsAdmin, logout, signup, isAdmin }}>
      {children}
    </AuthenticationContext.Provider>
  );
}

export const useAuthentication = () => useContext(AuthenticationContext);
