
import React, { useState } from 'react';
import { Attraction, Category } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (attr: Attraction) => void;
}

const AddAttractionModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    district: '',
    category: Category.SCENIC,
    description: '',
    suggestedDuration: '1-2 小時',
    address: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAttr: Attraction = {
      ...formData,
      id: Date.now().toString(),
      rating: 5.0,
      popularity: 50,
      // Default sample coordinates for manual entries to show on map
      lat: 25.033,
      lng: 121.565
    };
    onAdd(newAttr);
    onClose();
    setFormData({
      name: '',
      region: '',
      district: '',
      category: Category.SCENIC,
      description: '',
      suggestedDuration: '1-2 小時',
      address: ''
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-black text-white">新增自定義旅行景點</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 font-bold mb-1 uppercase tracking-widest">景點名稱</label>
              <input 
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-cyan-500 transition" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 font-bold mb-1 uppercase tracking-widest">縣市</label>
              <input 
                required
                placeholder="例如：台北"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-cyan-500 transition" 
                value={formData.region}
                onChange={e => setFormData({...formData, region: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 font-bold mb-1 uppercase tracking-widest">行政區</label>
              <input 
                required
                placeholder="例如：信義區"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-cyan-500 transition" 
                value={formData.district}
                onChange={e => setFormData({...formData, district: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 font-bold mb-1 uppercase tracking-widest">類型</label>
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm outline-none cursor-pointer" 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as Category})}
              >
                {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 font-bold mb-1 uppercase tracking-widest">詳細地址</label>
            <input 
              required
              placeholder="完整地址資訊"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-cyan-500 transition" 
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 font-bold mb-1 uppercase tracking-widest">詳細介紹</label>
            <textarea 
              required
              rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-cyan-500 transition resize-none" 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-xl transition shadow-xl shadow-cyan-900/20 active:scale-95">
            確認新增景點
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAttractionModal;
