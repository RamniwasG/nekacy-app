'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Grid2X2, List, LogOut } from 'lucide-react';
import { eventApi, attendeeApi } from '../../lib/api';
import { authStorage } from '../../lib/auth';

export default function Dashboard() {
	const [view, setView] = useState('card');
	const [events, setEvents] = useState([]);
	const [attendees, setAttendees] = useState([]);
	const [upcomingEvents, setUpcomingEvents] = useState([]);

	useEffect(() => {
		const auth = authStorage.get();
		const userId = auth?.user?.id;
		Promise.all([
			eventApi.list(userId),
			eventApi.upcoming(userId),
			attendeeApi.list(),
		])
			.then(([eventData, upcomingEventData, attendeeData]) => {
				setEvents(eventData);
				setUpcomingEvents(upcomingEventData);
				setAttendees(attendeeData);
			})
			.catch(console.error);
	}, []);

	const items = [
		{ title: 'Upcoming Events', description: 'Create, manage, and review upcoming events.', count: upcomingEvents.length, icon: 'UEV' },
		{ title: 'All Events', description: 'View and manage all events.', count: events.length, icon: 'AEV' },
		{ title: 'Peoples', description: 'View members, contacts, and attendee details.', count: attendees.length, icon: 'PE' },
	];

	return (
		<main className="min-h-screen bg-[#f4efe7] px-5 py-6 sm:px-10 sm:py-8">
			<div className="mx-auto max-w-5xl">
				<header className="mb-10 flex items-center justify-between">
					<Link
						href="/"
						className="text-xl font-extrabold tracking-tight text-neutral-900"
						aria-label="Go to login page"
					>
						Nevta ki copy
					</Link>

					<Link
						href="/"
						className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-bold text-neutral-800 transition hover:border-neutral-900 hover:text-neutral-950"
						onClick={() => authStorage.clear()}
					>
						<LogOut className="h-4 w-4" />
						<span className="hidden sm:inline">Logout</span>
					</Link>
				</header>

				<section aria-labelledby="dashboard-title">
					<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<p className="mb-1 text-sm font-bold uppercase tracking-[0.18em] text-[#a18d72]">
								Overview
							</p>
							<h1
								id="dashboard-title"
								className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl"
							>
								Dashboard
							</h1>
						</div>

						<div
							className="inline-flex w-fit rounded-xl border border-neutral-200 bg-white p-1"
							aria-label="View options"
						>
							<button
								type="button"
								onClick={() => setView('card')}
								aria-pressed={view === 'card'}
								className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
									view === 'card'
										? 'bg-neutral-900 text-white'
										: 'text-neutral-600 hover:text-neutral-900'
								}`}
							>
								<Grid2X2 className="mr-2 inline-block h-4 w-4" />
								<span className="hidden sm:inline">Card</span>
							</button>
							<button
								type="button"
								onClick={() => setView('list')}
								aria-pressed={view === 'list'}
								className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
									view === 'list'
										? 'bg-neutral-900 text-white'
										: 'text-neutral-600 hover:text-neutral-900'
								}`}
							>
								<List className="mr-2 inline-block h-4 w-4" />
								<span className="hidden sm:inline">List</span>
							</button>
						</div>
					</div>

					<div
						className={
							view === 'card'
								? 'grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-3'
								: 'flex flex-col gap-4'
						}
					>
						{items.map((item) => (
							<Link
								key={item.title}
								href={item.title === 'Peoples' ? '/attendees' : item.title === 'Upcoming Events' ? '/events?mode=upcoming' : '/events?mode=all'}
								className="block"
							>
								<article
									className={
										view === 'card'
											? 'h-full min-h-64 rounded-3xl border border-black/8 bg-white p-6 shadow-[0_18px_50px_rgba(76,62,45,0.08)]'
											: 'flex items-center gap-5 rounded-2xl border border-black/8 bg-white p-5 shadow-[0_12px_35px_rgba(76,62,45,0.06)]'
									}
								>
									<div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-neutral-900 text-sm font-extrabold text-white">
										{item.icon}
									</div>
									<div
										className={
											view === 'card' ? 'mt-12' : 'min-w-0 flex-1'
										}
									>
										<div className="flex items-start justify-between gap-4">
											<h2 className="text-xl font-extrabold text-neutral-900">
												{item.title}
											</h2>
											<span className="text-lg font-extrabold text-[#a18d72]">
												{item.count}
											</span>
										</div>
										<p className="mt-2 text-sm leading-6 text-neutral-500">
											{item.description}
										</p>
									</div>
								</article>
							</Link>
						))}
					</div>
				</section>
			</div>
		</main>
	);
}
