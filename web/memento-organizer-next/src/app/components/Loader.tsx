import { MdOutlineSquare } from "react-icons/md";

export default function Loader({
  loadingText,
  size,
}: {
  loadingText: string;
  size?: string;
}) {
  console.log(size);
  return (
    <div className="w-full h-full flex justify-center items-center gap-4 select-none">
      <span className={`animate-spin ${size ? size : "text-5xl"}`}>
        <MdOutlineSquare />
      </span>
      <span>{loadingText}</span>
    </div>
  );
}
