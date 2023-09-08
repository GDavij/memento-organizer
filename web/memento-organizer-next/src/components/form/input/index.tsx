'use client';
import {
	ComponentProps,
	ReactNode,
	createContext,
	useContext,
	useId,
} from 'react';
import { Flat } from './variants/flat';

export type InputContextType = {
	id: string;
};

const InputContext = createContext({} as InputContextType);

interface InputRootProps {
	children: ReactNode;
}
function Root({ children }: InputRootProps) {
	const id = useId();

	const values: InputContextType = {
		id,
	};

	return (
		<InputContext.Provider value={values}>
			<label htmlFor={id}>{children}</label>
		</InputContext.Provider>
	);
}

export const useInput = () => useContext(InputContext);

type InputControlProps = ComponentProps<'input'>;
function Control(props: InputControlProps) {
	const { id } = useInput();
	return (
		<input
			{...props}
			id={id}
			className='bg-transparent w-full h-full  text-xl outline-none caret-emerald-500'
		/>
	);
}
export { Root, Flat, Control };
