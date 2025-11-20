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

  return isFollowing ? (
    <button onClick={unfollow} disabled={loading} className="px-3 py-1 bg-red-600 rounded text-white text-sm">
      {loading ? "..." : "Unfollow"}
    </button>
  ) : (
    <button onClick={follow} disabled={loading} className="px-3 py-1 bg-teal-600 rounded text-white text-sm">
      {loading ? "..." : "Follow"}
    </button>
  );
};

export default FollowButton;
