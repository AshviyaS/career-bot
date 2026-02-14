import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input && !file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("message", input);
    if (file) formData.append("file", file);

    const userMsg = { role: 'user', text: input || "Uploaded a document" };
    setMessages(prev => [...prev, userMsg]);
    
    try {
      const res = await fetch("http://localhost:8000/chat", { 
        method: "POST", 
        body: formData 
      });
      
      if (!res.ok) throw new Error("Server error");
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Error: Cannot connect to AI core. Please check your connection." }]);
    } finally {
      setInput("");
      setFile(null);
      setLoading(false);
    }
  };

  // --- WELCOME PAGE COMPONENT ---
  if (!started) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]"></div>

        {/* Header Logo */}
        <div className="absolute top-8 left-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-lg rotate-12 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="font-black text-white">CB</span>
          </div>
          <h1 className="text-xl font-bold tracking-[0.2em] uppercase text-gray-200">Career Bot</h1>
        </div>

        {/* Hero Section */}
        <div className="max-w-3xl text-center z-10">
          <h2 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tighter leading-tight bg-gradient-to-b from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
            Your Future, <br/>Architected by AI.
          </h2>
          <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-xl mx-auto italic font-light">
            "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle." 
            <span className="block mt-2 not-italic font-bold text-gray-500">— Steve Jobs</span>
          </p>

          <button 
            onClick={() => setStarted(true)}
            className="group relative px-10 py-5 bg-white text-black font-black rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-4 mx-auto shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            START A CHAT
            <span className="text-xl group-hover:translate-x-2 transition-transform">→</span>
          </button>
        </div>

        {/* Portal Ring Decorative */}
        <div className="absolute bottom-[-15%] border-[1px] border-white/5 rounded-full w-[800px] h-[800px] pointer-events-none"></div>
      </div>
    );
  }

  // --- CHAT PAGE COMPONENT ---
  return (
    <div className="h-screen bg-[#0c0c0c] flex flex-col text-white font-sans">
      {/* Mini Top Bar */}
      <div className="p-4 border-b border-white/5 flex justify-between items-center backdrop-blur-md bg-black/20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-sm"></div>
          <span className="text-sm font-bold tracking-widest uppercase">Career Bot Core</span>
        </div>
        <button onClick={() => setStarted(false)} className="text-xs text-gray-500 hover:text-white transition-colors">Exit Session</button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
            <p className="text-2xl font-light">How can I guide your career today?</p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`p-5 rounded-3xl max-w-[85%] md:max-w-[70%] text-[15px] leading-relaxed transition-all shadow-xl ${
              m.role === 'user' 
                ? 'bg-[#1a1a1a] text-white border border-white/10 rounded-tr-none' 
                : 'bg-white/5 border border-white/5 text-gray-200 rounded-tl-none backdrop-blur-sm'
            }`}>
              <ReactMarkdown>{m.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white/5 p-4 rounded-2xl animate-pulse text-xs text-purple-400">
               Mentors analysis in progress...
             </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-[#0c0c0c] border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-4 bg-[#161616] p-4 rounded-3xl border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4 px-2">
              <label className="cursor-pointer hover:opacity-70 transition-opacity">
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                />
                <div className="p-2 bg-white/5 rounded-full">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </div>
              </label>
              <input 
                className="flex-1 bg-transparent focus:outline-none text-gray-200 placeholder-gray-600 text-[15px]"
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Career Bot..."
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend} 
                disabled={loading || (!input && !file)}
                className="bg-white text-black p-3 rounded-2xl hover:bg-gray-200 disabled:opacity-20 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
            {file && (
              <div className="px-2 pb-1 flex items-center gap-2">
                <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-1 rounded-md border border-purple-500/30 font-mono">
                  RESUME: {file.name}
                </span>
              </div>
            )}
          </div>
          <p className="text-[10px] text-center text-gray-600 mt-4 tracking-widest uppercase">Powered by Gemini 2.0 Flash</p>
        </div>
      </div>
    </div>
  );
}