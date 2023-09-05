import { ReactNode, useEffect, useState } from "react";

type ConfirmDialogProps = {
  title?: string;
  question: string;
  onOkay: () => void | Promise<void>;
  onNegation?: () => void | Promise<void>;
  onClose: () => void;
  open: boolean;
  okayButtonContent?: ReactNode;
  declineButtonContent?: ReactNode;
};

export default function ConfirmDialog({
  open,
  onOkay,
  question,
  onNegation,
  title,
  onClose,
  okayButtonContent = "Confirm",
  declineButtonContent = "Decline",
}: ConfirmDialogProps) {
  const [blockActions, setBlockActions] = useState(false);

  useEffect(() => {
    setBlockActions(false);
  }, [open]);
  return open ? (
    <div className="fixed z-20 top-0 left-0 ">
      <div className="w-screen h-screen backdrop-blur-sm bg-[#00000055]"></div>
      <section className="fixed bg-white dark:bg-slate-700 top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 min-w-[20rem] w-fit h-fit overflow-auto p-8 ">
        <div className="text-2xl mb-5">{title}</div>
        <div className="text-lg mb-4 flex justify-center">{question}</div>
        <div className="flex gap-6 justify-center">
          <button
            disabled={blockActions}
            onClick={
              onNegation
                ? async () => {
                    setBlockActions(true);
                    await onNegation();
                    onClose();
                  }
                : onClose
            }
            className=" text-white w-full p-4 bg-red-600 hover:bg-red-800 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-red-600 transition-colors rounded-md font-bold text-lg"
          >
            {declineButtonContent}
          </button>
          <button
            disabled={blockActions}
            onClick={async () => {
              setBlockActions(true);
              await onOkay();
              onClose();
            }}
            className="text-white w-full p-4 bg-green-700 hover:bg-green-800 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-green-700 transition-colors rounded-md font-bold text-lg"
          >
            {okayButtonContent}
          </button>
        </div>
      </section>
    </div>
  ) : null;
}
