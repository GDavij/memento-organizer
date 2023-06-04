"use client";
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from "slate-react";
import {
  Dispatch,
  Provider,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  BaseEditor,
  Editor,
  Transforms,
  createEditor,
  Element as SlateElement,
  Node as SlateNode,
  NodeEntry,
} from "slate";
import { HistoryEditor, withHistory } from "slate-history";
import isHotkey from "is-hotkey";
import { MdDelete } from "react-icons/md";
import { isMarkActive, toggleMark, useEditor } from "./useEditor";
import Loader from "@/app/components/Loader";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: TBaseNoteData;
    Text: CustomText;
  }
}

export type THotKeys = {
  "mod+b": "bold";
  "mod+i": "italic";
  "mod+u": "underline";
};

export type TMarkdownTypes =
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "heading-4"
  | "heading-5"
  | "heading-6"
  | "unorded-list";
export const markdownTypes: TMarkdownTypes[] = [
  "heading-1",
  "heading-2",
  "heading-3",
  "heading-4",
  "heading-5",
  "heading-6",
  "unorded-list",
];
type TNoteTypes = "paragraph" | "image" | TMarkdownTypes;
export type TTextMarks = "bold" | "italic" | "underline";
export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

export type TBaseNoteData = {
  type: TNoteTypes;
  children: CustomText[];
  url?: string;
};

type TEditorScreenProps = {
  disabled: boolean;
  initialNoteContent: TBaseNoteData[];
  saveNoteCallback: () => Promise<void>;
};

export function EditorScreen({
  disabled,
  initialNoteContent,
  saveNoteCallback,
}: TEditorScreenProps) {
  const {
    setEditor,
    noteContent,
    setNoteContent,
    isBold,
    setIsBold,
    isItalic,
    setIsItalic,
    isUnderline,
    setIsUnderline,
  } = useEditor();

  const editor = useMemo(
    () =>
      withMarkdown(withImagesFromFiles(withHistory(withReact(createEditor())))),
    []
  );

  useEffect(() => {
    console.log(editor);
    setEditor(editor);
    console.log(initialNoteContent);
    setNoteContent(initialNoteContent);
    return () => setNoteContent([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );

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

  function Leaf({ attributes, children, leaf }: RenderLeafProps) {
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

  return noteContent.length <= 0 ? (
    <Loader loadingText="Loading Editor" />
  ) : (
    <Slate
      onChange={(value) => {
        //? Maybe this is not the best implementation of this.
        // But till now it lead to several performance improvement
        // This improvement is probaly because of less eventHandlers to work on this component
        const isBoldMark = isMarkActive(editor, "bold");
        const isItalicMark = isMarkActive(editor, "italic");
        const isUnderlineMark = isMarkActive(editor, "underline");
        if (isBold != isBoldMark) {
          setIsBold(isBoldMark);
        }

        if (isItalic != isItalicMark) {
          setIsItalic(isItalicMark);
        }

        if (isUnderline != isUnderlineMark) {
          setIsUnderline(isUnderlineMark);
        }
        setNoteContent(value as TBaseNoteData[]);
      }}
      editor={editor}
      value={noteContent as TBaseNoteData[]}
    >
      <Editable
        value={JSON.stringify(noteContent)}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Start Writing"
        disabled={disabled}
        spellCheck
        autoFocus
        className="w-full h-full cursor-text caret-emerald-500 selection:text-emerald-500 selection:bg-slate-200 dark:selection:bg-slate-900"
        onKeyDown={async (event) => {
          //TODO: Refactor the hotKeys
          if (isHotkey("mod+s", event as any)) {
            event.preventDefault();
            await saveNoteCallback();
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
  );
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
