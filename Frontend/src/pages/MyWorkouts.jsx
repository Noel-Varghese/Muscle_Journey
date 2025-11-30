import { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const toDateKey = (dateLike) => {
  const d = new Date(dateLike);
  if (isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const MyWorkouts = () => {
  const { token } = useContext(AuthContext);

  const [workouts, setWorkouts] = useState([]);
  const [calendarMap, setCalendarMap] = useState({});
  const today = new Date();

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(toDateKey(today));
  const [loading, setLoading] = useState(true);

  // ✅ CRITICAL FIX: force axios auth sync
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resWorkouts, resCalendar] = await Promise.all([
        axios.get("http://localhost:8000/workouts/me"),
        axios.get("http://localhost:8000/workouts/calendar"),
      ]);

      setWorkouts(resWorkouts.data);
      setCalendarMap(resCalendar.data || {});
    } catch (err) {
      console.log("Workout load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const monthLabel = useMemo(() => {
    const d = new Date(currentYear, currentMonth, 1);
    return d.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [currentYear, currentMonth]);

  const daysInMonth = useMemo(
    () => new Date(currentYear, currentMonth + 1, 0).getDate(),
    [currentYear, currentMonth]
  );

  const firstWeekday = useMemo(
    () => new Date(currentYear, currentMonth, 1).getDay(),
    [currentYear, currentMonth]
  );

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const handleDayClick = (dayNum) => {
    const key = toDateKey(new Date(currentYear, currentMonth, dayNum));
    setSelectedDate(key);
  };

  const dayWorkoutCount = useMemo(() => {
    if (!selectedDate) return 0;
    return calendarMap[selectedDate] || 0;
  }, [calendarMap, selectedDate]);

  const selectedDayWorkouts = useMemo(() => {
    if (!selectedDate) return [];
    return workouts.filter(
      (w) => toDateKey(w.created_at) === selectedDate
    );
  }, [workouts, selectedDate]);

  const streak = useMemo(() => {
    let count = 0;
    let cursor = new Date();

    while (true) {
      const key = toDateKey(cursor);
      if (!calendarMap[key]) break;
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }, [calendarMap]);

  const intensityEmojiForDay = (dayNum) => {
    const key = toDateKey(new Date(currentYear, currentMonth, dayNum));
    const count = key ? calendarMap[key] || 0 : 0;
    if (count >= 3) return "🔥";
    if (count >= 1) return "🔵";
    return "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <Navbar />
        <div className="flex items-center justify-center mt-20">
          Loading workouts...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: CALENDAR */}
        <section className="bg-gray-900 rounded-3xl border border-gray-800 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <button onClick={handlePrevMonth} className="w-9 h-9 rounded-full bg-gray-800">‹</button>
            <p className="text-lg font-bold">{monthLabel}</p>
            <button onClick={handleNextMonth} className="w-9 h-9 rounded-full bg-gray-800">›</button>
          </div>

          <div className="grid grid-cols-7 text-xs text-gray-500">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-center py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-sm mt-1">
            {Array.from({ length: firstWeekday }).map((_, idx) => (
              <div key={`empty-${idx}`} />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => {
              const dayNum = i + 1;
              const key = toDateKey(
                new Date(currentYear, currentMonth, dayNum)
              );
              const isSelected = key === selectedDate;
              const emoji = intensityEmojiForDay(dayNum);

              return (
                <button
                  key={dayNum}
                  onClick={() => handleDayClick(dayNum)}
                  className={`mx-1 my-1 rounded-2xl py-2 ${
                    isSelected
                      ? "bg-teal-500 text-gray-900"
                      : "bg-gray-800"
                  }`}
                >
                  {dayNum} {emoji}
                </button>
              );
            })}
          </div>
        </section>

        {/* RIGHT: WORKOUT LIST */}
        <section className="lg:col-span-2 bg-gray-900 rounded-3xl border border-gray-800 p-6">
          {selectedDayWorkouts.map((w) => (
            <div key={w.id} className="bg-gray-800 p-4 mb-3 rounded-xl">
              <p className="font-semibold">{w.exercise}</p>
              <p className="text-sm text-gray-400">
                {w.sets} × {w.reps} {w.weight ? `@ ${w.weight}kg` : ""}
              </p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default MyWorkouts;
