import { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AvatarUpload = () => {
  const { token, setUser } = useContext(AuthContext);

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

      // Update UI instantly
      if (res.data.user) {
        setUser(res.data.user);
      }

      alert("Profile picture updated!");

    } catch (err) {
      console.log(err);
      alert("Error uploading image");
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={changeAvatar} />
    </div>
  );
};

export default AvatarUpload;
