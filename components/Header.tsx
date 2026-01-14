
import React from 'react';

interface Props {
  onOpenItinerary: () => void;
  onOpenAdd: () => void;
}

const Header: React.FC<Props> = ({ onOpenItinerary, onOpenAdd }) => {
  return (
    <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-900 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <i className="fas fa-plane-departure text-white text-lg"></i>
          </div>
          <h1 className="text-xl font-black tracking-tighter text-white">
            SmartTrip<span className="text-cyan-400">AI</span>
          </h1>
        </div>

        {/* Center Navigation / Itinerary Button */}
        <div className="flex-1 flex justify-center">
          <button 
            onClick={onOpenItinerary}
            className="text-white font-bold text-sm bg-slate-900 hover:bg-slate-800 border border-slate-700 px-6 py-2 rounded-full transition flex items-center gap-2 group"
          >
            <i className="fas fa-map-marked-alt text-cyan-400 group-hover:scale-110 transition"></i>
            我的行程
          </button>
        </div>

        <button 
          onClick={onOpenAdd}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          <span className="hidden sm:inline">新增景點</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
