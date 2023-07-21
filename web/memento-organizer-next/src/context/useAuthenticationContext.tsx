'use client';
import { User } from '@/models/data/user';
import { ReactNode, createContext, useContext, useState } from 'react';
import usersService from '@/services/user.service';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
type TAuthenticationContext = {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string) => Promise<void>;
};

const AuthenticationContext = createContext({} as TAuthenticationContext);

type TBackdropProps = {
  children: ReactNode;
};

export function AutheticationProvider({ children }: TBackdropProps) {
  const router = useRouter();

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
  return (
    <AuthenticationContext.Provider value={{ login, logout, signup }}>
      {children}
    </AuthenticationContext.Provider>
  );
}

export const useAuthentication = () => useContext(AuthenticationContext);
