export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-zinc-100 ${className}`} />;
}

export function WarmingNotice() {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <p className="font-medium">Backend is warming up…</p>
      <p className="mt-1 text-xs text-amber-700">
        The API is hosted on Render's free tier and may take 30–60 seconds to wake from sleep on the first
        request. Subsequent requests will be instant.
      </p>
    </div>
  );
}

export function ErrorNotice({ error }: { error: Error }) {
  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
      <p className="font-medium">Couldn't reach the API</p>
      <p className="mt-1 text-xs text-rose-700">{error.message || "Unknown error"}</p>
    </div>
  );
}
