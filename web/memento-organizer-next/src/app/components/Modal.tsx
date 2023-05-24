//TODO: Implement Acessibility for Modal and implement Lock Focus on Modal
import React, { ReactNode } from "react";
import { MdClose } from "react-icons/md";

export type BaseModalProps = {
  open: boolean;
  onClose: () => void;
};

type ModalProps = {
  open: boolean;
  onClose: () => void;
  subject: ReactNode;
  children: ReactNode;
  lockCloseBtn?: boolean;
  optionsMenu?: ReactNode;
};

export default function Modal({
  open,
  onClose,
  subject,
  children,
  lockCloseBtn = false,
  optionsMenu,
}: ModalProps) {
  return open ? (
    <div className="fixed z-20 top-0 left-0 ">
      <div className="w-screen h-screen backdrop-blur-sm bg-[#00000055]"></div>
      <section className="fixed top-0 left-0 w-screen h-screen bg-white dark:bg-slate-700 sm:top-32 sm:left-2/4 sm:-translate-x-2/4 md:w-2/4 sm:w-3/4 sm:h-fit sm:px-8 sm:py-8 p-4 overflow-auto">
        <div className="flex items-center">
          {optionsMenu}
          <span className="inline-block text-2xl sm:text-4xl mx-auto">
            {subject}
          </span>
          <button
            onClick={onClose}
            disabled={lockCloseBtn}
            className="hover:text-red-500 transition-colors disabled:text-slate-400 dark:disabled:text-slate-500"
          >
            <MdClose className="inline text-4xl " />
          </button>
        </div>
        <article className="flex flex-col items-center mt-8">
          {children}
        </article>
      </section>
    </div>
  ) : null;
}
