import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { getUrlAnalytics } from "../api/urlApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  plugins: { legend: { labels: { color: "#94a3b8" } } },
  scales: {
    x: { ticks: { color: "#94a3b8" }, grid: { color: "#1e293b" } },
    y: { ticks: { color: "#94a3b8" }, grid: { color: "#1e293b" } },
  },
};

export default function UrlAnalytics() {
  const { shortCode } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const analytics = await getUrlAnalytics(shortCode);
        setData(analytics);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [shortCode]);

  if (loading) {
    return <p className="text-slate-400">Loading analytics…</p>;
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-rose-300">{error}</p>
        <Link to="/dashboard" className="mt-4 inline-block text-indigo-400">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const dayChart = {
    labels: data.clicksPerDay.map((d) => d.period),
    datasets: [
      {
        label: "Clicks per day",
        data: data.clicksPerDay.map((d) => d.count),
        backgroundColor: "rgba(99, 102, 241, 0.5)",
        borderColor: "#6366f1",
      },
    ],
  };

  const monthChart = {
    labels: data.clicksPerMonth.map((d) => d.period),
    datasets: [
      {
        label: "Clicks per month",
        data: data.clicksPerMonth.map((d) => d.count),
        borderColor: "#a78bfa",
        backgroundColor: "rgba(167, 139, 250, 0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div>
        <Link to="/dashboard" className="text-sm text-indigo-400 hover:text-indigo-300">
          ← Dashboard
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-white">
          Analytics: <span className="text-indigo-400">{data.shortCode}</span>
        </h1>
        <p className="mt-1 truncate text-slate-400">{data.longUrl}</p>
        <p className="mt-2 text-2xl font-semibold text-white">
          {data.totalClicks} total clicks
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="mb-4 font-semibold text-white">Clicks per day</h2>
          <Bar data={dayChart} options={chartOptions} />
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="mb-4 font-semibold text-white">Clicks per month</h2>
          <Line data={monthChart} options={chartOptions} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="mb-4 font-semibold text-white">Recent click events</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-2 pr-4">Time</th>
                <th className="pb-2 pr-4">Browser</th>
                <th className="pb-2 pr-4">Device</th>
                <th className="pb-2 pr-4">OS</th>
                <th className="pb-2 pr-4">Referrer</th>
                <th className="pb-2 pr-4">Location</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {data.recentEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-slate-500">
                    No detailed events yet
                  </td>
                </tr>
              ) : (
                data.recentEvents.map((e, i) => (
                  <tr key={i} className="border-t border-slate-800">
                    <td className="py-2 pr-4">
                      {new Date(e.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2 pr-4">{e.browser}</td>
                    <td className="py-2 pr-4">{e.device}</td>
                    <td className="py-2 pr-4">{e.os}</td>
                    <td className="max-w-[120px] truncate py-2 pr-4">{e.referrer}</td>
                    <td className="py-2 pr-4">
                      {e.city}, {e.country}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
