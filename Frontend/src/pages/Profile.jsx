import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";

const Profile = () => {
  const { user, token } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // -------------------------------
  // LOAD PROFILE + POSTS
  // -------------------------------
  useEffect(() => {
    const loadInfo = async () => {
      try {
        // ✅ Get full user data
        const resUser = await axios.get(
          `http://localhost:8000/users/${user.email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserInfo(resUser.data);

        // ✅ Get ONLY this user's posts (not whole feed)
        const resPosts = await axios.get(
          `http://localhost:8000/posts/user/${resUser.data.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // ✅ IMPORTANT: keep likes_count & comments_count
        const formatted = resPosts.data.map((p) => ({
          id: p.id,
          content: p.content,
          user: p.user || p.username || resUser.data.username,
          user_id: p.user_id,
          created_at: p.created_at,
          likes_count: p.likes_count || 0,
          comments_count: p.comments_count || 0,
          image_url: p.image_url || null,
        }));

        setMyPosts(formatted);
      } catch (err) {
        console.log("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadInfo();
  }, [user.email, token]);

  if (loading || !userInfo)
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* =====================
            PROFILE HEADER
        ===================== */}
        <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-2xl mb-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-teal-900/40 to-gray-900/40"></div>

          <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 z-10 mt-12">

            {/* AVATAR */}
            {userInfo.avatar_url ? (
              <img
                src={userInfo.avatar_url}
                className="w-32 h-32 rounded-full border-4 border-teal-500 object-cover shadow-xl"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-900 border-4 border-teal-500 flex items-center justify-center text-4xl shadow-xl">
                {userInfo.username[0].toUpperCase()}
              </div>
            )}

            {/* USER INFO */}
            <div className="flex-1 text-center md:text-left mb-2">
              <h1 className="text-3xl font-black text-white tracking-tight">
                {userInfo.username}
              </h1>

              <p className="text-teal-400 font-bold uppercase text-sm mt-1">
                BMI: {userInfo.bmi}
              </p>

              <p className="text-gray-400 mt-3">
                Height: {userInfo.height} cm • Weight: {userInfo.weight} kg • Age:{" "}
                {userInfo.age}
              </p>

              {userInfo.bio && (
                <p className="text-gray-300 mt-3 italic">
                  “{userInfo.bio}”
                </p>
              )}
            </div>

            <button
              onClick={() => (window.location.href = "/edit-profile")}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* =====================
            POSTS SECTION
        ===================== */}
        <div className="space-y-6">
          {myPosts.length === 0 ? (
            <p className="text-gray-500">No posts yet.</p>
          ) : (
            myPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>

      </main>
    </div>
  );
};

export default Profile;
