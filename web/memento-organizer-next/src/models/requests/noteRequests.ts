export type TCreateNoteRequest = {
  name: string;
  description?: string;
};

export type TUpdateNoteRequest = {
  name?: string;
  description?: string;
  content?: string;
};
