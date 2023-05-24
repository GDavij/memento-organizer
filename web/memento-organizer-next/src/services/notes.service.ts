import axios from "@/lib/axios.setup";
import { Note } from "@/models/data/note";
import {
  TCreateNoteRequest,
  TUpdateNoteRequest,
} from "@/models/requests/noteRequests";

//? Maybe Create Request Validators inside these services

async function createNote(request: TCreateNoteRequest): Promise<string> {
  return (await axios.post<{ id: string }>("/notes/new", request)).data.id;
}

async function getNotesByOwner(): Promise<Note[]> {
  return (await axios.get("/notes/find")).data;
}

async function getNote(id: string): Promise<Note> {
  return (await axios.get(`/notes/find/${id}`)).data;
}

async function updateNote(
  id: string,
  updateRequest: TUpdateNoteRequest
): Promise<boolean> {
  return (await axios.put(`/notes/update/${id}`, updateRequest)).data;
}

async function deleteNote(id: string): Promise<boolean> {
  return (await axios.delete(`/notes/delete/${id}`)).data;
}

const service = {
  createNote,
  getNotesByOwner,
  getNote,
  updateNote,
  deleteNote,
};

export default service;
