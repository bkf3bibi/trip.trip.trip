
import React, { useState, useEffect, useMemo } from 'react';
import { Attraction, DataStructure, FilterState, TransportationMode } from './types';
import AttractionCard from './components/AttractionCard';
import DetailsPanel from './components/DetailsPanel';
import Header from './components/Header';
import AddAttractionModal from './components/AddAttractionModal';
import ItineraryModal from './components/ItineraryModal';

const App: React.FC = () => {
  const [data, setData] = useState<DataStructure | null>(null);
  const [itinerary, setItinerary] = useState<Attraction[]>([]);
  
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    searchTerm: '',
    selectedRegions: ['全部'],
    selectedDistricts: ['全部'],
    travelDays: 1,
    transportMode: TransportationMode.CAR
  });
  
  const [pendingSearch, setPendingSearch] = useState('');
  const [pendingRegions, setPendingRegions] = useState<string[]>(['全部']);
  const [pendingDistricts, setPendingDistricts] = useState<string[]>(['全部']);
  const [pendingDays, setPendingDays] = useState(1);
  const [pendingTransport, setPendingTransport] = useState<TransportationMode>(TransportationMode.CAR);

  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isItineraryOpen, setIsItineraryOpen] = useState(false);

  useEffect(() => {
    fetch('./data.json')
      .then(res => res.json())
      .then(jsonData => setData(jsonData))
      .catch(() => setData({ lastUpdated: new Date().toISOString(), attractions: [] }));
  }, []);

  const availableRegions = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.attractions.map(a => a.region)));
  }, [data]);

  const availableDistricts = useMemo(() => {
    if (!data) return [];
    const regionsToLook = pendingRegions.includes('全部') ? availableRegions : pendingRegions;
    return Array.from(new Set(
      data.attractions
        .filter(a => regionsToLook.includes(a.region))
        .map(a => a.district)
    ));
  }, [data, pendingRegions, availableRegions]);

  const filteredAttractions = useMemo(() => {
    if (!data) return [];
    return data.attractions.filter(attr => {
      const matchesSearch = 
        attr.name.toLowerCase().includes(appliedFilters.searchTerm.toLowerCase()) ||
        attr.category.toLowerCase().includes(appliedFilters.searchTerm.toLowerCase()) ||
        attr.description.toLowerCase().includes(appliedFilters.searchTerm.toLowerCase());
      
      const matchesRegion = appliedFilters.selectedRegions.includes('全部') || 
                           appliedFilters.selectedRegions.includes(attr.region);

      const matchesDistrict = appliedFilters.selectedDistricts.includes('全部') || 
                             appliedFilters.selectedDistricts.includes(attr.district);
      
      return matchesSearch && matchesRegion && matchesDistrict;
    });
  }, [appliedFilters, data]);

  useEffect(() => {
    if (filteredAttractions.length > 0) {
      if (!selectedAttraction || !filteredAttractions.find(a => a.id === selectedAttraction.id)) {
        setSelectedAttraction(filteredAttractions[0]);
      }
    } else {
      setSelectedAttraction(null);
    }
  }, [filteredAttractions]);

  const handleApplyFilters = () => {
    setAppliedFilters({
      searchTerm: pendingSearch,
      selectedRegions: pendingRegions,
      selectedDistricts: pendingDistricts,
      travelDays: pendingDays,
      transportMode: pendingTransport
    });
    const listEl = document.getElementById('attraction-list');
    if (listEl) listEl.scrollTop = 0;
  };

  const handleToggleRegion = (region: string) => {
    if (region === '全部') {
      setPendingRegions(['全部']);
      setPendingDistricts(['全部']);
    } else {
      let next = pendingRegions.filter(r => r !== '全部');
      if (next.includes(region)) {
        next = next.filter(r => r !== region);
        if (next.length === 0) next = ['全部'];
      } else {
        next.push(region);
      }
      setPendingRegions(next);
      setPendingDistricts(['全部']);
    }
  };

  const handleToggleDistrict = (district: string) => {
    if (district === '全部') {
      setPendingDistricts(['全部']);
    } else {
      let next = pendingDistricts.filter(d => d !== '全部');
      if (next.includes(district)) {
        next = next.filter(d => d !== district);
        if (next.length === 0) next = ['全部'];
      } else {
        next.push(district);
      }
      setPendingDistricts(next);
    }
  };

  const addToItinerary = (attr: Attraction) => {
    if (!itinerary.find(i => i.id === attr.id)) {
      setItinerary([...itinerary, attr]);
      alert(`已將 ${attr.name} 加入您的行程！`);
    } else {
      alert("此景點已在您的行程中。");
    }
  };

  const removeFromItinerary = (id: string) => {
    setItinerary(itinerary.filter(i => i.id !== id));
  };

  const handleAddManualAttraction = (newAttr: Attraction) => {
    if (data) {
      setData({
        ...data,
        attractions: [newAttr, ...data.attractions]
      });
      setAppliedFilters({
        ...appliedFilters,
        searchTerm: '',
        selectedRegions: ['全部'],
        selectedDistricts: ['全部']
      });
      setSelectedAttraction(newAttr);
    }
  };

  if (!data) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400">載入中...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header 
        onOpenItinerary={() => setIsItineraryOpen(true)} 
        onOpenAdd={() => setIsAddModalOpen(true)} 
      />
      
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 overflow-hidden">
        <div className="w-full lg:w-1/3 flex flex-col gap-6 h-full max-h-[calc(100vh-120px)] overflow-hidden">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 flex flex-col shrink-0 shadow-2xl">
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
               <h2 className="text-lg font-black flex items-center gap-2">
                <i className="fas fa-sliders-h text-cyan-400"></i>
                探索篩選
              </h2>
            </div>
            
            <div className="p-5 flex flex-col gap-5 overflow-y-auto max-h-[400px] custom-scrollbar">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest">關鍵字搜尋</label>
                <div className="relative">
                  <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
                  <input
                    type="text"
                    placeholder="搜尋景點、特色標籤..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none transition"
                    value={pendingSearch}
                    onChange={(e) => setPendingSearch(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest">交通方式</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(TransportationMode).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setPendingTransport(mode)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${pendingTransport === mode ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                    >
                      {mode === TransportationMode.CAR && <i className="fas fa-car mr-2"></i>}
                      {mode === TransportationMode.SCOOTER && <i className="fas fa-motorcycle mr-2"></i>}
                      {mode === TransportationMode.BICYCLE && <i className="fas fa-bicycle mr-2"></i>}
                      {mode === TransportationMode.WALKING && <i className="fas fa-walking mr-2"></i>}
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest">地區選擇</label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleToggleRegion('全部')}
                    className={`px-3 py-1 rounded-full text-[11px] font-black border transition-all ${pendingRegions.includes('全部') ? 'bg-cyan-500 border-cyan-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                  >
                    全部
                  </button>
                  {availableRegions.map(r => (
                    <button
                      key={r}
                      onClick={() => handleToggleRegion(r)}
                      className={`px-3 py-1 rounded-full text-[11px] font-black border transition-all ${pendingRegions.includes(r) ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {!pendingRegions.includes('全部') && availableDistricts.length > 0 && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest">行政區細分</label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => handleToggleDistrict('全部')}
                      className={`px-3 py-1 rounded-full text-[11px] font-black border transition-all ${pendingDistricts.includes('全部') ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                    >
                      全部
                    </button>
                    {availableDistricts.map(d => (
                      <button
                        key={d}
                        onClick={() => handleToggleDistrict(d)}
                        className={`px-3 py-1 rounded-full text-[11px] font-black border transition-all ${pendingDistricts.includes(d) ? 'bg-pink-600 border-pink-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/80">
              <button 
                onClick={handleApplyFilters}
                className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-black py-3 rounded-xl transition shadow-xl active:scale-95 flex items-center justify-center gap-2"
              >
                <i className="fas fa-check-circle"></i>
                確定篩選景點
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
             <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest px-2 mb-3 flex justify-between items-center">
                <span>搜尋結果 ({filteredAttractions.length})</span>
             </div>
             <div id="attraction-list" className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3 custom-scrollbar">
                {filteredAttractions.length > 0 ? (
                  filteredAttractions.map(attr => (
                    <AttractionCard 
                      key={attr.id} 
                      attraction={attr} 
                      isSelected={selectedAttraction?.id === attr.id}
                      onClick={() => setSelectedAttraction(attr)}
                    />
                  ))
                ) : (
                  <div className="py-20 text-center bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
                    <i className="fas fa-map-marked text-4xl text-slate-800 mb-4 block"></i>
                    <p className="text-slate-600 font-bold italic">找不到符合條件的景點</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        <div className="w-full lg:w-2/3 max-h-[calc(100vh-120px)] overflow-y-auto scroll-smooth">
          {selectedAttraction ? (
            <DetailsPanel 
              attraction={selectedAttraction} 
              onAddToItinerary={() => addToItinerary(selectedAttraction)}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
              <p className="text-slate-600 text-xl font-black italic tracking-widest uppercase">Select an attraction to explore</p>
            </div>
          )}
        </div>
      </main>

      <AddAttractionModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddManualAttraction}
      />

      <ItineraryModal 
        isOpen={isItineraryOpen} 
        onClose={() => setIsItineraryOpen(false)} 
        items={itinerary}
        onRemove={removeFromItinerary}
        transportMode={appliedFilters.transportMode}
      />

      <footer className="py-3 border-t border-slate-900 text-center text-slate-700 text-[10px] uppercase tracking-tighter bg-slate-950">
        SmartTrip AI Traveler &bull; 精準規劃 &bull; 卓越體驗
      </footer>
    </div>
  );
};

export default App;
