import Image from "next/image";
import { Appbar } from "./components/Appbar";
console.log(process.env.GOOGLE_CLIENT_ID)
console.log(process.env.GOOGLE_CLIENT_SECRET)
export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 text-white flex flex-col">
     <Appbar/>
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between flex-1 px-10 md:px-20 py-20">
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Empowering <span className="text-blue-300">Creators</span> &  
            <br />Engaging <span className="text-blue-300">Listeners</span>
          </h2>
          <p className="text-lg text-blue-200">
            TuneLink lets your audience join the vibe — users can suggest and queue songs that play during your live stream.  
            Real interaction. Real music. Real-time.
          </p>

          <div className="flex justify-center md:justify-start gap-4 pt-4">
            <a
              href="/add-creator-Id"
              className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Explore Streams
            </a>
            <a
              href="/creator"
              className="border border-blue-300 text-blue-300 px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              Join as Creator
            </a>
          </div>
        </div>

        <div className="mt-12 md:mt-0 md:w-1/2 flex justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/889/889221.png"
            alt="Streaming Music Illustration"
            className="w-80 drop-shadow-2xl"
          />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-blue-800 py-16 text-center px-8">
        <h3 className="text-3xl font-bold mb-4 text-blue-100">What is TuneLink?</h3>
        <p className="text-blue-200 max-w-3xl mx-auto text-lg">
          TuneLink bridges the gap between <span className="font-semibold text-blue-300">content creators</span> and 
          <span className="font-semibold text-blue-300"> their audiences</span>.  
          Listeners can add songs to the creator’s stream playlist, vote on tracks, and help shape the sound of every live session.
        </p>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-blue-900 py-20 text-center px-8">
        <h3 className="text-3xl font-bold mb-10">Features</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-blue-800 p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h4 className="font-semibold text-xl mb-3 text-blue-200">🎧 Audience Song Requests</h4>
            <p className="text-blue-300">Listeners can queue their favorite tracks for live playback during the stream.</p>
          </div>

          <div className="bg-blue-800 p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h4 className="font-semibold text-xl mb-3 text-blue-200">🔗 Multi-Platform Support</h4>
            <p className="text-blue-300">Add tracks from YouTube or Spotify seamlessly with just a song URL.</p>
          </div>

          <div className="bg-blue-800 p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h4 className="font-semibold text-xl mb-3 text-blue-200">🔥 Community Vibes</h4>
            <p className="text-blue-300">Let your fans interact, upvote songs, and keep the energy alive throughout your stream.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 py-6 text-center text-blue-300 text-sm border-t border-blue-800">
        © {new Date().getFullYear()} TuneLink · Built for creators and fans who love music.
      </footer>
    </main>
  );
}

