// frontend/src/pages/Friends.jsx
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const Friends = () => {
  const { token } = useContext(AuthContext);
  const nav = useNavigate();

  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------- LOAD DATA ----------
  const loadAll = async () => {
    setLoading(true);
    try {
      const [friendsRes, reqRes, suggRes] = await Promise.all([
        axios.get("http://localhost:8000/friends/list", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8000/friends/requests", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8000/friends/suggestions", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setFriends(friendsRes.data);
      setRequests(reqRes.data);
      setSuggestions(suggRes.data);
    } catch (err) {
      console.log("Friends page load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadAll();
  }, [token]);

  // ---------- ACTIONS ----------
  const sendRequest = async (userId) => {
    try {
      await axios.post(
        `http://localhost:8000/friends/add/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // remove from suggestions & reload requests
      await loadAll();
    } catch (err) {
      console.log("Send request error:", err);
      alert("Error sending request");
    }
  };

  const acceptRequest = async (friendshipId) => {
    try {
      await axios.post(
        `http://localhost:8000/friends/accept/${friendshipId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await loadAll();
    } catch (err) {
      console.log("Accept request error:", err);
      alert("Error accepting request");
    }
  };

  const rejectRequest = async (friendshipId) => {
    try {
      await axios.delete(
        `http://localhost:8000/friends/reject/${friendshipId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await loadAll();
    } catch (err) {
      console.log("Reject request error:", err);
      alert("Error rejecting request");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="max-w-5xl mx-auto p-8 text-center text-gray-400">
          Loading friends...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* FRIENDS LIST */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            Your Friends
          </h2>
          {friends.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No friends yet. Send a request from Suggestions below!
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {friends.map((f) => (
                <div
                  key={f.id}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-teal-500">
                      {f.avatar_url ? (
                        <img
                          src={f.avatar_url}
                          alt={f.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white font-bold text-sm">
                          {f.username[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        {f.username}
                      </p>
                      {f.bmi && (
                        <p className="text-xs text-teal-400">
                          BMI: {f.bmi}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => nav(`/friend/${f.id}`)}
                    className="text-sm bg-teal-600 hover:bg-teal-500 px-3 py-1 rounded-lg text-white"
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* INCOMING REQUESTS */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            Friend Requests
          </h2>
          {requests.length === 0 ? (
            <p className="text-gray-500 text-sm">No pending requests.</p>
          ) : (
            <div className="space-y-3">
              {requests.map((r) => (
                <div
                  key={r.friendship_id}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-600">
                      {r.avatar_url ? (
                        <img
                          src={r.avatar_url}
                          alt={r.from_username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
                          {r.from_username[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-white">
                      <span className="font-semibold">
                        {r.from_username}
                      </span>{" "}
                      sent you a friend request
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => acceptRequest(r.friendship_id)}
                      className="px-3 py-1 rounded-lg text-xs bg-teal-600 hover:bg-teal-500 text-white"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => rejectRequest(r.friendship_id)}
                      className="px-3 py-1 rounded-lg text-xs bg-gray-700 hover:bg-gray-600 text-gray-200"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SUGGESTIONS (KEEPING YOUR FEATURE) */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            Friend Suggestions
          </h2>
          {suggestions.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No suggestions right now. You’re all connected 👀
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-600">
                      {s.avatar_url ? (
                        <img
                          src={s.avatar_url}
                          alt={s.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white font-bold text-sm">
                          {s.username[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        {s.username}
                      </p>
                      {s.bmi && (
                        <p className="text-xs text-teal-400">
                          BMI: {s.bmi}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => sendRequest(s.id)}
                    className="text-sm bg-gray-700 hover:bg-teal-600 px-3 py-1 rounded-lg text-white"
                  >
                    Add Friend
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Friends;
