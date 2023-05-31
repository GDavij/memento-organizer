import { Descendant } from "slate";

export type Note = {
  id: string;
  owner: string;
  name: string;
  description: string;
  content: string;
  issued: string;
  lastUpdate: string;
};

type TNoteTypes = "paragraph"
export type TTextMarks = "bold" | "italic" | "underline"
export type THotKeys = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline"
}

export type TBaseNoteData = {
  type: TNoteTypes;
  children: CustomText[];
  url?: string;
};

export type CustomText = {
  text: string, bold?: boolean;
  italic?: boolean;
  underline?: boolean
};