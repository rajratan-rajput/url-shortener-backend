import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-3xl font-bold text-white">Profile</h1>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <dl className="space-y-4">
          <div>
            <dt className="text-sm text-slate-500">Name</dt>
            <dd className="text-lg text-white">{user?.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Email</dt>
            <dd className="text-lg text-white">{user?.email}</dd>
          </div>
          {user?.createdAt && (
            <div>
              <dt className="text-sm text-slate-500">Member since</dt>
              <dd className="text-lg text-white">
                {new Date(user.createdAt).toLocaleDateString()}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
