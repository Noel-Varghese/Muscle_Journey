import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";

const Profile = () => {
  const { user } = useContext(AuthContext);

  // Mock data for the user's specific posts
  const [myPosts] = useState([
    {
      id: 1,
      user: user?.username || "Me",
      tag: "Progress",
      time: "2 days ago",
      content: "Finally hit my goal weight! tough journey but worth every drop of sweat. #Gains",
      likes: 45,
    },
    {
      id: 2,
      user: user?.username || "Me",
      tag: "Meal Prep",
      time: "5 days ago",
      content: "Chicken, rice, and broccoli for the next 4 days. Discipline is key. 🥦🍗",
      likes: 20,
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* PROFILE HEADER CARD */}
        <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-2xl mb-10 relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-teal-900/40 to-gray-900/40"></div>

          <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 z-10 mt-12">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-gray-900 border-4 border-teal-500 flex items-center justify-center text-4xl shadow-xl">
              <span className="text-white font-bold">
                {user?.username ? user.username[0].toUpperCase() : "U"}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left mb-2">
              <h1 className="text-3xl font-black text-white tracking-tight">
                {user?.username || "Gym Warrior"}
              </h1>
              <p className="text-teal-400 font-bold uppercase tracking-widest text-sm mt-1">
                Level 5 Athlete
              </p>
              <p className="text-gray-400 mt-3 max-w-md mx-auto md:mx-0">
                "Consistency is key. Grinding every day to be better than yesterday."
              </p>
            </div>

            {/* Edit Button */}
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold transition border border-gray-600">
              Edit Profile
            </button>
          </div>

          {/* Stats Row */}
          <div className="flex justify-center md:justify-start gap-8 mt-8 pt-8 border-t border-gray-700/50">
            <div className="text-center">
              <p className="text-2xl font-black text-white">24</p>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Workouts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-white">108</p>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-white">45</p>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Following</p>
            </div>
          </div>
        </div>

        {/* CONTENT TABS (Visual Only) */}
        <div className="flex gap-6 border-b border-gray-800 mb-8">
          <button className="pb-4 text-teal-400 border-b-2 border-teal-400 font-bold uppercase text-sm tracking-wider">
            My Posts
          </button>
          <button className="pb-4 text-gray-500 hover:text-gray-300 font-bold uppercase text-sm tracking-wider transition">
            Progress Pics
          </button>
          <button className="pb-4 text-gray-500 hover:text-gray-300 font-bold uppercase text-sm tracking-wider transition">
            PRs
          </button>
        </div>

        {/* POSTS FEED */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Col: Personal Bests Widget */}
          <div className="hidden md:block col-span-1">
            <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 sticky top-24">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <span>🏆</span> Personal Bests
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Bench Press</span>
                  <span className="text-white font-bold">100kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Deadlift</span>
                  <span className="text-white font-bold">140kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">5k Run</span>
                  <span className="text-white font-bold">24:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: User's Posts */}
          <div className="col-span-2 space-y-6">
            {myPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Profile;