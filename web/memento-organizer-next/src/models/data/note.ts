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


export type TMarkdownTypes = "heading-1" | "heading-2" | "heading-3" | "heading-4" | "heading-5" | "heading-6" | "unorded-list";
export const markdownTypes: TMarkdownTypes[] = ["heading-1", "heading-2", "heading-3", "heading-4", "heading-5", "heading-6", "unorded-list"]
type TNoteTypes = "paragraph" | "image" | TMarkdownTypes;
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