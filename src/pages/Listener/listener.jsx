import {
  Home,
  Search,
  Heart,
  ListMusic,
  User,
  Music,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ListenerDashboard() {
  const navigate = useNavigate();

  const songs = [
    {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
    },
    {
      id: 2,
      title: "Perfect",
      artist: "Ed Sheeran",
    },
    {
      id: 3,
      title: "Levitating",
      artist: "Dua Lipa",
    },
    {
      id: 4,
      title: "Stay",
      artist: "Justin Bieber",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">

      {/* Sidebar */}
      <aside className="w-64 bg-black p-6 hidden md:block">
        <h1 className="text-3xl font-bold text-green-500 mb-10">
          SoundWave
        </h1>

        <nav className="space-y-6">

          {/* Home */}
          <div
            onClick={() => navigate("/home")}
            className="flex items-center gap-3 cursor-pointer hover:text-green-500"
          >
            <Home />
            <span>Home</span>
          </div>

          {/* Search */}
          <div
            onClick={() => navigate("/listener/search")}
            className="flex items-center gap-3 cursor-pointer hover:text-green-500"
          >
            <Search />
            <span>Search</span>
          </div>

          {/* Favorites */}
          <div
            onClick={() => navigate("/listener/favorites")}
            className="flex items-center gap-3 cursor-pointer hover:text-green-500"
          >
            <Heart />
            <span>Favorites</span>
          </div>

          {/* Playlists */}
          <div
            onClick={() => navigate("/listener/playlists")}
            className="flex items-center gap-3 cursor-pointer hover:text-green-500"
          >
            <ListMusic />
            <span>Playlists</span>
          </div>

          {/* Profile */}
          <div
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 cursor-pointer hover:text-green-500"
          >
            <User />
            <span>Profile</span>
          </div>

        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <div>
            <h2 className="text-4xl font-bold">
              Welcome 👋
            </h2>

            <p className="text-gray-400">
              Enjoy your favourite music.
            </p>
          </div>

          <input
            type="text"
            placeholder="Search songs..."
            className="bg-[#222] rounded-full px-5 py-3 w-72 outline-none"
          />

        </div>

        {/* Recently Played */}
        <h3 className="text-2xl font-semibold mb-5">
          Recently Played
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {songs.map((song) => (
            <div
              key={song.id}
              className="bg-[#1c1c1c] rounded-2xl p-5 hover:bg-[#282828] duration-300 cursor-pointer"
            >
              <div className="bg-green-500 w-full h-40 rounded-xl flex items-center justify-center mb-4">
                <Music size={55} />
              </div>

              <h4 className="font-semibold">{song.title}</h4>

              <p className="text-gray-400">{song.artist}</p>
            </div>
          ))}
        </div>

        {/* Favorites */}
        <h3 className="text-2xl font-semibold mt-12 mb-5">
          Favorite Songs
        </h3>

        <div className="bg-[#1c1c1c] rounded-2xl overflow-hidden">
          {songs.map((song) => (
            <div
              key={song.id}
              className="flex justify-between items-center px-6 py-4 border-b border-gray-700 hover:bg-[#282828]"
            >
              <div>
                <h4>{song.title}</h4>

                <p className="text-gray-400 text-sm">
                  {song.artist}
                </p>
              </div>

              <Heart className="text-red-500 fill-red-500" />
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}