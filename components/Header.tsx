'use client';

import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <header className="w-full p-4 bg-white shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-400">
            Loading...
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="w-full p-4 bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-lg font-semibold">
          {user ? (
            <span className="text-gray-700">{user.email}</span>
          ) : (
            <span className="text-gray-400">Not signed in</span>
          )}
        </div>
        {user && (
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        )}
      </div>
    </header>
  );
} 