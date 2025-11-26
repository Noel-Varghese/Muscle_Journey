import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ------------------------------------
  // LOAD USER INFO + USER POSTS ✅ FIXED
  // ------------------------------------
  useEffect(() => {
    const loadInfo = async () => {
      try {
        // ✅ Get user details
        const resUser = await axios.get(
          `http://localhost:8000/users/${user.email}`
        );
        setUserInfo(resUser.data);

        // ✅ FIX: Get ONLY this user's posts (not full feed)
        const resPosts = await axios.get(
          `http://localhost:8000/posts/user/${resUser.data.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // ✅ FIX: Keep backend field names EXACTLY as-is
        setMyPosts(
          resPosts.data.map((p) => ({
            id: p.id,
            user: p.username,
            user_id: p.user_id,                 // ✅ FIX: needed for PostCard routing
            content: p.content,
            created_at: p.created_at,           // ✅ FIX: PostCard needs this
            image_url: p.image_url,             // ✅ FIX: image support
            avatar_url: p.avatar_url,           // ✅ FIX: avatar support
            likes_count: p.likes_count || 0,    // ✅ FIX: CORRECT FIELD
            comments_count: p.comments_count || 0, // ✅ FIX: CORRECT FIELD
          }))
        );
      } catch (err) {
        console.log("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadInfo();
  }, [user.email]);

  if (loading || !userInfo) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ------------------------- */}
        {/* PROFILE HEADER CARD       */}
        {/* ------------------------- */}
        <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-2xl mb-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-teal-900/40 to-gray-900/40"></div>

          <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 z-10 mt-12">

            {/* AVATAR */}
            {userInfo.avatar_url ? (
              <img
                src={userInfo.avatar_url}
                alt="avatar"
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

              <p className="text-gray-400 mt-3 italic">
                {userInfo.bio ? userInfo.bio : "No bio added yet."}
              </p>

              <p className="text-teal-400 font-bold uppercase text-sm mt-2">
                BMI: {userInfo.bmi}
              </p>

              <p className="text-gray-400 mt-3">
                Height: {userInfo.height} cm • Weight: {userInfo.weight} kg • Age:{" "}
                {userInfo.age}
              </p>
            </div>

            {/* EDIT BUTTON */}
            <button
              onClick={() => (window.location.href = "/edit-profile")}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* ------------------------- */}
        {/* POSTS FEED + SIDEBAR      */}
        {/* ------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* LEFT SIDEBAR */}
          <div className="hidden md:block col-span-1">
            <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 sticky top-24">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <span>🏆</span> Personal Stats
              </h3>

              <div className="space-y-3 text-sm text-gray-300">
                <p>Height: {userInfo.height} cm</p>
                <p>Weight: {userInfo.weight} kg</p>
                <p>Age: {userInfo.age}</p>
                <p className="text-teal-400 font-bold">BMI: {userInfo.bmi}</p>
              </div>
            </div>
          </div>

          {/* POSTS */}
          <div className="col-span-2 space-y-6">
            {myPosts.length === 0 ? (
              <p className="text-gray-500">No posts yet.</p>
            ) : (
              myPosts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Profile;
