// app/page.tsx
import SurfSpotCard from '@/components/SurfSpotCard'
import { surfSpots } from '@/lib/surfSpots'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-5">
          <h1 className="text-center text-2xl font-semibold">Sydney Surf Spots</h1>
        </div>
      </header>

      <div className="container max-w-2xl mx-auto px-4 py-4">
        {surfSpots.map((spot) => (
          <SurfSpotCard key={spot.name} spot={spot} />
        ))}
      </div>
    </main>
  );
}