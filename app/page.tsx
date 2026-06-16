import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-medium tracking-widest mb-4">ONLINESMOKERS</h1>
      <p className="text-gray-400 text-sm mb-12">The ritual. Without the cigarette.</p>
      <Link href="/simulate">
        <button className="border border-white px-8 py-3 text-sm tracking-widest hover:bg-white hover:text-black transition-all duration-300">
          GET STARTED
        </button>
      </Link>
    </main>
  )
}