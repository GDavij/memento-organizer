"use client";
import { TUpdateNoteRequest } from "@/models/requests/noteRequests";
import {
  MdAssignmentAdd,
  MdAutorenew,
  MdBuild,
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
import {
  CustomText,
  Note,
  TBaseNoteData,
  THotKeys,
  TTextMarks,
} from "@/models/data/note";
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
import { withHistory } from "slate-history";
import notesService from "@/services/notes.service";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Loader from "@/app/components/Loader";
import { Editor, Location, Transforms, createEditor } from "slate";
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from "slate-react";
import { BaseEditor, Descendant } from "slate";
import { ReactEditor } from "slate-react";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: TBaseNoteData;
    Text: CustomText;
  }
}

const hotKeys: THotKeys = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
};

export default function Notes() {
  const noteId = usePathname().split("/")[3];
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );

  const [note, setNote] = useState<Note>();
  const [initialNoteContent, setInitialNoteContent] = useState<TBaseNoteData[]>(
    []
  );
  const [noteContent, setNoteContent] = useState<TBaseNoteData[]>([]);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const [isFetchingNote, setIsFetchingNote] = useState(true);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);

  async function saveNote() {
    setIsSavingNote(true);
    const updateRequest: TUpdateNoteRequest = {
      content: JSON.stringify(noteContent),
    };
    await notesService.updateNote(noteId, updateRequest);
    setIsSavingNote(false);
    toast.success(`Note "${note!.name}" has been saved`);
  }

  async function fetchNote() {
    setIsFetchingNote(true);
    const noteFetched = await notesService.getNote(noteId);
    setNote(noteFetched);
    setInitialNoteContent(JSON.parse(noteFetched.content) as TBaseNoteData[]);
    setNoteContent(JSON.parse(noteFetched.content) as TBaseNoteData[]);

    setIsFetchingNote(false);
  }

  useEffect(() => {
    fetchNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editorId = useId();

  function isMarkActive(editor: BaseEditor & ReactEditor, format: TTextMarks) {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  }

  function toggleMark(editor: BaseEditor & ReactEditor, format: TTextMarks) {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  }
  const [isBoldMark, setIsBoldMark] = useState(false);
  const [isItalicMark, setIsItalicMark] = useState(false);
  const [isUnderlineMark, setIsUnderlineMark] = useState(false);

  return (
    <>
      <div className="sm:ml-0 ml-5 w-11/12 md:flex-nowrap flex-wrap bg-white dark:bg-slate-700 sticky top-0 px-2 py-4 sm:p-4 flex flex-col items-start justify-start mb-8 drop-shadow-lg z-10 gap-4">
        <div className="flex w-full justify-between gap-4">
          <div className="flex items-center flex-wrap md:w-[60%] w-full h-full p-2 bg-slate-200 dark:bg-slate-800 rounded-lg gap-8">
            <button
              onClick={() => {
                toggleMark(editor, "bold");
                setIsBoldMark(isMarkActive(editor, "bold"));
              }}
              className={`grid place-content-center text-xl ${
                isBoldMark ? "text-emerald-500" : ""
              }`}
            >
              <MdFormatBold />
            </button>
            <button
              onClick={() => {
                toggleMark(editor, "italic");
                setIsItalicMark(isMarkActive(editor, "italic"));
              }}
              className={`grid place-content-center text-xl ${
                isItalicMark ? "text-emerald-500" : ""
              }`}
            >
              <MdFormatItalic />
            </button>
            <button
              onClick={() => {
                toggleMark(editor, "underline");
                setIsUnderlineMark(isMarkActive(editor, "underline"));
              }}
              className={`grid place-content-center text-xl ${
                isUnderlineMark ? "text-emerald-500" : ""
              }`}
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
        {isFetchingNote ? (
          <Loader loadingText="Fetching Note Data" />
        ) : (
          <Slate
            onChange={(value) => {
              //? Maybe this is not the best implementation of this.
              // But till now it lead to several performance improvement
              // This improvement is probaly because of less eventHandlers to work on this component
              const isBold = isMarkActive(editor, "bold");
              const isItalic = isMarkActive(editor, "italic");
              const isUnderline = isMarkActive(editor, "underline");
              if (isBold != isBoldMark) {
                setIsBoldMark(isBold);
              }

              if (isItalic != isItalicMark) {
                setIsItalicMark(isItalic);
              }

              if (isUnderline != isUnderlineMark) {
                setIsUnderlineMark(isUnderline);
              }

              setNoteContent(value as TBaseNoteData[]);
            }}
            editor={editor}
            value={initialNoteContent}
          >
            {/*
            //! Maybe create a Select Context in Future Component, should improve UX
             */}
            <Editable
              value={JSON.stringify(noteContent)}
              id={editorId}
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder="Start Writing"
              spellCheck
              autoFocus
              className="w-full h-full cursor-text caret-emerald-500 selection:text-emerald-500 selection:bg-slate-200 dark:selection:bg-slate-900"
              onKeyDown={async (event) => {
                //TODO: Refactor the hotKeys
                if (isHotkey("mod+s", event as any)) {
                  event.preventDefault();
                  await saveNote();
                } else if (isHotkey("mod+z", event)) {
                  event.preventDefault();
                  editor.undo();
                } else if (isHotkey("mod+y", event)) {
                  event.preventDefault();
                  editor.redo();
                } else if (isHotkey("tab", event as any)) {
                  event.preventDefault();
                  Transforms.insertText(editor, "   ");
                } else {
                  for (const hotkey in hotKeys) {
                    if (isHotkey(hotkey, event as any)) {
                      event.preventDefault();
                      //@ts-ignore
                      const mark = hotKeys[hotkey];
                      toggleMark(editor, mark);
                    }
                  }
                }
              }}
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

function Element({ attributes, children, element }: RenderElementProps) {
  // switch (element.type) {
  //   case "paragraph":
  //     return <p {...attributes}>{children}</p>;
  // }
  return <p {...attributes}>{children}</p>;
}

function Leaf({ attributes, children, leaf, text }: RenderLeafProps) {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
}
