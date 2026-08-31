import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Check, BookOpen, Volume2, Sparkles, Loader } from 'lucide-react';
import "./DashboardDesign.css";

const ParagraphReader = () => {
  const navigate = useNavigate();
  const [paragraphs, setParagraphs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch paragraphs from API
  useEffect(() => {
    const fetchParagraphs = async () => {
      try {
        const response = await fetch('https://localhost:7106/api/Paragraph_Reader');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setParagraphs(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load paragraphs.');
        setLoading(false);
      }
    };

    fetchParagraphs();
  }, []);

  const handleRead = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleSelect = (text) => {
    localStorage.setItem('selectedParagraph', text);
    navigate('/paragraph-listener');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* Ambient Lighting Orbs */}
      <div className="ambient-glow-1 -top-20 -left-20 animate-pulse" />
      <div className="ambient-glow-2 -bottom-20 -right-20 animate-pulse" />

      {/* Glass Workstation Panel */}
      <div className="w-full max-w-5xl glass-panel-3d p-6 sm:p-8 lg:p-10 relative z-10 flex flex-col min-h-[640px] max-h-[85vh]">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/10 gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-3d-glass px-4 py-2 flex items-center text-xs font-semibold uppercase tracking-wider text-sky-400 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20 border border-white/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Paragraph Reader</h1>
              <p className="text-xs text-slate-400">Listen & Select Paragraphs for Practice</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 space-y-3">
              <Loader className="w-8 h-8 text-sky-400 animate-spin" />
              <p className="text-sm font-medium">Fetching paragraph list...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {paragraphs.map((paragraph, index) => (
                <div
                  key={paragraph.paragraph_ReadID || index}
                  className="glass-card-3d p-5 flex flex-col justify-between hover:border-sky-500/40 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[11px] font-mono text-sky-400 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20">
                      ID #{paragraph.paragraph_ReadID}
                    </span>
                    <Volume2 className="w-5 h-5 text-slate-400" />
                  </div>

                  <p className="text-slate-200 text-sm leading-relaxed mb-5 font-sans bg-slate-950/40 p-4 rounded-xl border border-white/5 shadow-inner">
                    {paragraph.paragraphs}
                  </p>

                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      onClick={() => handleRead(paragraph.paragraphs)}
                      className="btn-3d-cyan px-4 py-2.5 text-xs flex items-center space-x-2 font-semibold shadow-md"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Listen Audio</span>
                    </button>

                    <button
                      onClick={() => handleSelect(paragraph.paragraphs)}
                      className="btn-3d-glass px-4 py-2.5 text-xs flex items-center space-x-2 font-semibold border-sky-500/30 hover:border-sky-400 text-sky-300 hover:text-white"
                    >
                      <Check className="w-4 h-4" />
                      <span>Select for Speaking</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ParagraphReader;
