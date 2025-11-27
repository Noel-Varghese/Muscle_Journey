import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const FollowButton = ({ targetUserId, initialFollowing = false, onChange }) => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialFollowing);

  const follow = async () => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:8000/friends/${targetUserId}/follow`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFollowing(true);
      if (onChange) onChange(true);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const unfollow = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8000/friends/${targetUserId}/unfollow`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFollowing(false);
      if (onChange) onChange(false);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const baseClass = "px-6 py-2 rounded-full text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100";

  return isFollowing ? (
    <button 
        onClick={unfollow} 
        disabled={loading} 
        className={`${baseClass} bg-gray-700 hover:bg-gray-600 text-white border border-gray-600`}
    >
      {loading ? "..." : "Unfollow"}
    </button>
  ) : (
    <button 
        onClick={follow} 
        disabled={loading} 
        className={`${baseClass} bg-teal-600 hover:bg-teal-500 text-white shadow-teal-500/20`}
    >
      {loading ? "..." : "Follow"}
    </button>
  );
};

export default FollowButton;