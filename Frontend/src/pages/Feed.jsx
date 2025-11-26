      {/* MODAL */}
      {activePost && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl max-w-3xl w-full mx-4 overflow-hidden">

            {/* ✅ IMAGE OR VIDEO PREVIEW */}
            {activePost.image_url &&
            [".mp4", ".webm", ".ogg"].some((ext) =>
              activePost.image_url.toLowerCase().includes(ext)
            ) ? (
              <video
                src={activePost.image_url}
                controls
                autoPlay
                className="w-full max-h-[70vh] object-contain bg-black"
              />
            ) : (
              <img
                src={activePost.image_url}
                className="w-full max-h-[70vh] object-cover"
              />
            )}

            <div className="p-4">
              <p className="text-gray-300 mb-2">{activePost.content}</p>

              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span>❤️ {activePost.likes_count}</span>
                <span>💬 {activePost.comments_count}</span>
                <span>👤 {activePost.username}</span>
              </div>

              <button
                onClick={() => setActivePost(null)}
                className="mt-4 bg-teal-600 px-6 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
