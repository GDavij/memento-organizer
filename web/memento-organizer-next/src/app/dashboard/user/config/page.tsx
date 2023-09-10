'use client';
import { Accordion } from '@/components/Acordion';
import { TToken } from '@/models/data/token';
import { User } from '@/models/data/user';
import jwtDecode from 'jwt-decode';
import { lazy, useEffect, useId, useState } from 'react';
import {
	MdAccessTimeFilled,
	MdAccountBox,
	MdKeyboardArrowDown,
	MdLockClock,
} from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import userService from '@/services/user.service';
import { useTopBar } from '../../contexts/useTopBar';
import { useForm } from 'react-hook-form';
import AccountInfoAccordion from './components/AccountInfoAccordion';
import UnsecureSettingsAccordion from './components/UnsecureSettingsAccordion';

export default function UserConfig() {
	const { setPageDetails } = useTopBar();
	const [userData, setUserData] = useState<User | null>(null);

	async function fetchData() {
		const user = await userService.findUser();
		setUserData(user);
	}

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			toast.error('Could not Authenticate Token');
			return;
		}
		try {
			setPageDetails({ pageName: 'User Settings' });
			fetchData();
		} catch (e) {
			toast.error('Could not Authenticate Token');
			return;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div className='sm:ml-0 ml-5 w-11/12 h-fit  bg-white dark:bg-slate-700 flex flex-col gap-4 drop-shadow-lg p-4 rounded-md mb-4'>
				<div className='flex gap-2 items-end'>
					<MdAccountBox className='text-xl sm:text-2xl md:text-4xl' />
					<span className='text-sm sm:text-md md:text-xl'>
						Logged as{' '}
						<span className='text-emerald-500'>{userData?.email}</span>
					</span>
				</div>
				<div className='flex gap-2 items-end'>
					<MdAccessTimeFilled className='text-lg sm:text-xl md:text-3xl' />
					<span className='text-sm sm:text-md md:text-lg'>
						Last Login at {userData?.lastLogin}
					</span>
				</div>
				<div className='flex gap-2 items-end'>
					<MdLockClock className='text-lg sm:text-xl md:text-3xl' />
					<span className='text-sm sm:text-md md:text-lg '>
						Created at {userData?.issued}
					</span>
				</div>
			</div>
			<div className='w-full h-fit flex flex-col flex-shrink-0 flex-grow-0 gap-4 items-center'>
				<AccountInfoAccordion
					fetchedEmail={userData?.email}
					refetchUserData={fetchData}
				/>
				<UnsecureSettingsAccordion />
			</div>
			<ToastContainer />
		</>
	);
}
