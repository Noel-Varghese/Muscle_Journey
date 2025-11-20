import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import FollowButton from "../components/FollowButton";

const Friends = () => {
  const { user, token } = useContext(AuthContext);
  const [tab, setTab] = useState("friends"); // friends = following, requests not needed for option B
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLists = async () => {
    setLoading(true);
    try {
      const [fRes, foRes, sRes] = await Promise.all([
        axios.get("http://localhost:8000/friends/me/following", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:8000/friends/me/followers", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:8000/friends/me/suggestions", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setFollowing(fRes.data);
      setFollowers(foRes.data);
      setSuggestions(sRes.data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { if (user) loadLists(); }, [user]);

  const renderUserRow = (u, idx, showFollowBtn = true, initialFollowing=false) => (
    <div key={u.id || idx} className="flex items-center justify-between gap-4 p-3 bg-gray-800 rounded">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden border">
          {u.avatar_url ? <img src={u.avatar_url} alt="a" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white">{u.username[0]}</div>}
        </div>
        <div>
          <div className="font-bold">{u.username}</div>
        </div>
      </div>

      {showFollowBtn && <FollowButton targetUserId={u.id} initialFollowing={initialFollowing} onChange={() => loadLists()} />}
    </div>
  );

  if (!user) return <div className="min-h-screen flex items-center justify-center">Please login</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Connections</h1>

        <div className="flex gap-3 mb-6">
          <button onClick={() => setTab("friends")} className={`px-3 py-2 rounded ${tab==="friends" ? "bg-teal-600" : "bg-gray-800"}`}>Following</button>
          <button onClick={() => setTab("followers")} className={`px-3 py-2 rounded ${tab==="followers" ? "bg-teal-600" : "bg-gray-800"}`}>Followers</button>
          <button onClick={() => setTab("suggestions")} className={`px-3 py-2 rounded ${tab==="suggestions" ? "bg-teal-600" : "bg-gray-800"}`}>Suggestions</button>
        </div>

        {loading ? <div>Loading...</div> : (
          <>
            {tab === "friends" && (
              <div className="space-y-3">
                {following.length === 0 ? <div className="text-gray-400">You are not following anyone yet.</div> : following.map((u, i) => renderUserRow(u, i, true, true))}
              </div>
            )}

            {tab === "followers" && (
              <div className="space-y-3">
                {followers.length === 0 ? <div className="text-gray-400">No followers yet.</div> : followers.map((u, i) => renderUserRow(u, i, true, false))}
              </div>
            )}

            {tab === "suggestions" && (
              <div className="space-y-3">
                {suggestions.length === 0 ? <div className="text-gray-400">No suggestions right now.</div> : suggestions.map((u, i) => renderUserRow(u, i, true, false))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Friends;
