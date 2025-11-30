import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const MyWorkouts = () => {
  const { token } = useContext(AuthContext);

  const [workouts, setWorkouts] = useState([]);
  const [calendar, setCalendar] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // ---------------- LOAD DATA ----------------
  const loadWorkouts = async () => {
    const res = await axios.get("http://localhost:8000/workouts/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setWorkouts(res.data);
  };

  const loadCalendar = async () => {
    const res = await axios.get("http://localhost:8000/workouts/calendar", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCalendar(res.data);
  };

  useEffect(() => {
    loadWorkouts();
    loadCalendar();
  }, []);

  // ---------------- DELETE ----------------
  const deleteWorkout = async (id) => {
    await axios.delete(`http://localhost:8000/workouts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    loadWorkouts();
    loadCalendar();
  };

  // ---------------- MONTH HANDLING ----------------
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const daysInMonth = lastDay.getDate();
  const startDay = firstDay.getDay(); // 0 = Sunday

  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // ---------------- CALENDAR BUILD ----------------
  const calendarCells = [];

  for (let i = 0; i < startDay; i++) {
    calendarCells.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const fullDate = new Date(year, month, d)
      .toISOString()
      .split("T")[0];

    const count = calendar[fullDate] || 0;

    let emoji = "⚫";
    if (count === 1) emoji = "🔵";
    if (count >= 2) emoji = "🔥";

    calendarCells.push({ day: d, emoji });
  }

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto mt-8 p-4 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ✅ NEW CALENDAR UI */}
        <div className="bg-gray-900 border border-gray-700 rounded-3xl p-6">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="text-2xl px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700"
            >
              ←
            </button>

            <h3 className="font-bold text-xl tracking-wide">
              {monthName}
            </h3>

            <button
              onClick={nextMonth}
              className="text-2xl px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700"
            >
              →
            </button>
          </div>

          {/* WEEK HEADER */}
          <div className="grid grid-cols-7 text-center text-gray-400 text-sm mb-3">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* DAYS GRID */}
          <div className="grid grid-cols-7 gap-2">
            {calendarCells.map((cell, i) =>
              cell ? (
                <div
                  key={i}
                  className="bg-gray-800 rounded-xl p-2 text-center flex flex-col items-center justify-center"
                >
                  <span className="text-sm">{cell.day}</span>
                  <span className="text-lg mt-1">{cell.emoji}</span>
                </div>
              ) : (
                <div key={i}></div>
              )
            )}
          </div>
        </div>

        {/* ✅ WORKOUT LIST (UNCHANGED but CLEANER) */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-teal-400">
            📓 My Workouts
          </h2>

          {workouts.map((w) => (
            <div
              key={w.id}
              className="bg-gray-900 border border-gray-700 rounded-xl p-6 flex justify-between items-center hover:border-teal-500/40 transition-all"
            >
              <div>
                <h4 className="font-bold text-xl mb-1">
                  {w.exercise}
                </h4>

                <p className="text-sm text-gray-400">
                  {w.sets} sets × {w.reps} reps{" "}
                  {w.weight && (
                    <span className="ml-2 text-teal-500 font-bold">
                      @ {w.weight}kg
                    </span>
                  )}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {new Date(w.created_at).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => deleteWorkout(w.id)}
                className="text-red-400 hover:text-red-300 bg-red-900/20 px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default MyWorkouts;
