"use client";
import { TUpdateNoteRequest } from "@/models/requests/noteRequests";
import {
  MdAssignmentAdd,
  MdAutorenew,
  MdBuild,
  MdDelete,
  MdFormatAlignCenter,
  MdFormatAlignJustify,
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdOutlineSquare,
  MdSettings,
  MdVisibility,
} from "react-icons/md";
import isHotkey from "is-hotkey";
import EditNoteModal from "./components/EditNoteModal";

import Image from "next/image";
import {
  LegacyRef,
  Ref,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { HistoryEditor, withHistory } from "slate-history";
import notesService from "@/services/notes.service";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Loader from "@/app/components/Loader";
import {
  Descendant,
  Editor,
  Location,
  NodeEntry,
  Transforms,
  createEditor,
  insertNode,
} from "slate";
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from "slate-react";
import { BaseEditor, Element as SlateElement, Node as SlateNode } from "slate";
import { ReactEditor } from "slate-react";
import { EditorScreen, TBaseNoteData } from "../../contexts/editor/editor";
import {
  isMarkActive,
  toggleMark,
  useEditor,
} from "../../contexts/editor/useEditor";
import { Note } from "@/models/data/note";

export default function Notes() {
  const noteId = usePathname().split("/")[3];

  const [isFetchingNote, setIsFetchingNote] = useState(true);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const editorContext = useEditor();
  const [note, setNote] = useState<Note | null>(null);

  async function saveNote() {
    setIsSavingNote(true);
    const updateRequest: TUpdateNoteRequest = {
      content: JSON.stringify(editorContext.noteContent),
    };
    await notesService.updateNote(noteId, updateRequest);
    setIsSavingNote(false);
    toast.success(`Note "${note!.name}" has been saved`);
  }

  async function fetchNote() {
    setIsFetchingNote(true);
    console.log(note);
    const noteFetched = await notesService.getNote(noteId);
    console.log(noteFetched);
    setNote(noteFetched);
    setIsFetchingNote(false);
  }

  useEffect(() => {
    fetchNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editorId = useId();

  return (
    <>
      <div className="sm:ml-0 ml-5 w-11/12 md:flex-nowrap flex-wrap bg-white dark:bg-slate-700 sticky top-0 px-2 py-4 sm:p-4 flex flex-col items-start justify-start mb-8 drop-shadow-lg z-10 gap-4">
        <div className="flex w-full justify-between gap-4">
          <div className="flex items-center flex-wrap md:w-[60%] w-full h-full p-2 bg-slate-200 dark:bg-slate-800 rounded-lg gap-8">
            <button
              onClick={() => {
                toggleMark(editorContext.editor!, "bold");
                editorContext.setIsBold(
                  isMarkActive(editorContext.editor!, "bold")
                );
              }}
              className={`grid place-content-center text-xl ${
                editorContext.isBold ? "text-emerald-500" : ""
              }
              }`}
            >
              <MdFormatBold />
            </button>
            <button
              onClick={() => {
                toggleMark(editorContext.editor!, "italic");
                editorContext.setIsItalic(
                  isMarkActive(editorContext.editor!, "italic")
                );
              }}
              className={`grid place-content-center text-xl ${
                editorContext.isItalic ? "text-emerald-500" : ""
              }`}
            >
              <MdFormatItalic />
            </button>
            <button
              onClick={() => {
                toggleMark(editorContext.editor!, "underline");
                editorContext.setIsUnderline(
                  isMarkActive(editorContext.editor!, "underline")
                );
              }}
              className={`grid place-content-center text-xl 
              ${editorContext.isUnderline ? "text-emerald-500" : ""}
              `}
            >
              <MdFormatUnderlined />
            </button>
          </div>

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
      </div>
      <label
        htmlFor={editorId}
        className="sm:ml-0 ml-5 w-11/12 h-fit min-h-screen bg-white dark:bg-slate-700 sticky  px-2 py-4 sm:p-4 flex flex-col flex-grow flex-shrink-0 mb-8 drop-shadow-lg  gap-4"
      >
        {note ? (
          <EditorScreen
            disabled={false}
            initialNoteContent={JSON.parse(note.content) as TBaseNoteData[]}
            saveNoteCallback={saveNote}
          />
        ) : (
          <Loader loadingText="Fetching Note Data " />
        )}
      </label>
      <EditNoteModal
        refetchNoteCb={fetchNote}
        open={
          {
            /*note != null*/
          } && isEditingNote
        }
        onClose={() => setIsEditingNote(false)}
        id={noteId}
      />
      <ToastContainer />
    </>
  );
}
