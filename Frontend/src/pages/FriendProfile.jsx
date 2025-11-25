// frontend/src/pages/FriendProfile.jsx
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import { AuthContext } from "../context/AuthContext";

const FriendProfile = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);

  const [friend, setFriend] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const authConfig = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        // 1) User info
        const userRes = await axios.get(
          `http://localhost:8000/users/id/${id}`,
          authConfig
        );
        setFriend(userRes.data);

        // 2) Their posts
        const postsRes = await axios.get(
          `http://localhost:8000/posts/user/${id}`,
          authConfig
        );
        setPosts(postsRes.data);
      } catch (err) {
        console.log("Friend profile load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, token]);

  if (loading || !friend) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER CARD */}
        <div className="bg-gray-800 rounded-3xl p-8 mb-10 border border-gray-700 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-teal-800/40 to-gray-900/40" />

          <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 z-10 mt-12">
            {/* Avatar */}
            {friend.avatar_url ? (
              <img
                src={friend.avatar_url}
                alt={friend.username}
                className="w-32 h-32 rounded-full border-4 border-teal-500 object-cover shadow-xl"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-900 border-4 border-teal-500 flex items-center justify-center text-4xl shadow-xl">
                {friend.username ? friend.username[0].toUpperCase() : "U"}
              </div>
            )}

            {/* Info */}
            <div className="flex-1 text-center md:text-left mb-2">
              <h1 className="text-3xl font-black text-white tracking-tight">
                {friend.username}
              </h1>
              <p className="text-teal-400 font-bold uppercase text-xs mt-1">
                BMI:{" "}
                {friend.bmi && friend.bmi.toFixed
                  ? friend.bmi.toFixed(1)
                  : friend.bmi}
              </p>

              <p className="text-gray-400 mt-3">
                Height: {friend.height} cm • Weight: {friend.weight} kg • Age:{" "}
                {friend.age}
              </p>

              {friend.bio && (
                <p className="text-gray-300 mt-3 italic">
                  “{friend.bio}”
                </p>
              )}
            </div>

            {/* Friend button placeholder (future: add/remove friend) */}
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold border border-gray-600">
              Friend
            </button>
          </div>

          {/* Stats Row */}
          <div className="flex justify-center md:justify-start gap-8 mt-8 pt-6 border-t border-gray-700/60">
            <div className="text-center">
              <p className="text-2xl font-black text-white">
                {posts.length}
              </p>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                Posts
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-white">—</p>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                Followers
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-white">—</p>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                Following
              </p>
            </div>
          </div>
        </div>

        {/* POSTS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Stats */}
          <div className="hidden md:block col-span-1">
            <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 sticky top-24">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <span>🏋️</span> Stats
              </h3>

              <div className="space-y-3 text-sm text-gray-300">
                <p>Height: {friend.height} cm</p>
                <p>Weight: {friend.weight} kg</p>
                <p>Age: {friend.age}</p>
                <p className="text-teal-400 font-bold">
                  BMI: {friend.bmi}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Posts */}
          <div className="col-span-2 space-y-6">
            {posts.length === 0 ? (
              <p className="text-gray-500">No posts yet.</p>
            ) : (
              posts.map((p) => <PostCard key={p.id} post={p} />)
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FriendProfile;
