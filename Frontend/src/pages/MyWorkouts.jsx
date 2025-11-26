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

      <div className="max-w-3xl mx-auto mt-8 p-4 space-y-4">
        <h2 className="text-2xl font-bold mb-4">📓 My Workouts</h2>

        {workouts.map((w) => (
          <div
            key={w.id}
            className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex justify-between"
          >
            <div>
              <h4 className="font-bold text-lg">{w.exercise}</h4>
              <p className="text-sm text-gray-400">
                {w.sets} sets × {w.reps} reps
                {w.weight && ` @ ${w.weight}kg`}
              </p>
            </div>

            <button
              onClick={() => deleteWorkout(w.id)}
              className="text-red-500 hover:text-red-700"
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
