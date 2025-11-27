import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const CreatePostModal = ({ open, onClose, refreshFeed }) => {
  const { token } = useContext(AuthContext);

  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);
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

    if (f.type.startsWith("video/")) {
      setPreviewType("video");
    } else if (f.type.startsWith("image/")) {
      setPreviewType("image");
    } else {
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
      <div className="bg-gray-900 w-full max-w-lg rounded-3xl border border-gray-700 p-8 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Top Gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-blue-500"></div>

        <h2 className="text-2xl font-black text-white mb-6">
          Share your workout 🚀
        </h2>

        {/* Text area */}
        <textarea
          className="w-full bg-gray-800/50 text-white rounded-xl p-4 border border-gray-700 outline-none resize-none mb-4 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder-gray-500"
          rows={4}
          placeholder="How was your session today?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* File input */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
            Add image / video
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-teal-900 file:text-teal-300 hover:file:bg-teal-800 transition-colors cursor-pointer"
          />
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="mb-6 rounded-xl overflow-hidden border border-gray-700 bg-black/50 shadow-inner">
            {previewType === "video" ? (
              <video
                src={previewUrl}
                controls
                className="w-full max-h-80 object-contain mx-auto"
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
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 font-semibold transition-colors active:scale-95"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 text-white font-bold hover:shadow-lg hover:shadow-teal-500/25 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;