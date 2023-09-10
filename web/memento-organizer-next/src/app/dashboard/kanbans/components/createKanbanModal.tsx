import Modal, { BaseModalProps } from '@/components/Modal';
import { useEffect, useState } from 'react';
import * as Button from '@/components/form/button';
import * as Input from '@/components/form/input';
import { toast } from 'react-toastify';
import kanbansService from '@/services/kanbans.service';
import { useRouter } from 'next/navigation';
import { MdOutlineSquare } from 'react-icons/md';

type TCreateKanbanForm = {
	name: string;
	description?: string;
};

interface CreateKanbanModalProps extends BaseModalProps {}
export function CreateKanbanModal({ onClose, open }: CreateKanbanModalProps) {
	const router = useRouter();

	const [isCreating, setIsCreating] = useState(false);

	const [name, setName] = useState('');
	const [description, setDescription] = useState('');

	useEffect(() => {
		setName('');
		setDescription('');
	}, [open]);

	async function createKanban() {
		if (!name) {
			toast.error('Missing name');
			return;
		}

		setIsCreating(true);
		const createKanbanPromise = kanbansService.createKanban({
			name,
			description,
		});
		toast.promise(createKanbanPromise, {
			pending: 'Creating kanban',
			error: 'Could not create kanban',
			success: 'Created kanban with success',
		});

		const kanbanId = await createKanbanPromise;
		router.push(`/dashboard/kanbans/${kanbanId}`);
	}

	return (
		<Modal
			onClose={onClose}
			open={open}
			subject='Create Kanban'
			lockCloseBtn={isCreating}
		>
			<form
				className='flex flex-col w-full gap-4'
				onSubmit={(ev) => {
					ev.preventDefault();
					createKanban();
				}}
			>
				<Input.Root>
					<Input.Flat>
						<span>Name*</span>
						<Input.Control
							value={name}
							onChange={(ev) => setName(ev.target.value)}
						/>
					</Input.Flat>
				</Input.Root>
				<Input.Root>
					<Input.Flat>
						<span>Description</span>
						<Input.Control
							value={description}
							onChange={(ev) => setDescription(ev.target.value)}
						/>
					</Input.Flat>
				</Input.Root>

				<div>
					<Button.Flat disabled={isCreating}>
						{isCreating ? (
							<span className='flex justify-center items-center w-full h-full'>
								<MdOutlineSquare className='w-fit h-fit text-2xl animate-spin' />
							</span>
						) : (
							'Create'
						)}
					</Button.Flat>
				</div>
			</form>
		</Modal>
	);
}
