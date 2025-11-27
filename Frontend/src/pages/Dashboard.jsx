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

  const loadFeed = useCallback(async () => {
    setLoading(true);

    try {
      const res = await axios.get("http://localhost:8000/posts/feed");

      const formatted = res.data.map((p) => ({
        id: p.id,
        content: p.content,
        user: p.user,
        user_id: p.user_id,
        created_at: p.created_at,
        likes_count: p.likes_count || 0,
        comments_count: p.comments_count || 0,
        image_url: p.image_url || null,
        avatar_url: p.avatar_url || null,
      }));

      setPosts(formatted);
    } catch (err) {
      console.log("Feed error:", err);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Feed */}
          <div className="lg:col-span-2">
            
            {/* Create Post Bar */}
            <div
              onClick={() => setOpenModal(true)}
              className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-4 mb-8 border border-gray-700 hover:border-teal-500/50 transition-all cursor-pointer shadow-lg flex gap-4 items-center group"
            >
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold border border-gray-600 group-hover:border-teal-400 transition-colors">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </div>

              <input
                type="text"
                placeholder="Share your progress..."
                readOnly
                className="w-full bg-gray-900/50 rounded-xl px-5 py-3 text-gray-300 focus:outline-none group-hover:bg-gray-900 transition-colors cursor-pointer"
              />

              <button className="bg-teal-600 group-hover:bg-teal-500 text-white px-6 py-2 rounded-xl font-bold transition-colors">
                Post
              </button>
            </div>

            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-teal-500">●</span> Latest Activity
            </h3>

            {loading ? (
              <p className="text-gray-500 text-center py-10">Loading feed...</p>
            ) : (
              <div className="flex flex-col gap-8">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          <div className="hidden lg:block">
            <StatsCard />
          </div>

        </div>
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setOpenModal(true)}
        className="fixed bottom-10 right-10 bg-gradient-to-r from-teal-500 to-teal-700 text-white w-16 h-16 rounded-full shadow-2xl shadow-teal-900/50 text-4xl flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-teal-400/30"
      >
        +
      </button>
      
      <CreatePostModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        refreshFeed={loadFeed}
      />
    </div>
  );
};

export default Dashboard;