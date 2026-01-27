import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, DiagramData, SearchResult } from '../types';
import { searchAndAssist } from '../services/geminiService';
import { Send, Bot, Loader2, GripVertical, Search } from 'lucide-react';

interface Props {
  currentDiagram: DiagramData;
  onUpdateDiagram: (diagram: DiagramData) => void;
}

export const AIChat: React.FC<Props> = ({ currentDiagram, onUpdateDiagram }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setInput('');

    try {
      // Pass the *entire* conversation history context if we wanted, 
      // but for this MVP we focus on single turn instruction with current diagram state
      const result = await searchAndAssist(userMsg.text, currentDiagram, messages);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: result.text,
        searchResults: result.searchResults
      };

      setMessages(prev => [...prev, aiMsg]);
      
      if (result.updatedDiagram) {
        onUpdateDiagram(result.updatedDiagram);
      }
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Error communicating with AI", isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, result: SearchResult) => {
    e.dataTransfer.setData('searchUrl', result.uri);
    e.dataTransfer.setData('searchTitle', result.title);
  };

  return (
    <div 
        className="flex flex-col h-full border-l border-zinc-700/50"
        style={{ background: 'rgba(17, 24, 39, 0.9)', backdropFilter: 'blur(10px)' }}
    >
       <div className="p-4 border-b border-zinc-700/50 flex items-center gap-2 text-cyan-400 font-semibold font-['Orbitron']">
         <Bot size={20} />
         <span>ARK AI ASSISTANT</span>
       </div>

       <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="text-zinc-500 text-center text-sm mt-10">
              <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto mb-3">
                  <Bot size={24} className="opacity-50" />
              </div>
              <p>Ask me to generate shapes, optimize flows, or analyze code context.</p>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div 
                className={`max-w-[90%] p-3 rounded-xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600/20 text-blue-100 border border-blue-500/30 rounded-tr-none' 
                    : 'bg-zinc-800/80 text-zinc-300 border border-zinc-700 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
              
              {/* Search Results Display */}
              {msg.searchResults && msg.searchResults.length > 0 && (
                <div className="mt-2 w-[90%] space-y-1">
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Search size={10} /> Web Results (Drag to diagram)
                  </div>
                  {msg.searchResults.map((result, idx) => (
                    <div 
                      key={idx}
                      draggable
                      onDragStart={(e) => handleDragStart(e, result)}
                      className="bg-black/40 p-2 rounded border border-zinc-700/50 cursor-grab hover:border-cyan-500/50 flex items-center gap-2 group transition-all"
                    >
                      <GripVertical size={14} className="text-zinc-600 group-hover:text-cyan-500" />
                      <div className="overflow-hidden">
                        <div className="text-xs text-cyan-400 font-medium truncate">{result.title}</div>
                        <div className="text-[10px] text-zinc-500 truncate">{result.uri}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && (
             <div className="flex items-center gap-2 text-zinc-500 text-xs pl-2">
               <Loader2 className="animate-spin text-cyan-400" size={14} /> Processing Request...
             </div>
          )}
       </div>

       <div className="p-4 border-t border-zinc-700/50 bg-[#0f1729]/50">
         <div className="flex gap-2 relative">
           <input 
             type="text"
             className="w-full bg-[#111827] border border-zinc-700 rounded-lg pl-3 pr-10 py-2.5 text-sm text-zinc-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder-zinc-600"
             placeholder="Message Ark AI..."
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && handleSend()}
           />
           <button 
             onClick={handleSend}
             disabled={loading}
             className="absolute right-1.5 top-1.5 p-1.5 bg-cyan-600/80 text-white rounded-md hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
           >
             <Send size={14} />
           </button>
         </div>
       </div>
    </div>
  );
};