import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import { AuthContext } from "../context/AuthContext";

const FriendProfile = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  // Load user info
  const loadUser = async () => {
    const res = await axios.get(`http://localhost:8000/users/id/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProfile(res.data);
  };

  // Load posts
  const loadPosts = async () => {
    const res = await axios.get(`http://localhost:8000/posts/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPosts(res.data);
  };

  // Check follow status
  const loadFollowStatus = async () => {
    const res = await axios.get(`http://localhost:8000/friends/check/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setIsFollowing(res.data.following);
  };

  const toggleFollow = async () => {
    if (!isFollowing) {
      await axios.post(
        `http://localhost:8000/friends/add/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      await axios.delete(
        `http://localhost:8000/friends/remove/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
    loadFollowStatus();
  };

  useEffect(() => {
    loadUser();
    loadPosts();
    loadFollowStatus();
  }, [id]);

  if (!profile)
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* PROFILE HEADER */}
        <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 mb-10">
          <div className="flex items-center gap-6">

            {/* AVATAR */}
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-3xl font-bold">
              {profile.username[0].toUpperCase()}
            </div>

            {/* INFO */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{profile.username}</h1>
              <p className="text-gray-400 mt-2">{profile.bio || "No bio yet."}</p>
            </div>

            {/* FOLLOW BUTTON */}
            <button
              onClick={toggleFollow}
              className={`px-5 py-2 rounded-xl font-bold transition ${
                isFollowing
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-teal-500 hover:bg-teal-600"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        </div>

        {/* THEIR POSTS */}
        <h2 className="text-xl font-bold mb-4">Posts</h2>

        <div className="space-y-6">
          {posts.length === 0 ? (
            <p className="text-gray-400">No posts yet.</p>
          ) : (
            posts.map((p) => <PostCard key={p.id} post={p} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendProfile;
