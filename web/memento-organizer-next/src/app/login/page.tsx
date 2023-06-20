"use client";
//TODO: Improve Acessibility
import { useRouter } from "next/navigation";
import axios from "../../lib/axios.setup";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineSquare } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";

type TLoginFormData = {
  email: string;
  passphrase: string;
};

export default function Login() {
  const route = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TLoginFormData>();

  const [isLoging, setIsLoging] = useState(false);
  async function handleLogin(formData: TLoginFormData) {
    const filteredBody: TLoginFormData = {
      email: formData.email,
      passphrase: formData.passphrase,
    };
    try {
      setIsLoging(true);
      const response: { data: { token: string } } = await axios.post(
        "/users/login",
        filteredBody
      );
      toast.success("User successfully authenticated", {
        position: window.innerWidth < 640 ? "bottom-center" : "top-right",
      });
      localStorage.setItem("token", response.data["token"]);
      return route.push("/dashboard/home");
    } catch (er) {
      toast.error("User could not be Authenticated");
      console.error(er);
    }

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
              {...register("email", { required: true })}
              type="email"
              id={emailInputId}
              className="w-full h-8 bg-slate-300 dark:bg-slate-800 outline-none p-6 text-base rounded-md"
            />
            {errors.email && (
              <span className="text-red-500">Email is Required</span>
            )}
          </label>

          <label htmlFor={passphraseInputId}>
            Passphrase
            <div className=" bg-slate-300 dark:bg-slate-800 text-base rounded-md flex items-center pr-5">
              <input
                {...register("passphrase", { required: true, minLength: 16 })}
                type="password"
                id={passphraseInputId}
                className="w-full h-8 bg-transparent p-6 outline-none"
              />
              <span>{watch("passphrase")?.length || 0}</span>
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

          <button
            className="p-4 bg-emerald-500 text-white rounded-2xl shadow-black drop-shadow-sm hover:bg-slate-300 hover:text-emerald-600 transition-all hover:drop-shadow-none dark:hover:bg-slate-600 text-lg flex items-center justify-center h-16 disabled:cursor-not-allowed"
            disabled={isLoging}
          >
            {isLoging ? (
              <span className="animate-spin text-lg">
                <MdOutlineSquare />
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <ToastContainer />
      </main>
    </>
  );
}
