import {
	ComponentProps,
	ReactNode,
	RefObject,
	createContext,
	createRef,
	useContext,
	useEffect,
	useId,
	useState,
} from 'react';
import { Flat } from './variants/flat';
import { MdChevronRight } from 'react-icons/md';
type SelectContextType = {
	id: string;
};

const SelectContext = createContext({} as SelectContextType);

interface SelectRootProps {
	children: ReactNode;
}
function Root({ children }: SelectRootProps) {
	const id = useId();

	const values: SelectContextType = {
		id,
	};
	return (
		<SelectContext.Provider value={values}>
			<label htmlFor={id} className='cursor-pointer w-full'>
				{children}
			</label>
		</SelectContext.Provider>
	);
}

export const useSelect = () => useContext(SelectContext);

type SelectControlProps = ComponentProps<'select'>;
function Control(props: SelectControlProps) {
	const { id } = useSelect();
	return (
		<select
			{...props}
			id={id}
			className='bg-transparent w-full h-full cursor-pointer text-xl outline-none px-4 py-2 '
		/>
	);
}

export { Root, Control, Flat };
