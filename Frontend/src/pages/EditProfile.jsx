import { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import AvatarUpload from "../components/AvatarUpload";

const EditProfile = () => {
  const { user, token, setUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    username: "",
    bio: "",
    height: "",
    weight: "",
    age: "",
  });

  const [loading, setLoading] = useState(true);

  // Load current profile info
  useEffect(() => {
    const loadInfo = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/users/${user.email}`
        );

        setForm({
          username: res.data.username,
          bio: res.data.bio || "",
          height: res.data.height,
          weight: res.data.weight,
          age: res.data.age,
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    loadInfo();
  }, [user.email]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // SAVE PROFILE CHANGES
  const saveChanges = async () => {
    try {
      const res = await axios.put(
        "http://localhost:8000/users/update",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update user instantly across the app
      setUser(res.data.user);

      alert("Profile saved!");
    } catch (err) {
      console.log(err);
      alert("Error saving changes");
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-8">

          {/* Avatar Upload */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Profile Picture</h2>
            <AvatarUpload />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm mb-1">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none"
            />
          </div>

          {/* Height + Weight + Age */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Height (cm)</label>
              <input
                name="height"
                type="number"
                value={form.height}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Weight (kg)</label>
              <input
                name="weight"
                type="number"
                value={form.weight}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Age</label>
              <input
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={saveChanges}
            className="bg-teal-600 hover:bg-teal-700 px-6 py-3 rounded-lg font-bold w-full"
          >
            Save Changes
          </button>

        </div>
      </div>
    </div>
  );
};

export default EditProfile;
