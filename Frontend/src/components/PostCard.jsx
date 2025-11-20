import { useState } from "react";

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4 transition hover:shadow-md">
      
      {/* Header: Avatar & Name */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
          {post.user[0]?.toUpperCase()}
        </div>

        <div>
          <h4 className="font-bold text-gray-800">{post.user}</h4>
          <p className="text-xs text-gray-400">{post.time}</p>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-700 leading-relaxed mb-3">{post.content}</p>

      {/* IMAGE (NEW BLOCK) */}
      {post.image_url && (
        <img
          src={post.image_url}
          alt="Post media"
          className="w-full rounded-lg border border-gray-200 mb-4"
        />
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-6 pt-3 border-t border-gray-50">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-2 text-sm font-medium transition ${
            liked ? "text-pink-500" : "text-gray-500 hover:text-pink-500"
          }`}
        >
          <span>{liked ? "❤️" : "🤍"}</span>
          {liked ? post.likes + 1 : post.likes}
        </button>

        <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-teal-600 transition">
          <span>💬</span> Comment
        </button>
      </div>
    </div>
  );
};

export default PostCard;
