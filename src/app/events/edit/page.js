'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteEvent } from '../../../store/slices/appSlice';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { eventApi } from '../../../lib/api';

function EditEventForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id') || '';
  const event = useSelector((state) => state.app.events.find((item) => item.id === eventId));

  const defaultDate = useMemo(() => {
    if (!event?.date) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(event.date)) return event.date;
    const parsedDate = new Date(event.date);
    if (Number.isNaN(parsedDate.getTime())) return '';
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, [event]);

  async function handleSubmit(formEvent) {
    formEvent.preventDefault();
    const form = new FormData(formEvent.currentTarget);
    eventApi.update(eventId, {
      name: form.get('name'),
      date: form.get('date'),
      venue: form.get('venue'),
    }).then(() => router.push('/events')).catch(console.error);
  }

  function handleDelete() {
    if (!window.confirm(`Delete ${event.name}?`)) return;
    eventApi.remove(eventId).then(() => router.push('/events')).catch(console.error);
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-[#f4efe7] px-5 py-6 sm:px-10 sm:py-8">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center">
          <h1 className="text-2xl font-extrabold text-neutral-900">Event not found</h1>
          <Link href="/events" className="mt-4 inline-block text-sm font-bold text-[#a18d72]">Back to Events</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4efe7] px-5 py-6 sm:px-10 sm:py-8">
      <div className="mx-auto max-w-xl">
        <Link href="/events" className="mb-8 flex items-center gap-2 text-sm font-bold text-[#a18d72]">
          <ArrowLeft className="h-4 w-4" /> Back to Events
        </Link>
        <section className="rounded-3xl border border-black/8 bg-white p-6 shadow-[0_18px_50px_rgba(76,62,45,0.08)] sm:p-10">
          <p className="mb-1 text-sm font-bold uppercase tracking-[0.18em] text-[#a18d72]">Edit Event</p>
          <h1 className="mb-8 text-3xl font-extrabold text-neutral-900">Update Event</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-bold text-neutral-700">Event Name</label>
              <input id="name" name="name" required defaultValue={event.name} className="h-12 rounded-xl border border-neutral-300 px-4 outline-none focus:border-neutral-900" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="date" className="text-sm font-bold text-neutral-700">Date</label>
              <input id="date" name="date" type="date" required defaultValue={defaultDate} className="h-12 rounded-xl border border-neutral-300 px-4 outline-none focus:border-neutral-900" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="venue" className="text-sm font-bold text-neutral-700">Venue</label>
              <input id="venue" name="venue" required defaultValue={event.venue} className="h-12 rounded-xl border border-neutral-300 px-4 outline-none focus:border-neutral-900" />
            </div>
            <div className="mt-2 flex gap-3">
              <button type="button" onClick={handleDelete} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 text-sm font-bold text-red-600">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
              <button type="submit" className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-neutral-900 text-sm font-bold text-white">
                <Save className="h-4 w-4" /> Update
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default function EditEventPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f4efe7]" />}>
      <EditEventForm />
    </Suspense>
  );
}
