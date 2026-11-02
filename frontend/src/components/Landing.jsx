import React from "react";

export default function Landing({ onGetStarted, onSignIn }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-600 to-pink-500" />
          <span className="text-lg font-bold">EduTrack</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onSignIn} className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:block">Sign in</button>
          <button onClick={onGetStarted} className="rounded-lg bg-gradient-to-r from-indigo-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:opacity-95">Get started</button>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">Student Management Made Simple</div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Manage students with clarity and speed
              </h1>
              <p className="mt-6 max-w-xl text-lg text-slate-600">
                EduTrack helps you enroll, track, and organize student records in one beautiful dashboard. Filter by status, course, year and get instant insights.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button onClick={onGetStarted} className="rounded-lg bg-gradient-to-r from-indigo-600 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:opacity-95">Get started free</button>
                <button onClick={onSignIn} className="rounded-lg border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Sign in</button>
              </div>
              <p className="mt-4 text-sm text-slate-500">Create an account or sign in to get started.</p>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-indigo-500/10 to-pink-500/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/5">
                <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <div className="ml-2 text-xs text-slate-400">EduTrack Dashboard</div>
                </div>
                <div className="grid gap-4 p-6 sm:grid-cols-2">
                  <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-white p-4">
                    <p className="text-sm text-slate-500">Total Students</p>
                    <p className="mt-2 text-3xl font-bold">—</p>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-white p-4">
                    <p className="text-sm text-slate-500">Active</p>
                    <p className="mt-2 text-3xl font-bold">—</p>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-amber-50 to-white p-4 sm:col-span-2">
                    <p className="text-sm text-slate-500">Average GPA</p>
                    <p className="mt-2 text-3xl font-bold">—</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Smart Enrollment", desc: "Add and manage student profiles with all key details in seconds." },
              { title: "Powerful Filters", desc: "Search, filter by status/course/year and sort to find anyone instantly." },
              { title: "Beautiful Insights", desc: "See totals, status breakdown and average GPA at a glance." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-600 to-pink-500" />
            <span className="text-sm font-semibold">EduTrack</span>
          </div>
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} EduTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
