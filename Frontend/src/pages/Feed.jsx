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
      <div className="max-w-7xl mx-auto p-4 columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {posts.map((post) => (
          <PostCardPinterest
            key={post.id}
            post={post}
            onOpen={() => setActivePost(post)}
          />
        ))}
      </div>

      {/* MODAL */}
      {activePost && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl max-w-3xl w-full mx-4 overflow-hidden">
            <img
              src={activePost.image_url}
              className="w-full max-h-[70vh] object-cover"
            />

            <div className="p-4">
              <p className="text-gray-300 mb-2">{activePost.content}</p>

              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span>❤️ {activePost.likes_count}</span>
                <span>💬 {activePost.comments_count}</span>
                <span>👤 {activePost.username}</span>
              </div>

              <button
                onClick={() => setActivePost(null)}
                className="mt-4 bg-teal-600 px-6 py-2 rounded-lg"
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
