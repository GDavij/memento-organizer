'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useTopBar } from '../contexts/useTopBar';

export default function Home() {
  const { setPageDetails } = useTopBar();
  useEffect(() => {
    setPageDetails({ pageName: 'Home' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className="card-container">
        <h1 className="text-lg md:text-5xl">Welcome Back to Memento</h1>
        <section className="mt-4">
          <h2 className="text-md md:text-2xl">What Would you like to to now</h2>
          <div className="w-full flex flex-col items-center">
            <span>#TODO: Add Some Content here For Users and For Admins</span>
          </div>
        </section>
      </div>
    </>
  );
}
