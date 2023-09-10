import Modal, { BaseModalProps } from '@/components/Modal';
import { KanbanColumn } from '@/models/data/kanban';
import * as Input from '@/components/form/input';
import { useEffect, useState } from 'react';
import KanbansService from '@/services/kanbans.service';
import { toast } from 'react-toastify';
import * as Button from '@/components/form/button';
import { MdOutlineSquare } from 'react-icons/md';

interface CreateColumnModal extends BaseModalProps {
	kanbanId: string;
	kanbanColumns: KanbanColumn[] | undefined;
	refetchColumn: () => Promise<void>;
}
export default function CreateColumnModal({
	onClose,
	open,
	kanbanId,
	kanbanColumns,
	refetchColumn,
}: CreateColumnModal) {
	const getHighestColumnOrder = (columns: KanbanColumn[]) => {
		if (columns.length == 0) return 0;

		let highestColumn = columns[0];
		for (let i = 1; i < columns.length; i++) {
			if (columns[i].order > highestColumn.order) {
				highestColumn = columns[i];
			}
		}

		return highestColumn.order;
	};

	const [isCreating, setIsCreating] = useState(false);
	const [name, setName] = useState('');

	useEffect(() => {
		setName('');
	}, [open]);

	async function createColumn() {
		if (!name) {
			toast.error('Missing name');
			return;
		}

		setIsCreating(true);
		const createColumnPromise = KanbansService.updateKanbanColumns(kanbanId, {
			add: [
				{
					name,
					order: getHighestColumnOrder(kanbanColumns!) + 1,
				},
			],
			replace: [],
			delete: [],
		});

		toast.promise(createColumnPromise, {
			pending: `Creating column \"${name}\"`,
			error: `Could not create column \"${name}\"`,
			success: `Created column \"${name}\" with success`,
		});
		await createColumnPromise;
		await refetchColumn();
		setIsCreating(false);
		onClose();
	}

	return (
		<Modal
			onClose={onClose}
			open={open}
			subject='Create Column Request'
			lockCloseBtn={isCreating}
		>
			<div className='w-full flex flex-col gap-8'>
				<form
					className='flex flex-col w-full gap-4'
					onSubmit={(ev) => {
						ev.preventDefault();
						createColumn();
					}}
				>
					<Input.Root>
						<Input.Flat>
							<span>Name</span>
							<Input.Control
								disabled={isCreating}
								value={name}
								onChange={(ev) => setName(ev.target.value)}
							/>
						</Input.Flat>
					</Input.Root>
					<Button.Flat disabled={isCreating}>
						{' '}
						{isCreating ? (
							<span className='flex justify-center items-center w-full h-full'>
								<MdOutlineSquare className='w-fit h-fit text-2xl animate-spin' />
							</span>
						) : (
							'Create Column'
						)}
					</Button.Flat>
				</form>
				<div className='border border-slate-300 rounded-lg p-4'>
					<div className='text-emerald-500 font-semibold mb-4'>
						Kanban Columns Preview
					</div>
					<div className='lg:h-72 h-30 overflow-y-auto px-4 '>
						{kanbanColumns && (
							<div className='flex flex-col gap-2'>
								<div className='w-full h-2 bg-gradient-to-b from-white dark:from-slate-700 to-transparent sticky top-0'></div>
								<span>Existing Columns</span>

								{kanbanColumns.length > 0 ? (
									kanbanColumns.map((column) => (
										<div
											key={column.id}
											className='w-full  bg-slate-200 dark:bg-slate-600 px-4 py-2 flex items-center gap-4'
										>
											<div className='w-1 h-4 bg-emerald-500 rounded-lg'></div>
											<span>{column.name}</span>
										</div>
									))
								) : (
									<span>No Column Exists Yet</span>
								)}
								<div className='w-full flex justify-center gap-4  text-2xl items-center'>
									<span className='text-emerald-600 font-semibold'>+</span>
									<span className='text-lg'>column to add</span>
								</div>
								<div className='w-full  bg-slate-200 dark:bg-slate-600 px-4 py-2 flex items-center gap-4'>
									<div className='w-1 h-4 bg-emerald-500 rounded-lg'></div>
									<span>
										{name || (
											<span className='text-slate-400 dark:text-slate-400'>
												Write a name for you column in the input above...
											</span>
										)}
									</span>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</Modal>
	);
}
