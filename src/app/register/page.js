'use client';

import { useRouter } from 'next/navigation';
import { authStorage } from '../../lib/auth';

export default function RegisterPage() {
  const router = useRouter();

  function handleSubmit(event) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const fullName = form.get('name').trim();
    const email = form.get('username').trim().toLowerCase();
    const password = form.get('password');
    const nameParts = fullName.split(/\s+/).filter(Boolean);
    const firstname = nameParts.shift() || '';
    const lastname = nameParts.join(' ') || firstname;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (password.length < 6 || !/[A-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>_\-=+]/.test(password)) {
      alert('Password must be at least 6 characters and include an uppercase letter and a special symbol');
      return;
    }

    fetch('http://localhost:5002/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstname, lastname, email, password }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Registration failed');
        authStorage.save(data);
        router.push('/dashboard');
      })
      .catch((error) => alert(error.message));
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f4efe7] p-6">
      <section
        className="flex min-h-[560px] w-full max-w-[420px] flex-col justify-center rounded-3xl border border-black/8 bg-white/95 px-6 py-10 shadow-[0_24px_70px_rgba(76,62,45,0.12)] sm:px-11"
        aria-labelledby="register-title"
      >
        <h1
          id="register-title"
          className="mb-8 text-center text-4xl font-extrabold tracking-tight text-neutral-900"
        >
          Register
        </h1>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-bold text-neutral-700">Full Name</label>
            <input id="name" name="name" type="text" required placeholder="Enter your full name" autoComplete="name" className="h-[52px] w-full rounded-xl border border-[#d8d2c8] bg-white px-[15px] text-base text-neutral-900 outline-none placeholder:text-[#9b978f] focus:border-neutral-900 focus:ring-3 focus:ring-neutral-900/8" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-sm font-bold text-neutral-700">Email</label>
            <input id="username" name="username" type="email" required placeholder="Enter your email" autoComplete="email" className="h-[52px] w-full rounded-xl border border-[#d8d2c8] bg-white px-[15px] text-base text-neutral-900 outline-none placeholder:text-[#9b978f] focus:border-neutral-900 focus:ring-3 focus:ring-neutral-900/8" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-bold text-neutral-700">Password</label>
            <input id="password" name="password" type="password" required minLength="6" pattern="(?=.*[A-Z])(?=.*[!@#$%^&*(),.?&quot;:{}|&lt;&gt;_\-=+]).{6,}" title="At least 6 characters, one uppercase letter, and one special symbol" placeholder="Create a password" autoComplete="new-password" className="h-[52px] w-full rounded-xl border border-[#d8d2c8] bg-white px-[15px] text-base text-neutral-900 outline-none placeholder:text-[#9b978f] focus:border-neutral-900 focus:ring-3 focus:ring-neutral-900/8" />
          </div>

          <button type="submit" className="mt-2 h-[52px] rounded-xl bg-neutral-900 text-base font-extrabold text-white transition hover:-translate-y-px hover:bg-neutral-700 active:translate-y-0">
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">
          Already registered?{' '}
          <button type="button" onClick={() => router.push('/')} className="font-bold text-neutral-900 underline underline-offset-4">
            Sign in
          </button>
        </p>
      </section>
    </main>
  );
}
