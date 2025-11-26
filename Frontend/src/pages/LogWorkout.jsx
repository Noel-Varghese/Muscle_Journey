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
    if (!exercise || !sets || !reps) return alert("Fill all required fields");

    try {
      await axios.post(
        "http://localhost:8000/workouts/",
        {
          exercise,
          sets: Number(sets),
          reps: Number(reps),
          weight: weight ? Number(weight) : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Workout saved ✅");
      setExercise("");
      setSets("");
      setReps("");
      setWeight("");
    } catch (err) {
      console.log(err);
      alert("Failed to save workout ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-xl mx-auto mt-10 bg-gray-900 p-6 rounded-2xl border border-gray-700">
        <h2 className="text-2xl font-bold mb-5">🏋️ Log Workout</h2>

        <input
          className="w-full p-2 mb-3 bg-gray-800 border border-gray-700 rounded"
          placeholder="Exercise (e.g. Bench Press)"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            className="p-2 bg-gray-800 border border-gray-700 rounded"
            placeholder="Sets"
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
          />

          <input
            className="p-2 bg-gray-800 border border-gray-700 rounded"
            placeholder="Reps"
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
          />
        </div>

        <input
          className="w-full p-2 mt-3 bg-gray-800 border border-gray-700 rounded"
          placeholder="Weight (kg, optional)"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <button
          onClick={saveWorkout}
          className="mt-5 w-full bg-teal-600 hover:bg-teal-700 p-2 rounded text-white font-bold"
        >
          Save Workout
        </button>
      </div>
    </div>
  );
};

export default LogWorkout;
