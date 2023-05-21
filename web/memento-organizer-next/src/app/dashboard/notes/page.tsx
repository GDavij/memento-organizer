"use client";

import {
  MdAssignment,
  MdAssignmentAdd,
  MdAutorenew,
  MdClose,
  MdLockClock,
  MdOutlineSquare,
} from "react-icons/md";
import { Note } from "@/models/data/note";
import { Ref, useEffect, useId, useRef, useState } from "react";
import notesService from "@/services/notes.service";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Loader from "@/app/components/Loader";
import { useForm } from "react-hook-form";

export default function Notes() {
  type TFilterOptions =
    | "Id"
    | "Name"
    | "Description"
    | "Content"
    | "Issued Date";
  const filterOptions: TFilterOptions[] = [
    "Id",
    "Name",
    "Description",
    "Content",
    "Issued Date",
  ];
  const { watch, register } = useForm<{
    filterType: TFilterOptions;
    filterData: string;
  }>({ defaultValues: { filterData: "", filterType: "Id" } });

  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [openCreateNoteModal, setOpenCreateModal] = useState(false);
  const [isFetchingNotes, setIsFetchingNotes] = useState(true);

  function filterSearch(item: Note, index: number): boolean {
    switch (watch("filterType")) {
      case "Id":
        return item.id
          .toUpperCase()
          .includes(watch("filterData").toUpperCase());
      case "Name":
        return item.name
          .toUpperCase()
          .includes(watch("filterData").toUpperCase());
      case "Description":
        return item.description
          .toUpperCase()
          .includes(watch("filterData").toUpperCase());
      case "Content":
        return item.content
          .toUpperCase()
          .includes(watch("filterData").toUpperCase());
      case "Issued Date":
        return item.issued
          .toUpperCase()
          .includes(watch("filterData").toUpperCase());
    }
  }

  useEffect(() => {
    setFilteredNotes(notes.filter(filterSearch));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("filterData"), watch("filterType")]);

  async function fetchNotes() {
    setIsFetchingNotes(true);
    const aux = await notesService.getNotesByOwner();
    console.log(aux);
    setNotes(aux);
    setFilteredNotes(aux.filter(filterSearch));
    setIsFetchingNotes(false);
    toast.success("Notes fetched with sucess");
  }
  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterId = useId();

  return (
    <>
      <div className="sm:ml-0 ml-5 w-11/12  bg-white dark:bg-slate-700 sticky top-0 px-2 py-4 sm:p-4 flex flex-row-reverse items-center mb-8 drop-shadow-lg z-10 gap-4">
        <button
          onClick={() => setOpenCreateModal((prev) => !prev)}
          className=" sm:w-64 w-44 p-2 sm:p-4  text-sm sm:text-md bg-emerald-500 rounded-lg  text-white font-bold hover:bg-emerald-600 transition-colors flex gap-2"
        >
          Create New Note <MdAssignmentAdd className="inline text-lg" />
        </button>
        <button
          disabled={isFetchingNotes}
          onClick={fetchNotes}
          className="  items-center justify-center sm:w-64 w-36 p-2 sm:p-4 text-sm sm:text-md bg-emerald-500 rounded-lg  text-white font-bold hover:bg-emerald-600 transition-colors flex gap-2 disabled:cursor-progress disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:text-slate-500 dark:disabled:bg-slate-800 "
        >
          Refresh Notes
          <span
            className={`inline-block  ${isFetchingNotes && "animate-spin"} `}
          >
            <MdAutorenew className="inline text-lg" />
          </span>
        </button>

        <label
          htmlFor={filterId}
          className="w-full h-4/6 bg-slate-300 dark:bg-slate-800 outline-none  text-base rounded-md md:flex items-center gap-4 justify-center p-2 hidden"
        >
          <span className=" h-full flex items-center w-2/6">
            <div className="w-32">Filter by:</div>
            <select
              className="bg-transparent w-full h-full outline-none"
              {...register("filterType")}
            >
              {filterOptions.map((option) => (
                <option
                  value={option}
                  key={option}
                  className="bg-slate-300 dark:bg-slate-800 "
                >
                  {option}
                </option>
              ))}
            </select>
          </span>
          <input
            {...register("filterData")}
            id={filterId}
            type="search"
            placeholder="filter"
            className="bg-transparent w-full h-full outline-none pl-4 border-b-2 border-emerald-500 caret-emerald-500"
          />
        </label>
      </div>

      <div className="sm:ml-0 ml-5 w-11/12 h-fit bg-white dark:bg-slate-700 flex gap-4 flex-wrap flex-grow p-4 justify-center drop-shadow-lg">
        {isFetchingNotes ? (
          <Loader loadingText="Fetching notes" />
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className=" w-full xl:w-1/3 h-80 bg-slate-300 dark:bg-slate-800 p-4 hover:bg-emerald-300 dark:hover:bg-emerald-800 transition-colors duration-500 "
            >
              <Link
                className="w-full h-full flex flex-col gap-8"
                href={"/dashboard/notes/" + note.id}
              >
                <div className="border-l-2 border-emerald-500 pl-2">
                  <div className="flex justify-between items-center">
                    <MdAssignment className="inline text-xl" />
                    <span className="text-2xl w-5/6 md:w-4/6 font-bold flex flex-grow-0 flex-shrink justify-between items-center">
                      <span className="inline-block max-w-full truncate ">
                        {note.name}
                      </span>
                    </span>
                    <span className="font-normal text-sm flex items-center gap-2">
                      {note.issued.slice(0, 10)}{" "}
                      <MdLockClock className="inline text-xl" />
                    </span>
                  </div>
                  <div>{note.id}</div>
                </div>
                <section className="font-light text-md text-slate-500 dark:text-gray-400 p-2 rounded-lg bg-slate-200 dark:bg-slate-700 flex flex-col gap-4">
                  <div className="h-12">
                    <h3 className="font-bold">Description</h3>
                    <span className="truncate">{note.description}</span>
                  </div>
                  <div className="h-12">
                    <h3 className="font-bold">Content</h3>
                    <article className="truncate">{note.content}</article>
                  </div>
                </section>
                <section className="bottom-0 font-light text-md text-slate-500 dark:text-gray-400 p-2 rounded-lg bg-slate-200 dark:bg-slate-700">
                  Last Update {note.lastUpdate.slice(0, 10)}
                </section>
              </Link>
            </div>
          ))
        )}
      </div>
      <ToastContainer />
    </>
  );
}
