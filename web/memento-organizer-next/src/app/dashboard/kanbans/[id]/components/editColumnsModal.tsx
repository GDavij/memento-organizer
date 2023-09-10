import Modal, { BaseModalProps } from '@/components/Modal';
import { KanbanColumn } from '@/models/data/kanban';
import { useEffect, useId, useState } from 'react';
import { MdOutlineSquare } from 'react-icons/md';
import * as Select from '@/components/form/select';
import * as Button from '@/components/form/button';
import kanbansService from '@/services/kanbans.service';
import { toast } from 'react-toastify';

interface EditColumnsModalProps extends BaseModalProps {
	kanbanId: string;
	kanbanColumns: KanbanColumn[] | undefined;
	refetchColumns: () => Promise<void>;
}

export default function EditColumnsModal({
	onClose,
	open,
	kanbanColumns,
	kanbanId,
	refetchColumns,
}: EditColumnsModalProps) {
	const [columnToSwap, setColumnToReplace] = useState<string | undefined>(
		undefined
	);
	const [columnToMoveTo, setColumnToDoReplace] = useState<string | undefined>(
		undefined
	);

	useEffect(() => {
		if (kanbanColumns && kanbanColumns.length > 0) {
			setColumnToReplace(kanbanColumns[0].id);
			setColumnToDoReplace(kanbanColumns[0].id);
		}
	}, [open]);

	const [isUpdating, setIsUpdating] = useState(false);

	const getColumnOptions = (kanbanColumns: KanbanColumn[]) => {
		return kanbanColumns.map((column) => (
			<option value={column.id} key={column.id}>
				{column.name}
			</option>
		));
	};

	const renderColumnPreview = (kanbanColumns: KanbanColumn[]) => {
		const renderColumn = (column: KanbanColumn) => {
			if (column.id === columnToSwap) {
				return (
					<div
						key={column.id}
						className='h-10 flex items-center gap-3 bg-slate-200 dark:bg-slate-600  px-4 py-2 rounded-sm'
					>
						<div className='w-1 h-4 rounded-lg bg-emerald-500 flex flex-grow-0 flex-shrink-0' />
						<span className='truncate whitespace-nowrap flex-grow-0 flex-shrink'>
							{column.name}
						</span>
						<div className='w-1 h-4 rounded-lg bg-red-500 flex flex-grow-0 flex-shrink-0' />

						<span>Column to swap</span>
					</div>
				);
			} else if (column.id === columnToMoveTo) {
				return (
					<div
						key={column.id}
						className='flex items-center gap-3 bg-slate-200 dark:bg-slate-600 px-4 py-2 rounded-sm flex-grow-0 flex-shrink-0'
					>
						<div className='w-1 h-4 rounded-lg bg-emerald-500 flex flex-grow-0 flex-shrink-0' />
						<span className='truncate whitespace-nowrap flex-grow-0 flex-shrink'>
							{column.name}
						</span>
						<div className='w-1 h-4 rounded-lg bg-red-500 flex flex-grow-0 flex-shrink-0' />
						<span className=''>Column to move to</span>
					</div>
				);
			}

			return (
				<div
					key={column.id}
					className='h-10 flex items-center gap-3 bg-slate-200 dark:bg-slate-600 px-4 py-2 rounded-sm'
				>
					<div className='w-1 h-4 rounded-lg bg-emerald-500 flex flex-grow-0 flex-shrink-0' />
					<span className='truncate whitespace-nowrap flex-grow-0 flex-shrink'>
						{column.name}
					</span>
				</div>
			);
		};

		return kanbanColumns.map((column) => renderColumn(column));
	};

	const updateColumnFormId = useId();

	async function updateColumns() {
		if (!columnToSwap || !columnToMoveTo) {
			toast.error('Some option is not selected to swap');
			return;
		}

		if (columnToSwap == columnToMoveTo) {
			toast.error('Same columns, no swap needed');
			return;
		}

		setIsUpdating(true);
		const updatePromise = kanbansService.updateKanbanColumns(kanbanId!, {
			add: [],
			delete: [],
			replace: [
				{
					id: columnToSwap,
					columnToReplaceId: columnToMoveTo,
				},
			],
		});

		toast.promise(updatePromise, {
			pending: 'Swapping columns',
			error: 'Could not swap columns',
			success: 'Swapped column with success',
		});
		await updatePromise;

		await refetchColumns();
		setIsUpdating(false);
		onClose();
	}
	return (
		<Modal
			onClose={onClose}
			open={open}
			subject='Edit Column'
			lockCloseBtn={isUpdating}
		>
			{kanbanColumns ? (
				<>
					<form
						className='flex flex-col gap-4 w-full'
						id={updateColumnFormId}
						onSubmit={(ev) => {
							ev.preventDefault();
							updateColumns();
						}}
					>
						<div className='flex gap-2 w-full'>
							<Select.Root>
								<span>Column Swap</span>
								<Select.Flat>
									<Select.Control
										value={columnToSwap}
										onChange={(ev) => setColumnToReplace(ev.target.value)}
									>
										{getColumnOptions(kanbanColumns)}
									</Select.Control>
								</Select.Flat>
							</Select.Root>
							<Select.Root>
								<span>Column to move to</span>
								<Select.Flat>
									<Select.Control
										value={columnToMoveTo}
										onChange={(ev) => setColumnToDoReplace(ev.target.value)}
									>
										{getColumnOptions(kanbanColumns)}
									</Select.Control>
								</Select.Flat>
							</Select.Root>
						</div>
					</form>
					<div className='w-full mt-8 border border-slate-400 p-4 rounded-lg flex flex-col gap-4'>
						<div className='text-emerald-500 font-semibold text-lg'>
							Preview Columns
						</div>
						<div className='lg:h-72 h-30 overflow-y-auto px-4'>
							<div className='w-full h-2 bg-gradient-to-b from-white dark:from-slate-700 to-transparent sticky top-0'></div>
							<div className='flex flex-col gap-3'>
								{kanbanColumns && kanbanColumns.length > 0 ? (
									renderColumnPreview(kanbanColumns)
								) : (
									<span>No Columns exists yet</span>
								)}
							</div>
						</div>
					</div>
					<div className='w-full flex justify-end mt-4'>
						<div className='w-1/2'>
							<Button.Flat disabled={isUpdating} form={updateColumnFormId}>
								{isUpdating ? (
									<span className='flex justify-center items-center w-full h-full'>
										<MdOutlineSquare className='w-fit h-fit text-2xl animate-spin' />
									</span>
								) : (
									'Update'
								)}
							</Button.Flat>
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
	);
}
