import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const PostCard = ({ post }) => {
  const { user, token } = useContext(AuthContext);

  const [likedPost, setLikedPost] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  const username = post.user || post.username || "User";

  // ---------------------------
  // LIKE / UNLIKE POST
  // ---------------------------
  const togglePostLike = async () => {
    try {
      if (!likedPost) {
        await axios.post(
          `http://localhost:8000/posts/${post.id}/like`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLikedPost(true);
        setLikesCount((prev) => prev + 1);
      } else {
        await axios.delete(
          `http://localhost:8000/posts/${post.id}/like`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLikedPost(false);
        setLikesCount((prev) => prev - 1);
      }
    } catch (err) {
      console.log("Post like error:", err);
    }
  };

  // ---------------------------
  // LOAD COMMENTS
  // ---------------------------
  const loadComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/posts/${post.id}/comments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(res.data);
    } catch (err) {
      console.log("Load comments error:", err);
    }
  };

  // ---------------------------
  // SUBMIT COMMENT
  // ---------------------------
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
      console.log("Post comment error:", err);
    }
  };

  // ---------------------------
  // DELETE COMMENT
  // ---------------------------
  const deleteComment = async (commentId) => {
    try {
      await axios.delete(
        `http://localhost:8000/posts/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await loadComments();
    } catch (err) {
      console.log("Delete comment error:", err);
    }
  };

  // ---------------------------
  // TOGGLE COMMENT LIKE
  // ---------------------------
  const toggleCommentLike = async (comment) => {
    try {
      if (!comment.liked_by_me) {
        await axios.post(
          `http://localhost:8000/comments/${comment.id}/like`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.delete(
          `http://localhost:8000/comments/${comment.id}/like`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // update in local state
      setComments((prev) =>
        prev.map((c) =>
          c.id === comment.id
            ? {
                ...c,
                liked_by_me: !c.liked_by_me,
                likes_count: c.liked_by_me
                  ? c.likes_count - 1
                  : c.likes_count + 1,
              }
            : c
        )
      );
    } catch (err) {
      console.log("Comment like error:", err);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-md p-5 border border-gray-700">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold text-white">
          {username[0].toUpperCase()}
        </div>

        <div>
          <h4 className="font-bold text-white">{username}</h4>
          <p className="text-xs text-gray-400">
            {new Date(post.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Image (if any) */}
      {post.image_url && (
        <img
          src={post.image_url}
          alt="post"
          className="w-full rounded-xl mb-4 shadow-lg"
        />
      )}

      {/* Content */}
      <p className="text-gray-200 mb-4 text-[15px] leading-relaxed">
        {post.content}
      </p>

      {/* ACTION BAR */}
      <div className="flex items-center gap-6 pt-3 border-t border-gray-700">
        {/* LIKE POST */}
        <button
          onClick={togglePostLike}
          className={`flex items-center gap-2 text-sm font-semibold transition ${
            likedPost ? "text-pink-500" : "text-gray-400 hover:text-pink-400"
          }`}
        >
          {likedPost ? "❤️" : "🤍"} {likesCount}
        </button>

        {/* COMMENTS TOGGLE */}
        <button
          onClick={async () => {
            const next = !showComments;
            setShowComments(next);
            if (next) await loadComments();
          }}
          className="text-sm text-gray-400 hover:text-teal-400 transition"
        >
          💬 Comments ({comments.length})
        </button>
      </div>

      {/* COMMENTS SECTION */}
      {showComments && (
        <div className="mt-4 bg-gray-900 p-4 rounded-xl border border-gray-700">
          {/* COMMENT LIST */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {comments.map((c) => (
              <div
                key={c.id}
                className="bg-gray-800 p-3 rounded-lg border border-gray-700 flex justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-white">
                    {c.user_id === user.id ? "You" : "User"}
                  </p>
                  <p className="text-gray-300 text-sm">{c.content}</p>

                  {/* COMMENT LIKE BUTTON */}
                  <button
                    onClick={() => toggleCommentLike(c)}
                    className={`text-xs mt-1 flex items-center gap-1 transition ${
                      c.liked_by_me
                        ? "text-pink-400"
                        : "text-gray-400 hover:text-pink-300"
                    }`}
                  >
                    {c.liked_by_me ? "❤️" : "🤍"} {c.likes_count}
                  </button>
                </div>

                {/* DELETE BUTTON */}
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

          {/* COMMENT INPUT */}
          <div className="flex gap-2 mt-3">
            <input
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 p-2 rounded-lg bg-gray-800 text-white border border-gray-600 placeholder-gray-400"
            />
            <button
              onClick={submitComment}
              className="px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
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
