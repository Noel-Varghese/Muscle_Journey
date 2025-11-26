const PostCardPinterest = ({ post, onOpen }) => {
  return (
    <div
      onClick={onOpen}
      className="relative mb-4 break-inside-avoid cursor-pointer rounded-2xl overflow-hidden group"
    >
      {/* IMAGE */}
      <img
        src={post.image_url}
        className="w-full object-cover rounded-2xl transition group-hover:scale-105"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">
            {post.username?.[0]?.toUpperCase()}
          </div>

          <p className="text-sm font-semibold">{post.username}</p>
        </div>

        <div className="flex justify-between text-xs text-gray-300 mt-2">
          <span>❤️ {post.likes_count}</span>
          <span>💬 {post.comments_count}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCardPinterest;
