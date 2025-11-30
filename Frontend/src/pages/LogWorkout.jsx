import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const LogWorkout = () => {
  const { token } = useContext(AuthContext);

  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  const saveWorkout = async () => {
    if (!exercise || !sets || !reps) {
      alert("Fill all required fields");
      return;
    }

    if (!token) {
      alert("Auth token missing. Please logout and login again.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/workouts/",
        {
          exercise,
          sets: Number(sets),
          reps: Number(reps),
          weight: weight ? Number(weight) : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ FIXED
          },
        }
      );

      alert("Workout saved ✅");
      setExercise("");
      setSets("");
      setReps("");
      setWeight("");
    } catch (err) {
      console.log("SAVE WORKOUT ERROR:", err.response?.data || err.message);
      alert("Failed to save workout ❌");
    }
  };

  const inputClass =
    "w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all duration-300 placeholder-gray-500 text-white";

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-xl mx-auto mt-10 bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-teal-400 drop-shadow-sm">
          🏋️ Log Workout
        </h2>

        <div className="space-y-4">
          <input
            className={inputClass}
            placeholder="Exercise (e.g. Bench Press)"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              className={inputClass}
              placeholder="Sets"
              type="number"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
            />

            <input
              className={inputClass}
              placeholder="Reps"
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
          </div>

          <input
            className={inputClass}
            placeholder="Weight (kg, optional)"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        <button
          onClick={saveWorkout}
          className="mt-8 w-full bg-gradient-to-r from-teal-600 to-teal-500 py-3 rounded-xl font-bold text-white shadow-lg shadow-teal-900/20 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-200"
        >
          Save Workout
        </button>
      </div>
    </div>
  );
};

export default LogWorkout;
