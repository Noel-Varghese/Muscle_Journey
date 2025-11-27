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
      setUser(res.data.user);
      alert("Profile saved!");
    } catch (err) {
      console.log(err);
      alert("Error saving changes");
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  const inputClass = "w-full p-3 bg-gray-900/50 border border-gray-600 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all duration-300 text-white";

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-teal-400">Edit Profile</h1>

        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl space-y-8">

          {/* Avatar Upload */}
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-3">Profile Picture</h2>
            <div className="inline-block p-1 border-2 border-dashed border-gray-600 rounded-full hover:border-teal-500 transition-colors">
                 <AvatarUpload />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows="4"
              className={inputClass}
            />
          </div>

          {/* Height + Weight + Age */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Height (cm)</label>
              <input
                name="height"
                type="number"
                value={form.height}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Weight (kg)</label>
              <input
                name="weight"
                type="number"
                value={form.weight}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Age</label>
              <input
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={saveChanges}
            className="bg-gradient-to-r from-teal-600 to-teal-500 hover:shadow-teal-500/30 shadow-lg w-full py-4 rounded-xl font-bold text-lg active:scale-95 transition-all"
          >
            Save Changes
          </button>

        </div>
      </div>
    </div>
  );
};

export default EditProfile;