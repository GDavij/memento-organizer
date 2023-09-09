import Modal, { BaseModalProps } from '@/components/Modal';
import { Kanban } from '@/models/data/kanban';
import { useEffect, useState } from 'react';
import kanbansService from '@/services/kanbans.service';
import * as Input from '@/components/form/input';
import * as Button from '@/components/form/button';

interface EditKanbanModalProps extends BaseModalProps {
	kanbanId: string;
}
export default function EditKanbanModal({
	onClose,
	open,
	kanbanId,
}: EditKanbanModalProps) {
	const [kanban, setKanban] = useState<Kanban | null>(null);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');

	async function fetchKanban() {
		const kanban = await kanbansService.getKanbanById(kanbanId);
		setKanban(kanban);
		setName(kanban.name);
		setDescription(kanban.description);
	}

	useEffect(() => {
		fetchKanban();
	}, [open]);
	return (
		<Modal onClose={onClose} open={open} subject={'Edit Kanban'}>
			{kanban && (
				<div className='w-full h-full flex flex-col gap-4'>
					<Input.Root>
						<Input.Flat>
							<span>Name</span>
							<Input.Control
								autoFocus
								value={name}
								onChange={(ev) => {
									setName(ev.target.value);
								}}
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
							/>
						</Input.Flat>
					</Input.Root>

					<Button.Flat>Update Kanban</Button.Flat>
				</div>
			)}
		</Modal>
	);
}
