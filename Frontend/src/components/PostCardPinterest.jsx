const isVideo = (url) => {
  return [".mp4", ".webm", ".ogg"].some((ext) =>
    url?.toLowerCase().includes(ext)
  );
};

const PostCardPinterest = ({ post, onOpen }) => {
  return (
    <div
      onClick={onOpen}
      className="relative mb-6 break-inside-avoid cursor-pointer rounded-2xl overflow-hidden group shadow-md hover:shadow-2xl transition-all duration-300"
    >
      {/* IMAGE OR VIDEO */}
      {isVideo(post.image_url) ? (
        <video
          src={post.image_url}
          className="w-full object-cover rounded-2xl transition duration-500 group-hover:scale-105"
          muted
          loop
        />
      ) : (
        <img
          src={post.image_url}
          className="w-full object-cover rounded-2xl transition duration-500 group-hover:scale-105"
        />
      )}

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <div className="flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
            {post.username?.[0]?.toUpperCase()}
          </div>

          <p className="text-sm font-bold text-white drop-shadow-md">{post.username}</p>
        </div>

        <div className="flex justify-between text-xs text-gray-200 mt-2 font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
          <span className="flex items-center gap-1">❤️ {post.likes_count}</span>
          <span className="flex items-center gap-1">💬 {post.comments_count}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCardPinterest;