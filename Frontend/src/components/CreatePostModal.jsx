// frontend/src/components/CreatePostModal.jsx
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const CreatePostModal = ({ open, onClose, refreshFeed }) => {
  const { token } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImage(null);
      setPreview(null);
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!content.trim() && !image) {
      alert("Please add text or an image.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (image) formData.append("file", image);

      await axios.post("http://localhost:8000/posts/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // reset UI
      setContent("");
      setImage(null);
      setPreview(null);

      onClose();
      if (refreshFeed) refreshFeed();
    } catch (err) {
      console.error("Create post error:", err?.response?.data || err);
      alert("Error creating post — check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Create Post</h2>

        <textarea
          placeholder="What's on your mind?"
          className="w-full bg-gray-700 text-white p-3 rounded-lg outline-none mb-3 resize-none"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="mb-3">
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="text-white"
          />
        </div>

        {preview && (
          <div className="mb-3">
            <img
              src={preview}
              alt="preview"
              className="w-full rounded-lg object-cover max-h-60"
            />
          </div>
        )}

        <div className="flex justify-between items-center gap-3">
          <button
            onClick={() => {
              setContent("");
              setImage(null);
              setPreview(null);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold disabled:opacity-50"
            disabled={loading || (!content.trim() && !image)}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
