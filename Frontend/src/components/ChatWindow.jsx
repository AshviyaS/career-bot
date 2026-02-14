import React from 'react';

const ChatWindow = ({ messages, loading }) => {
  return (
    <div className="h-[450px] overflow-y-auto p-6 space-y-4 bg-white">
      {messages.map((m, i) => (
        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
            m.role === 'user' 
            ? 'bg-slate-800 text-white rounded-tr-none' 
            : 'bg-slate-100 text-slate-800 rounded-tl-none'
          }`}>
            {m.text}
          </div>
        </div>
      ))}
      {loading && (
        <div className="flex justify-start">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs animate-pulse">
            Mentor is writing...
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;