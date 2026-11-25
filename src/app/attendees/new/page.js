'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ArrowLeft, Save } from 'lucide-react';
import { attendeeApi } from '../../../lib/api';

function NewAttendeeForm() {
  const router = useRouter();

  const selectedEvent = useSelector((state) => state.app.selectedEvent);
  const eventId = selectedEvent?.id || '';
  const eventName = selectedEvent?.name || '';

  async function saveAttendee(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const newAttendee = {
      eventId: eventId,
      name: form.get('name'),
      address: form.get('address'),
      gift: `₹${Number(form.get('gift')).toLocaleString('en-IN')}`,
      paymentMode: form.get('paymentMode'),
    };

    attendeeApi.create(newAttendee)
      .then(() => {
        formElement.reset();
        router.push('/attendees');
      })
      .catch(console.error);
  }

  return (
    <main className="min-h-screen bg-[#f4efe7] px-5 py-6 sm:px-10 sm:py-8">
      <div className="mx-auto max-w-xl">
        <Link href="/attendees" className="mb-8 flex items-center gap-2 text-sm font-bold text-[#a18d72]">
          <ArrowLeft className="w-4 h-4" /> Back to Attendees
        </Link>
        <section className="rounded-3xl border border-black/8 bg-white p-6 shadow-[0_18px_50px_rgba(76,62,45,0.08)] sm:p-10">
          <p className="mb-1 text-sm font-bold uppercase tracking-[0.18em] text-[#a18d72]">New Attendee</p>
          <h1 className="mb-8 text-3xl font-extrabold text-neutral-900">Add Attendee</h1>
          <form onSubmit={saveAttendee} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-bold text-neutral-700">Attendee Name</label>
              <input id="name" name="name" required placeholder="Enter attendee name" className="h-12 rounded-xl border border-neutral-300 px-4 outline-none focus:border-neutral-900" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="address" className="text-sm font-bold text-neutral-700">Address</label>
              <input id="address" name="address" required placeholder="Enter address" className="h-12 rounded-xl border border-neutral-300 px-4 outline-none focus:border-neutral-900" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="gift" className="text-sm font-bold text-neutral-700">Cash Gift (₹)</label>
              <input id="gift" name="gift" type="number" min="0" required placeholder="Enter amount" className="h-12 rounded-xl border border-neutral-300 px-4 outline-none focus:border-neutral-900" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="paymentMode" className="text-sm font-bold text-neutral-700">Payment Mode</label>
              <select id="paymentMode" name="paymentMode" required defaultValue="" className="h-12 rounded-xl border border-neutral-300 bg-white px-4 outline-none focus:border-neutral-900">
                <option value="" disabled>Select payment mode</option>
                <option value="Cash">Cash</option>
                <option value="GPay">GPay</option>
                <option value="PhonePe">PhonePe</option>
              </select>
            </div>
            <button type="submit" className="mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-neutral-900 text-sm font-bold text-white">
              <Save className="w-4 h-4" /> Save Attendee
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default function NewAttendeePage() {
  return (
    <NewAttendeeForm />
  );
}
