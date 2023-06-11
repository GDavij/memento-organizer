import { TBaseNoteData, TTextMarks } from "@/models/data/editorTypes";
import { BaseEditor, Editor, Transforms } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor, RenderElementProps, RenderLeafProps } from "slate-react";

export function isMarkActive(
    editor: BaseEditor & ReactEditor & HistoryEditor,
    format: TTextMarks
) {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
}

export function toggleMark(
    editor: BaseEditor & ReactEditor & HistoryEditor,
    format: TTextMarks
) {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
}



export const insertImage = (editor: Editor, url: string) => {
    const text = { text: "" };
    const image: TBaseNoteData = { type: "image", url, children: [text] };
    Transforms.insertNodes(editor, image);
};

export const countOrderedListN = (text: string): number => {
    console.log(text);
    const orderedListProbability = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
    ];
    let count = 0;
    for (let i = 0; i < text.length; i++) {
        if (orderedListProbability.includes(text[i])) {
            count++;
        }
        if (text[i] === ".") {
            break;
        }
    }
    console.log(text.slice(0, count));
    return Number(text.slice(0, count));
};
