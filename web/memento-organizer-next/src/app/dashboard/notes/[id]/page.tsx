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
import {
  CustomText,
  Note,
  TBaseNoteData,
  THotKeys,
  TMarkdownTypes,
  TTextMarks,
  markdownTypes,
} from "@/models/data/note";
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

const withImagesFromFiles = (editor: Editor) => {
  const { isVoid, insertData } = editor;

  editor.isVoid = (element) =>
    element.type === "image" ? true : isVoid(element);

  editor.insertData = (data) => {
    console.log({ data });
    const { files } = data;
    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split("/");

        if (mime === "image") {
          reader.addEventListener("load", () => {
            const url: string = reader.result as string;
            insertImage(editor, url);
          });

          reader.readAsDataURL(file);
        }
      }
    } else {
      insertData(data);
    }
  };
  return editor;
};

const withMarkdown = (editor: Editor) => {
  const { node, onChange, nodes } = editor;
  editor.onChange = (options) => {
    if (options?.operation?.type == "insert_text") {
      renderMarkdown(editor, node((options.operation as any).path));
    }

    onChange(options);
  };

  return editor;
};

export default function Notes() {
  const noteId = usePathname().split("/")[3];
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const editor = useMemo(
    () =>
      withMarkdown(withImagesFromFiles(withHistory(withReact(createEditor())))),
    []
  );

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

  function Element(props: RenderElementProps) {
    switch (props.element.type) {
      case "image":
        return <TextEditorImage editor={editor} renderProps={props} />;
      case "heading-1":
        return (
          <h1 className="text-7xl" {...props.attributes}>
            {props.children}
          </h1>
        );
      case "heading-2":
        return (
          <h1 className="text-6xl" {...props.attributes}>
            {props.children}
          </h1>
        );
      case "heading-3":
        return (
          <h1 className="text-5xl" {...props.attributes}>
            {props.children}
          </h1>
        );
      case "heading-4":
        return (
          <h1 className="text-4xl" {...props.attributes}>
            {props.children}
          </h1>
        );
      case "heading-5":
        return (
          <h1 className="text-3xl" {...props.attributes}>
            {props.children}
          </h1>
        );
      case "heading-6":
        return (
          <h1 className="text-2xl" {...props.attributes}>
            {props.children}
          </h1>
        );
      case "unorded-list":
        return (
          <ul className=" list-none h-fit w-fit " {...props.attributes}>
            <li className="text-emerald-500 text-xl ">{props.children}</li>
          </ul>
        );
    }
    return <p {...props.attributes}>{props.children}</p>;
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
                  (editor as unknown as HistoryEditor).undo();
                } else if (isHotkey("mod+y", event)) {
                  event.preventDefault();
                  (editor as unknown as HistoryEditor).redo();
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

const insertImage = (editor: Editor, url: string) => {
  const text = { text: "" };
  const image: TBaseNoteData = { type: "image", url, children: [text] };
  Transforms.insertNodes(editor, image);
};
const renderMarkdown = (editor: Editor, nodeEntry: NodeEntry) => {
  let text = (nodeEntry[0] as { text: string }).text;

  let headers = 0;
  if (text[0] === "#") {
    headers++;
    for (let i = 1; i < 6; i++) {
      if (text[i] === "#") {
        headers++;
      }
    }
    if (text[headers] == " ") {
      switch (headers) {
        case 1:
          Transforms.setNodes(editor, {
            type: "heading-1",
          });
          break;
        case 2:
          Transforms.setNodes(editor, {
            type: "heading-2",
          });
          break;
        case 3:
          Transforms.setNodes(editor, {
            type: "heading-3",
          });
          break;
        case 4:
          Transforms.setNodes(editor, {
            type: "heading-4",
          });
          break;
        case 5:
          Transforms.setNodes(editor, {
            type: "heading-5",
          });
          break;
        case 6:
          Transforms.setNodes(editor, {
            type: "heading-6",
          });
          break;
      }
      return;
    }
  }

  if (text[0] === "-" && text[1] === " ") {
    Transforms.setNodes(editor, { type: "unorded-list" });
    return;
  }
  Transforms.setNodes(editor, {
    type: "paragraph",
  });
  // Transforms.insertNodes(editor, markdown);
};

type TTextEditorImageProps = {
  editor: Editor;
  renderProps: RenderElementProps;
};
function TextEditorImage(props: TTextEditorImageProps) {
  const path = ReactEditor.findPath(props.editor, props.renderProps.element);
  return (
    <div
      {...props.renderProps.attributes}
      className="flex w-fit h-fit items-start"
    >
      {/* eslint-disable-next-line @next/next/no-img-element*/}
      <img
        src={props.renderProps.element.url!}
        alt={"Image Could not be loaded or is unavaible"}
      />
      <button
        onClick={() => Transforms.removeNodes(props.editor, { at: path })}
        className="flex text-red-500 text-2xl -translate-x-8 z-20 translate-y-2"
      >
        <MdDelete />
      </button>
      {props.renderProps.children}
    </div>
  );
}
