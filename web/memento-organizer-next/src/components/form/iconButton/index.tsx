import { ComponentProps } from 'react';

type ButtonPrimaryProps = ComponentProps<'button'> & {
	active?: boolean;
};
function Flat({ active = true, ...props }: ButtonPrimaryProps) {
	return (
		<button
			{...props}
			className={`w-fit h-fit ${
				active
					? 'bg-emerald-500 text-white'
					: 'bg-slate-300 text-slate-800 hover:text-emerald-500 hover:bg-slate-200 dark:hover:bg-slate-900  dark:bg-slate-800 dark:text-slate-700'
			} p-1   text-sm sm:text-lg font-semibold rounded-lg hover:bg-emerald-600 transition-all duration-200`}
		/>
	);
}

type ButtonDangerProps = ComponentProps<'button'>;
function Danger(props: ButtonDangerProps) {
	return (
		<button
			{...props}
			className='w-fit h-fit  p-1 bg-red-500 text-white hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-800 disabled:dark:bg-slate-800 dark:disabled:text-slate-400 text-sm sm:text-lg font-semibold rounded-lg  transition-all duration-200'
		/>
	);
}

export { Flat, Danger };
