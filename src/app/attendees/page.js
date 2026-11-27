'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Grid2X2, List, LogOut, Pencil, Plus, Search, SlidersHorizontal, Trash2, X } from 'lucide-react';
import { setAttendees } from '../../store/slices/appSlice';
import { attendeeApi } from '../../lib/api';

function toTitleCase(value) {
	return (value || '')
		.toLowerCase()
		.split(/\s+/)
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

export default function AttendeesPage() {
	const [view, setView] = useState('card');
	const [searchQuery, setSearchQuery] = useState('');
	const [addressFilter, setAddressFilter] = useState('');
	const [giftFilter, setGiftFilter] = useState('');
	const [otherGiftFilter, setOtherGiftFilter] = useState('');
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const dispatch = useDispatch();
	const selectedEvent = useSelector((state) => state.app.selectedEvent);
	const allAttendees = useSelector((state) => state.app.attendees);
	const eventId = selectedEvent?.id || '';
	const eventName = selectedEvent?.name || '';
	const attendees = eventId
		? allAttendees.filter((attendee) => attendee.eventId === eventId)
		: [];
	const filteredAttendees = [...attendees]
		.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
		.filter((attendee) => attendee.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
		.filter((attendee) => !addressFilter || attendee.address === addressFilter)
		.filter((attendee) => !giftFilter || attendee.gift === giftFilter)
		.filter((attendee) => !otherGiftFilter || attendee.other === otherGiftFilter);

	const addresses = [...new Set(attendees.map((attendee) => attendee.address?.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
	const gifts = [...new Set(attendees.map((attendee) => attendee.gift?.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    const othergifts = [...new Set(attendees.map((attendee) => attendee.other?.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));

	useEffect(() => {
		if (!eventId) return;
		attendeeApi.list(eventId)
			.then((data) => dispatch(setAttendees(data)))
			.catch(console.error)
			.finally(() => setIsLoading(false));
	}, [dispatch, eventId]);

	async function handleDeleteAttendee(attendee) {
		if (!window.confirm(`Delete ${attendee.name}?`)) return;
		try {
			await attendeeApi.remove(attendee.id);
			const data = await attendeeApi.list(eventId);
			dispatch(setAttendees(data));
		} catch (error) {
			console.error(error);
		}
	}

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
					>
						<LogOut className="h-4 w-4" />
						<span className="hidden sm:inline">Logout</span>
					</Link>
				</header>

				<section aria-labelledby="attendees-title">
					<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<Link
								href="/events"
								className="mb-2 flex items-center text-sm font-bold text-[#a18d72]">
								<ArrowLeft className="mr-1 h-4 w-4" />
								<span>Back to Events</span>
							</Link>
							<p className="mb-1 text-sm font-bold uppercase tracking-[0.18em] text-[#a18d72]">
								Attendees
							</p>
							<h1
								id="attendees-title"
								className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl"
							>
								{eventId
									? `Attendees for ${eventName || 'Selected Event'} (${attendees.length})`
									: `All Attendees (${attendees.length})`}
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
											view === option
												? 'bg-neutral-900 text-white'
												: 'text-neutral-600'
										}`}
									>
										{option === 'card' ? (
											<Grid2X2 className="mr-2 h-4 w-4 inline-block" />
										) : (
											<List className="mr-2 h-4 w-4 inline-block" />
										)}
										<span className="hidden sm:inline">{option}</span>
									</button>
								))}
							</div>
							<Link
								href="/attendees/new"
								className="flex h-10 shrink-0 flex-row items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-neutral-900 px-3 text-sm font-bold text-white sm:px-4"
							>
								<Plus className="h-4 w-4" />
								<span>New Attend</span>
							</Link>
						</div>
					</div>

					<div className="mb-6 flex w-full flex-row items-center justify-between gap-3">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
							<input
								type="text"
								placeholder="Search attendees..."
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
						<div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
							<div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
								<div className="mb-5 flex items-center justify-between">
									<h2 className="text-xl font-extrabold text-neutral-900">Filter Attendees</h2>
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
										Address
										<select
											value={addressFilter}
											onChange={(e) => setAddressFilter(e.target.value)}
											className="h-11 rounded-xl border border-neutral-300 px-3"
										>
											<option value="">All addresses</option>
											{addresses.map((address) => (
												<option key={address} value={address}>
													{address}
												</option>
											))}
										</select>
									</label>
									<label className="flex flex-col gap-2 text-sm font-bold">
										Cash Gift
										<select
											value={giftFilter}
											onChange={(e) => setGiftFilter(e.target.value)}
											className="h-11 rounded-xl border border-neutral-300 px-3"
										>
											<option value="">All gifts</option>
											{gifts.map((gift) => (
												<option key={gift} value={gift}>
													{gift}
												</option>
											))}
										</select>
									</label>
									<label className="flex flex-col gap-2 text-sm font-bold">
										All other gifts
										<select
											value={otherGiftFilter}
											onChange={(e) => setOtherGiftFilter(e.target.value)}
											className="h-11 rounded-xl border border-neutral-300 px-3"
										>
											<option value="">Other gifts</option>
											{[...othergifts].map((og) => (
												<option key={og} value={og}>
													{og}
												</option>
											))}
										</select>
									</label>
								</div>
								<div className="mt-6 flex gap-3">
									<button
										type="button"
										onClick={() => {
											setAddressFilter('');
											setGiftFilter('');
											setOtherGiftFilter('');
										}}
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
						{filteredAttendees.length === 0 && !isLoading && (
							<p className="col-span-full text-center py-4 text-sm text-neutral-500">
								No attendees found.
							</p>
						)}
						{isLoading && (
							<div className="col-span-full flex justify-center py-4">
								<div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-neutral-900" />
							</div>
						)}
						{filteredAttendees.map((attendee) => (
							<article
								key={attendee.id}
								className={
									view === 'card'
										? 'h-full min-h-56 rounded-3xl border border-black/8 bg-white p-6 shadow-[0_18px_50px_rgba(76,62,45,0.08)]'
										: 'grid grid-cols-[1fr_auto] items-center gap-5 rounded-2xl border border-black/8 bg-white p-5'
								}
							>
								<div>
									<div className="flex items-start justify-between gap-3">
										<h2 className="text-xl font-extrabold text-neutral-900">{toTitleCase(attendee.name)}</h2>
										<div className="flex gap-2">
											<Link
												href={`/attendees/edit?id=${encodeURIComponent(attendee.id)}&eventId=${encodeURIComponent(attendee.eventId || eventId)}`}
												aria-label={`Edit ${attendee.name}`}
												className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-neutral-300 text-neutral-700 hover:border-neutral-900"
											>
												<Pencil className="h-4 w-4" />
											</Link>
											<button
												type="button"
												aria-label={`Delete ${attendee.name}`}
												className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-neutral-300 text-red-600 hover:border-red-400"
												onClick={() => handleDeleteAttendee(attendee)}
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
									</div>
									<p className="mt-4 text-sm text-neutral-500">{attendee.address}</p>
								</div>
								<div
									className={
										view === 'card'
											? 'mt-6 border-t border-neutral-100 pt-4'
											: 'text-right'
									}
								>
									<p className="text-xs font-bold uppercase tracking-wide text-neutral-400">
										Cash Gift
									</p>
									<div className="mt-1 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
										<p className="text-lg font-extrabold text-[#a18d70]">{attendee.gift}</p>
										<p className="text-center text-xs text-neutral-500">{attendee.other ? `Other: ${attendee.other}` : ''}</p>
										{attendee.paymentMode && <span className="justify-self-end text-xs font-bold text-neutral-600">{attendee.paymentMode}</span>}
									</div>
								</div>
							</article>
						))}
					</div>
				</section>
			</div>
		</main>
	);
}
