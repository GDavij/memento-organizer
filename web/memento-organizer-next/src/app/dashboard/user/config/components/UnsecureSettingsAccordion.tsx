import { Accordion } from '@/components/Acordion';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useEffect, useState } from 'react';
import userService from '@/services/user.service';
import { redirect, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { RedirectType } from 'next/dist/client/components/redirect';
export default function UnsecureSettingsAccordion() {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [openDeleteAccountConfirm, setOpenDeleteAccountConfirm] =
		useState(false);

	return (
		<>
			<Accordion
				open={open}
				closeOpen={() => setOpen((prev) => !prev)}
				subject='Unsecure Settings'
				height='h-[30rem] md:h-[20rem]'
			>
				<div className='text-red-500 font-bold text-xl'>
					Warning These Settings can lead to permanent actions !
				</div>
				<button
					className='button-danger-flat p-4 h-16'
					onClick={() => setOpenDeleteAccountConfirm(true)}
				>
					DELETE ACCOUNT
				</button>
			</Accordion>
			<ConfirmDialog
				open={openDeleteAccountConfirm}
				onClose={() => setOpenDeleteAccountConfirm(false)}
				title='Delete Account!'
				question='Are you sure to delete your account?. this action is unreversible!'
				declineButtonContent="No, don't delete"
				okayButtonContent='Yes, Delete'
				onOkay={async () => {
					try {
						await userService.deleteUser();
						toast.success('Deleted User With Sucess');
						localStorage.clear();
						router.replace('/');
					} catch (e: any) {
						toast.error('Error while trying to Delete User');
					}
				}}
			/>
		</>
	);
}
