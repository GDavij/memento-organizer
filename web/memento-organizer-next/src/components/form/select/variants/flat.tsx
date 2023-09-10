import { ReactNode } from 'react';

interface SelectFlatProps {
	children: ReactNode;
}
export function Flat({ children }: SelectFlatProps) {
	return (
		<div className='w-full h-fit bg-slate-300 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800  z-10 flex items-center  sm:text-sm text-lg whitespace-nowrap'>
			{children}
		</div>
	);
}
