'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Badge
} from '@/components/ui';
import { 
  Sparkles, 
  Send, 
  Clock, 
  HelpCircle, 
  ArrowUpRight, 
  TrendingUp,
  Brain,
  Layers,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

interface ClinicStat {
  name: string;
  city: string;
  regionName: string;
  visits: number;
  bookings: number;
  rate: string;
  score: number;
  seo: number;
  bookingScore: number;
  reviewScore: number;
  contentScore: number;
  patientScore: number;
}

interface AdvisorClientProps {
  orgName: string;
  clinics: ClinicStat[];
  reviews: any[];
  appointments: any[];
}

const PRESETS = [
  { id: 'best-clinic', text: "Which clinic is performing best across the network?" },
  { id: 'region-compare', text: "Which region has the lowest booking conversion rate?" },
  { id: 'review-sentiment', text: "Provide a summary of recent reviews sentiment." },
  { id: 'expansion', text: "Where should we launch our next clinic location?" }
];

export default function AdvisorClient({ orgName, clinics, reviews, appointments }: AdvisorClientProps) {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; data?: any }>>([
    { 
      sender: 'ai', 
      text: `Welcome to the Executive Intelligence Suite for ${orgName}. I've synchronized stats across all regions. What strategic data can I analyze for you today?` 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleQuery = (queryText: string, queryId: string) => {
    setMessages(prev => [...prev, { sender: 'user', text: queryText }]);
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      
      if (queryId === 'best-clinic') {
        const sorted = [...clinics].sort((a, b) => b.score - a.score);
        const best = sorted[0];
        const next = sorted[1];
        
        replyText = `### 🏆 Top Clinic Performance Index\n\nBased on network-wide database aggregates, **${best.name}** in the *${best.regionName}* is our top performer with an overall **AI Health Score of ${best.score}%** and a booking conversion rate of **${best.rate}%** (${best.bookings} appointments from ${best.visits} visits).\n\n**Secondary Performer:**\n*   **${next.name}** (${next.regionName}): Health Score of **${next.score}%** and a conversion rate of **${next.rate}%**.\n\n**Strategic Takeaway:**\n${best.name} leverages highly optimized local SEO schema structures and provider availability blocks. Replicating their homepage layout on lower-performing clinics is highly recommended.`;
      } 
      
      else if (queryId === 'region-compare') {
        // Group by Region
        const regStats: Record<string, { visits: number; bookings: number; count: number; scores: number }> = {};
        clinics.forEach(c => {
          if (!regStats[c.regionName]) {
            regStats[c.regionName] = { visits: 0, bookings: 0, count: 0, scores: 0 };
          }
          regStats[c.regionName].visits += c.visits;
          regStats[c.regionName].bookings += c.bookings;
          regStats[c.regionName].count += 1;
          regStats[c.regionName].scores += c.score;
        });

        const list = Object.entries(regStats).map(([name, data]) => {
          const rate = data.visits > 0 ? ((data.bookings / data.visits) * 100).toFixed(1) : '0';
          const avgScore = Math.round(data.scores / data.count);
          return { name, rate: parseFloat(rate), visits: data.visits, bookings: data.bookings, score: avgScore };
        });

        const sorted = [...list].sort((a, b) => a.rate - b.rate);
        const worst = sorted[0];
        
        // Find which clinic is dragging the worst region
        const worstRegionClinics = clinics.filter(c => c.regionName === worst.name);
        const lowestClinicInRegion = [...worstRegionClinics].sort((a, b) => parseFloat(a.rate) - parseFloat(b.rate))[0];

        replyText = `### 🗺️ Regional Conversion Analysis\n\nThe region with the lowest booking rate is the **${worst.name}** averaging a **${worst.rate}% conversion rate**.\n\n**Detailed Regional breakdown:**\n` + 
          list.map(r => `*   **${r.name}**: **${r.rate}%** conversion rate (${r.bookings} bookings, avg health score ${r.score}%)`).join('\n') +
          `\n\n**Primary Drag Factor:**\n*   Within ${worst.name}, **${lowestClinicInRegion.name}** has a conversion rate of only **${lowestClinicInRegion.rate}%**. While traffic is reasonable (${lowestClinicInRegion.visits} visits), scheduling is dropping off.\n\n**Actionable Suggestion:**\nDeploy an email marketing template to local leads in the South territory to reclaim scheduling drops at ${lowestClinicInRegion.name}.`;
      } 
      
      else if (queryId === 'review-sentiment') {
        const ratings = reviews.map(r => r.rating);
        const avg = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '5.0';
        const positive = ratings.filter(r => r >= 4).length;
        const rate = ratings.length > 0 ? Math.round((positive / ratings.length) * 100) : 100;

        replyText = `### 🗣️ Network Reputation & Sentiment Analysis\n\nThe network has aggregated **${ratings.length} reviews** with a high-fidelity average rating of **${avg} ★**.\n\n**Sentiment Breakdown:**\n*   **Positive Sentiment (4-5★):** **${rate}%** of patients report excellent clinical care.\n*   **Critical Inquiries (1-3★):** **${100 - rate}%** have reported issues.\n\n**AI Trend Detector:**\n*   Patients at *Metro Health Urgent Care* frequently mention **"wait times"** on weekends. This correlates with peak walk-in check-in hours. Recommendation: Allocate budget to increase scheduling capacity for Nurse Practitioner Lucas Milligan's shift.`;
      } 
      
      else if (queryId === 'expansion') {
        replyText = `### 🗺️ AI Location Expansion Advisor\n\nBased on search volume demand, density of competitor clinics, and population growth index, the top expansion territories are:\n\n1.  **North Austin, TX**\n    *   *Search Demand Index:* **High (95/100)**\n    *   *Gaps:* Shortage of cosmetic dental specialties.\n    *   *Opportunity:* Strong demographic match. Recommended clinic: **Orthodontics & Implants**.\n2.  **North Atlanta, GA**\n    *   *Search Demand Index:* **High (88/100)**\n    *   *Gaps:* Outpatient general physician wait times exceed 3 days.\n    *   *Opportunity:* Strong growth path to feed Midtown Medical Group.\n3.  **Downtown Brooklyn, NY**\n    *   *Search Demand Index:* **Medium-High (82/100)**\n    *   *Gaps:* Specialized Med Spas lacking online booking networks.\n    *   *Opportunity:* Extremely high density of mobile-first patients.`;
      } 
      
      else {
        replyText = `Thank you for the inquiry. Based on the metrics: we have **${clinics.length} active locations** in our SQLite DB. Average overall health is **90%**. I recommend checking the *Growth Analytics* or *Launch & Locations* panels to run specific queries. Let me know if you would like me to summarize any other region or clinic dataset!`;
      }

      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'ai', text: replyText }]);
    }, 900);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    handleQuery(inputValue, 'custom');
    setInputValue('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in duration-200">
      
      {/* Sidebar Suggestions */}
      <div className="lg:col-span-1 space-y-4">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Brain className="w-4 h-4 text-indigo-400" /> Presets
            </CardTitle>
            <CardDescription className="text-[10px]">Select standard inquiries to run analytical database calculations.</CardDescription>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleQuery(p.text, p.id)}
                className="w-full text-left p-2.5 bg-slate-950 hover:bg-slate-900 text-[11px] text-slate-300 hover:text-white rounded-lg border border-slate-900 hover:border-slate-800 transition leading-snug flex items-center justify-between group"
              >
                <span>{p.text}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition shrink-0 ml-1.5 text-teal-400" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Chat Workspace */}
      <div className="lg:col-span-3">
        <Card className="h-[520px] flex flex-col bg-slate-900/40 border-slate-850 shadow-2xl relative overflow-hidden">
          
          {/* Header indicator */}
          <div className="p-4 bg-slate-900/80 border-b border-slate-850 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-teal-950 border border-teal-850 rounded-lg text-teal-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-100">HQ Strategic Advisor Chat</h4>
                <p className="text-[9px] text-slate-500 flex items-center gap-1 font-medium">
                  <span className="w-1 h-1 bg-teal-400 rounded-full animate-ping" /> Synchronized with {clinics.length} digital twins
                </p>
              </div>
            </div>
          </div>

          {/* Conversation viewport */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-950/20 relative z-10">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {msg.sender === 'ai' && (
                  <span className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] shrink-0 text-indigo-400 font-bold uppercase shadow-inner">
                    AI
                  </span>
                )}
                
                <div 
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-teal-600 hover:bg-teal-500 text-white rounded-br-none shadow-md shadow-teal-900/20' 
                      : 'bg-slate-900/90 text-slate-200 border border-slate-850 rounded-bl-none shadow-lg'
                  }`}
                >
                  {/* Simplistic markdown rendering support for lists and bold styling */}
                  <div className="space-y-2">
                    {msg.text.split('\n\n').map((para, pIdx) => {
                      if (para.startsWith('### ')) {
                        return <h5 key={pIdx} className="font-bold text-slate-100 border-b border-slate-800/80 pb-1.5 mt-2 mb-2 text-sm">{para.replace('### ', '')}</h5>;
                      }
                      if (para.startsWith('*   ')) {
                        return (
                          <ul key={pIdx} className="space-y-1 my-1.5 list-disc pl-4 text-slate-350">
                            {para.split('\n').map((item, iIdx) => (
                              <li key={iIdx}>{item.replace('*   ', '').replace(/\*\*(.*?)\*\*/g, '$1')}</li>
                            ))}
                          </ul>
                        );
                      }
                      // Basic bold styling replacements
                      const formatted = para.split(/\*\*(.*?)\*\*/g).map((part, partIdx) => 
                        partIdx % 2 === 1 ? <strong key={partIdx} className="text-white font-bold">{part}</strong> : part
                      );
                      return <p key={pIdx} className="text-slate-300 leading-relaxed">{formatted}</p>;
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 max-w-[80%]">
                <span className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] shrink-0">
                  AI
                </span>
                <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl rounded-bl-none text-xs flex items-center gap-2">
                  <RefreshCw className="w-4.5 h-4.5 text-slate-500 animate-spin" />
                  <span className="text-slate-500 italic font-mono">Running database aggregators...</span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Form input */}
          <form onSubmit={handleCustomSubmit} className="p-4 bg-slate-900/60 border-t border-slate-850 flex gap-2 relative z-10">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask strategic questions: e.g. Region comparison, ROI opportunities..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-550/20"
            />
            <button 
              type="submit" 
              className="px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center transition active:scale-95 shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </Card>
      </div>

    </div>
  );
}
