"use client"
import { MdHome, MdArticle, MdAccountBox } from "react-icons/md";
import { ReactElement, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../contexts/useSidebar";

type TNavigationMenu = {
  href: string;
  name: string;
  icon: () => ReactElement;
};

const routes: TNavigationMenu[] = [
  {
    href: "home",
    name: "Home",
    icon: () => <MdHome />,
  },
  {
    href: "notes",
    name: "Notes",
    icon: () => <MdArticle />,
  },
];

export function NavigationBar({ hidden }: { hidden: boolean }) {
  const path = usePathname();
  const { openClose } = useSidebar();
  return (
    <>
    <button
    onClick={openClose} 
    hidden={hidden}
    className={`${!hidden && "sm:hidden backdrop-blur-md z-20"}  fixed w-full h-full top-0 left-0`}
    ></button>
    <nav
      className={` ${
        hidden ? "w-4" : "w-80"
      }  sm:relative fixed flex-col h-full flex justify-between top-0  bg-white dark:bg-slate-700 drop-shadow-lg rounded-r-lg transition-all duration-500 overflow-hidden z-20`}
    >
       <ul
        className={`mt-4 px-2 flex flex-col flex-shrink flex-grow-0 gap-8 ${
          hidden && "hidden"
        }`}
        >
        {routes.map((route) => (
          <li
            key={route.href}
            className="w-full h-16 bg-slate-300 dark:bg-slate-800 rounded-lg"
            >
            <Link
              href={"dashboard/" + route.href}
              onClick={() => {
                if (window.innerWidth <= 640) {
                  openClose();
                }
              }}
              className={`flex w-full h-full justify-center items-center gap-4 hover:text-emerald-600 transition-all ${
                "/dashboard/" + route.href == path && "text-emerald-500"
              }`}
            >
              <span className="text-3xl">{route.name}</span>
              <span className="text-3xl">
                <route.icon />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/dashboard/user/config" className={` bg-slate-300 dark:bg-slate-800 hover:bg-emerald-500 transition-all w-full h-fit mb-4 flex  items-center pr-6 py-4
       ${ hidden && "hidden"}`}>
         <div  className=" w-full h-full flex  items-center justify-end">
          <span className="text-lg">USER</span>
          <MdAccountBox className="text-4xl"/>
        </div>
      </Link>
    </nav>
  </>
  );
}
