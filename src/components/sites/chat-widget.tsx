'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createLead } from '@/app/actions';
import { MessageSquare, X, Send, Sparkles, RefreshCw, User } from 'lucide-react';

interface ChatWidgetProps {
  clinicName: string;
  clinicPhone: string;
  clinicEmail: string;
  hours: string;
  services: string[];
  providers: string[];
  locationId: string;
}

export default function ChatWidget({
  clinicName,
  clinicPhone,
  clinicEmail,
  hours,
  services,
  providers,
  locationId
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    { sender: 'ai', text: `Hello! I'm your AI Clinic Assistant for ${clinicName}. How can I help you today? I can answer questions about our services, providers, hours, or insurance!` }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [leadCollected, setLeadCollected] = useState(false);
  const [leadStep, setLeadStep] = useState(0); // 0: None, 1: Name, 2: Email, 3: Completed
  const [tempLeadName, setTempLeadName] = useState('');
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputValue('');
    setIsTyping(true);

    // AI logic response timeout simulation
    setTimeout(async () => {
      let replyText = '';
      const text = userText.toLowerCase();

      // Trigger Lead generation info gathering if they ask for appointment/costs
      if ((text.includes('book') || text.includes('appointment') || text.includes('schedule') || text.includes('consult')) && !leadCollected && leadStep === 0) {
        replyText = "I can help you get scheduled! First, could you tell me your full name so I can set up your client portal inquiry?";
        setLeadStep(1);
        setIsTyping(false);
        setMessages(prev => [...prev, { sender: 'ai', text: replyText }]);
        return;
      }

      // If lead collection is in progress
      if (leadStep === 1) {
        setTempLeadName(userText);
        replyText = `Thanks ${userText}! What is your email address so we can coordinate your request?`;
        setLeadStep(2);
        setIsTyping(false);
        setMessages(prev => [...prev, { sender: 'ai', text: replyText }]);
        return;
      }

      if (leadStep === 2) {
        setLeadStep(3);
        setLeadCollected(true);
        replyText = `Perfect. I've recorded your inquiry, and our coordinator will follow up at ${userText}. In the meantime, you can schedule a slot instantly using our 'Book Appointment' button in the top menu!`;
        
        // Save lead in CRM database via server action!
        try {
          await createLead({
            name: tempLeadName,
            email: userText,
            phone: clinicPhone,
            status: 'LEAD',
            source: 'CHAT',
            notes: `Chat inquiry logged from AI Chatbot for ${clinicName}. Patient requested appointment details.`,
            locationId
          });
        } catch (err) {
          console.error("CRM action error:", err);
        }

        setIsTyping(false);
        setMessages(prev => [...prev, { sender: 'ai', text: replyText }]);
        return;
      }

      // Keyword queries matching
      if (text.includes('service') || text.includes('treat') || text.includes('offer')) {
        replyText = `At ${clinicName}, we offer professional services including: ${services.join(', ')}. Would you like to check the details or book one of these?`;
      } else if (text.includes('doctor') || text.includes('provider') || text.includes('dentist') || text.includes('staff') || text.includes('specialist')) {
        replyText = `Our medical team consists of: ${providers.join('; ')}. They are highly specialized and dedicated to patient success.`;
      } else if (text.includes('hour') || text.includes('open') || text.includes('close') || text.includes('time') || text.includes('saturday')) {
        replyText = `Our hours are: ${hours}. We advise scheduling online to confirm availability.`;
      } else if (text.includes('insurance') || text.includes('aetna') || text.includes('pay') || text.includes('cost') || text.includes('blue cross')) {
        replyText = "We accept Aetna, Blue Cross Blue Shield, UnitedHealthcare, Cigna, and major health insurance policies. We also offer flexible self-pay pricing models. We can verify your insurance coverage when you arrive or book!";
      } else if (text.includes('location') || text.includes('address') || text.includes('where') || text.includes('find')) {
        replyText = `We are located at our central clinic: ${clinicName}. You can find local maps and directions on our contact info segment at the footer.`;
      } else {
        replyText = `Thank you for asking! For specific medical concerns or to request treatments, we recommend scheduling a direct consultation with one of our specialists. You can also contact our front desk at ${clinicPhone}.`;
      }

      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'ai', text: replyText }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Toggle button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition cursor-pointer relative"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-indigo-500 rounded-full border-2 border-slate-950 animate-pulse" />
        </button>
      )}

      {/* Chat Dialog */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[450px] animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-brand-secondary border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-brand-primary rounded-lg text-white">
                <Sparkles className="w-4 h-4 text-emerald-300" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-100">{clinicName} AI</h4>
                <p className="text-[9px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Online Assistant
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition p-1 hover:bg-slate-850 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-2 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {msg.sender === 'ai' && (
                  <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] shrink-0 text-indigo-400 font-bold uppercase">
                    AI
                  </span>
                )}
                <div 
                  className={`p-3 rounded-xl text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-brand-primary text-white rounded-br-none' 
                      : 'bg-slate-850 text-slate-200 border border-slate-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-2 max-w-[80%]">
                <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] shrink-0">
                  AI
                </span>
                <div className="p-3 bg-slate-850 border border-slate-800 rounded-xl rounded-bl-none text-xs flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500 animate-spin" />
                  <span className="text-slate-500 italic">Thinking...</span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Form input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={leadStep > 0 ? "Type response here..." : "Ask about doctors, hours, pricing..."}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-primary"
            />
            <button 
              type="submit" 
              className="p-2 rounded-xl bg-brand-primary text-white hover:brightness-110 active:scale-95 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
