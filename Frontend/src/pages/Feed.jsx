import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import PostCardPinterest from "../components/PostCardPinterest";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [activePost, setActivePost] = useState(null);

  const loadFeed = async () => {
    try {
      const res = await axios.get("http://localhost:8000/posts/feed");
      setPosts(res.data);
    } catch (err) {
      console.log("Feed load error:", err);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* GRID */}
      <div className="max-w-7xl mx-auto p-4 columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
        {posts.map((post) => (
          <PostCardPinterest
            key={post.id}
            post={post}
            onOpen={() => setActivePost(post)}
          />
        ))}
      </div>

      {/* MODAL with Glassmorphism */}
      {activePost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-3xl w-full mx-4 overflow-hidden shadow-2xl">

            {/* IMAGE OR VIDEO */}
            {activePost?.image_url &&
            [".mp4", ".webm", ".ogg"].some((ext) =>
              activePost.image_url.toLowerCase().includes(ext)
            ) ? (
              <video
                src={activePost.image_url}
                controls
                autoPlay
                className="w-full max-h-[70vh] object-contain bg-black"
              />
            ) : (
              activePost?.image_url && (
                <img
                  src={activePost.image_url}
                  className="w-full max-h-[70vh] object-contain bg-black"
                />
              )
            )}

            <div className="p-6">
              <p className="text-gray-200 text-lg mb-4">{activePost.content}</p>

              <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                <span className="flex items-center gap-1">❤️ {activePost.likes_count}</span>
                <span className="flex items-center gap-1">💬 {activePost.comments_count}</span>
                <span className="text-teal-400 font-semibold">@{activePost.username}</span>
              </div>

              <button
                onClick={() => setActivePost(null)}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-bold transition-all active:scale-95"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;