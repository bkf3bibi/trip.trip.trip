
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Attraction } from '../types';

interface Props {
  attraction: Attraction;
}

const GeminiTravelTip: React.FC<Props> = ({ attraction }) => {
  const [tip, setTip] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTip = async () => {
      if (!process.env.API_KEY) {
        setTip("AI 助手尚未配置。");
        return;
      }

      setLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `你是專業的旅遊規劃師。請根據以下景點資訊，提供一條 50 字以內的簡短、幽默且實用的旅遊建議。景點名稱：${attraction.name}，類別：${attraction.category}，介紹：${attraction.description}。`,
          config: {
            temperature: 0.7,
            maxOutputTokens: 200,
          },
        });
        setTip(response.text || "無法生成建議。");
      } catch (error) {
        console.error("Gemini Error:", error);
        setTip("目前無法聯繫 AI 助手...");
      } finally {
        setLoading(false);
      }
    };

    fetchTip();
  }, [attraction]);

  return (
    <div className="bg-indigo-950/30 rounded-2xl p-6 border border-indigo-500/30 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <i className="fas fa-robot text-6xl text-indigo-400"></i>
      </div>
      <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
        <i className="fas fa-sparkles"></i>
        SmartTrip AI 隨身建議
      </h3>
      {loading ? (
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-400 border-t-transparent"></div>
          <span className="text-slate-500 text-sm italic">AI 正在思考專屬你的攻略...</span>
        </div>
      ) : (
        <p className="text-slate-300 text-sm leading-relaxed italic">
          "{tip}"
        </p>
      )}
    </div>
  );
};

export default GeminiTravelTip;
