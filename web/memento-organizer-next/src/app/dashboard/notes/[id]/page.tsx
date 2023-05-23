"use client";
import { TUpdateNoteRequest } from "@/models/requests/noteRequests";
import remarkGfm from "remark-gfm";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import {
  MdAssignmentAdd,
  MdAutorenew,
  MdBuild,
  MdOutlineSquare,
  MdSettings,
  MdVisibility,
} from "react-icons/md";
import EditNoteModal from "./components/EditNoteModal";
import { Note } from "@/models/data/note";
import { LegacyRef, Ref, useEffect, useId, useRef, useState } from "react";
import notesService from "@/services/notes.service";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Loader from "@/app/components/Loader";

export default function Notes() {
  const noteId = usePathname().split("/")[3];

  const [note, setNote] = useState<Note>();
  const [noteContent, setNoteContent] = useState<string>("");

  const [isFetchingNote, setIsFetchingNote] = useState(true);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);

  function togglePreview() {
    if (!isPreviewing) {
      setNoteContent(watch("markdownEditor"));
    } else {
      setValue("markdownEditor", noteContent);
    }
    setIsPreviewing((prev) => !prev);
  }

  async function saveNote() {
    setIsSavingNote(true);
    const updateRequest: TUpdateNoteRequest = {
      content: getValues("markdownEditor"),
    };

    await notesService.updateNote(noteId, updateRequest);
    setIsSavingNote(false);
    console.log("Hello");
    toast.success(`Note "${note!.name}" has been saved`);
  }

  async function fetchNote() {
    setIsFetchingNote(true);
    const noteFetched = await notesService.getNote(noteId);
    setNote(noteFetched);
    setValue("markdownEditor", noteFetched.content);
    setIsFetchingNote(false);
  }

  useEffect(() => {
    fetchNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { register, watch, setValue, getValues } = useForm<{
    markdownEditor: string;
  }>();

  return (
    <>
      <div className="sm:ml-0 ml-5 w-11/12 md:flex-nowrap flex-wrap bg-white dark:bg-slate-700 sticky top-0 px-2 py-4 sm:p-4 flex flex-row items-center justify-between mb-8 drop-shadow-lg z-10 gap-4">
        <button
          onClick={togglePreview}
          className="p-2 bg-emerald-600 hover:bg-emerald-700 transition-colors rounded-lg flex gap-2 items-center w-28 justify-center sm:w-72 text-white flex-grow-0 flex-shrink-0"
        >
          <span className="text-sm sm:text-lg">
            <span className="hidden sm:inline">Toggle Preview - </span>
            {isPreviewing ? "Previewing" : "Editing"}
          </span>
          {isPreviewing ? (
            <MdVisibility className="text-sm sm:text-lg inline" />
          ) : (
            <MdBuild className="text-sm sm:text-lg inline" />
          )}
        </button>
        <span className="flex-grow-0 flex-shrink inline-block max-w-full truncate text-ellipsis sm:text-2xl text-sm">
          {note?.name}
        </span>
        <button
          onClick={() => setIsEditingNote(true)}
          className="p-2 bg-emerald-600 hover:bg-emerald-700 transition-colors rounded-lg text-white flex items-center w-fit justify-center  flex-grow-0 flex-shrink-0"
        >
          <MdSettings className="inline text-xl" />
        </button>
        <button
          disabled={isSavingNote || isFetchingNote}
          onClick={saveNote}
          className={`p-2 bg-emerald-600 hover:bg-emerald-700 transition-colors rounded-lg text-white flex gap-2 items-center sm:w-40 w-28 justify-center disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:text-slate-500 dark:disabled:bg-slate-800 flex-grow-0 flex-shrink-0 ${
            isFetchingNote ? "cursor-not-allowed" : ""
          } ${isSavingNote ? "cursor-progress" : ""}`}
        >
          <span className="sm:text-lg text-sm">
            {isSavingNote ? "Saving" : "Save File"}
          </span>
          <MdOutlineSquare
            className={`sm:text-2xl text-sm inline ${
              isSavingNote ? "animate-spin" : ""
            }`}
          />
        </button>
      </div>
      <div className="sm:ml-0 ml-5 w-11/12  h-5/6 bg-white dark:bg-slate-700 sticky top-0 px-2 py-4 sm:p-4 flex flex-col mb-8 drop-shadow-lg  gap-4">
        {isFetchingNote ? (
          <Loader loadingText="Fetching Note Data" />
        ) : isPreviewing ? (
          <ReactMarkdown
            className="bg-slate-300 dark:bg-slate-800 h-full overflow-ellipsis p-2 rounded-lg overflow-auto flex-nowrap selection:text-emerald-500 selection:bg-slate-200 dark:selection:bg-slate-900"
            remarkPlugins={[remarkGfm]}
            components={{
              a: (props) => (
                <a
                  className="text-emerald-500 font-semibold hover:border-b-2 border-emerald-500 "
                  href={props.href}
                >
                  {props.children}
                </a>
              ),
              h1: (props) => (
                <h1 className="md:text-6xl text-3xl">{props.children}</h1>
              ),
              h2: (props) => (
                <h1 className="md:text-5xl text-2xl">{props.children}</h1>
              ),
              h3: (props) => (
                <h1 className="md:text-4xl text-3xl">{props.children}</h1>
              ),
              h4: (props) => (
                <h1 className="md:text-3xl text-2xl">{props.children}</h1>
              ),
              h5: (props) => (
                <h1 className="md:text-2xl text-xl">{props.children}</h1>
              ),
              h6: (props) => (
                <h1 className="md:text-xl text-lg">{props.children}</h1>
              ),
              hr: (props) => (
                <hr
                  {...props}
                  className="border-slate-400 dark:border-slate-600 mt-2 mb-4"
                />
              ),
              input: (props) =>
                props.type == "checkbox" ? (
                  <input
                    checked={props.checked}
                    type="checkbox"
                    readOnly
                    className="accent-emerald-500 disabled:accent-emerald-500"
                  />
                ) : (
                  <input
                    {...props}
                    className="bg-slate-300 dark:bg-slate-800 outline-none p-6 text-base rounded-md"
                  />
                ),
              li: (props) => (
                <li>
                  <span className="pl-4 pr-2 text-emerald-500">-</span>{" "}
                  {props.children}
                </li>
              ),
            }}
          >
            {noteContent}
          </ReactMarkdown>
        ) : (
          <textarea
            placeholder="Edit Your Note Here (It Works with markdown)"
            {...register("markdownEditor")}
            id="markdown-editor"
            wrap="on"
            className="bg-slate-300 dark:bg-slate-800 h-full w-full p-2 rounded-lg  resize-none sm:text-xl md:text-2xl text-sm caret-emerald-500 selection:text-emerald-500 selection:bg-slate-200 dark:selection:bg-slate-900"
          ></textarea>
        )}
      </div>
      <EditNoteModal
        refetchNoteCb={fetchNote}
        open={note != null && isEditingNote}
        onClose={() => setIsEditingNote(false)}
        id={noteId}
      />
      <ToastContainer />
    </>
  );
}
