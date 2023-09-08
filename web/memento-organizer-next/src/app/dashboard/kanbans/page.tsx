'use client';

import * as Input from '@/components/form/input';
import {
	MdLockClock,
	MdOutlineTableChart,
	MdRefresh,
	MdUpdate,
	MdVerifiedUser,
	MdViewKanban,
	MdViewWeek,
} from 'react-icons/md';
import * as Button from '@/components/form/button';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Kanban } from '@/models/data/kanban';
import KanbansService from '@/services/kanbans.service';
import Link from 'next/link';
export default function Kanbans() {
	const [isFetching, setIsFetching] = useState(false);

	const [kanbans, setKanbans] = useState<Kanban[]>([]);
	async function fetchKanbans() {
		setIsFetching(true);
		const kanbans = KanbansService.getKanbansByOwner();
		toast.promise(kanbans, {
			pending: 'Refreshing Kanbans',
			error: 'Could not Refresh Kanbans',
			success: 'Fetched notes with success',
		});
		const aux = await kanbans;
		console.log(aux);
		setKanbans(aux);
		setIsFetching(false);
	}

	useEffect(() => {
		fetchKanbans();
	}, []);

	return (
		<>
			<div className='w-full h-18 bg-white dark:bg-slate-700 drop-shadow-md flex items-center px-3 py-2 md:px-6 md:py-4 justify-between rounded-lg sticky top-0 z-10'>
				<div>
					<div className='justify-start sm:flex hidden'>
						<Input.Root>
							<Input.Flat>
								<Input.Control placeholder='Filter Your Kanbans By Name...' />
							</Input.Flat>
						</Input.Root>
					</div>
				</div>
				<div>
					<Button.Flat disabled={isFetching} onClick={() => fetchKanbans()}>
						<span className='flex gap-2 items-center justify-center'>
							<span className='sm:text-sm w-fit h-fit'>Refresh Kanbans</span>
							<span
								className={`inline-block  ${
									isFetching && 'animate-spin'
								} w-fit h-fit`}
							>
								<MdRefresh className='text-2xl' />
							</span>
						</span>
					</Button.Flat>
				</div>
			</div>
			<div className='mt-8 mb-4 w-full min-h-[80%] bg-white dark:bg-slate-700  drop-shadow-lg rounded-md grid grid-cols-1   lg:grid-cols-2 xl:grid-cols-3 flex-grow flex-shrink-0'>
				{kanbans.map((kanban) => (
					<Link
						href={`/dashboard/kanbans/${kanban.id}`}
						key={kanban.id}
						className='bg-slate-100 dark:bg-slate-800 m-4 h-60 flex flex-col border-slate-100 dark:border-slate-900 border rounded-md hover:bg-emerald-200 dark:hover:bg-emerald-700 duration-200 transition-all'
					>
						<div className='w-full h-10 flex items-center p-2'>
							<MdOutlineTableChart className='text-2xl mr-1' />
							<span className='h-full bg-emerald-500 w-1 rounded-full'></span>
							<span className='truncate'>
								<span className='ml-2 text-2xl font-semibold truncate'>
									{kanban.name}
								</span>
							</span>
						</div>
						<div className='border-l border-l-emerald-500 pl-2 ml-12 mt-2 '>
							<h3 className='text-xl text-slate-700 dark:text-slate-300'>
								Description
							</h3>
							<div className='h-[6rem] break-al overflow-hidden'>
								<p className='overflow-hidden text-ellipsis text-slate-600 dark:text-slate-500'>
									{kanban.description ||
										"This Kanban Don't have a description yet, create one"}
								</p>
							</div>
						</div>
						<div className='w-full items-end flex flex-col pr-4'>
							<span className='flex items-center gap-2'>
								<span>Issued</span>
								<MdLockClock />
								<span>{new Date(kanban.issued).toDateString()}</span>
							</span>
							<span className='flex items-center gap-2'>
								<span>Last Update</span>
								<MdUpdate />
								<span>{new Date(kanban.lastUpdate).toDateString()}</span>
							</span>
						</div>
					</Link>
				))}
			</div>
			<ToastContainer />
		</>
	);
}
