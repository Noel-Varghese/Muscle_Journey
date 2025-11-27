import { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AvatarUpload = () => {
  const { token, user, setUser } = useContext(AuthContext);

  const changeAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:8000/users/avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newAvatar = res.data.avatar_url;

      if (!newAvatar) {
        alert("Error: No avatar URL returned.");
        return;
      }

      const updatedUser = { ...user, avatar_url: newAvatar };
      setUser(updatedUser);

      alert("Profile picture updated!");

    } catch (err) {
      console.log("Avatar upload error:", err);
      alert("Error uploading image");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-bold text-gray-400 uppercase tracking-wide">Change Profile Photo</label>
      <input
        type="file"
        accept="image/*"
        onChange={changeAvatar}
        className="block w-full text-sm text-gray-400
          file:mr-4 file:py-2.5 file:px-6
          file:rounded-full file:border-0
          file:text-sm file:font-bold
          file:bg-teal-600 file:text-white
          hover:file:bg-teal-500
          file:transition-colors file:cursor-pointer
          cursor-pointer bg-gray-900/50 rounded-full border border-gray-700"
      />
    </div>
  );
};

export default AvatarUpload;