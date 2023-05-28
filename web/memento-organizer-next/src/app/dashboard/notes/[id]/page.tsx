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
import { CustomText, Note, TBaseNoteData } from "@/models/data/note";
import {
  LegacyRef,
  Ref,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { withHistory } from "slate-history";
import notesService from "@/services/notes.service";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Loader from "@/app/components/Loader";
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { BaseEditor, Descendant } from "slate";
import { ReactEditor } from "slate-react";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: TBaseNoteData;
    Text: CustomText;
  }
}

type TUpdateNoteFormData = {
  content: TBaseNoteData[];
};

export default function Notes() {
  const noteId = usePathname().split("/")[3];
  const { setValue, getValues } = useForm<TUpdateNoteFormData>();

  const [note, setNote] = useState<Note>();
  const [noteContent, setNoteContent] = useState<TBaseNoteData[]>([]);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [isFetchingNote, setIsFetchingNote] = useState(true);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);

  const noteRef = useRef<HTMLDivElement>(null);
  async function saveNote() {
    setIsSavingNote(true);
    const updateRequest: TUpdateNoteRequest = {
      content: JSON.stringify(getValues("content")),
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
    console.log(noteFetched.content);
    setNoteContent(JSON.parse(noteFetched.content) as TBaseNoteData[]);
    setIsFetchingNote(false);
  }

  useEffect(() => {
    fetchNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const editorId = useId();

  return (
    <>
      <div className="sm:ml-0 ml-5 w-11/12 md:flex-nowrap flex-wrap bg-white dark:bg-slate-700 sticky top-0 px-2 py-4 sm:p-4 flex flex-row items-center justify-between mb-8 drop-shadow-lg z-10 gap-4">
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
      <label
        htmlFor={editorId}
        className="sm:ml-0 ml-5 w-11/12 h-fit min-h-screen bg-white dark:bg-slate-700 sticky  px-2 py-4 sm:p-4 flex flex-col flex-grow flex-shrink-0 mb-8 drop-shadow-lg  gap-4"
      >
        {isFetchingNote ? (
          <Loader loadingText="Fetching Note Data" />
        ) : (
          <Slate
            onChange={(value) => setValue("content", value as TBaseNoteData[])}
            editor={editor}
            value={noteContent}
          >
            {/*bg-slate-300 dark:bg-slate-800 h-full w-full p-2 rounded-lg  resize-none sm:text-xl md:text-2xl text-sm caret-emerald-500 selection:text-emerald-500 selection:bg-slate-200 dark:selection:bg-slate-900"*/}
            <Editable
              id={editorId}
              placeholder="Start Writing"
              className="w-full h-full cursor-text caret-emerald-500 selection:text-emerald-500 selection:bg-slate-200 dark:selection:bg-slate-900"
            />
          </Slate>
        )}
      </label>
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
