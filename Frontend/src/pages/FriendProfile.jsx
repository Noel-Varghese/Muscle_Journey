import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import { AuthContext } from "../context/AuthContext";

const FriendProfile = () => {
  const { id } = useParams();              // friend user_id from URL
  const { token } = useContext(AuthContext);

  const [friend, setFriend] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);

  // ---- load friend basic info ----
  const loadFriend = async () => {
    const res = await axios.get(`http://localhost:8000/users/id/${id}`);
    setFriend(res.data);
  };

  // ---- load that user's posts ----
  const loadPosts = async () => {
    const res = await axios.get(`http://localhost:8000/posts/user/${id}`);
    setPosts(res.data);
  };

  // ✅ CHECK FOLLOW STATUS USING REAL BACKEND DATA
  const loadFollowStatus = async () => {
    if (!token) return;

    const res = await axios.get("http://localhost:8000/friends/list", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const alreadyFriend = res.data.some(
      (f) => f.id === Number(id)
    );

    setIsFollowing(alreadyFriend);
  };

  // ✅ ✅ ✅ FULLY WORKING FOLLOW + UNFOLLOW
  const toggleFollow = async () => {
    if (!token || !friend) return;
    setFollowBusy(true);

    try {
      if (isFollowing) {
        // ✅ REAL UNFOLLOW (BACKEND ALREADY HAS THIS)
        await axios.delete(
          `http://localhost:8000/friends/remove/${friend.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setIsFollowing(false); // ✅ switch button back to FOLLOW
      } else {
        // ✅ REAL FOLLOW
        await axios.post(
          `http://localhost:8000/friends/add/${friend.id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setIsFollowing(true); // ✅ switch button to UNFOLLOW
      }
    } catch (err) {
      console.log("Follow/unfollow error:", err);
    } finally {
      setFollowBusy(false);
    }
  };

  // ---- initial load ----
  useEffect(() => {
    const loadAll = async () => {
      try {
        await Promise.all([
          loadFriend(),
          loadPosts(),
          loadFollowStatus()
        ]);
      } catch (err) {
        console.log("Friend profile load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
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
                {friend.bmi?.toFixed ? friend.bmi.toFixed(1) : friend.bmi}
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

            {/* Follow / Unfollow button */}
            <div className="mt-4 md:mt-0">
              <button
                onClick={toggleFollow}
                disabled={followBusy}
                className={`px-8 py-3 rounded-full font-bold shadow-lg transition ${
                  isFollowing
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-teal-500 hover:bg-teal-400 text-white"
                }`}
              >
                {followBusy
                  ? "..."
                  : isFollowing
                  ? "Unfollow"
                  : "Follow"}
              </button>
            </div>
          </div>
        </div>

        {/* POSTS */}
        <section>
          <h2 className="text-xl font-bold mb-4">Posts</h2>
          {posts.length === 0 ? (
            <p className="text-gray-500">No posts yet.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default FriendProfile;
