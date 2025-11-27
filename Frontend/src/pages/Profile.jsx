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

  useEffect(() => {
    const loadInfo = async () => {
      try {
        const resUser = await axios.get(
          `http://localhost:8000/users/${user.email}`
        );
        setUserInfo(resUser.data);

        const resPosts = await axios.get(
          `http://localhost:8000/posts/user/${resUser.data.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setMyPosts(
          resPosts.data.map((p) => ({
            id: p.id,
            user: p.username,
            user_id: p.user_id,
            content: p.content,
            created_at: p.created_at,
            image_url: p.image_url,
            avatar_url: p.avatar_url,
            likes_count: p.likes_count || 0,
            comments_count: p.comments_count || 0,
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

        {/* HEADER CARD */}
        <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-2xl mb-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-teal-900/60 to-gray-900/60 transition-all group-hover:from-teal-800/60"></div>

          <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 z-10 mt-12">

            {/* AVATAR */}
            {userInfo.avatar_url ? (
              <img
                src={userInfo.avatar_url}
                alt="avatar"
                className="w-32 h-32 rounded-full border-4 border-teal-500 object-cover shadow-xl ring-4 ring-gray-900"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-900 border-4 border-teal-500 flex items-center justify-center text-4xl shadow-xl ring-4 ring-gray-900">
                {userInfo.username[0].toUpperCase()}
              </div>
            )}

            {/* USER INFO */}
            <div className="flex-1 text-center md:text-left mb-2">
              <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-lg">
                {userInfo.username}
              </h1>

              <p className="text-gray-300 mt-3 italic text-lg drop-shadow-md">
                {userInfo.bio ? userInfo.bio : "No bio added yet."}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                 <span className="bg-teal-900/50 text-teal-400 px-3 py-1 rounded-full text-xs font-bold border border-teal-500/30">
                    BMI: {userInfo.bmi}
                 </span>
                 <span className="text-gray-400 text-sm flex items-center">
                    {userInfo.height}cm • {userInfo.weight}kg • {userInfo.age}y
                 </span>
              </div>
            </div>

            {/* EDIT BUTTON */}
            <button
              onClick={() => (window.location.href = "/edit-profile")}
              className="bg-gray-700/80 hover:bg-gray-600 border border-gray-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-all"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* LEFT SIDEBAR */}
          <div className="hidden md:block col-span-1">
            <div className="bg-gray-800/50 rounded-3xl p-6 border border-gray-700/50 sticky top-24 backdrop-blur-sm">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
                <span>🏆</span> Personal Stats
              </h3>

              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span>Height</span> <span className="text-white font-mono">{userInfo.height} cm</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span>Weight</span> <span className="text-white font-mono">{userInfo.weight} kg</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span>Age</span> <span className="text-white font-mono">{userInfo.age}</span>
                </div>
                <div className="flex justify-between pt-1">
                    <span>BMI</span> <span className="text-teal-400 font-bold font-mono">{userInfo.bmi}</span>
                </div>
              </div>
            </div>
          </div>

          {/* POSTS */}
          <div className="col-span-2 space-y-6">
            {myPosts.length === 0 ? (
              <div className="text-center py-10 text-gray-500 bg-gray-800/30 rounded-3xl border border-gray-800">
                <p>No posts yet.</p>
              </div>
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