export type TCreateNoteRequest = {
  name: string;
  description: string;
  content: string;
};

export type TUpdateNoteRequest = {
  name?: string;
  description?: string;
  content?: string;
};
