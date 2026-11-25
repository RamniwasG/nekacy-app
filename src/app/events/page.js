'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedEvent, setEvents } from '../../store/slices/appSlice';
import { ArrowLeft, Grid2X2, List, LogOut, Plus, Pencil, Trash2, Search, SlidersHorizontal, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { eventApi } from '../../lib/api';
import { authStorage } from '../../lib/auth';

function EventsContent() {
	const [view, setView] = useState('card');
	const [searchQuery, setSearchQuery] = useState('');
	const [dateFilter, setDateFilter] = useState('');
		const [venueFilter, setVenueFilter] = useState('');
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const dispatch = useDispatch();
	const router = useRouter();
	const searchParams = useSearchParams();
	const listMode = searchParams.get('mode') || 'all';
	const events = useSelector((state) => state.app.events);

	useEffect(() => {
		const auth = authStorage.get();
		const userId = auth?.user?.id;
		const request = listMode === 'upcoming' ? eventApi.upcoming(userId) : eventApi.list(userId);
		request.then((data) => dispatch(setEvents(data))).catch(console.error);
	}, [dispatch, listMode]);

	const filteredEvents = [...events]
		.reverse()
		.filter((event) => event.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
		.filter((event) => !dateFilter || event.date === dateFilter)
		.filter((event) => !venueFilter || event.venue === venueFilter);

	const dates = [...new Set(events.map((event) => event.date))].sort();
	const venues = [...new Set(events.map((event) => event.venue))].sort();

	return (
		<main className="min-h-screen bg-[#f4efe7] px-5 py-6 sm:px-10 sm:py-8">
			<div className="mx-auto max-w-6xl">
				<header className="mb-10 flex items-center justify-between">
					<Link href="/dashboard" className="text-xl font-extrabold tracking-tight text-neutral-900">
						Nevta ki copy
					</Link>
					<Link
						href="/"
						className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-bold text-neutral-800"
						aria-label="Logout"
						onClick={() => authStorage.clear()}
					>
						<LogOut className="h-4 w-4" />
						<span className="hidden sm:inline">Logout</span>
					</Link>
				</header>

				<section aria-labelledby="events-title">
					<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<p className="mb-1 text-sm font-bold uppercase tracking-[0.18em] text-[#a18d72]">Events</p>
							<h1
								id="events-title"
								className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl"
							>
								{listMode === 'upcoming' ? 'Upcoming Events' : 'All Events'}
							</h1>
						</div>

						<div className="flex items-center gap-3">
							<div
								className="inline-flex rounded-xl border border-neutral-200 bg-white p-1"
								aria-label="View options"
							>
								{['card', 'list'].map((option) => (
									<button
										key={option}
										type="button"
										onClick={() => setView(option)}
										aria-pressed={view === option}
										className={`rounded-lg px-4 py-2 text-sm font-bold capitalize transition ${
											view === option ? 'bg-neutral-900 text-white' : 'text-neutral-600'
										}`}
									>
										{option === 'card' ? (
											<Grid2X2 className="mr-2 inline-block h-4 w-4" />
										) : (
											<List className="mr-2 inline-block h-4 w-4" />
										)}
										<span className="hidden sm:inline">{option}</span>
									</button>
								))}
							</div>
							<Link
								href="/events/new"
								aria-label="Create new event"
								className="flex h-10 shrink-0 flex-row items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-neutral-900 px-3 text-sm font-bold text-white sm:px-4"
							>
								<Plus className="h-4 w-4" />
								<span>New Event</span>
							</Link>
						</div>
					</div>

					<div className="mb-6 flex w-full flex-row items-center justify-between gap-3">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
							<input
								type="text"
								placeholder="Search events by name..."
								className="h-11 w-full rounded-xl border border-neutral-300 bg-white pl-10 pr-4 text-sm font-medium text-neutral-900 focus:border-neutral-900 focus:outline-none"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<button
							type="button"
							onClick={() => setIsFilterOpen(true)}
							className="flex h-11 shrink-0 items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 text-sm font-bold text-neutral-800"
						>
							<SlidersHorizontal className="h-4 w-4" />
							Filter
						</button>
					</div>

					{isFilterOpen && (
						<div
							className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
							role="dialog"
							aria-modal="true"
						>
							<div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
								<div className="mb-5 flex items-center justify-between">
									<h2 className="text-xl font-extrabold text-neutral-900">Filter Events</h2>
									<button
										type="button"
										onClick={() => setIsFilterOpen(false)}
										aria-label="Close filters"
										className="grid h-9 w-9 place-items-center rounded-lg border border-neutral-200"
									>
										<X className="h-4 w-4" />
									</button>
								</div>
								<div className="flex flex-col gap-4">
									<label className="flex flex-col gap-2 text-sm font-bold">
										Date
										<select
											value={dateFilter}
											onChange={(e) => setDateFilter(e.target.value)}
											className="h-11 rounded-xl border border-neutral-300 px-3"
										>
											<option value="">All Dates</option>
											{dates.map((date) => (
												<option key={date} value={date}>
													{new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
														month: 'long', day: 'numeric', year: 'numeric',
													})}
												</option>
											))}
										</select>
									</label>
									<label className="flex flex-col gap-2 text-sm font-bold">
										Venue
										<select
											value={venueFilter}
											onChange={(e) => setVenueFilter(e.target.value)}
											className="h-11 rounded-xl border border-neutral-300 px-3"
										>
											<option value="">All Venues</option>
											{venues.map((venue) => (
												<option key={venue} value={venue}>
													{venue}
												</option>
											))}
										</select>
									</label>
								</div>
								<div className="mt-6 flex gap-3">
									<button
										type="button"
										onClick={() => { setDateFilter(''); setVenueFilter(''); }}
										className="h-11 flex-1 rounded-xl border border-neutral-300 text-sm font-bold"
									>
										Clear
									</button>
									<button
										type="button"
										onClick={() => setIsFilterOpen(false)}
										className="h-11 flex-1 rounded-xl bg-neutral-900 text-sm font-bold text-white"
									>
										Apply Filter
									</button>
								</div>
							</div>
						</div>
					)}

					<div
						className={
							view === 'card'
								? 'grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4'
								: 'flex flex-col gap-4'
						}
					>
						{filteredEvents.length === 0 ? (
							<p className="col-span-full text-center text-sm text-neutral-500">
								No events found for &quot;{searchQuery}&quot;.
							</p>
						) : (
							[...filteredEvents].reverse().map((event) => (
								<article
									key={event.id}
									className={
										view === 'card'
											? 'h-full min-h-56 rounded-3xl border border-black/8 bg-white p-6 shadow-[0_18px_50px_rgba(76,62,45,0.08)]'
											: 'grid grid-cols-[1fr_auto] items-center gap-5 rounded-2xl border border-black/8 bg-white p-5'
									}
									onClick={() => {
										dispatch(setSelectedEvent(event));
										router.push(`/attendees?event=${encodeURIComponent(event.id)}&name=${encodeURIComponent(event.name)}`);
									}}
								>
									<div>
										<div className="flex items-start justify-between gap-3">
											<h2 className="text-xl font-extrabold text-neutral-900">{event.name}</h2>
											<div className="flex gap-2">
												<button
													type="button"
													aria-label={`Edit ${event.name}`}
													className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-neutral-300 text-neutral-700 hover:border-neutral-900"
													onClick={(eventClick) => {
														eventClick.stopPropagation();
														dispatch(setSelectedEvent(event));
														router.push(`/events/edit?id=${encodeURIComponent(event.id)}`);
													}}
												>
													<Pencil className="h-4 w-4" />
												</button>
												<button
													type="button"
													aria-label={`Delete ${event.name}`}
													className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-neutral-300 text-neutral-700 hover:border-neutral-900"
													onClick={(eventClick) => {
														eventClick.stopPropagation();
														if (window.confirm(`Delete ${event.name}?`)) {
																			eventApi.remove(event.id)
																				.then(() => eventApi.list())
																				.then((data) => dispatch(setEvents(data)))
																				.catch(console.error);
																		}
													}}
												>
													<Trash2 className="h-4 w-4" />
												</button>
											</div>
										</div>
										<p className="mt-4 text-sm font-bold text-[#a18d72]">
												{formatEventDate(event.date)}
											</p>
										<p className="mt-1 text-sm text-neutral-500">{event.venue}</p>
									</div>
								</article>
							))
						)}
					</div>
				</section>
			</div>
		</main>
	);
}

export default function EventsPage() {
	return (
		<Suspense fallback={<main className="min-h-screen bg-[#f4efe7]" />}>
			<EventsContent />
		</Suspense>
	);
}

function formatEventDate(value) {
	if (!value) return 'Date unavailable';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return 'Date unavailable';
	return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
