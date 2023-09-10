import { SimpleEditorScreen } from '@/app/dashboard/components/simpleEditor';
import Modal, { BaseModalProps } from '@/components/Modal';
import * as Input from '@/components/form/input';
import { useEffect, useId, useState } from 'react';
import * as Button from '@/components/form/button';
import { useEditor } from '@/app/dashboard/contexts/editor/useEditor';
import * as IconButton from '@/components/form/iconButton';
import { toggleMark } from '@/lib/editor/editor.aux';
import {
	MdFormatBold,
	MdFormatItalic,
	MdFormatUnderlined,
	MdOutlineSquare,
} from 'react-icons/md';
import kanbansService from '@/services/kanbans.service';
import { toast } from 'react-toastify';

interface CreateTaskModalProps extends BaseModalProps {
	kanbanId: string;
	columnId: string | undefined;
	refetchTasks: () => Promise<void>;
}
export default function CreateTaskModal({
	onClose,
	open,
	kanbanId,
	columnId,
	refetchTasks,
}: CreateTaskModalProps) {
	const {
		noteContent,
		isBold,
		setIsBold,
		isItalic,
		setIsItalic,
		isUnderline,
		setIsUnderline,
		editor,
	} = useEditor();

	const [name, setName] = useState('');
	const [isCreating, setIsCreating] = useState(false);

	useEffect(() => {
		setName('');
	}, [open]);

	async function createTask() {
		if (!name) {
			toast.error('Missing name to create task');
			return;
		}

		const content = JSON.stringify(noteContent);

		const createPromise = kanbansService.updateKanbanTasks(kanbanId, {
			add: [
				{
					name,
					content,
					column: columnId,
				},
			],
			replace: [],
			delete: [],
		});

		setIsCreating(true);
		toast.promise(createPromise, {
			success: `Created task \"${name}\" with success`,
			error: `Could not create task \"${name}\"`,
			pending: `Creating task \"${name}\"...`,
		});
		await createPromise;

		await refetchTasks();
		setIsCreating(false);
		onClose();
	}

	const editorId = useId();

	const toggleIsBold = () => {
		toggleMark(editor!, 'bold');
		setIsBold(!isBold);
		document.getElementById(editorId)?.focus();
	};

	const toggleIsItalic = () => {
		toggleMark(editor!, 'italic');
		setIsItalic(!isItalic);
		document.getElementById(editorId)?.focus();
	};

	const toggleIsUnderline = () => {
		toggleMark(editor!, 'underline');
		setIsUnderline(!isUnderline);
		document.getElementById(editorId)?.focus();
	};
	return (
		<Modal
			open={open}
			onClose={onClose}
			subject='Create new Task'
			lockCloseBtn={isCreating}
		>
			<form
				className='w-full flex flex-col gap-4'
				onSubmit={(ev) => {
					ev.preventDefault();
					createTask();
				}}
			>
				<Input.Root>
					<Input.Flat>
						<span>Name*</span>
						<Input.Control
							autoFocus={true}
							value={name}
							onChange={(ev) => setName(ev.target.value)}
						/>
					</Input.Flat>
				</Input.Root>
				<label htmlFor={editorId} className='flex flex-col mt-2'>
					<span className='ml-1'>Content</span>
					<div className='border-slate-400 border  rounded-lg overflow-y-auto h-64 max-h-64 '>
						<div className='sticky top-0  flex gap-4 w-fit mb-2 z-10 p-2 bg-gradient-to-b from-white to-transparent dark:from-slate-700'>
							<IconButton.Flat
								type='button'
								active={isBold}
								onClick={toggleIsBold}
							>
								<MdFormatBold />
							</IconButton.Flat>
							<IconButton.Flat
								type='button'
								active={isItalic}
								onClick={toggleIsItalic}
							>
								<MdFormatItalic />
							</IconButton.Flat>
							<IconButton.Flat
								type='button'
								active={isUnderline}
								onClick={toggleIsUnderline}
							>
								<MdFormatUnderlined />
							</IconButton.Flat>
						</div>
						<div className='w-full h-full px-2'>
							<SimpleEditorScreen
								readOnly={isCreating}
								initialNoteContent={[
									{ type: 'paragraph', children: [{ text: '' }] },
								]}
								saveNoteCallback={async () => {}}
								editorId={editorId}
							/>
						</div>
					</div>
				</label>

				<div className='flex justify-end'>
					<div className='w-full md:w-1/2'>
						<Button.Flat disabled={isCreating}>
							{isCreating ? (
								<span className='flex justify-center items-center w-full h-full'>
									<MdOutlineSquare className='w-fit h-fit text-2xl animate-spin' />
								</span>
							) : (
								'Create Task'
							)}
						</Button.Flat>
					</div>
				</div>
			</form>
		</Modal>
	);
}
