'use client';
import { useRouter } from 'next/navigation';
import axios from '../../lib/axios.setup';
import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdOutlineSquare } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import { useAuthentication } from '@/context/useAuthenticationContext';

type TSignUpFormData = {
  email: string;
  passphrase: string;
  confirmPassphrase: string;
};

type TCreateUserRequest = {
  email: string;
  passphras: string;
};

function auxPassphraseValidationFunction(
  passphraseInputData?: string,
  confirmPassphraseInputData?: string
): boolean {
  const p1InputData = passphraseInputData ?? '';
  const p2InputData = confirmPassphraseInputData ?? '';

  if (p1InputData.length < 16 && p2InputData.length < 16) {
    return false;
  }

  if (p1InputData != p2InputData) {
    return false;
  }
  return true;
}

export default function Login() {
  const { signup } = useAuthentication();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TSignUpFormData>();

  const [isCreating, setIsCreating] = useState(false);
  async function handleSignUp(formData: TSignUpFormData) {
    if (formData.passphrase != formData.confirmPassphrase) {
      toast.error("Passphrases don't Match");
      return;
    }

    try {
      setIsCreating(true);
      await signup(formData.email, formData.passphrase);
    } catch (er) {}

    setIsCreating(false);
  }

  const emailInputId = useId();
  const passphraseInputId = useId();
  const confirmPassphraseInputId = useId();
  return (
    <>
      <main className="w-screen sm:h-screen sm:mt-0 flex flex-col items-center sm:justify-center h-fit mt-10">
        <form
          className="flex flex-col p-8 bg-white dark:bg-slate-700 sm:w-6/12 h-fit gap-6 sm:rounded-lg rounded-none"
          onSubmit={handleSubmit(handleSignUp)}
        >
          <label htmlFor={emailInputId}>
            E-Mail*
            <input
              {...register('email', { required: true })}
              type="email"
              id={emailInputId}
              className="w-full h-8 bg-slate-300 dark:bg-slate-800 outline-none p-6 text-base rounded-md"
            />
            {errors.email && (
              <div className="text-red-500">Email is Required</div>
            )}
          </label>

          <label htmlFor={passphraseInputId}>
            Passphrase*
            <div className=" bg-slate-300 dark:bg-slate-800 text-base rounded-md flex items-center pr-5">
              <input
                {...register('passphrase', { required: true, minLength: 16 })}
                type="password"
                id={passphraseInputId}
                className="w-full h-8 bg-transparent p-6 outline-none"
              />
              <span className="text-slate-600 dark:text-slate-400">
                {watch('passphrase')?.length || 0}
              </span>
            </div>
            {errors.passphrase && (
              <div className="text-red-500">passphrase is Required</div>
            )}
            {errors.passphrase && (
              <div className="text-red-500 ">
                passphrase must have a minimum of 16 characters
              </div>
            )}
          </label>

          <label htmlFor={confirmPassphraseInputId}>
            Confirm Passphrase*
            <div className=" bg-slate-300 dark:bg-slate-800 text-base rounded-md flex items-center pr-5">
              <input
                {...register('confirmPassphrase', {
                  required: true,
                  minLength: 16,
                })}
                type="password"
                id={confirmPassphraseInputId}
                className="w-full h-8 bg-transparent p-6 outline-none"
              />
              <span className="text-slate-600 dark:text-slate-400">
                {watch('confirmPassphrase')?.length || 0}
              </span>
            </div>
            {errors.confirmPassphrase && (
              <div className="text-red-500">passphrase is Required</div>
            )}
            {errors.confirmPassphrase && (
              <div className="text-red-500">
                passphrase must have a minimum of 16 characters
              </div>
            )}
            {/* TODO: Improve this Algorithim Bellow much verbose*/}
            {(watch('passphrase')?.length ?? 0) >= 16 ||
            (watch('confirmPassphrase')?.length ?? 0) >= 16 ? (
              watch('passphrase') == watch('confirmPassphrase') ? (
                <div className="text-green-400">Passphrases match</div>
              ) : (
                <div className="text-red-500">Passphrases mismatch</div>
              )
            ) : null}
          </label>

          <button
            className={`p-4 ${
              auxPassphraseValidationFunction(
                watch('passphrase'),
                watch('confirmPassphrase')
              ) && watch('email')
                ? 'bg-green-500 hover:bg-slate-300 hover:text-emerald-500 dark:hover:bg-slate-600'
                : 'bg-red-500 hover:bg-slate-300 hover:text-red-500 dark:hover:bg-slate-600'
            } text-white rounded-2xl shadow-black drop-shadow-sm  transition-all hover:drop-shadow-none  text-lg flex items-center justify-center h-16 disabled:cursor-not-allowed`}
            disabled={isCreating}
          >
            {isCreating ? (
              <span className="animate-spin text-lg">
                <MdOutlineSquare />
              </span>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
        <ToastContainer />
      </main>
    </>
  );
}
