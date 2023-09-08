'use client';
import { Kanban, KanbanColumn, KanbanTask } from '@/models/data/kanban';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import kanbansService from '@/services/kanbans.service';
import { MdAdd, MdOutlineTableChart } from 'react-icons/md';
import * as IconButton from '@/components/form/iconButton';
import CreateTaskModal from './components/createTaskModal';
import ViewTaskModal from './components/viewTaskModal';
export default function Kanban() {
	const { id } = useParams();

	const [kanban, setKanban] = useState<Kanban | null>(null);
	const [kanbanTasks, setKanbanTasks] = useState<KanbanTask[]>([]);
	const [draggingTask, setDraggingTask] = useState<string | null>(null);
	const [draggingOverColumn, setDraggingOverColumn] = useState<string | null>(
		null
	);
	const [updateAbortController, setUpdateAbortController] =
		useState<AbortController | null>(null);

	const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false);
	const [columnToCreateTask, setColumnToCreateTask] =
		useState<KanbanColumn | null>(null);

	const [openViewTaskModal, setOpenViewTaskModal] = useState(false);
	const [taskToView, setTaskToView] = useState<KanbanTask | null>(null);

	async function fetchTasks() {
		const auxTasks = await kanbansService.getKanbanTasksById(id);
		setKanbanTasks(auxTasks);
	}

	async function fetchKanban() {
		const auxKanbans = await kanbansService.getKanbanById(id);
		setKanban(auxKanbans);
		fetchTasks();
	}

	async function handleTaskDropChange() {}

	async function handleTaskColumnChange(columnId: string) {
		setDraggingOverColumn(columnId);
		const tasks = [...kanbanTasks];
		const taskToHandleIndex = tasks.findIndex((t) => t.id === draggingTask);
		tasks[taskToHandleIndex].column = columnId;
		tasks[taskToHandleIndex].lastUpdate = new Date().toISOString();
		setKanbanTasks(tasks);
		// On Drag End Event, Fix

		console.log({ draggingTask, draggingOverColumn });

		if (updateAbortController != null) {
			updateAbortController.abort();
		}

		const controller = new AbortController();
		document.getElementById(columnId!)?.addEventListener(
			'drop',
			async (ev) => {
				ev.preventDefault();
				console.log('Start Updating');
				console.log({ columnId, draggingTask });
				await kanbansService.updateKanbanTasks(id, {
					add: [],
					delete: [],
					replace: [
						{
							id: draggingTask!,
							column: columnId!,
						},
					],
				});
				console.log('End Updating');
				setDraggingTask(null);
				setDraggingOverColumn(null);
				controller.abort();
				setUpdateAbortController(null);
			},
			{ signal: controller.signal }
		);

		setUpdateAbortController(controller);
	}

	useEffect(() => {
		console.log(draggingOverColumn);
	}, [draggingOverColumn]);

	useEffect(() => {
		fetchKanban();
	}, []);
	return (
		<>
			<div className='w-full h-14 bg-white dark:bg-slate-700 px-3 py-2 md:px-6 md:py-4 drop-shadow-lg rounded-lg '>
				<span className='flex h-full gap-2 items-center'>
					<MdOutlineTableChart className='text-md md:text-3xl' />
					<div className='h-6 md:h-8 bg-emerald-500 w-1 rounded-full'></div>
					<strong className='text-sm md:text-2xl font-bold'>
						{kanban?.name}
					</strong>
				</span>
			</div>

			<div className='mt-8 mb-4 w-full h-full bg-white dark:bg-slate-700 overflow-x-auto overflow-y-hidden flex gap-4 px-4 py-4 rounded-lg'>
				{kanban?.columns &&
					kanban.columns.map((column) => (
						<div
							id={column.id}
							key={column.id}
							className='w-80 min-h-fit-content bg-slate-100 dark:bg-slate-800 flex flex-col flex-grow-0 flex-shrink-0 overflow-y-auto rounded-md'
							onDragOver={(ev) => {
								ev.preventDefault();
								handleTaskColumnChange(column.id);
							}}
						>
							<div className='w-full flex flex-col justify-center items-center h-12 mt-2 gap-1 mb-2 sticky top-0'>
								<span className='flex justify-center items-center gap-4'>
									<strong className='text-xl'>{column.name}</strong>
									<IconButton.Flat
										onClick={() => {
											setColumnToCreateTask(column);
											setOpenCreateTaskModal(true);
										}}
									>
										<MdAdd />
									</IconButton.Flat>
								</span>
								<div className='w-1/2 h-1 bg-emerald-500 rounded-lg'></div>
							</div>
							<div className='flex flex-col w-full min-h-fit overflow-y-auto px-2 py-4 gap-6'>
								{kanbanTasks
									.filter((task) => task.column === column.id)
									.sort(
										(taskA, taskB) =>
											new Date(taskB.lastUpdate).getTime() -
											new Date(taskA.lastUpdate).getTime()
									)
									.map((task) => (
										<div
											id={task.id}
											key={task.id}
											className='bg-white dark:bg-slate-600 px-2 py-2 rounded-md  cursor-grab'
											draggable
											onDragStart={(ev) => {
												setDraggingTask(task.id);
											}}
										>
											<div className='w-full flex justify-start items-center gap-2'>
												<div className='w-1 h-8 ml-1 bg-emerald-500 rounded-lg'></div>
												<button
													className='w-full h-fit bg-transparent border-0 outline-none cursor-pointer'
													onClick={(ev) => {
														setTaskToView(task);
														setOpenViewTaskModal(true);
													}}
												>
													<strong className='text-sm font-semibold '>
														{task.name}
													</strong>
												</button>
											</div>
										</div>
									))}
							</div>
						</div>
					))}
			</div>
			<CreateTaskModal
				open={openCreateTaskModal}
				onClose={() => {
					setOpenCreateTaskModal(false);
					setColumnToCreateTask(null);
				}}
				kanbanId={id}
				columnId={columnToCreateTask?.id}
				refetchTasks={fetchTasks}
			/>
			<ViewTaskModal
				open={openViewTaskModal}
				onClose={() => {
					setOpenViewTaskModal(false);
					setTaskToView(null);
				}}
				taskId={taskToView?.id!}
				kanbanId={id}
				refetchTasks={fetchTasks}
			/>
			<ToastContainer />
		</>
	);
}
