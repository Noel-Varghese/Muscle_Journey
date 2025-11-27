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

  // Reusable styling for consistent look
  const inputClass = "w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all duration-300 placeholder-gray-500 text-white";

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-xl mx-auto mt-10 bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-teal-400 drop-shadow-sm">Log Workout</h2>

        <div className="space-y-4">
          
          {/* Exercise Name */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase">Exercise</label>
            <input 
                className={inputClass} 
                name="exercise" 
                placeholder="e.g. Incline Bench Press" 
                onChange={handleChange} 
                value={form.exercise} 
            />
          </div>

          {/* Sets / Reps / Weight Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase">Sets</label>
                <input className={inputClass} name="sets" type="number" placeholder="0" onChange={handleChange} value={form.sets} />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase">Reps</label>
                <input className={inputClass} name="reps" type="number" placeholder="0" onChange={handleChange} value={form.reps} />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase">Weight (kg)</label>
                <input className={inputClass} name="weight" type="number" placeholder="0" onChange={handleChange} value={form.weight} />
            </div>
          </div>

          {/* Duration / Calories Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase">Duration (min)</label>
                <input className={inputClass} name="duration_minutes" type="number" placeholder="Optional" onChange={handleChange} value={form.duration_minutes} />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase">Calories</label>
                <input className={inputClass} name="calories" type="number" placeholder="Optional" onChange={handleChange} value={form.calories} />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase">Notes</label>
            <textarea
                className={`${inputClass} h-24 resize-none`}
                name="notes"
                placeholder="How did it feel? Any pain or PRs?"
                onChange={handleChange}
                value={form.notes}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={submitWorkout}
            className="w-full mt-4 bg-gradient-to-r from-teal-600 to-teal-500 py-3 rounded-xl font-bold text-white shadow-lg shadow-teal-900/20 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            Save Workout
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutLog;