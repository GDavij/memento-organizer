import { ComponentProps } from 'react';

type ButtonPrimaryProps = ComponentProps<'button'>;
function Flat(props: ButtonPrimaryProps) {
	return (
		<button
			{...props}
			className='w-fit h-fit bg-emerald-500 p-1  text-white text-sm sm:text-lg font-semibold rounded-lg hover:bg-emerald-600 transition-all duration-200 disabled:bg-slate-500 dark:disabled:bg-slate-900 '
		/>
	);
}

export { Flat };
