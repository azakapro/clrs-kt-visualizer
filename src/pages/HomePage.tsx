import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">
        CLRS × K&amp;T Visualizer
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Interactive algorithm visualizations for{" "}
        <strong>CS610 — Algorithm Design Techniques</strong> at New Uzbekistan
        University.
      </p>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Modules</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          <Link 
            to="/ch01"
            className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
          >
            <h3 className="text-lg font-bold text-gray-900">Chapter 1: Stable Matching</h3>
            <p className="text-gray-500 text-sm mt-2">K&T §1.1 / CLRS §1.2</p>
          </Link>
        </ul>
      </section>
    </main>
  );
}
