"use client";
import notesService from "@/services/notes.service";
import Modal, { BaseModalProps } from "@/app/components/Modal";
import {
  TCreateNoteRequest,
  TUpdateNoteRequest,
} from "@/models/requests/noteRequests";
import ConfirmDialog from "@/app/components/ConfirmDialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Note } from "@/models/data/note";
import Loader from "@/app/components/Loader";
import { MdDelete } from "react-icons/md";

interface EditNoteModalProps extends BaseModalProps {
  id: string;
  refetchNoteCb: () => Promise<void>;
}
export default function CreateNoteModal({
  open,
  onClose,
  id,
  refetchNoteCb,
}: EditNoteModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCreateNoteRequest>();

  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  async function fetchNoteData() {
    const noteFetched = await notesService.getNote(id);
    setNote(noteFetched);
    reset({ name: noteFetched.name, description: noteFetched.description });
  }

  useEffect(() => {
    if (open) {
      fetchNoteData();
    } else {
      setNote(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function handleNoteEdition(formData: TCreateNoteRequest) {
    if (formData.name.length < 4) {
      toast.error("Name does not have the minimum length of 4");
      return;
    }

    if (formData.description.length < 8) {
      toast.error("Description does not have the minimum length of 8");
      return;
    }

    const filteredBody: TUpdateNoteRequest = {
      name: formData.name,
      description: formData.description,
    };
    setIsSaving(true);
    await notesService.updateNote(id, filteredBody);
    await refetchNoteCb();
    toast.success("Alteration has been saved");
    setIsSaving(false);
    onClose();
  }
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        subject={
          <>
            <span>Edit Note</span>
          </>
        }
        optionsMenu={
          <span>
            <button
              onClick={() => setOpenDeleteDialog(true)}
              className="flex gap-2 items-center justify-center bg-red-500 hover:bg-red-700 text-white transition-colors p-2 rounded-md text-lg"
            >
              <MdDelete className="inline-block" />
              Delete Note
            </button>
          </span>
        }
        lockCloseBtn={isSaving}
      >
        {note != null ? (
          <form
            onSubmit={handleSubmit(handleNoteEdition)}
            className="flex flex-col items-center gap-4"
          >
            <label className="w-full">
              Note Name*
              <input
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
            <button className=" w-full p-4 bg-emerald-500 text-white rounded-2xl shadow-black drop-shadow-sm hover:bg-slate-300 hover:text-emerald-600 transition-all hover:drop-shadow-none dark:hover:bg-slate-600 text-lg flex items-center justify-center h-16 disabled:cursor-not-allowed">
              {isSaving ? (
                <Loader loadingText="Saving Note" size="text-lg" />
              ) : (
                "Save Alterations"
              )}
            </button>
          </form>
        ) : (
          <Loader loadingText="Loading Note" />
        )}
      </Modal>
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onOkay={async () => {
          setIsDeleting(true);
          await notesService.deleteNote(id);
          toast.success("Note Has been Deleted, Redirecting to Notes Page");
          setIsDeleting(false);
          router.push("/dashboard/notes");
        }}
        question="sure you want to delete this note?"
        title="Delete Note"
        declineButtonContent="No"
        okayButtonContent={
          isDeleting ? (
            <Loader loadingText="Deleting Note" size="text-sm" />
          ) : (
            "Yes, Delete"
          )
        }
      />
    </>
  );
}
