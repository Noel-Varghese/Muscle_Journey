const StatsCard = () => {
  return (
    <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-lg sticky top-24">
      <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
        <span className="text-teal-500">⚡</span> Your Stats
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700/50 p-4 rounded-2xl border border-gray-700">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Steps</p>
          <p className="text-2xl font-black text-white mt-1">8,432</p>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-2xl border border-gray-700">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Kcal</p>
          <p className="text-2xl font-black text-white mt-1">640</p>
        </div>
      </div>

      <h4 className="text-gray-300 font-bold text-sm mb-4 uppercase tracking-widest">
        Weekly Goal
      </h4>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-400">Workouts</span>
            <span className="text-white font-bold">4/5</span>
          </div>
          <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal-500 to-green-400 w-[80%]"></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-400">Water</span>
            <span className="text-white font-bold">1.2L / 2.5L</span>
          </div>
          <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[50%]"></div>
          </div>
        </div>
      </div>

      <button className="w-full mt-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition shadow-lg shadow-teal-900/20">
        Log Workout +
      </button>
    </div>
  );
};

export default StatsCard;