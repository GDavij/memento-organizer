'use client';
//TODO: Improve Acessibility
import { useRouter } from 'next/navigation';
import axios from '../../lib/axios.setup';
import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdOutlineSquare } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import { useAuthentication } from '@/context/useAuthenticationContext';
type TLoginFormData = {
  email: string;
  passphrase: string;
};

export default function Login() {
  const { login } = useAuthentication();
  const route = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TLoginFormData>();

  const [isLoging, setIsLoging] = useState(false);
  async function handleLogin(formData: TLoginFormData) {
    setIsLoging(true);
    try {
      await login(formData.email, formData.passphrase);
    } catch (er) {}

    setIsLoging(false);
  }

  const emailInputId = useId();
  const passphraseInputId = useId();
  return (
    <>
      <main className="w-screen sm:h-screen sm:mt-0 flex flex-col items-center sm:justify-center h-fit mt-10">
        <form
          className="flex flex-col p-8 bg-white dark:bg-slate-700 sm:w-6/12 h-fit gap-6 sm:rounded-lg rounded-none"
          onSubmit={handleSubmit(handleLogin)}
          method="POST"
        >
          <label htmlFor={emailInputId}>
            E-Mail
            <input
              {...register('email', { required: true })}
              type="email"
              id={emailInputId}
              className="input-flat"
            />
            {errors.email && (
              <span className="text-red-500">Email is Required</span>
            )}
          </label>

          <label htmlFor={passphraseInputId}>
            Passphrase
            <div className="input-wrapper-left-flat">
              <input
                {...register('passphrase', { required: true, minLength: 16 })}
                type="password"
                id={passphraseInputId}
                className="w-full h-8 bg-transparent p-6 outline-none"
              />
              <span>{watch('passphrase')?.length || 0}</span>
            </div>
            {errors.passphrase && (
              <div className="text-red-500">passphrase is Required</div>
            )}
            {errors.passphrase && (
              <div className="text-red-500">
                passphrase must have a minimum of 16 characters
              </div>
            )}
          </label>

          <button className="h-16 p-4 button-flat" disabled={isLoging}>
            {isLoging ? (
              <span className="animate-spin text-lg">
                <MdOutlineSquare />
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <ToastContainer />
      </main>
    </>
  );
}
