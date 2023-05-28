"use client";
import notesService from "@/services/notes.service";
import Modal, { BaseModalProps } from "@/app/components/Modal";
import { TCreateNoteRequest } from "@/models/requests/noteRequests";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Loader from "@/app/components/Loader";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import { CustomText, TBaseNoteData } from "@/models/data/note";
import { BaseEditor, createEditor } from "slate";
declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: TBaseNoteData;
    Text: CustomText;
  }
}

type TCreateNoteFormData = {
  name: string;
  description: string;
  content: TBaseNoteData[];
};

export default function CreateNoteModal({ open, onClose }: BaseModalProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<TCreateNoteFormData>();

  const editor = useMemo(() => withReact(createEditor()), []);
  const [noteContent, setNoteContent] = useState<TBaseNoteData[]>([
    { children: [{ text: "My Note Content" }], type: "paragraph" },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function handleNoteCreation(formData: TCreateNoteFormData) {
    if (formData.name.length < 4) {
      toast.error("Name does not have the minimum length of 4");
      return;
    }

    if (formData.description.length < 8) {
      toast.error("Description does not have the minimum length of 8");
      return;
    }

    const filteredBody: TCreateNoteRequest = {
      name: formData.name,
      description: formData.description,
      content: JSON.stringify(formData.content),
    };
    setIsCreating(true);
    const noteId = await notesService.createNote(filteredBody);
    toast.success("Note Has Been Created, Redirecting to Editor");
    router.push(`/dashboard/notes/${noteId}`);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      subject="Create Note"
      lockCloseBtn={isCreating}
    >
      <form
        onSubmit={handleSubmit(handleNoteCreation)}
        className="flex flex-col items-center gap-4"
      >
        <label className="w-full">
          Note Name*
          <input
            readOnly={isCreating}
            {...register("name", { required: true, minLength: 4 })}
            type="text"
            className="w-full h-8 bg-slate-300 dark:bg-slate-800 outline-none p-6 text-base rounded-md"
          />
          {errors.name?.type == "required" && (
            <div className="text-red-500">Name is Required</div>
          )}
          {errors.name?.type == "minLength" && (
            <div className="text-red-500">
              Name must have a minimum Length of 4
            </div>
          )}
        </label>
        <label className="w-full">
          Description*
          <input
            readOnly={isCreating}
            {...register("description", { required: true, minLength: 8 })}
            type="text"
            className="w-full h-8 bg-slate-300 dark:bg-slate-800 outline-none p-6 text-base rounded-md"
          />
          {errors.description?.type == "required" && (
            <div className="text-red-500">Description is Required</div>
          )}
          {errors.description?.type == "minLength" && (
            <div className="text-red-500">
              Description must have a minimum Length of 8
            </div>
          )}
        </label>
        <label className="w-full">
          Content
          <Slate
            onChange={(value) => setValue("content", value as TBaseNoteData[])}
            editor={editor}
            value={noteContent}
          >
            <Editable className="w-full h-fit flex items-center justify-start bg-slate-300 dark:bg-slate-800 outline-none p-4 text-base rounded-md" />
          </Slate>
          {errors.content?.type == "required" && (
            <div className="text-red-500">Content is Required</div>
          )}
        </label>
        <button
          disabled={isCreating}
          className="w-full p-4 bg-emerald-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-emerald-500 text-white rounded-2xl shadow-black drop-shadow-sm hover:bg-slate-300 hover:text-emerald-600 transition-all hover:drop-shadow-none dark:hover:bg-slate-600 text-lg flex items-center justify-center h-16 disabled:cursor-not-allowed"
        >
          {isCreating ? (
            <Loader loadingText="Creating Note" size="text-lg" />
          ) : (
            "Create Note"
          )}
        </button>
      </form>
    </Modal>
  );
}
