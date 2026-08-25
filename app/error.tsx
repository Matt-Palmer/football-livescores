"use client";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ reset }: ErrorProps) {
  return (
    <main className="flex flex-col w-full items-center px-4 mx-auto mb-16">
      <div className="text-center py-12">
        <p className="mb-2">Something went wrong.</p>
        <p className="text-sm text-[rgba(255,255,255,0.6)] mb-6">
          An unexpected error occurred while rendering this page.
        </p>
        <button
          onClick={reset}
          className="bg-[#EFEF3E] text-black px-6 py-2 rounded-full"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
