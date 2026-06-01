import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "An unexpected error occurred. Please try again.";
  let status = null;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    title = error.status === 404 ? "Page not found" : `Error ${error.status}`;
    message =
      error.statusText ||
      error.data?.message ||
      "The page you are looking for does not exist.";
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {status && (
        <p className="text-7xl font-bold text-indigo-500/40">{status}</p>
      )}
      <h1 className="mt-2 text-3xl font-bold text-white">{title}</h1>
      <p className="mt-3 max-w-md text-slate-400">{message}</p>
      <div className="mt-8 flex gap-4">
        <Link
          to="/"
          className="rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white hover:bg-indigo-400"
        >
          Go home
        </Link>
        <Link
          to="/create"
          className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-200 hover:bg-slate-800"
        >
          Create URL
        </Link>
      </div>
    </div>
  );
}
