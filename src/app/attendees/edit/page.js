'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Save } from 'lucide-react';
import { attendeeApi } from '../../../lib/api';

function EditAttendeeForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const attendeeId = searchParams.get('id') || '';
  const routeEventId = searchParams.get('eventId') || '';
  const attendee = useSelector((state) =>
    state.app.attendees.find((item) => item.id === attendeeId)
  );

  const defaultGift = useMemo(() => {
    if (!attendee?.gift) return '';
    return attendee.gift.replace(/[^0-9]/g, '');
  }, [attendee]);

  function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    attendeeApi.update(attendeeId, {
      eventId: routeEventId || attendee.eventId,
      name: form.get('name'),
      address: form.get('address'),
      gift: `₹${Number(form.get('gift')).toLocaleString('en-IN')}`,
      other: form.get('other')?.trim() || '',
      paymentMode: form.get('paymentMode'),
    }).then(() => router.push('/attendees')).catch(console.error);
  }

  if (!attendee) {
    return (
      <main className="min-h-screen bg-[#f4efe7] px-5 py-6 sm:px-10 sm:py-8">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center">
          <h1 className="text-2xl font-extrabold text-neutral-900">Attendee not found</h1>
          <Link href="/attendees" className="mt-4 inline-block text-sm font-bold text-[#a18d72]">Back to Attendees</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4efe7] px-5 py-6 sm:px-10 sm:py-8">
      <div className="mx-auto max-w-xl">
        <Link href="/attendees" className="mb-8 block text-sm font-bold text-[#a18d72]">← Back to Attendees</Link>
        <section className="rounded-3xl border border-black/8 bg-white p-6 shadow-[0_18px_50px_rgba(76,62,45,0.08)] sm:p-10">
          <p className="mb-1 text-sm font-bold uppercase tracking-[0.18em] text-[#a18d72]">Edit Attendee</p>
          <h1 className="mb-8 text-3xl font-extrabold text-neutral-900">Update Attendee</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-bold text-neutral-700">Attendee Name</label>
              <input id="name" name="name" required defaultValue={attendee.name} className="h-12 rounded-xl border border-neutral-300 px-4 outline-none focus:border-neutral-900" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="address" className="text-sm font-bold text-neutral-700">Address</label>
              <input id="address" name="address" required defaultValue={attendee.address} className="h-12 rounded-xl border border-neutral-300 px-4 outline-none focus:border-neutral-900" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="gift" className="text-sm font-bold text-neutral-700">Cash Gift (₹)</label>
              <input id="gift" name="gift" type="number" min="0" required defaultValue={defaultGift} className="h-12 rounded-xl border border-neutral-300 px-4 outline-none focus:border-neutral-900" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="other" className="text-sm font-bold text-neutral-700">Other <span className="font-normal text-neutral-400">(optional)</span></label>
              <input id="other" name="other" type="text" defaultValue={attendee.other || ''} placeholder="Enter other details" className="h-12 rounded-xl border border-neutral-300 px-4 outline-none focus:border-neutral-900" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="paymentMode" className="text-sm font-bold text-neutral-700">Payment Mode</label>
              <select id="paymentMode" name="paymentMode" required defaultValue={attendee.paymentMode || ''} className="h-12 rounded-xl border border-neutral-300 bg-white px-4 outline-none focus:border-neutral-900">
                <option value="" disabled>Select payment mode</option>
                <option value="Cash">Cash</option>
                <option value="GPay">GPay</option>
                <option value="PhonePe">PhonePe</option>
              </select>
            </div>
            <button type="submit" className="mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-neutral-900 text-sm font-bold text-white">
              <Save className="w-5 h-5" />
              Update Attendee
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default function EditAttendeePage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f4efe7]" />}>
      <EditAttendeeForm />
    </Suspense>
  );
}
