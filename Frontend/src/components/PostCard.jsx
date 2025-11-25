import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
  const nav = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [likedPost, setLikedPost] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  const username = post.user || post.username;

  // ---- CHECK IF I LIKED ----
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/posts/${post.id}/liked-by-me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLikedPost(res.data.liked);
      } catch (err) {
        console.log(err);
      }
    };
    load();
  }, [post.id, token]);

  // ---- LIKE / UNLIKE ----
  const toggleLike = async () => {
    try {
      if (!likedPost) {
        await axios.post(
          `http://localhost:8000/posts/${post.id}/like`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLikedPost(true);
        setLikesCount((n) => n + 1);
      } else {
        await axios.delete(
          `http://localhost:8000/posts/${post.id}/like`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLikedPost(false);
        setLikesCount((n) => n - 1);
      }
    } catch (err) {
      console.log("Post like error:", err);
    }
  };

  // ---- LOAD COMMENTS ----
  const loadComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/posts/${post.id}/comments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ---- ADD COMMENT ----
  const submitComment = async () => {
    if (!commentInput.trim()) return;

    try {
      await axios.post(
        `http://localhost:8000/posts/${post.id}/comment`,
        { content: commentInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentInput("");

      // reload comments
      await loadComments();
    } catch (err) {
      console.log(err);
    }
  };

  // ---- LIKE / UNLIKE COMMENT ----
  const toggleCommentLike = async (c) => {
    try {
      if (!c.liked_by_me) {
        await axios.post(
          `http://localhost:8000/comments/${c.id}/like`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.delete(
          `http://localhost:8000/comments/${c.id}/like`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setComments((prev) =>
        prev.map((x) =>
          x.id === c.id
            ? {
                ...x,
                liked_by_me: !x.liked_by_me,
                likes_count: x.liked_by_me
                  ? x.likes_count - 1
                  : x.likes_count + 1,
              }
            : x
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  // ---- DELETE COMMENT ----
  const deleteComment = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8000/posts/comment/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await loadComments();
    } catch (err) {
      console.log("Delete comment error:", err);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">

      {/* HEADER */}
      <div
        className="flex items-center gap-3 mb-4 cursor-pointer"
        onClick={() => nav(`/friend/${post.user_id}`)}
      >
        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
          {username[0].toUpperCase()}
        </div>

        <div>
          <h4 className="font-bold text-white">{username}</h4>
          <p className="text-xs text-gray-400">
            {new Date(post.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      {/* IMAGE */}
      {post.image_url && (
        <img
          src={post.image_url}
          className="w-full rounded-xl mb-4 shadow-lg"
        />
      )}

      <p className="text-gray-300 mb-4">{post.content}</p>

      {/* ACTION BAR */}
      <div className="flex items-center gap-6 border-t border-gray-700 pt-3">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-2 text-sm ${
            likedPost ? "text-pink-500" : "text-gray-400"
          }`}
        >
          {likedPost ? "❤️" : "🤍"} {likesCount}
        </button>

        {/* ⭐ FIXED COMMENT COUNT ⭐ */}
        <button
          onClick={() => {
            setShowComments((v) => !v);
            if (!showComments) loadComments();
          }}
          className="text-sm text-gray-400"
        >
          💬 Comments ({comments.length || post.comments_count})
        </button>
      </div>

      {/* COMMENTS */}
      {showComments && (
        <div className="mt-4 bg-gray-900 border border-gray-700 p-4 rounded-xl">
          <div className="max-h-64 overflow-y-auto space-y-3">

            {comments.map((c) => (
              <div
                key={c.id}
                className="bg-gray-800 border border-gray-700 p-3 rounded-lg flex justify-between"
              >
                <div>
                  <p className="text-sm text-white font-semibold">
                    {c.user_id === user.id ? "You" : "User"}
                  </p>
                  <p className="text-gray-300">{c.content}</p>

                  <button
                    onClick={() => toggleCommentLike(c)}
                    className={`text-xs mt-1 ${
                      c.liked_by_me ? "text-pink-400" : "text-gray-500"
                    }`}
                  >
                    {c.liked_by_me ? "❤️" : "🤍"} {c.likes_count}
                  </button>
                </div>

                {c.user_id === user.id && (
                  <button
                    onClick={() => deleteComment(c.id)}
                    className="text-red-500 text-xs hover:text-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}

          </div>

          <div className="flex gap-2 mt-3">
            <input
              className="flex-1 bg-gray-800 border border-gray-700 text-white p-2 rounded-lg"
              placeholder="Write a comment…"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <button
              onClick={submitComment}
              className="bg-teal-600 px-4 rounded-lg text-white"
            >
              Post
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default PostCard;
