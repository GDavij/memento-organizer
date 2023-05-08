import Link from "next/link";

export default function Home() {
  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="text-center sm:p-16 bg-white drop-shadow-lg rounded-sm gap-16 flex flex-col dark:bg-slate-700 p-1 pt-10 pb-10">
        <section className="border-l-emerald-500 border-l-4 pl-4">
          <h1 className="font-bold text-4xl">Memento Organizer</h1>
          <article className="font-light text-lg text-slate-500 dark:text-gray-100">
            Your Next Personal Organizer on Web
          </article>
        </section>
        <div>
          <Link
            href="login"
            className="p-4 bg-emerald-500 text-white rounded-2xl shadow-black drop-shadow-sm hover:bg-slate-300 hover:text-emerald-600 transition-all hover:drop-shadow-none dark:hover:bg-slate-600"
          >
            Login
          </Link>
          <Link
            href="signup"
            className="p-4 text-emerald-500 hover:text-black dark:hover:text-slate-50 transition-colors"
          >
            Sign-Up
          </Link>
        </div>
      </div>
    </main>
  );
}
