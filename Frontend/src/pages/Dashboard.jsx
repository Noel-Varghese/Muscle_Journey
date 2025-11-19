import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import StatsCard from "../components/StatsCard";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeed = async () => {
      try {
        const res = await axios.get("http://localhost:8000/posts/feed");
        // We map your API data to the format our UI expects
        // If your backend doesn't send 'user' or 'likes' yet, we add defaults
        const formattedData = res.data.map((post) => ({
          ...post,
          user: post.user || "Gym User", // Default name if missing
          likes: post.likes || 0,        // Default likes if missing
          tag: post.tag || "Workout",    // Default tag
        }));
        setPosts(formattedData);
      } catch (err) {
        console.log("Error loading feed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: FEED */}
          <div className="lg:col-span-2">
            {/* Create Post Input */}
            <div className="bg-gray-800 rounded-3xl p-4 mb-8 border border-gray-700 shadow-lg flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-teal-900/50 border border-teal-500/30 flex-shrink-0 flex items-center justify-center text-teal-400 font-bold">
                ME
              </div>
              <input
                type="text"
                placeholder="What's your workout today?"
                className="w-full bg-gray-900/50 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition border border-transparent focus:border-teal-500/30"
              />
              <button className="bg-teal-600 hover:bg-teal-500 text-white p-3 rounded-xl transition shadow-lg shadow-teal-900/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>

            {/* Feed List */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xl font-bold text-white mb-2 px-2 flex items-center gap-2">
                <span className="w-2 h-8 bg-teal-500 rounded-full inline-block"></span>
                Latest Activity
              </h3>
              
              {loading ? (
                <p className="text-gray-500 text-center py-10">Loading your gains...</p>
              ) : (
                posts.map((post) => <PostCard key={post.id} post={post} />)
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: STATS (Hidden on mobile) */}
          <div className="hidden lg:block">
             <StatsCard />
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;