import { BaseEditor } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";



export type Note = {
  id: string;
  owner: string;
  name: string;
  description: string;
  content: string;
  issued: string;
  lastUpdate: string;
};


export type TMarkdownTypes =
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "heading-4"
  | "heading-5"
  | "heading-6"
  | "unordered-list"
  | "ordered-list";
export const markdownTypes: TMarkdownTypes[] = [
  "heading-1",
  "heading-2",
  "heading-3",
  "heading-4",
  "heading-5",
  "heading-6",
  "unordered-list",
  "ordered-list",
];

export type THotKeys = {
  "mod+b": "bold";
  "mod+i": "italic";
  "mod+u": "underline";
};
export const hotKeys: THotKeys = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
};

export type TNoteTypes = "paragraph" | "image" | TMarkdownTypes;
export type TTextMarks = "bold" | "italic" | "underline";
export type TBaseText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

export type TBaseNoteData = {
  type: TNoteTypes;
  children: TBaseText[];
  url?: string;
};


