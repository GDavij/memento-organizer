import { ReactNode } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

type AccordionProps = {
    subject: string,
    children: ReactNode;
    open: boolean,
    closeOpen: () => void,
    height: string,
}
export function Accordion({children, open, closeOpen, subject, height}:AccordionProps) {

    return (
    <section className="sm:ml-0 ml-5 w-11/12 h-fit transition-[height] bg-white dark:bg-slate-700 flex flex-col  drop-shadow-lg  rounded-md ">
     <button className="p-4 w-full flex items-center transition-colors hover:text-emerald-500" onClick={closeOpen}>
        <span className={`${open ? "rotate-0" : "-rotate-90"} transition-all duration-150 text-xl `}>
            <MdKeyboardArrowDown/>
        </span>
       <span className="text-lg font-bold duration-150">{subject}</span> 
     </button>
    <article className={`px-4 flex flex-col transition-[height, margin-top] duration-200 ${open ? `${height} mt-8` : "h-0"} overflow-hidden`}>{children}</article>
    </section>)
}