import {
  LayoutDashboard,
  Upload,
  Music,
  Album,
  BarChart3,
  User,
  PlayCircle,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function ArtistDashboard() {
    const navigate = useNavigate();
  const songs = [
    {
      id: 1,
      title: "Dreams",
      album: "Night Vibes",
      plays: "120K",
    },
    {
      id: 2,
      title: "Sunset",
      album: "Golden Hour",
      plays: "95K",
    },
    {
      id: 3,
      title: "Lost",
      album: "Echoes",
      plays: "210K",
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
<div 
onClick={() => navigate("/home")}
           className="flex items-center gap-3 hover:text-green-500 cursor-pointer">
            <LayoutDashboard />
            home
          </div>
          <div 
           className="flex items-center gap-3 hover:text-green-500 cursor-pointer">
            <LayoutDashboard />
            Dashboard
          </div>

          <div className="flex items-center gap-3 hover:text-green-500 cursor-pointer">
            <Upload />
            Upload Song
          </div>

          <div className="flex items-center gap-3 hover:text-green-500 cursor-pointer">
            <Music />
            My Songs
          </div>

          <div className="flex items-center gap-3 hover:text-green-500 cursor-pointer">
            <Album />
            Albums
          </div>

          <div className="flex items-center gap-3 hover:text-green-500 cursor-pointer">
            <BarChart3 />
            Analytics
          </div>

          <div
          onClick={() => navigate("/profile")}
           className="flex items-center gap-3 hover:text-green-500 cursor-pointer">
            <User />
            Profile
          </div>

        </nav>

      </aside>

      {/* Main */}
      <main className="flex-1 p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">

          <div>
            <h2 className="text-4xl font-bold">
              Artist Dashboard 🎤
            </h2>

            <p className="text-gray-400 mt-2">
              Manage your music and monitor your audience.
            </p>
          </div>

          <button className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-full font-semibold">
            + Upload Song
          </button>

        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <div className="bg-[#1c1c1c] rounded-2xl p-6">
            <h4 className="text-gray-400">Total Songs</h4>
            <h2 className="text-4xl font-bold mt-2">12</h2>
          </div>

          <div className="bg-[#1c1c1c] rounded-2xl p-6">
            <h4 className="text-gray-400">Albums</h4>
            <h2 className="text-4xl font-bold mt-2">3</h2>
          </div>

          <div className="bg-[#1c1c1c] rounded-2xl p-6">
            <h4 className="text-gray-400">Followers</h4>
            <h2 className="text-4xl font-bold mt-2">24K</h2>
          </div>

          <div className="bg-[#1c1c1c] rounded-2xl p-6">
            <h4 className="text-gray-400">Total Plays</h4>
            <h2 className="text-4xl font-bold mt-2">1.5M</h2>
          </div>

        </div>

        {/* My Songs */}

        <h3 className="text-2xl font-semibold mb-5">
          My Songs
        </h3>

        <div className="bg-[#1c1c1c] rounded-2xl overflow-hidden">

          {songs.map((song) => (
            <div
              key={song.id}
              className="flex justify-between items-center px-6 py-5 border-b border-gray-700 hover:bg-[#292929]"
            >
              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-xl bg-green-500 flex items-center justify-center">
                  <PlayCircle size={28} />
                </div>

                <div>
                  <h4 className="font-semibold">{song.title}</h4>
                  <p className="text-gray-400 text-sm">
                    {song.album}
                  </p>
                </div>

              </div>

              <div className="text-right">
                <p className="font-semibold">{song.plays}</p>
                <p className="text-gray-400 text-sm">
                  Plays
                </p>
              </div>

            </div>
          ))}

        </div>

      </main>

    </div>
  );
}