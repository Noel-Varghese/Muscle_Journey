// frontend/src/pages/Dashboard.jsx
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import StatsCard from "../components/StatsCard";
import CreatePostModal from "../components/CreatePostModal";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/posts/feed");
      // backend returns array of Post objects with image_url field
      const formattedData = res.data.map((post) => ({
        id: post.id,
        content: post.content,
        user: post.user || post.username || "Gym User",
        user_id: post.user_id,
        created_at: post.created_at,
        likes: post.likes || 0,
        image_url: post.image_url || null,
        tag: post.tag || "Workout",
      }));
      setPosts(formattedData);
    } catch (err) {
      console.log("Error loading feed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: FEED */}
          <div className="lg:col-span-2">
            {/* Create Post Input (click to open modal) */}
            <div
              onClick={() => setOpenModal(true)}
              className="bg-gray-800 rounded-3xl p-4 mb-8 border border-gray-700 shadow-lg flex gap-4 items-center cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-teal-900/50 border border-teal-500/30 flex-shrink-0 flex items-center justify-center text-teal-400 font-bold">
                ME
              </div>
              <input
                type="text"
                placeholder="What's your workout today?"
                className="w-full bg-gray-900/20 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none"
                readOnly
              />
              <button
                onClick={() => setOpenModal(true)}
                className="bg-teal-600 hover:bg-teal-500 text-white p-3 rounded-xl transition shadow-lg"
              >
                Post
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

      {/* Floating + Button */}
      <button
        onClick={() => setOpenModal(true)}
        className="fixed bottom-10 right-10 bg-teal-600 hover:bg-teal-700 text-white w-16 h-16 rounded-full shadow-2xl text-4xl flex items-center justify-center z-50"
        aria-label="Create post"
      >
        +
      </button>

      {/* Create Post Modal */}
      <CreatePostModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        refreshFeed={loadFeed}
      />
    </div>
  );
};

export default Dashboard;
