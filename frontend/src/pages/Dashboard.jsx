import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createUrl,
  deleteUrl,
  getDashboardStats,
  getMyUrls,
} from "../api/urlApi";

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      {sub && <p className="mt-1 truncate text-sm text-slate-400">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [urls, setUrls] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [lastCreated, setLastCreated] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [statsData, urlsData] = await Promise.all([
        getDashboardStats(),
        getMyUrls({ page, limit: 10, search }),
      ]);
      setStats(statsData);
      setUrls(urlsData.urls);
      setPagination(urlsData.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreating(true);
    try {
      const payload = { url: url.trim() };
      if (customAlias.trim()) payload.customAlias = customAlias.trim();
      if (expiresAt) payload.expiresAt = new Date(expiresAt).toISOString();

      const data = await createUrl(payload);
      setLastCreated(data);
      setUrl("");
      setCustomAlias("");
      setExpiresAt("");
      await loadData();
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this URL?")) return;
    try {
      await deleteUrl(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const copyText = async (text) => {
    await navigator.clipboard.writeText(text);
  };

  const downloadQr = (qrCode, shortCode) => {
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `${shortCode}-qr.png`;
    link.click();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-slate-400">Manage your short links and track performance</p>
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total URLs" value={stats.totalUrls} />
          <StatCard label="Total Clicks" value={stats.totalClicks} />
          <StatCard
            label="Most Popular"
            value={stats.mostPopularUrl?.clicks ?? 0}
            sub={stats.mostPopularUrl?.shortCode}
          />
          <StatCard
            label="Latest URL"
            value={stats.latestUrl?.shortCode ?? "—"}
            sub={stats.latestUrl?.longUrl}
          />
        </div>
      )}

      <form
        onSubmit={handleCreate}
        className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
      >
        <h2 className="text-lg font-semibold text-white">Create short URL</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="url"
            required
            placeholder="https://example.com/long-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white sm:col-span-2"
          />
          <input
            type="text"
            placeholder="Custom alias (optional)"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
        </div>
        {createError && (
          <p className="text-sm text-rose-300">{createError}</p>
        )}
        <button
          type="submit"
          disabled={creating}
          className="rounded-xl bg-indigo-500 px-6 py-2.5 font-semibold text-white hover:bg-indigo-400 disabled:opacity-60"
        >
          {creating ? "Creating…" : "Shorten URL"}
        </button>

        {lastCreated && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <p className="text-sm text-emerald-300">Created: {lastCreated.shortUrl}</p>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <img
                src={lastCreated.qrCode}
                alt="QR Code"
                className="h-24 w-24 rounded-lg bg-white p-1"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => copyText(lastCreated.shortUrl)}
                  className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-white"
                >
                  Copy URL
                </button>
                <button
                  type="button"
                  onClick={() => downloadQr(lastCreated.qrCode, lastCreated.shortCode)}
                  className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-white"
                >
                  Download QR
                </button>
              </div>
            </div>
          </div>
        )}
      </form>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-white">Your URLs</h2>
          <input
            type="search"
            placeholder="Search URLs…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white"
          />
        </div>

        {error && <p className="mb-4 text-sm text-rose-300">{error}</p>}
        {loading ? (
          <p className="text-slate-400">Loading…</p>
        ) : urls.length === 0 ? (
          <p className="text-slate-400">No URLs yet. Create your first short link above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-slate-800 text-slate-500">
                <tr>
                  <th className="pb-3 pr-4">Original</th>
                  <th className="pb-3 pr-4">Short</th>
                  <th className="pb-3 pr-4">QR</th>
                  <th className="pb-3 pr-4">Clicks</th>
                  <th className="pb-3 pr-4">Created</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {urls.map((row) => (
                  <tr key={row._id} className="border-b border-slate-800/60">
                    <td className="max-w-[180px] truncate py-3 pr-4" title={row.longUrl}>
                      {row.longUrl}
                    </td>
                    <td className="py-3 pr-4">
                      <a
                        href={row.shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:underline"
                      >
                        {row.shortCode}
                      </a>
                    </td>
                    <td className="py-3 pr-4">
                      <img
                        src={row.qrCode}
                        alt=""
                        className="h-10 w-10 rounded bg-white p-0.5"
                      />
                    </td>
                    <td className="py-3 pr-4">{row.clicks}</td>
                    <td className="py-3 pr-4">
                      {new Date(row.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          onClick={() => copyText(row.shortUrl)}
                          className="rounded bg-slate-800 px-2 py-1 text-xs"
                        >
                          Copy
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadQr(row.qrCode, row.shortCode)}
                          className="rounded bg-slate-800 px-2 py-1 text-xs"
                        >
                          QR
                        </button>
                        <Link
                          to={`/analytics/${row.shortCode}`}
                          className="rounded bg-indigo-500/20 px-2 py-1 text-xs text-indigo-300"
                        >
                          Stats
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(row._id)}
                          className="rounded bg-rose-500/20 px-2 py-1 text-xs text-rose-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-slate-500">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              type="button"
              disabled={page >= pagination.pages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
