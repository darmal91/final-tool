import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="max-w-lg w-full text-center space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Final Tool</h1>
        <p className="text-lg text-gray-500">
          Modular website builder for local businesses.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <Link
            href="/editor"
            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Open Editor
          </Link>
          <Link
            href="/preview"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Preview Site
          </Link>
        </div>
      </div>
    </main>
  );
}
