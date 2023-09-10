'use client';
import notesService from '@/services/notes.service';
import Modal, { BaseModalProps } from '@/components/Modal';
import { TCreateNoteRequest } from '@/models/requests/noteRequests';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Loader from '@/components/Loader';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';

import { BaseEditor, Descendant, createEditor } from 'slate';

type TCreateNoteFormData = {
	name: string;
	description?: string;
};

export default function CreateNoteModal({ open, onClose }: BaseModalProps) {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TCreateNoteFormData>();

	const [isCreating, setIsCreating] = useState(false);
	useEffect(() => {
		reset();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	async function handleNoteCreation(formData: TCreateNoteFormData) {
		const filteredBody: TCreateNoteRequest = {
			name: formData.name,
			description:
				formData.description != '' ? formData.description : undefined,
		};
		setIsCreating(true);
		const noteId = await notesService.createNote(filteredBody);
		toast.success('Note Has Been Created, Redirecting to Editor');
		router.push(`/dashboard/notes/${noteId}`);
	}

	return (
		<Modal
			open={open}
			onClose={onClose}
			subject='Create Note'
			lockCloseBtn={isCreating}
		>
			<form
				onSubmit={handleSubmit(handleNoteCreation)}
				className='flex flex-col items-center gap-4'
			>
				<label className='w-full'>
					Note Name*
					<input
						readOnly={isCreating}
						{...register('name', { required: true })}
						type='text'
						className='w-full h-8 bg-slate-300 dark:bg-slate-800 outline-none p-6 text-base rounded-md'
					/>
					{errors.name?.type == 'required' && (
						<div className='text-red-500'>Name is Required</div>
					)}
				</label>
				<label className='w-full'>
					Description
					<input
						readOnly={isCreating}
						{...register('description')}
						type='text'
						className='w-full h-8 bg-slate-300 dark:bg-slate-800 outline-none p-6 text-base rounded-md'
					/>
				</label>
				<button
					disabled={isCreating}
					className='w-full p-4 bg-emerald-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-emerald-500 text-white rounded-2xl shadow-black drop-shadow-sm hover:bg-slate-300 hover:text-emerald-600 transition-all hover:drop-shadow-none dark:hover:bg-slate-600 text-lg flex items-center justify-center h-16 disabled:cursor-not-allowed'
				>
					{isCreating ? (
						<Loader loadingText='Creating Note' size='text-lg' />
					) : (
						'Create Note'
					)}
				</button>
			</form>
		</Modal>
	);
}
