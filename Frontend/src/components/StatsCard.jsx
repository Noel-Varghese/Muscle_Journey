const StatsCard = () => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/50 shadow-xl sticky top-24">
      <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
        <span className="text-teal-500 drop-shadow-md">⚡</span> Your Stats
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700/30 p-4 rounded-2xl border border-gray-600/30 hover:bg-gray-700/50 transition-colors">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Steps</p>
          <p className="text-2xl font-black text-white mt-1 drop-shadow-sm">8,432</p>
        </div>
        <div className="bg-gray-700/30 p-4 rounded-2xl border border-gray-600/30 hover:bg-gray-700/50 transition-colors">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Kcal</p>
          <p className="text-2xl font-black text-white mt-1 drop-shadow-sm">640</p>
        </div>
      </div>

      <h4 className="text-gray-300 font-bold text-xs mb-4 uppercase tracking-widest border-b border-gray-700 pb-2">
        Weekly Goal
      </h4>
      
      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-400 font-semibold">Workouts</span>
            <span className="text-white font-bold">4/5</span>
          </div>
          <div className="h-2.5 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-700/50">
            <div className="h-full bg-gradient-to-r from-teal-600 to-green-400 w-[80%] shadow-[0_0_10px_rgba(45,212,191,0.5)]"></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-400 font-semibold">Water</span>
            <span className="text-white font-bold">1.2L / 2.5L</span>
          </div>
          <div className="h-2.5 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-700/50">
            <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 w-[50%] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          </div>
        </div>
      </div>

      <button className="w-full mt-8 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-bold transition-all shadow-lg shadow-teal-900/30 hover:shadow-teal-500/20 active:scale-95 border border-teal-500/20">
        Log Workout +
      </button>
    </div>
  );
};

export default StatsCard;