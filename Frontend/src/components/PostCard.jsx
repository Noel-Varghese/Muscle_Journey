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

  const username = post.user || post.username || "User";

  const isVideo =
    post.image_url &&
    [".mp4", ".webm", ".ogg"].some((ext) =>
      post.image_url.toLowerCase().includes(ext)
    );

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

  const submitComment = async () => {
    if (!commentInput.trim()) return;

    try {
      await axios.post(
        `http://localhost:8000/posts/${post.id}/comment`,
        { content: commentInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentInput("");
      await loadComments();
    } catch (err) {
      console.log(err);
    }
  };

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
    <div className="bg-gray-800 border border-gray-700 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* HEADER */}
      <div
        className="flex items-center gap-3 mb-5 cursor-pointer group"
        onClick={() => nav(`/friend/${post.user_id}`)}
      >
        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold border border-gray-600 group-hover:border-teal-500 transition-colors">
          {username[0].toUpperCase()}
        </div>

        <div>
          <h4 className="font-bold text-white group-hover:text-teal-400 transition-colors">{username}</h4>
          <p className="text-xs text-gray-400">
            {new Date(post.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      {/* MEDIA */}
      {post.image_url && (
        <div className="w-full rounded-2xl mb-5 overflow-hidden shadow-md bg-black border border-gray-700/50">
          {isVideo ? (
            <video
              src={post.image_url}
              controls
              className="w-full max-h-[500px] object-contain"
            />
          ) : (
            <img
              src={post.image_url}
              className="w-full max-h-[500px] object-cover"
              alt="post media"
            />
          )}
        </div>
      )}

      {/* CONTENT */}
      <p className="text-gray-200 mb-5 leading-relaxed">{post.content}</p>

      {/* ACTION BAR */}
      <div className="flex items-center gap-6 border-t border-gray-700/50 pt-4">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-2 text-sm font-medium transition-all active:scale-95 px-2 py-1 rounded-lg ${
            likedPost ? "text-pink-500 bg-pink-500/10" : "text-gray-400 hover:text-white hover:bg-gray-700"
          }`}
        >
          {likedPost ? "❤️" : "🤍"} {likesCount}
        </button>

        <button
          onClick={() => {
            setShowComments((v) => !v);
            if (!showComments) loadComments();
          }}
          className="text-sm text-gray-400 hover:text-teal-400 transition-colors flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-700"
        >
          💬 Comments ({comments.length || post.comments_count})
        </button>
      </div>

      {/* COMMENTS */}
      {showComments && (
        <div className="mt-5 bg-gray-900/50 border border-gray-700/50 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-64 overflow-y-auto space-y-3 mb-4 pr-2">
            {comments.map((c) => (
              <div
                key={c.id}
                className="bg-gray-800/80 border border-gray-700 p-3 rounded-xl flex justify-between"
              >
                <div>
                  <p className="text-xs text-teal-400 font-bold mb-1">
                    {c.user_id === user.id ? "You" : "User"}
                  </p>
                  <p className="text-gray-300 text-sm">{c.content}</p>

                  <button
                    onClick={() => toggleCommentLike(c)}
                    className={`text-xs mt-2 flex items-center gap-1 ${
                      c.liked_by_me ? "text-pink-400" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {c.liked_by_me ? "❤️" : "🤍"} {c.likes_count}
                  </button>
                </div>

                {c.user_id === user.id && (
                  <button
                    onClick={() => deleteComment(c.id)}
                    className="text-red-500 text-xs hover:text-red-400 font-medium h-fit"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              className="flex-1 bg-gray-800 border border-gray-600 text-white p-2.5 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder-gray-500"
              placeholder="Write a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <button
              onClick={submitComment}
              className="bg-teal-600 hover:bg-teal-500 text-white px-5 rounded-xl text-sm font-bold shadow-lg active:scale-95 transition-all"
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