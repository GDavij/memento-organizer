"use client";
import { MdViewHeadline } from "react-icons/md";
import { useSidebar } from "../contexts/useSidebar";
import { useTopBar } from "../contexts/useTopBar";
import { useEditor } from "../contexts/editor/useEditor";
import { MdSettings } from "react-icons/md";
export function TopBar() {
  const { openClose } = useSidebar();
  const { pageDetails } = useTopBar();
  const { setIsEditingNoteMetadata } = useEditor();
  return (
    <div className="w-screen h-16 bg-emerald-500 drop-shadow-lg px-4 flex flex-grow-0 flex-shrink-0 justify-between items-center">
      <button onClick={openClose} className="h-full text-4xl text-white">
        <MdViewHeadline />
      </button>
      <div className="w-full h-full flex justify-center items-center overflow-hidden">
        <h1 className="text-4xl w-[50%] truncate flex  justify-center items-center">
          <span className="truncate whitespace-nowrap text-white">
            {pageDetails.pageName}
          </span>
        </h1>
        <div>
          {pageDetails.editorOptionsContext && (
            <button
              className="p-2 text-white rounded-2xl shadow-black drop-shadow-sm hover:bg-slate-300 hover:text-emerald-600 transition-all hover:drop-shadow-none dark:hover:bg-slate-600 text-lg flex items-center justify-center"
              onClick={() => {
                setIsEditingNoteMetadata(true);
              }}>
              <MdSettings />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
