'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { eventApi } from '../../../lib/api';
import { authStorage } from '../../../lib/auth';

export default function NewEventPage() {
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const auth = authStorage.get();
    const userId = auth?.user?.id;

    if (!userId) {
      router.push('/');
      return;
    }

    const newEvent = {
      userId,
      name: form.get('name'),
      date: form.get('date'),
      venue: form.get('venue'),
    };

    const formElement = event.currentTarget;

    eventApi.create(newEvent)
      .then(() => {
        formElement.reset();
        router.push('/events');
      })
      .catch((error) => console.error(error));
  }

  return (
    <main className="min-h-screen bg-[#f4efe7] px-5 py-6 sm:px-10 sm:py-8">
      <div className="mx-auto max-w-xl">
        <Link href="/events" className="mb-8 block text-sm font-bold text-[#a18d72]">
          <ArrowLeft className="inline-block mr-2" /> Back to Events
        </Link>
        <section className="rounded-3xl border border-black/8 bg-white p-6 shadow-[0_18px_50px_rgba(76,62,45,0.08)] sm:p-10">
          <p className="mb-1 text-sm font-bold uppercase tracking-[0.18em] text-[#a18d72]">New Event</p>
          <h1 className="mb-8 text-3xl font-extrabold text-neutral-900">Create Event</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-bold text-neutral-700">Event Name</label>
              <input id="name" name="name" required placeholder="Enter event name" className="h-12 rounded-xl border border-neutral-300 px-4 outline-none focus:border-neutral-900" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="date" className="text-sm font-bold text-neutral-700">Date</label>
              <input id="date" name="date" type="date" required className="h-12 rounded-xl border border-neutral-300 px-4 outline-none focus:border-neutral-900" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="venue" className="text-sm font-bold text-neutral-700">Venue</label>
              <input id="venue" name="venue" required placeholder="Enter venue" className="h-12 rounded-xl border border-neutral-300 px-4 outline-none focus:border-neutral-900" />
            </div>
            <button type="submit" className="mt-2 h-12 rounded-xl bg-neutral-900 text-sm font-bold text-white">
              <Save className="inline-block mr-2" /> Save Event
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
