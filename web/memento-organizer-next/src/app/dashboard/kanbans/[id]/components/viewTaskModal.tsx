import Modal, { BaseModalProps } from '@/components/Modal';
import { KanbanTask } from '@/models/data/kanban';
import * as IconButton from '@/components/form/iconButton';
import { SimpleEditorScreen } from '@/app/dashboard/components/simpleEditor';
import { useEffect, useState } from 'react';
import kanbansService from '@/services/kanbans.service';
import {
	MdDelete,
	MdEdit,
	MdLockClock,
	MdOutlineSquare,
	MdUpdate,
} from 'react-icons/md';
import EditTaskModal from './editTaskModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { toast } from 'react-toastify';

interface ViewTaskModalProps extends BaseModalProps {
	taskId: string;
	kanbanId: string;
	refetchTasks: () => Promise<void>;
}
export default function ViewTaskModal({
	onClose,
	open,
	taskId,
	kanbanId,
	refetchTasks,
}: ViewTaskModalProps) {
	const [isFetching, setIsFetching] = useState<boolean>(false);

	const [task, setTask] = useState<KanbanTask | null>(null);
	async function fetchTask(id: string) {
		setIsFetching(true);
		const aux = await kanbansService.getKanbanTaskById(id);
		setTask(aux);
		setIsFetching(false);
	}

	const [openEditTaskModal, setOpenEditTaskModal] = useState<boolean>(false);

	useEffect(() => {
		if (taskId) {
			fetchTask(taskId);
		} else {
			setTask(null);
		}
	}, [open]);

	const [openDeleteTaskDialog, setOpenDeleteTaskDialog] =
		useState<boolean>(false);

	async function deleteTask() {
		const deletePromise = kanbansService.updateKanbanTasks(kanbanId, {
			add: [],
			replace: [],
			delete: [taskId],
		});
		toast.promise(deletePromise, {
			pending: `Deleting task \"${task?.name}\"`,
			error: `Could not delete task \"${task?.name}\"`,
			success: `Deleted task \"${task?.name}\" with sucess`,
		});
		await deletePromise;
		await refetchTasks();
		onClose();
	}
	return (
		<>
			<Modal
				open={open}
				onClose={onClose}
				subject={
					<span className=' flex flex-col gap-2'>
						<span className=''>Viewing task</span>
						<span className='flex flex-col items-center'>
							<strong className='text-emerald-500 text-xl'>{task?.name}</strong>
							<div className='w-full h-1 bg-emerald-500 rounded-lg'></div>
						</span>
					</span>
				}
				optionsMenu={
					<span className='flex gap-3'>
						<IconButton.Danger
							disabled={isFetching}
							onClick={() => setOpenDeleteTaskDialog(true)}
						>
							<MdDelete className='text-2xl' />
						</IconButton.Danger>
						<IconButton.Flat
							disabled={isFetching}
							onClick={() => setOpenEditTaskModal(true)}
						>
							<MdEdit className='text-2xl' />
						</IconButton.Flat>
					</span>
				}
			>
				{task && !openEditTaskModal && !isFetching ? (
					<>
						<div className='w-full'>
							<div className='h-96 overflow-y-auto w-full'>
								<div className='w-full h-4 bg-gradient-to-b from-white dark:from-slate-700 to-transparent sticky top-0 z-10 ' />
								<SimpleEditorScreen
									initialNoteContent={JSON.parse(task.content)}
									editorId=''
									saveNoteCallback={async () => {}}
									placeholder='Nothing Detailed on this task'
									readOnly
								/>
							</div>
							<div className='w-full h-1 bg-emerald-500 rounded-lg mt-4' />
							<div className='mt-2 mb-16 flex flex-col gap-1'>
								<div className='flex gap-1 items-center'>
									<span>Issued</span>
									<MdLockClock />
									<span>{new Date(task.issued).toDateString()}</span>
								</div>
								<div className='flex gap-1 items-center'>
									<span>Last update</span>
									<MdUpdate />
									<span>{new Date(task.issued).toDateString()}</span>
								</div>
							</div>
							<div className='text-xs bottom-2 fixed left-2 text-slate-400'>
								Task ID: <span className='text-emerald-300'>{task.id}</span>
							</div>
						</div>
					</>
				) : (
					<span className='flex gap-2 items-center'>
						<span className='w-fit h-fit animate-spin '>
							<MdOutlineSquare className='text-4xl' />
						</span>
						<span className='text-2xl'>Loading Task</span>
					</span>
				)}
			</Modal>
			<EditTaskModal
				taskId={task?.id}
				kanbanId={kanbanId}
				onClose={() => {
					setOpenEditTaskModal(false);
				}}
				open={openEditTaskModal}
				refetchTasks={refetchTasks}
				updateView={() => fetchTask(taskId)}
			/>
			<ConfirmDialog
				onClose={() => {
					setOpenDeleteTaskDialog(false);
				}}
				onOkay={deleteTask}
				open={openDeleteTaskDialog}
				declineButtonContent={'No'}
				okayButtonContent={'Yes'}
				title={`Delete Task`}
				question={`Are you sure to delete task \"${task?.name}\"`}
			/>
		</>
	);
}
