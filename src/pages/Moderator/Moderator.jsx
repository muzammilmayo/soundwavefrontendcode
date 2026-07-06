import {
  Home,
  ShieldCheck,
  Flag,
  Users,
  Music,
  User,
  Ban,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ModeratorDashboard() {
  const navigate = useNavigate();

  const reports = [
    {
      id: 1,
      type: "Song",
      title: "Fake Love",
      reportedBy: "Ali",
      status: "Pending",
    },
    {
      id: 2,
      type: "User",
      title: "John123",
      reportedBy: "Sara",
      status: "Reviewed",
    },
    {
      id: 3,
      type: "Playlist",
      title: "Spam Playlist",
      reportedBy: "Ahmed",
      status: "Pending",
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
            className="flex items-center gap-3 cursor-pointer hover:text-green-500"
          >
            <Home />
            Home
          </div>

          <div className="flex items-center gap-3 cursor-pointer hover:text-green-500">
            <ShieldCheck />
            Dashboard
          </div>

          <div className="flex items-center gap-3 cursor-pointer hover:text-green-500">
            <Flag />
            Reports
          </div>

          <div className="flex items-center gap-3 cursor-pointer hover:text-green-500">
            <Users />
            Users
          </div>

          <div className="flex items-center gap-3 cursor-pointer hover:text-green-500">
            <Music />
            Songs
          </div>

          <div
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 cursor-pointer hover:text-green-500"
          >
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
              Moderator Dashboard 🛠️
            </h2>

            <p className="text-gray-400 mt-2">
              Review reports and keep the platform safe.
            </p>
          </div>

        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <div className="bg-[#1c1c1c] rounded-2xl p-6">
            <h4 className="text-gray-400">Pending Reports</h4>
            <h2 className="text-4xl font-bold mt-2 text-yellow-400">12</h2>
          </div>

          <div className="bg-[#1c1c1c] rounded-2xl p-6">
            <h4 className="text-gray-400">Resolved</h4>
            <h2 className="text-4xl font-bold mt-2 text-green-500">145</h2>
          </div>

          <div className="bg-[#1c1c1c] rounded-2xl p-6">
            <h4 className="text-gray-400">Blocked Users</h4>
            <h2 className="text-4xl font-bold mt-2 text-red-500">18</h2>
          </div>

          <div className="bg-[#1c1c1c] rounded-2xl p-6">
            <h4 className="text-gray-400">Songs Removed</h4>
            <h2 className="text-4xl font-bold mt-2">37</h2>
          </div>

        </div>

        {/* Reports */}
        <h3 className="text-2xl font-semibold mb-5">
          Recent Reports
        </h3>

        <div className="bg-[#1c1c1c] rounded-2xl overflow-hidden">

          {reports.map((report) => (
            <div
              key={report.id}
              className="flex justify-between items-center px-6 py-5 border-b border-gray-700 hover:bg-[#292929]"
            >
              <div>
                <h4 className="font-semibold">{report.title}</h4>

                <p className="text-gray-400 text-sm">
                  {report.type} • Reported by {report.reportedBy}
                </p>
              </div>

              <div className="flex gap-3">

                <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2">
                  <CheckCircle size={18} />
                  Approve
                </button>

                <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2">
                  <Ban size={18} />
                  Remove
                </button>

              </div>

            </div>
          ))}

        </div>

      </main>

    </div>
  );
}