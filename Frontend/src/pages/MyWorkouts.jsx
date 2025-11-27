import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const MyWorkouts = () => {
  const { token } = useContext(AuthContext);
  const [workouts, setWorkouts] = useState([]);

  const loadWorkouts = async () => {
    const res = await axios.get("http://localhost:8000/workouts/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setWorkouts(res.data);
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  const deleteWorkout = async (id) => {
    await axios.delete(`http://localhost:8000/workouts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    loadWorkouts();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto mt-8 p-4 space-y-6">
        <h2 className="text-2xl font-bold mb-4 text-teal-400">📓 My Workouts</h2>

        {workouts.map((w) => (
          <div
            key={w.id}
            className="bg-gray-900 border border-gray-700 rounded-xl p-6 flex justify-between items-center hover:border-teal-500/40 transition-all duration-300 shadow-md group"
          >
            <div>
              <h4 className="font-bold text-xl text-white mb-1 group-hover:text-teal-300 transition-colors">{w.exercise}</h4>
              <p className="text-sm text-gray-400">
                <span className="font-mono text-white">{w.sets}</span> sets × <span className="font-mono text-white">{w.reps}</span> reps
                {w.weight && <span className="ml-2 text-teal-500 font-bold">@ {w.weight}kg</span>}
              </p>
            </div>

            <button
              onClick={() => deleteWorkout(w.id)}
              className="text-red-400 hover:text-red-300 bg-red-900/20 px-4 py-2 rounded-lg hover:bg-red-900/40 transition-colors text-sm font-semibold"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyWorkouts;