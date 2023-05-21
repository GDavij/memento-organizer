import { MdOutlineSquare } from "react-icons/md";

export default function Loader({ loadingText }: { loadingText: string }) {
  return (
    <div className="w-full h-full flex justify-center items-center gap-4 select-none">
      <span className="animate-spin text-5xl">
        <MdOutlineSquare />
      </span>
      <span>{loadingText}</span>
    </div>
  );
}
