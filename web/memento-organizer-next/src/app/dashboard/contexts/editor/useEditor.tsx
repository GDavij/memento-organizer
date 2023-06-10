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
import { TBaseNoteData, TNoteTypes, TTextMarks } from "./editor";

type TEditorContext = {
  editor: Editor | null;
  setEditor: (editor: Editor) => void;
  noteContent: TBaseNoteData[];
  setNoteContent: (newContent: TBaseNoteData[]) => void;
  isBold: boolean;
  setIsBold: (value: boolean) => void;
  isItalic: boolean;
  setIsItalic: (value: boolean) => void;
  isUnderline: boolean;
  setIsUnderline: (value: boolean) => void;
  isEditingNoteMetadata: boolean;
  setIsEditingNoteMetadata: (isEditing: boolean) => void;
  noteType: TNoteTypes;
  setNoteType: (noteType: TNoteTypes) => void;
};

const EditorContext = createContext<TEditorContext>({
  editor: null,
  setEditor(editor: Editor) {},
  noteContent: [{ type: "paragraph", children: [{ text: "" }] }],
  setNoteContent(newContent: TBaseNoteData[]) {},
  isBold: false,
  setIsBold(newValue: boolean) {},
  isItalic: false,
  setIsItalic(newValue: boolean) {},
  isUnderline: false,
  setIsUnderline(newValue: boolean) {},
  isEditingNoteMetadata: false,
  setIsEditingNoteMetadata(isEditing: boolean) {},
  noteType: "paragraph",
  setNoteType(noteType: TNoteTypes) {},
});

export function EditorProvider({ children }: { children: ReactNode }) {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [editorContent, setEditorContent] = useState<TBaseNoteData[]>([]);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isEditingNoteMetadata, setIsEditingNoteMetadata] = useState(false);
  const [noteType, setNoteType] = useState<TNoteTypes>("paragraph");

  const editorActions: TEditorContext = {
    editor: editor,
    setEditor(editor: Editor) {
      setEditor(editor);
    },
    noteContent: editorContent,
    setNoteContent(newContent) {
      setEditorContent(newContent);
    },
    isBold,
    setIsBold(newValue: boolean) {
      setIsBold(newValue);
    },
    isItalic,
    setIsItalic(newValue: boolean) {
      setIsItalic(newValue);
    },
    isUnderline,
    setIsUnderline(newValue: boolean) {
      setIsUnderline(newValue);
    },
    isEditingNoteMetadata,
    setIsEditingNoteMetadata: (isEditing: boolean) => {
      setIsEditingNoteMetadata(isEditing);
    },
    noteType,
    setNoteType(noteType: TNoteTypes) {
      setNoteType(noteType);
    },
  };

  return (
    <EditorContext.Provider value={editorActions}>
      {children}
    </EditorContext.Provider>
  );
}

export const useEditor = () => useContext(EditorContext);

//Context Function for Use on Toolbar
export function isMarkActive(
  editor: BaseEditor & ReactEditor,
  format: TTextMarks
) {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

export function toggleMark(
  editor: BaseEditor & ReactEditor,
  format: TTextMarks
) {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}
