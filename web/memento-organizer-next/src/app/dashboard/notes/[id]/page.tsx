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
  MdOutlineFormatListBulleted,
  MdOutlineFormatListNumbered,
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
import {
  EditorScreen,
  TBaseNoteData,
  TNoteTypes,
} from "../../contexts/editor/editor";
import {
  isMarkActive,
  toggleMark,
  useEditor,
} from "../../contexts/editor/useEditor";
import { Note } from "@/models/data/note";
import { useTopBar } from "../../contexts/useTopBar";
const removeLastHeading = (text: string, lastHeading: TNoteTypes) => {
  switch (lastHeading) {
    case "heading-1":
      return text.slice(1, text.length);
    case "heading-2":
      return text.slice(2, text.length);
    case "heading-3":
      return text.slice(3, text.length);
    case "heading-4":
      return text.slice(4, text.length);
    case "heading-5":
      return text.slice(5, text.length);
    case "heading-6":
      return text.slice(6, text.length);
    case "unordered-list":
      return text.slice(1, text.length);
    case "ordered-list":
      return text.slice(4, text.length);
  }
  return text;
};
export default function Notes() {
  const { setPageDetails } = useTopBar();

  const noteId = usePathname().split("/")[3];

  const [isFetchingNote, setIsFetchingNote] = useState(true);
  const [isSavingNote, setIsSavingNote] = useState(false);
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
    setPageDetails({
      pageName: noteFetched.name,
      editorOptionsContext: noteFetched,
    });
    setIsFetchingNote(false);
  }

  useEffect(() => {
    if (editorContext.isEditingNoteMetadata) {
      editorContext.setIsEditingNoteMetadata(false);
    }
    fetchNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editorId = useId();

  const auxilarMarkdownFuntion = (
    markSymbolizer: string,
    noteTypeCondition: TNoteTypes,
    actualType: TNoteTypes
  ) => {
    const line = editorContext.editor!.selection!.focus.path[0];
    if (actualType != noteTypeCondition) {
      if (Number.isInteger(line)) {
        const data = editorContext.noteContent[line];
        if (data.type == "image") {
          return;
        } else {
          let old = data.children[0].text;
          old = markSymbolizer + removeLastHeading(old, actualType);

          Transforms.insertText(editorContext.editor!, old, {
            at: [line, 0],
          });
          console.log(noteTypeCondition + " - Test");
          Transforms.setNodes(editorContext.editor!, {
            type: noteTypeCondition,
          });
        }
      }
    } else {
      if (Number.isInteger(line)) {
        const data = editorContext.noteContent[line];
        if (data.type == "image") {
          return;
        } else {
          let old = data.children[0].text;
          old = removeLastHeading(old, noteTypeCondition);
          Transforms.insertText(editorContext.editor!, old, {
            at: [line, 0],
          });
          console.log("Paragraph - Test");
          Transforms.setNodes(editorContext.editor!, {
            type: "paragraph",
          });
        }
      }
    }
  };

  return (
    <>
      <div className="sm:ml-0 ml-5 w-11/12 md:flex-nowrap flex-wrap bg-white dark:bg-slate-700 sticky top-0 px-2 py-4 sm:p-4 flex flex-col items-start justify-start mb-8 drop-shadow-lg z-10 gap-4">
        <div className="flex w-full justify-between gap-4">
          <div className="flex items-center overflow-auto flex-nowrap md:w-[60%] w-full h-full p-2 bg-slate-200 dark:bg-slate-800 rounded-lg gap-8">
            <button
              onClick={() => {
                toggleMark(editorContext.editor!, "bold");
                editorContext.setIsBold(
                  isMarkActive(editorContext.editor!, "bold")
                );
                document.getElementById(editorId)?.focus();
              }}
              className={`grid place-content-center text-xl ${
                editorContext.isBold ? "text-emerald-500" : ""
              }
              }`}>
              <MdFormatBold />
            </button>
            <button
              onClick={() => {
                toggleMark(editorContext.editor!, "italic");
                editorContext.setIsItalic(
                  isMarkActive(editorContext.editor!, "italic")
                );
                document.getElementById(editorId)?.focus();
              }}
              className={`grid place-content-center text-xl ${
                editorContext.isItalic ? "text-emerald-500" : ""
              }`}>
              <MdFormatItalic />
            </button>
            <button
              onClick={() => {
                toggleMark(editorContext.editor!, "underline");
                editorContext.setIsUnderline(
                  isMarkActive(editorContext.editor!, "underline")
                );
                document.getElementById(editorId)?.focus();
              }}
              className={`grid place-content-center text-xl 
              ${editorContext.isUnderline ? "text-emerald-500" : ""}
              `}>
              <MdFormatUnderlined />
            </button>
            <button
              onClick={() => {
                document.getElementById(editorId)?.focus();
                auxilarMarkdownFuntion(
                  "# ",
                  "heading-1",
                  editorContext.noteType
                );
              }}
              className={`grid place-content-center text-xl 
              ${
                editorContext.noteType === "heading-1" ? "text-emerald-500" : ""
              }
              `}>
              H1
            </button>
            <button
              onClick={() => {
                document.getElementById(editorId)?.focus();
                auxilarMarkdownFuntion(
                  "## ",
                  "heading-2",
                  editorContext.noteType
                );
              }}
              className={`grid place-content-center text-xl 
              ${
                editorContext.noteType === "heading-2" ? "text-emerald-500" : ""
              }
              `}>
              H2
            </button>
            <button
              onClick={() => {
                document.getElementById(editorId)?.focus();
                auxilarMarkdownFuntion(
                  "### ",
                  "heading-3",
                  editorContext.noteType
                );
              }}
              className={`grid place-content-center text-xl 
              ${
                editorContext.noteType === "heading-3" ? "text-emerald-500" : ""
              }
              `}>
              H3
            </button>
            <button
              onClick={() => {
                document.getElementById(editorId)?.focus();
                auxilarMarkdownFuntion(
                  "#### ",
                  "heading-4",
                  editorContext.noteType
                );
              }}
              className={`grid place-content-center text-xl 
              ${
                editorContext.noteType === "heading-4" ? "text-emerald-500" : ""
              }
              `}>
              H4
            </button>
            <button
              onClick={() => {
                document.getElementById(editorId)?.focus();
                auxilarMarkdownFuntion(
                  "##### ",
                  "heading-5",
                  editorContext.noteType
                );
              }}
              className={`grid place-content-center text-xl 
              ${
                editorContext.noteType === "heading-5" ? "text-emerald-500" : ""
              }
              `}>
              H5
            </button>
            <button
              onClick={() => {
                document.getElementById(editorId)?.focus();
                auxilarMarkdownFuntion(
                  "###### ",
                  "heading-6",
                  editorContext.noteType
                );
              }}
              className={`grid place-content-center text-xl 
              ${
                editorContext.noteType === "heading-6" ? "text-emerald-500" : ""
              }
              `}>
              H6
            </button>
            <button
              onClick={() => {
                document.getElementById(editorId)?.focus();
                auxilarMarkdownFuntion(
                  "- ",
                  "unordered-list",
                  editorContext.noteType
                );
              }}
              className={`grid place-content-center text-xl 
              ${
                editorContext.noteType === "unordered-list"
                  ? "text-emerald-500"
                  : ""
              }
              `}>
              <MdOutlineFormatListBulleted />
            </button>
            <button
              onClick={() => {
                document.getElementById(editorId)?.focus();
                auxilarMarkdownFuntion(
                  "1. ",
                  "ordered-list",
                  editorContext.noteType
                );
              }}
              className={`grid place-content-center text-xl 
              ${
                editorContext.noteType === "ordered-list"
                  ? "text-emerald-500"
                  : ""
              }
              `}>
              <MdOutlineFormatListNumbered />
            </button>
          </div>

          <button
            disabled={isSavingNote || isFetchingNote}
            onClick={() => {
              document.getElementById(editorId)?.focus();
              saveNote();
            }}
            className={`p-2 bg-emerald-600 hover:bg-emerald-700 transition-colors rounded-lg text-white flex gap-2 items-center sm:w-40 w-28 justify-center disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:text-slate-500 dark:disabled:bg-slate-800 flex-grow-0 flex-shrink-0 ${
              isFetchingNote ? "cursor-not-allowed" : ""
            } ${isSavingNote ? "cursor-progress" : ""}`}>
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
        className="sm:ml-0 ml-5 w-11/12 h-fit min-h-screen bg-white dark:bg-slate-700 sticky  px-2 py-4 sm:p-4 flex flex-col flex-grow flex-shrink-0 mb-8 drop-shadow-lg  gap-4">
        {note ? (
          <EditorScreen
            editorId={editorId}
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
        open={editorContext.isEditingNoteMetadata}
        onClose={() => editorContext.setIsEditingNoteMetadata(false)}
        id={noteId}
      />
      <ToastContainer />
    </>
  );
}
