'use client';

import { useRouter } from 'next/navigation';
import { authStorage } from '../lib/auth';

export default function Home() {
  const router = useRouter();

  function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    fetch('http://localhost:5002/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.get('username').trim().toLowerCase(),
        password: form.get('password'),
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Sign in failed');
        authStorage.save(data);
        router.push('/dashboard');
      })
      .catch((error) => alert(error.message));
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f4efe7] p-6">
      <section
        className="flex min-h-[520px] w-full max-w-[420px] flex-col justify-center rounded-3xl border border-black/8 bg-white/95 px-6 py-10 shadow-[0_24px_70px_rgba(76,62,45,0.12)] sm:px-11"
        aria-labelledby="login-title"
      >
        <h1
          id="login-title"
          className="mb-10 text-center text-[clamp(2.2rem,8vw,3.25rem)] font-extrabold leading-none tracking-tight text-neutral-900"
        >
          Nevta ki copy
        </h1>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-sm font-bold text-neutral-700">
              Email
            </label>
            <input
              id="username"
              name="username"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              required
              className="h-[52px] w-full rounded-xl border border-[#d8d2c8] bg-white px-[15px] text-base text-neutral-900 outline-none transition placeholder:text-[#9b978f] focus:border-neutral-900 focus:ring-3 focus:ring-neutral-900/8"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-bold text-neutral-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="h-[52px] w-full rounded-xl border border-[#d8d2c8] bg-white px-[15px] text-base text-neutral-900 outline-none transition placeholder:text-[#9b978f] focus:border-neutral-900 focus:ring-3 focus:ring-neutral-900/8"
            />
          </div>

          <button
            type="submit"
            className="mt-2 h-[52px] rounded-xl bg-neutral-900 text-base font-extrabold text-white transition hover:-translate-y-px hover:bg-neutral-700 active:translate-y-0"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">
          New user?{' '}
          <button
            type="button"
            onClick={() => router.push('/register')}
            className="font-bold text-neutral-900 underline underline-offset-4"
          >
            Register here
          </button>
        </p>
      </section>
    </main>
  );
}
