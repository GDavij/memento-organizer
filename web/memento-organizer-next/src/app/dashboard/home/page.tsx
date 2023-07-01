"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useTopBar } from "../contexts/useTopBar";

export default function Home() {
  const { setPageDetails } = useTopBar();
  useEffect(() => {
    setPageDetails({ pageName: "Home" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className="sm:ml-0 ml-5 w-11/12  bg-white dark:bg-slate-700 px-2 py-4 sm:p-8 flex flex-col mb-8">
        <h1 className="text-lg md:text-5xl">Welcome Back to Memento</h1>
        <section className="mt-4">
          <h2 className="text-md md:text-2xl">What Would you like to to now</h2>
          <div className="w-full flex flex-col items-center">
            <span>
              <ul className="mt-6 list-disc ">
                <li className="p-2">
                  <Link
                    href="dashboard/notes"
                    className="w-full h-full text-emerald-600"
                  >
                    View my Notes
                  </Link>
                </li>
              </ul>
            </span>
          </div>
        </section>
      </div>
    </>
  );
}
