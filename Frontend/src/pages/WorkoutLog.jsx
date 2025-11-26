import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const WorkoutLog = () => {
  const { token } = useContext(AuthContext);

  const [form, setForm] = useState({
    exercise: "",
    sets: "",
    reps: "",
    weight: "",
    duration_minutes: "",
    calories: "",
    notes: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitWorkout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/workouts/",
        {
          ...form,
          sets: Number(form.sets),
          reps: Number(form.reps),
          weight: form.weight ? Number(form.weight) : null,
          duration_minutes: form.duration_minutes ? Number(form.duration_minutes) : null,
          calories: form.calories ? Number(form.calories) : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Workout logged ✅");

      setForm({
        exercise: "",
        sets: "",
        reps: "",
        weight: "",
        duration_minutes: "",
        calories: "",
        notes: ""
      });

    } catch (err) {
      console.log(err);
      alert("Failed to log workout");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-xl mx-auto mt-10 bg-gray-900 p-6 rounded-xl border border-gray-800">
        <h2 className="text-2xl font-bold mb-4">Log Workout</h2>

        <input className="input" name="exercise" placeholder="Exercise" onChange={handleChange} value={form.exercise} />
        <input className="input" name="sets" placeholder="Sets" onChange={handleChange} value={form.sets} />
        <input className="input" name="reps" placeholder="Reps" onChange={handleChange} value={form.reps} />
        <input className="input" name="weight" placeholder="Weight (kg)" onChange={handleChange} value={form.weight} />
        <input className="input" name="duration_minutes" placeholder="Duration (min)" onChange={handleChange} value={form.duration_minutes} />
        <input className="input" name="calories" placeholder="Calories" onChange={handleChange} value={form.calories} />

        <textarea
          className="input h-20"
          name="notes"
          placeholder="Notes"
          onChange={handleChange}
          value={form.notes}
        />

        <button
          onClick={submitWorkout}
          className="w-full mt-4 bg-teal-600 py-2 rounded-lg hover:bg-teal-700"
        >
          Save Workout
        </button>
      </div>
    </div>
  );
};

export default WorkoutLog;
