// frontend/src/pages/Dashboard.jsx
import axios from "axios";
import { useEffect, useState, useCallback, useContext } from "react";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import StatsCard from "../components/StatsCard";
import CreatePostModal from "../components/CreatePostModal";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  // -------------------------------
  // LOAD FEED + FORMAT DATA
  // -------------------------------
  const loadFeed = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/posts/feed");

      // Normalize post data for PostCard
      const formatted = res.data.map((p) => ({
        id: p.id,
        content: p.content,
        user: p.user || p.username || "Anonymous",
        user_id: p.user_id,
        created_at: p.created_at,
        likes_count: p.likes || p.likes_count || 0,
        image_url: p.image_url || null,
      }));

      setPosts(formatted);
    } catch (err) {
      console.log("Feed load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load feed when dashboard loads
  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ------------------------------
               LEFT: FEED SECTION
          ------------------------------ */}
          <div className="lg:col-span-2">

            {/* Create Post Input Card */}
            <div
              onClick={() => setOpenModal(true)}
              className="bg-gray-800 rounded-3xl p-4 mb-8 border border-gray-700 shadow-lg flex gap-4 items-center cursor-pointer"
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                {user?.username ? user.username[0].toUpperCase() : "U"}
              </div>

              <input
                type="text"
                placeholder="What's your workout today?"
                readOnly
                className="w-full bg-gray-900/10 text-white placeholder-gray-500 rounded-xl px-4 py-3"
              />

              <button
                onClick={() => setOpenModal(true)}
                className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl shadow"
              >
                Post
              </button>
            </div>

            {/* FEED LIST */}
            <h3 className="text-xl font-bold text-white mb-4 px-2 flex items-center gap-2">
              <span className="w-2 h-8 bg-teal-500 rounded-full inline-block"></span>
              Latest Activity
            </h3>

            {loading ? (
              <p className="text-gray-400 text-center py-10">Loading your feed...</p>
            ) : (
              <div className="flex flex-col gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* ------------------------------
               RIGHT SIDEBAR: STATS
          ------------------------------ */}
          <div className="hidden lg:block">
            <StatsCard />
          </div>
        </div>
      </main>

      {/* Floating + Button */}
      <button
        onClick={() => setOpenModal(true)}
        className="fixed bottom-10 right-10 bg-teal-600 hover:bg-teal-700 text-white w-16 h-16 rounded-full shadow-xl text-4xl flex items-center justify-center z-50"
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
