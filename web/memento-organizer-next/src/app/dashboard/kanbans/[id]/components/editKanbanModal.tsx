import Modal, { BaseModalProps } from '@/components/Modal';
import { Kanban } from '@/models/data/kanban';
import { useEffect, useState } from 'react';
import kanbansService from '@/services/kanbans.service';
import * as Input from '@/components/form/input';
import * as Button from '@/components/form/button';
import { toast } from 'react-toastify';
import { MdDelete, MdOutlineSquare } from 'react-icons/md';
import * as IconButton from '@/components/form/iconButton';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/ConfirmDialog';

interface EditKanbanModalProps extends BaseModalProps {
	kanbanId: string;
	refetchKanban: () => Promise<void>;
}
export default function EditKanbanModal({
	onClose,
	open,
	kanbanId,
	refetchKanban,
}: EditKanbanModalProps) {
	const router = useRouter();

	const [kanban, setKanban] = useState<Kanban | null>(null);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isFetching, setIsFetching] = useState(false);

	const [openDeleteKanbanDialog, setOpenDeleteKanbanDialog] = useState(false);

	async function fetchKanban() {
		setIsFetching(true);
		const kanban = await kanbansService.getKanbanById(kanbanId);
		setKanban(kanban);
		setName(kanban.name);
		setDescription(kanban.description);
		setIsFetching(false);
	}

	async function updateKanban() {
		if (!name) {
			toast.error('Missing Kanban name');
		}

		setIsUpdating(true);
		const updatePromise = kanbansService.updateKanban(kanbanId, {
			name,
			description,
		});

		toast.promise(updatePromise, {
			pending: `Updating kanban`,
			success: `Updated kanban with success`,
			error: `Could not update kanban`,
		});
		await updatePromise;

		await refetchKanban();
		setIsUpdating(false);
		onClose();
	}

	async function deleteKanban() {
		setIsDeleting(true);
		const deletePromise = kanbansService.deleteKanbanById(kanbanId);
		toast.promise(deletePromise, {
			pending: 'Deleting kanban',
			error: 'Could not delete kanban',
			success: 'Deleted kanban with success',
		});
		await deletePromise;

		setIsDeleting(false);
		router.push('/dashboard/kanbans');
	}

	useEffect(() => {
		setKanban(null);
		setName('');
		setDescription('');
		fetchKanban();
	}, [open]);

	return (
		<>
			<Modal
				onClose={onClose}
				open={open}
				subject={'Edit Kanban'}
				lockCloseBtn={isUpdating || isDeleting}
				optionsMenu={
					<IconButton.Danger
						disabled={isFetching || isDeleting}
						onClick={() => setOpenDeleteKanbanDialog(true)}
					>
						<MdDelete className='text-2xl' />
					</IconButton.Danger>
				}
			>
				{kanban ? (
					<form
						className='w-full h-full flex flex-col gap-4'
						onSubmit={(ev) => {
							ev.preventDefault();
							updateKanban();
						}}
					>
						<Input.Root>
							<Input.Flat>
								<span>Name</span>
								<Input.Control
									autoFocus
									value={name}
									onChange={(ev) => {
										setName(ev.target.value);
									}}
									disabled={isUpdating || isDeleting}
								/>
							</Input.Flat>
						</Input.Root>
						<Input.Root>
							<Input.Flat>
								<span>Description</span>
								<Input.Control
									value={description}
									onChange={(ev) => {
										setDescription(ev.target.value);
									}}
									disabled={isUpdating || isDeleting}
								/>
							</Input.Flat>
						</Input.Root>

						<Button.Flat disabled={isUpdating || isDeleting}>
							{isUpdating ? (
								<span className='flex justify-center items-center w-full h-full'>
									<MdOutlineSquare className='w-fit h-fit text-2xl animate-spin' />
								</span>
							) : (
								'Update Kanban'
							)}
						</Button.Flat>
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
			<ConfirmDialog
				open={openDeleteKanbanDialog}
				onClose={() => {
					setOpenDeleteKanbanDialog(false);
				}}
				onOkay={deleteKanban}
				question='Are you sure to delete this kanban?'
				declineButtonContent='No'
				okayButtonContent='Yes'
				title='Delete Kanban'
			/>
		</>
	);
}
