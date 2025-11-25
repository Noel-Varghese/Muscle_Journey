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
            <div
              onClick={() => setOpenModal(true)}
              className="bg-gray-800 rounded-3xl p-4 mb-8 border border-gray-700 flex gap-4 items-center cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </div>

              <input
                type="text"
                placeholder="Share your progress..."
                readOnly
                className="w-full bg-gray-900/20 rounded-xl px-4 py-3"
              />

              <button className="bg-teal-600 px-4 py-2 rounded-xl">
                Post
              </button>
            </div>

            <h3 className="text-xl font-bold mb-4">Latest Activity</h3>

            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : (
              <div className="flex flex-col gap-6">
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

      <CreatePostModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        refreshFeed={loadFeed}
      />
    </div>
  );
};

export default Dashboard;
