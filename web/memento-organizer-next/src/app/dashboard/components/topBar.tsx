"use client";
import { MdViewHeadline } from "react-icons/md";
import { useSidebar } from "../contexts/useSidebar";

export function TopBar() {
  const { openClose } = useSidebar();
  return (
    <div className="w-screen h-16 bg-emerald-500 drop-shadow-lg px-4 flex justify-between items-center">
      <button onClick={openClose} className="h-full text-4xl text-white">
        <MdViewHeadline />
      </button>
    </div>
  );
}
