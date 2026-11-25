'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ArrowLeft, Save } from 'lucide-react';
import { attendeeApi } from '../../../lib/api';
import { useEffect, useState } from 'react';

function NewAttendeeForm() {
  const router = useRouter();

  const selectedEvent = useSelector((state) => state.app.selectedEvent);
  const eventId = selectedEvent?.id || '';
  const eventName = selectedEvent?.name || '';

  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState('');
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);

  async function saveAttendee(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const newAttendee = {
      eventId: eventId,
      name: form.get('name'),
      address: form.get('address'),
      gift: `₹${Number(form.get('gift')).toLocaleString('en-IN')}`,
      other: form.get('other')?.trim() || '',
      paymentMode: form.get('paymentMode'),
    };

    attendeeApi.create(newAttendee)
      .then(() => {
        formElement.reset();
        router.push('/attendees');
      })
      .catch(console.error);
  }

  useEffect(() => {
    attendeeApi.list()
      .then((attendees) => {
        const attendeeList = Array.isArray(attendees) ? attendees : [];
        const uniqueAddresses = Array.from(new Map(attendeeList
          .map((attendee) => attendee.address?.trim())
          .filter(Boolean)
          .map((value) => [value.toLowerCase(), value])).values());
        setAddresses(uniqueAddresses);
      })
      .catch(console.error);
  }, []);

  const addressSuggestions = (Array.isArray(addresses) ? addresses : [])
    .filter((value) => value.toLowerCase().includes(address.trim().toLowerCase()))
    .slice(0, 8);

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
              <input id="name" name="name" autoFocus required placeholder="Enter attendee name" className="h-12 rounded-xl border border-neutral-300 px-4 outline-none focus:border-neutral-900" />
            </div>
            <div className="relative flex flex-col gap-2">
              <label htmlFor="address" className="text-sm font-bold text-neutral-700">Address</label>
              <input
                id="address"
                name="address"
                required
                value={address}
                onChange={(event) => {
                  setAddress(event.target.value);
                  setShowAddressSuggestions(true);
                }}
                onFocus={() => setShowAddressSuggestions(true)}
                onBlur={() => window.setTimeout(() => setShowAddressSuggestions(false), 150)}
                placeholder="Enter or select address"
                autoComplete="street-address"
                className="h-12 rounded-xl border border-neutral-300 px-4 outline-none focus:border-neutral-900"
              />
              {showAddressSuggestions && addressSuggestions.length > 0 && (
                <div className="absolute top-[76px] z-20 max-h-48 w-full overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-lg">
                  {addressSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        setAddress(suggestion);
                        setShowAddressSuggestions(false);
                      }}
                      className="block w-full px-4 py-3 text-left text-sm text-neutral-700 hover:bg-neutral-100"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="gift" className="text-sm font-bold text-neutral-700">Cash Gift (₹)</label>
              <input id="gift" name="gift" type="number" min="0" required placeholder="Enter amount" className="h-12 rounded-xl border border-neutral-300 px-4 outline-none focus:border-neutral-900" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="other" className="text-sm font-bold text-neutral-700">Other <span className="font-normal text-neutral-400">(optional)</span></label>
              <input id="other" name="other" type="text" placeholder="Enter other details" className="h-12 rounded-xl border border-neutral-300 px-4 outline-none focus:border-neutral-900" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="paymentMode" className="text-sm font-bold text-neutral-700">Payment Mode</label>
              <select id="paymentMode" name="paymentMode" required defaultValue="Cash" className="h-12 rounded-xl border border-neutral-300 bg-white px-4 outline-none focus:border-neutral-900">
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
