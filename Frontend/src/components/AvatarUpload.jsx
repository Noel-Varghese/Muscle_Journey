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

      // Backend returns: { avatar_url: "..." }
      const newAvatar = res.data.avatar_url;

      if (!newAvatar) {
        alert("Error: No avatar URL returned.");
        return;
      }

      // Update global user immediately
      const updatedUser = { ...user, avatar_url: newAvatar };
      setUser(updatedUser);

      alert("Profile picture updated!");

    } catch (err) {
      console.log("Avatar upload error:", err);
      alert("Error uploading image");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-gray-300">Change Profile Photo</label>
      <input
        type="file"
        accept="image/*"
        onChange={changeAvatar}
        className="text-gray-200"
      />
    </div>
  );
};

export default AvatarUpload;
