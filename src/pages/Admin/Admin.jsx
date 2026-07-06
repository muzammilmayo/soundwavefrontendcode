import {
  Home,
  Users,
  Music,
  Mic2,
  BarChart3,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const users = [
    {
      id: 1,
      name: "Ali",
      role: "Listener",
      status: "Active",
    },
    {
      id: 2,
      name: "Ahmed",
      role: "Artist",
      status: "Active",
    },
    {
      id: 3,
      name: "Sara",
      role: "Listener",
      status: "Blocked",
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

          <div
            onClick={() => navigate("/admin/users")}
            className="flex items-center gap-3 cursor-pointer hover:text-green-500"
          >
            <Users />
            Manage Users
          </div>

          <div
            onClick={() => navigate("/admin/songs")}
            className="flex items-center gap-3 cursor-pointer hover:text-green-500"
          >
            <Music />
            Manage Songs
          </div>

          <div
            onClick={() => navigate("/admin/artists")}
            className="flex items-center gap-3 cursor-pointer hover:text-green-500"
          >
            <Mic2 />
            Manage Artists
          </div>

          <div
            onClick={() => navigate("/admin/reports")}
            className="flex items-center gap-3 cursor-pointer hover:text-green-500"
          >
            <BarChart3 />
            Reports
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

        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold">
              Admin Dashboard 🛡️
            </h1>

            <p className="text-gray-400 mt-2">
              Welcome back, Admin.
            </p>
          </div>
        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <div className="bg-[#1c1c1c] rounded-2xl p-6">
            <h4 className="text-gray-400">Total Users</h4>
            <h2 className="text-4xl font-bold mt-2">1,245</h2>
          </div>

          <div className="bg-[#1c1c1c] rounded-2xl p-6">
            <h4 className="text-gray-400">Artists</h4>
            <h2 className="text-4xl font-bold mt-2">218</h2>
          </div>

          <div className="bg-[#1c1c1c] rounded-2xl p-6">
            <h4 className="text-gray-400">Songs</h4>
            <h2 className="text-4xl font-bold mt-2">5,472</h2>
          </div>

          <div className="bg-[#1c1c1c] rounded-2xl p-6">
            <h4 className="text-gray-400">Reports</h4>
            <h2 className="text-4xl font-bold mt-2 text-red-500">15</h2>
          </div>

        </div>

        {/* Recent Users */}

        <h2 className="text-2xl font-semibold mb-5">
          Recent Users
        </h2>

        <div className="bg-[#1c1c1c] rounded-2xl overflow-hidden">

          <table className="w-full">

            <thead className="bg-[#282828]">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>

            <tbody>

              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-700 hover:bg-[#2d2d2d]"
                >
                  <td className="p-4">{user.name}</td>

                  <td className="p-4">{user.role}</td>

                  <td
                    className={`p-4 ${
                      user.status === "Active"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {user.status}
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </main>
    </div>
  );
}