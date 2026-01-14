
import React, { useEffect, useRef, useMemo } from 'react';
import { Attraction, TransportationMode } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: Attraction[];
  onRemove: (id: string) => void;
  transportMode: TransportationMode;
}

const ItineraryModal: React.FC<Props> = ({ isOpen, onClose, items, onRemove, transportMode }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);
  const routeLineRef = useRef<any>(null);

  // Speed mapping (km/h)
  const speeds = {
    [TransportationMode.CAR]: 40,
    [TransportationMode.SCOOTER]: 35,
    [TransportationMode.BICYCLE]: 15,
    [TransportationMode.WALKING]: 5,
  };

  const estimatedTotalTime = useMemo(() => {
    if (items.length < 2) return 0;
    // Mocked distance: 8km average between spots
    const distancePerLeg = 8; 
    const totalDistance = (items.length - 1) * distancePerLeg;
    const speed = speeds[transportMode];
    return Math.round((totalDistance / speed) * 60); // minutes
  }, [items, transportMode]);

  const handleExport = () => {
    if (items.length === 0) return;
    
    let content = `SmartTrip AI 旅程規劃表\n`;
    content += `==========================\n`;
    content += `交通方式：${transportMode}\n`;
    content += `預估總車程：${estimatedTotalTime} 分鐘\n`;
    content += `景點數量：${items.length}\n\n`;
    
    items.forEach((item, index) => {
      content += `第 ${index + 1} 站：${item.name}\n`;
      content += `地址：${item.address}\n`;
      content += `建議停留：${item.suggestedDuration}\n`;
      content += `景點介紹：${item.description}\n`;
      content += `--------------------------\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `我的旅程規劃_${new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (isOpen && mapContainerRef.current && !mapInstanceRef.current) {
      const L = (window as any).L;
      if (!L) return;

      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([23.5, 121], 7);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstanceRef.current);
      
      layerGroupRef.current = L.layerGroup().addTo(mapInstanceRef.current);
      routeLineRef.current = L.polyline([], {
        color: '#22d3ee',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10',
        lineCap: 'round'
      }).addTo(mapInstanceRef.current);
    }

    if (isOpen && mapInstanceRef.current) {
      const L = (window as any).L;
      layerGroupRef.current.clearLayers();
      
      const latlngs: any[] = [];
      
      items.forEach((item, index) => {
        if (item.lat && item.lng) {
          const pos = [item.lat, item.lng];
          latlngs.push(pos);
          
          const icon = L.divIcon({
            html: `<div style="background: #0ea5e9; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; border: 2px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">${index + 1}</div>`,
            className: '',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          L.marker(pos, { icon })
            .bindPopup(`<b style="color:#020617">${item.name}</b><br/><small style="color:#64748b">${item.address}</small>`)
            .addTo(layerGroupRef.current);
        }
      });

      routeLineRef.current.setLatLngs(latlngs);

      if (latlngs.length > 0) {
        const bounds = L.latLngBounds(latlngs);
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }

    return () => {
      if (!isOpen && mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, items]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 flex items-center justify-center text-cyan-400">
              <i className="fas fa-map-marked-alt text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-black text-white">智慧行程規劃 & 路線圖</h2>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                已選擇 {items.length} 個景點 | 交通工具：{transportMode}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition w-10 h-10 rounded-full hover:bg-slate-800 flex items-center justify-center">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/3 border-r border-slate-800 flex flex-col">
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <i className="fas fa-route text-4xl text-slate-800 mb-4 block"></i>
                  <p className="text-slate-500 italic font-medium">尚未加入任何行程</p>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div key={item.id} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex justify-between items-center group relative animate-in slide-in-from-left duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-950 border border-cyan-500/50 flex items-center justify-center text-xs font-black text-cyan-400">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">{item.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                          <i className="fas fa-location-dot mr-1"></i>
                          {item.district} | {item.address}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="text-slate-600 hover:text-red-400 transition p-2"
                      title="移除景點"
                    >
                      <i className="far fa-trash-alt"></i>
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="p-6 border-t border-slate-800 bg-slate-900/50">
              <button 
                disabled={items.length === 0}
                className="w-full bg-white hover:bg-slate-200 text-slate-950 font-black py-4 rounded-2xl transition disabled:opacity-30 flex items-center justify-center gap-2 active:scale-95 shadow-xl"
                onClick={handleExport}
              >
                <i className="fas fa-file-download"></i>
                匯出旅程規劃 (TXT)
              </button>
            </div>
          </div>

          <div className="flex-1 relative bg-slate-950">
             <div ref={mapContainerRef} className="absolute inset-0 z-10" />
             {items.length > 0 && (
               <div className="absolute top-4 right-4 z-20 bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-700 shadow-2xl pointer-events-none">
                 <div className="flex flex-col gap-1 text-cyan-400 text-xs font-black">
                   <div className="flex items-center gap-2">
                    <i className="fas fa-clock"></i>
                    <span>預估總車程：{estimatedTotalTime} 分鐘</span>
                   </div>
                   <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">
                     (以{transportMode}移動為基準)
                   </div>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryModal;
