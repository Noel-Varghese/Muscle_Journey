// frontend/src/components/CreatePostModal.jsx
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const CreatePostModal = ({ open, onClose, refreshFeed }) => {
  const { token } = useContext(AuthContext);

  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null); // "image" | "video" | null
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) {
      setFile(null);
      setPreviewUrl(null);
      setPreviewType(null);
      return;
    }

    setFile(f);

    // Decide if it's image or video
    if (f.type.startsWith("video/")) {
      setPreviewType("video");
    } else if (f.type.startsWith("image/")) {
      setPreviewType("image");
    } else {
      // unsupported -> no preview, but still uploadable if you want
      setPreviewType(null);
    }

    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  const handleSubmit = async () => {
    if (!content.trim() && !file) {
      alert("Write something or add a media file first.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("content", content);
      if (file) {
        formData.append("file", file);
      }

      await axios.post("http://localhost:8000/posts/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setContent("");
      setFile(null);
      setPreviewUrl(null);
      setPreviewType(null);

      if (refreshFeed) {
        await refreshFeed();
      }

      onClose();
    } catch (err) {
      console.log("Create post error:", err);
      alert("Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-full max-w-lg rounded-2xl border border-gray-700 p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-4">
          Share your workout
        </h2>

        {/* Text area */}
        <textarea
          className="w-full bg-gray-800 text-white rounded-xl p-3 border border-gray-700 outline-none resize-none mb-4"
          rows={4}
          placeholder="How was your session today?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* File input */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">
            Add image / video
          </label>
          <input
            type="file"
            // 🔥 allow images + videos
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="text-sm text-gray-300"
          />
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="mb-4 rounded-xl overflow-hidden border border-gray-700">
            {previewType === "video" ? (
              <video
                src={previewUrl}
                controls
                className="w-full max-h-80 object-contain bg-black"
              />
            ) : (
              <img
                src={previewUrl}
                alt="preview"
                className="w-full max-h-80 object-cover"
              />
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-500 disabled:opacity-60"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
