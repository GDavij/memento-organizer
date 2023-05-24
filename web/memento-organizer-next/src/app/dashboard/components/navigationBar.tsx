import { MdHome, MdArticle } from "react-icons/md";
import { ReactElement } from "react";
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
    <nav
      className={` ${
        hidden ? "w-4" : "w-80"
      } sm:relative fixed flex-col flex h-full bg-white dark:bg-slate-700 drop-shadow-lg rounded-r-lg transition-all duration-500 overflow-hidden z-20`}
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
    </nav>
  );
}
