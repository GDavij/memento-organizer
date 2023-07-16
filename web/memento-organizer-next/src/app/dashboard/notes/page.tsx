'use client';
import {
  MdAssignment,
  MdAssignmentAdd,
  MdAutorenew,
  MdLockClock,
} from 'react-icons/md';
import { Note } from '@/models/data/note';
import { useEffect, useId, useState } from 'react';
import notesService from '@/services/notes.service';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '@/app/components/Loader';
import { useForm } from 'react-hook-form';
import CreateNoteModal from './components/CreateNoteModal';
import { useTopBar } from '../contexts/useTopBar';
import { renderElementDisabled } from '@/lib/editor/markdown.aux';

export default function Notes() {
  const { setPageDetails } = useTopBar();

  type TFilterOptions =
    | 'Id'
    | 'Name'
    | 'Description'
    | 'Content'
    | 'Issued Date';
  const filterOptions: TFilterOptions[] = [
    'Id',
    'Name',
    'Description',
    'Content',
    'Issued Date',
  ];
  const { watch, register } = useForm<{
    filterType: TFilterOptions;
    filterData: string;
  }>({ defaultValues: { filterData: '', filterType: 'Name' } });

  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [isFetchingNotes, setIsFetchingNotes] = useState(true);

  function filterSearch(item: Note, index: number): boolean {
    switch (watch('filterType')) {
      case 'Id':
        return item.id
          .toUpperCase()
          .includes(watch('filterData').toUpperCase());
      case 'Name':
        return item.name
          .toUpperCase()
          .includes(watch('filterData').toUpperCase());
      case 'Description':
        return item.description
          .toUpperCase()
          .includes(watch('filterData').toUpperCase());
      case 'Content':
        return item.content
          .toUpperCase()
          .includes(watch('filterData').toUpperCase());
      case 'Issued Date':
        return item.issued
          .toUpperCase()
          .includes(watch('filterData').toUpperCase());
    }
  }

  useEffect(() => {
    setFilteredNotes(notes.filter(filterSearch));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('filterData'), watch('filterType')]);

  async function fetchNotes() {
    setIsFetchingNotes(true);
    const notesFetched = notesService.getNotesByOwner();
    toast.promise(notesFetched, {
      pending: 'Fetching Notes',
      error: 'Could not Fetch Notes',
      success: 'Notes Fetched with Sucess',
    });
    const aux = await notesFetched;
    setNotes(aux);
    setFilteredNotes(aux.filter(filterSearch));
    setIsFetchingNotes(false);
  }
  useEffect(() => {
    setPageDetails({ pageName: 'Notes List' });
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterId = useId();
  const [CreateNoteModalOpen, setCreateNoteModalOpen] = useState(false);
  return (
    <>
      <div className="sm:ml-0 ml-5 w-11/12  bg-white dark:bg-slate-700 sticky top-0 px-2 py-4 sm:p-4 flex flex-row-reverse items-center mb-8 drop-shadow-lg z-10 gap-4">
        <button
          onClick={() => setCreateNoteModalOpen(true)}
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
            className={`inline-block  ${isFetchingNotes && 'animate-spin'} `}
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
              {...register('filterType')}
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
            {...register('filterData')}
            id={filterId}
            type="search"
            placeholder="filter"
            className="bg-transparent w-full h-full outline-none pl-4 border-b-2 border-emerald-500 caret-emerald-500"
          />
        </label>
      </div>

      <div className="sm:ml-0 ml-5 w-11/12 h-fit bg-white dark:bg-slate-700 flex gap-4 flex-wrap flex-grow justify-center drop-shadow-lg p-4 rounded-md mb-16">
        {isFetchingNotes ? (
          <Loader loadingText="Fetching notes" />
        ) : filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className=" w-full xl:w-[32%] h-fit  bg-slate-300 dark:bg-slate-800 p-4 hover:bg-emerald-300 dark:hover:bg-emerald-800 transition-colors duration-500 "
            >
              <Link
                className="w-full h-full flex flex-col gap-8"
                href={`/dashboard/notes/${note.id}`}
              >
                <div className="border-l-2 border-emerald-500 pl-2">
                  <div className="flex justify-between items-center">
                    <MdAssignment className=" w-fit flex flex-shrink flex-grow-0 text-xl" />
                    <span className="text-lg md:text-xg w-3/6 md:w-4/6 font-bold flex flex-grow-0 flex-shrink justify-between items-center">
                      <span className="inline-block w-[90%] truncate ">
                        {note.name}
                      </span>
                    </span>
                    <span className="font-normal text-sm  flex items-end gap-2">
                      {note.issued.slice(0, 10)}
                      <MdLockClock className="inline text-xl" />
                    </span>
                  </div>
                  <div>{note.id}</div>
                </div>
                <section className="font-light text-md text-slate-500 dark:text-gray-400 p-2 pb-4 rounded-lg bg-slate-200 dark:bg-slate-700 flex flex-col gap-4">
                  <div className="h-16 truncate">
                    <h3 className="font-bold">Description</h3>
                    <span className="overflow-hidden">
                      {note.description != ''
                        ? note.description
                        : 'No Description, Add One!'}
                    </span>
                  </div>
                  <div className="h-24 border-l-2 border-emerald-500 pl-1">
                    <h3 className="font-bold">Content</h3>
                    <article className="truncate h-[80%] ">
                      {renderElementDisabled(note)}
                    </article>
                  </div>
                </section>
                <section className="bottom-0 font-light text-md text-slate-500 dark:text-gray-400 p-2 rounded-lg bg-slate-200 dark:bg-slate-700">
                  Last Update {note.lastUpdate.slice(0, 10)}
                </section>
              </Link>
            </div>
          ))
        ) : notes.length == 0 ? (
          <section className="w-full h-full flex flex-col gap-2 items-center justify-center">
            <h1 className=" text-lg md:text-4xl">
              You Don&apos;t have any Notes Yet
            </h1>
            <article className=" text-sm md:text-lg  font-light text-slate-500 dark:text-gray-100">
              Create your first note by clicking in the Create New Note{' '}
              <MdAssignmentAdd className="inline text-lg" />
              &quot; Button
            </article>
          </section>
        ) : (
          <section className="w-full h-full flex flex-col gap-2 items-center justify-center overflow-clip text-ellipsis">
            <h1 className=" text-lg md:text-4xl ">
              We Don&apos;t find any notes while searching for a{' '}
              {watch('filterType')}
            </h1>
            <article className="text-sm md:text-lg flex items-end justify-center  whitespace-nowrap font-light text-slate-500 dark:text-gray-100">
              The filter &ldquo;
              <span className="h-fit max-w-[50cqw] overflow-hidden text-ellipsis inline-block">
                {watch('filterData')}
              </span>
              &rdquo; Don&lsquo;t find any notes
            </article>
          </section>
        )}
      </div>
      <ToastContainer />
      <CreateNoteModal
        open={CreateNoteModalOpen}
        onClose={() => {
          setCreateNoteModalOpen(false);
        }}
      />
    </>
  );
}
