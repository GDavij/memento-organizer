import { EditorScreen } from '@/app/dashboard/components/editor';
import Modal, { BaseModalProps } from '@/components/Modal';
import * as Input from '@/components/form/input';
import { useId } from 'react';

interface CreateTaskModalProps extends BaseModalProps {
	columnName: string;
}
export default function CreateTaskModal({
	onClose,
	open,
	columnName,
}: CreateTaskModalProps) {
	const editorId = useId();
	return (
		<Modal
			open={open}
			onClose={onClose}
			subject='Create new Task'
			lockCloseBtn={false}
		>
			<form className='w-full flex flex-col'>
				<Input.Root>
					<Input.Flat>
						<span>Name*</span>
						<Input.Control />
					</Input.Flat>
				</Input.Root>
				<label htmlFor={editorId} className='flex flex-col mt-8 '>
					<span>Content</span>
					<div className='border-slate-400 border px-2 py-2 rounded-lg overflow-y-auto h-64 max-h-64'>
						<EditorScreen
							initialNoteContent={[
								{ type: 'paragraph', children: [{ text: '' }] },
							]}
							saveNoteCallback={async () => {}}
							editorId={editorId}
						/>
					</div>
				</label>
			</form>
		</Modal>
	);
}
