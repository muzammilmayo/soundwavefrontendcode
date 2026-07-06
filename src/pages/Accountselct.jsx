// import { useNavigate } from "react-router-dom";
// import {
//   Headphones,
//   Mic2,
//   Music2,
//   Shield,
//   Crown,
//   UserCog,
// } from "lucide-react";

// export default function AccountSelector() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-[#121212] to-[#1a1a1a] flex items-center justify-center px-6 py-10">
//       <div className="w-full max-w-7xl">

//         {/* Logo */}
//         <div className="flex justify-center items-center gap-3 mb-6">
//           <Music2 size={42} className="text-green-500" />
//           <h1 className="text-5xl font-extrabold text-white">
//             Sound<span className="text-green-500">Wave</span>
//           </h1>
//         </div>

//         {/* Heading */}
//         <div className="text-center mb-12">
//           <h2 className="text-4xl font-bold text-white">
//             Choose Your Account
//           </h2>

//           <p className="text-gray-400 mt-3 text-lg">
//             Select your role to continue
//           </p>
//         </div>

//         {/* Cards */}
//         <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

//           {/* Listener */}
//           <div
//             onClick={() => navigate("/listener/register")}
//             className="group cursor-pointer bg-white/5 backdrop-blur-lg border border-gray-700 rounded-3xl p-8 hover:border-green-500 hover:-translate-y-2 duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.35)]"
//           >
//             <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Headphones className="text-green-500 w-12 h-12" />
//             </div>

//             <h2 className="text-3xl text-center font-bold text-white">
//               Listener
//             </h2>

//             <p className="text-gray-400 text-center mt-4">
//               Listen to your favourite music and create playlists.
//             </p>

//             <ul className="mt-6 space-y-3 text-gray-300">
//               <li>🎵 Stream Music</li>
//               <li>❤️ Like Songs</li>
//               <li>📂 Create Playlists</li>
//               <li>🎧 High Quality Audio</li>
//             </ul>

//             <button
//               onClick={() => navigate("/listener/register")}
//               className="mt-8 w-full bg-green-500 hover:bg-green-600 py-3 rounded-xl text-white font-semibold"
//             >
//               Continue →
//             </button>
//           </div>

//           {/* Artist */}
//           <div
//             onClick={() => navigate("/artist/register")}
//             className="group cursor-pointer bg-white/5 backdrop-blur-lg border border-gray-700 rounded-3xl p-8 hover:border-purple-500 hover:-translate-y-2 duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.35)]"
//           >
//             <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Mic2 className="text-purple-500 w-12 h-12" />
//             </div>

//             <h2 className="text-3xl text-center font-bold text-white">
//               Artist
//             </h2>

//             <p className="text-gray-400 text-center mt-4">
//               Upload music and manage your albums.
//             </p>

//             <ul className="mt-6 space-y-3 text-gray-300">
//               <li>🎤 Upload Songs</li>
//               <li>💿 Albums</li>
//               <li>📈 Analytics</li>
//               <li>💰 Grow Audience</li>
//             </ul>

//             <button
//               onClick={() => navigate("/artist/register")}
//               className="mt-8 w-full bg-purple-500 hover:bg-purple-600 py-3 rounded-xl text-white font-semibold"
//             >
//               Continue →
//             </button>
//           </div>

        

//         </div>
//       </div>
//     </div>
//   );
// }