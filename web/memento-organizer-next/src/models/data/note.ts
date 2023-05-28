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

type TNoteTypes = "paragraph" | "image";
export type TBaseNoteData = {
  type: TNoteTypes;
  children: CustomText[];
  url?: string;
};

export type CustomText = { text: string };