import { TBaseNoteData, TNoteTypes } from "@/models/data/editorTypes";
import { ReactNode, createContext, useContext, useState } from "react";
import { Descendant, Editor } from "slate";

type TEditorContext = {
  editor: Editor | null;
  setEditor: (editor: Editor) => void;
  noteContent: Descendant[];
  setNoteContent: (newContent: Descendant[]) => void;
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
  setNoteContent(newContent: Descendant[]) {},
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
  const [editorContent, setEditorContent] = useState<Descendant[]>([]);
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
