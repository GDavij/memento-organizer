"use client";
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from "slate-react";
import { useCallback, useEffect, useMemo } from "react";
import {
  Transforms,
  createEditor,
  Descendant,
  Editor,
  node,
  Path,
  Location,
} from "slate";

import { HistoryEditor, withHistory } from "slate-history";
import isHotkey from "is-hotkey";
import {
  countOrderedListN,
  isMarkActive,
  toggleMark,
} from "@/lib/editor/editor.aux";
import { useEditor } from "../contexts/editor/useEditor";
import Loader from "@/app/components/Loader";
import { TBaseNoteData, hotKeys } from "@/models/data/editorTypes";
import {
  Leaf,
  TextEditorImage,
  renderElement,
  renderLeaf,
} from "@/lib/editor/markdown.aux";
import {
  withImagesFromFiles,
  withMarkdown,
} from "@/lib/editor/editorExtensions.setup";
import { Element } from "@/lib/editor/markdown.aux";
import { renderMarkdown } from "@/lib/editor/renderer";

type TEditorScreenProps = {
  disabled?: boolean;
  initialNoteContent: Descendant[];
  saveNoteCallback: () => Promise<void>;
  editorId: string;
};

export function EditorScreen({
  disabled = false,
  initialNoteContent,
  saveNoteCallback,
  editorId,
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
    noteType,
    setNoteType,
  } = useEditor();

  const editor = useMemo(
    () =>
      withMarkdown(withImagesFromFiles(withHistory(withReact(createEditor())))),
    []
  );

  useEffect(() => {
    setEditor(editor);
    setNoteContent(initialNoteContent);
    return () => setNoteContent([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

        const focusLine = editor.selection!.focus.path[0];
        const dataType = (value as TBaseNoteData[])[focusLine].type;
        if (noteType != dataType) {
          setNoteType(dataType);
        }

        if (isBold != isBoldMark) {
          setIsBold(isBoldMark);
        }

        if (isItalic != isItalicMark) {
          setIsItalic(isItalicMark);
        }

        if (isUnderline != isUnderlineMark) {
          setIsUnderline(isUnderlineMark);
        }
        setNoteContent(value);
      }}
      editor={editor}
      value={noteContent}
    >
      <Editable
        id={editorId}
        renderElement={(props) => renderElement(props, editor, disabled)}
        renderLeaf={(props) => renderLeaf(props)}
        placeholder="Start Writing"
        disabled={disabled}
        spellCheck
        autoFocus
        className="w-full h-full cursor-text caret-emerald-500 selection:text-emerald-500 selection:bg-slate-200 dark:selection:bg-slate-900"
        onKeyDown={async (event) => {
          if (isHotkey("backspace", event as any)) {
            const focusLine = editor.selection!.focus.path[0];
            const dataType = (editor.children as TBaseNoteData[])[focusLine]
              .type;
            if (dataType != noteType) {
              setNoteType(dataType);
            }
          }
          if (isHotkey("enter", event as any)) {
            const focusLine = editor.selection!.focus.path[0];
            const data = (editor.children as TBaseNoteData[])[focusLine];
            if (data.type === "ordered-list") {
              event.preventDefault();
              Transforms.insertNodes(editor, {
                type: "ordered-list",
                children: [
                  { text: `${countOrderedListN(data.children[0].text) + 1}. ` },
                ],
              });
            } else if (data.type === "unordered-list") {
              event.preventDefault();
              Transforms.insertNodes(editor, {
                type: "unordered-list",
                children: [{ text: "- " }],
              });
            }
          }
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
