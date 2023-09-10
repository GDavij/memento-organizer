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
import { KanbanTask } from '@/models/data/kanban';

interface EditTaskModalProps extends BaseModalProps {
	columnId?: string;
	kanbanId: string;
	taskId: string | undefined;
	refetchTasks: () => Promise<void>;
	updateView: () => Promise<void>;
}
export default function EditTaskModal({
	onClose,
	open,
	columnId,
	kanbanId,
	taskId,
	refetchTasks,
	updateView,
}: EditTaskModalProps) {
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

	const [task, setTask] = useState<KanbanTask | null>(null);
	const [name, setName] = useState('');
	const [isUpdating, setIsUpdating] = useState<boolean>(false);
	const [isFetching, setIsFetching] = useState<boolean>(false);

	async function fetchTask(id: string) {
		setIsFetching(true);
		const aux = await kanbansService.getKanbanTaskById(id);
		setTask(aux);
		setIsFetching(false);
		setName(aux!.name);
	}

	useEffect(() => {
		setName('');
		setTask(null);

		if (taskId) fetchTask(taskId);
	}, [open]);

	const differentValueOrUndefined = (value: any, equalValue: any) =>
		value == equalValue ? undefined : value;

	async function updateTask() {
		if (!name) {
			toast.error('Missing name to create task');
			return;
		}

		const content = JSON.stringify(noteContent);

		const updatePromise = kanbansService.updateKanbanTasks(kanbanId, {
			add: [],
			replace: [
				{
					id: task!.id,
					name: differentValueOrUndefined(name, task!.name),
					content: differentValueOrUndefined(content, task!.content),
				},
			],
			delete: [],
		});

		setIsUpdating(true);
		toast.promise(updatePromise, {
			success: `Updated task \"${name}\" with success`,
			error: `Could not update task \"${name}\"`,
			pending: `Updating task \"${name}\"...`,
		});
		await updatePromise;

		await refetchTasks();
		await updateView();
		setIsUpdating(false);
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
			subject='Update Task'
			lockCloseBtn={isUpdating}
		>
			{!isFetching ? (
				<form
					className='w-full flex flex-col gap-4'
					onSubmit={(ev) => {
						ev.preventDefault();
						updateTask();
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
								{task ? (
									<SimpleEditorScreen
										initialNoteContent={JSON.parse(task!.content)}
										saveNoteCallback={async () => {}}
										editorId={editorId}
									/>
								) : (
									'Loading...'
								)}
							</div>
						</div>
					</label>

					<div className='flex justify-end'>
						<div className='w-full md:w-1/2'>
							<Button.Flat disabled={isUpdating}>
								{isUpdating ? (
									<span className='flex justify-center items-center w-full h-full'>
										<MdOutlineSquare className='w-fit h-fit text-2xl animate-spin' />
									</span>
								) : (
									'Update Task'
								)}
							</Button.Flat>
						</div>
					</div>
				</form>
			) : (
				<span className='flex gap-2 items-center'>
					<span className='w-fit h-fit animate-spin '>
						<MdOutlineSquare className='text-4xl' />
					</span>
					<span className='text-2xl'>Loading Task</span>
				</span>
			)}
		</Modal>
	);
}
