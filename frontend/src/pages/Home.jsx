import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-12 text-center">
      <section>
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-indigo-400">
          URL Shortener Platform
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Short links with{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            analytics & QR codes
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
          Register to create branded short URLs, track clicks with advanced
          analytics, and download QR codes instantly.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400"
              >
                Get started free
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 font-semibold text-slate-200 hover:bg-slate-800"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="grid gap-4 text-left sm:grid-cols-3">
        {[
          ["JWT Authentication", "Secure accounts with protected dashboard access."],
          ["QR Codes", "Auto-generated QR for every short link with download support."],
          ["Advanced Analytics", "Browser, device, geo, and time-series click insights."],
        ].map(([title, desc]) => (
          <article
            key={title}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
          >
            <h2 className="font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm text-slate-400">{desc}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
