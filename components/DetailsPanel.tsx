
import React from 'react';
import { Attraction } from '../types';
import GeminiTravelTip from './GeminiTravelTip';

interface Props {
  attraction: Attraction;
  onAddToItinerary: () => void;
}

const DetailsPanel: React.FC<Props> = ({ attraction, onAddToItinerary }) => {
  return (
    <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl min-h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="bg-indigo-900/50 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30">
              {attraction.category}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 text-sm font-medium">{attraction.region} {attraction.district}</span>
          </div>
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight">{attraction.name}</h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
            {attraction.description}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl text-center border border-slate-700 min-w-[100px] flex flex-col justify-center">
            <div className="text-cyan-400 text-2xl font-black">{attraction.rating}</div>
            <div className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">評分</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl text-center border border-slate-700 min-w-[100px] flex flex-col justify-center">
            <div className="text-indigo-400 text-2xl font-black">{attraction.popularity}%</div>
            <div className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">熱度</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 flex flex-col justify-center gap-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-800 pb-2">實用資訊</h3>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-cyan-400 border border-slate-800 shrink-0">
              <i className="far fa-clock text-xl"></i>
            </div>
            <div>
              <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">建議停留時間</div>
              <div className="text-white font-bold">{attraction.suggestedDuration}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-indigo-400 border border-slate-800 shrink-0">
              <i className="fas fa-map-marker-alt text-xl"></i>
            </div>
            <div>
              <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">景點地址</div>
              <div className="text-white font-bold text-sm leading-snug">{attraction.address}</div>
            </div>
          </div>
        </div>

        <GeminiTravelTip attraction={attraction} />
      </div>
      
      <div className="mt-12">
        <button 
          onClick={onAddToItinerary}
          className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-black py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.01] shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-3 active:scale-95"
        >
          <i className="fas fa-plus-circle text-xl"></i>
          加入行程規劃
        </button>
      </div>
    </div>
  );
};

export default DetailsPanel;
