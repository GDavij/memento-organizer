'use client';

import { useInput } from '../index';
import { ReactNode } from 'react';

interface InputFlatProps {
	children: ReactNode;
}
export function Flat({ children }: InputFlatProps) {
	return (
		<div className='w-full bg-slate-300 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 cursor-text flex items-center px-4 py-2 gap-4 sm:text-sm text-lg'>
			{children}
		</div>
	);
}
