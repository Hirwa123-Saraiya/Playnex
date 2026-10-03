import React, { useState } from 'react';
import { useFinanceStore } from '../../store/FinanceStore';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Lightbulb, 
  ArrowRight, 
  ShieldCheck, 
  BrainCircuit,
  Bot,
  Zap,
  Activity
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const FinanceAIInsights: React.FC = () => {
  const { aiInsights } = useFinanceStore();
  const [promptQuery, setPromptQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'ai' | 'user'; text: string; time: string }>>([
    {
      role: 'ai',
      text: 'Hello, CFO! I have analyzed October 2025 financials across your 3 branches. Bar & Kitchen margins reached a record 54%, while Court Booking utility consumption spiked 18% during evening floodlight hours. How can I assist you with predictive planning today?',
      time: '10:45 AM'
    }
  ]);

  const forecastData = [
    { month: 'Jun', actual: 24.5, projected: 24.5 },
    { month: 'Jul', actual: 25.8, projected: 25.8 },
    { month: 'Aug', actual: 26.2, projected: 26.2 },
    { month: 'Sep', actual: 27.1, projected: 27.1 },
    { month: 'Oct (Current)', actual: 28.45, projected: 28.45 },
    { month: 'Nov (AI)', actual: null, projected: 30.2 },
    { month: 'Dec (AI)', actual: null, projected: 33.8 },
    { month: 'Jan (AI)', actual: null, projected: 35.5 },
  ];

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptQuery.trim()) return;

    const userText = promptQuery;
    setMessages(prev => [...prev, { role: 'user', text: userText, time: 'Just now' }]);
    setPromptQuery('');

    setTimeout(() => {
      let reply = "Based on our econometric regression model, winter membership signups will increase recurring cash inflows by ₹4.8 Lakhs in November. We recommend keeping vendor payables at 30-day terms to optimize working capital.";
      if (userText.toLowerCase().includes('court') || userText.toLowerCase().includes('booking')) {
        reply = "Court bookings have 88% weekend peak utilization. Adjusting prime-time slot pricing by 15% between 6 PM - 9 PM could yield an additional ₹1.2 Lakhs monthly without reducing player satisfaction.";
      } else if (userText.toLowerCase().includes('gst') || userText.toLowerCase().includes('tax')) {
        reply = "Your October ITC (Input Tax Credit) offset is ₹86,400 against ₹2,08,700 output GST, leaving ₹1,22,300 payable by 20 Nov 2025. All GSTR-2B inward items match 100%.";
      }
      setMessages(prev => [...prev, { role: 'ai', text: reply, time: 'Just now' }]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl backdrop-blur-xs">
                <BrainCircuit className="w-5 h-5 text-indigo-300" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Playnex Neural Copilot</span>
            </div>
            <h1 className="text-2xl font-bold mt-2">Autonomous Financial Intelligence & Forecasting</h1>
            <p className="text-xs text-indigo-200/80 mt-1 max-w-xl">
              Continuous machine learning models trained on club transactions, seasonal sports churn, vendor variance, and cash flow liquidity
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-[11px] text-indigo-200">Financial Health Score</div>
              <div className="text-xl font-black text-emerald-400">94 / 100</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Forecast Chart + AI Chat Agent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forecast Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Q4 Revenue Predictive Modeling</h3>
              <p className="text-xs text-slate-500 mt-0.5">Historical monthly actuals vs AI forecasted trendline (in ₹ Lakhs)</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 96.8% Confidence
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}L`} />
                <Tooltip 
                  formatter={(val: any) => [`₹${val} Lakhs`, 'Revenue']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="projected" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProjected)" name="Projected / Actual" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 font-medium">November Forecast</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">₹30.2 Lakhs</p>
              <span className="text-[11px] text-emerald-600 font-semibold">+6.1% vs Oct</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 font-medium">December (Holiday Peak)</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">₹33.8 Lakhs</p>
              <span className="text-[11px] text-emerald-600 font-semibold">+18.8% vs Oct</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 font-medium">Predicted Cash Runway</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">14.2 Months</p>
              <span className="text-[11px] text-indigo-600 font-semibold">Zero Liquidity Stress</span>
            </div>
          </div>
        </div>

        {/* Neural Financial Assistant Panel */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col h-[420px]">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-bold text-slate-900 text-sm">ERP Financial Advisor</h3>
            </div>
            <span className="text-[11px] text-slate-400">GPT-4o Finance Fine-tuned</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60'
                }`}>
                  <p>{m.text}</p>
                  <span className={`block text-[10px] mt-1 ${m.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAsk} className="p-3 border-t border-slate-100 flex items-center gap-2">
            <input 
              type="text" 
              value={promptQuery}
              onChange={(e) => setPromptQuery(e.target.value)}
              placeholder="Ask: 'How can we increase court revenue?'"
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              type="submit"
              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Anomaly Detection & Strategic Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {aiInsights.map((insight) => {
          const type = insight.type || (insight.impact === 'Positive' ? 'opportunity' : insight.impact === 'Warning' ? 'anomaly' : 'forecast');
          const confidence = insight.confidence ?? insight.confidenceScore ?? 90;
          const recommendation = insight.recommendation || insight.description;

          return (
            <div key={insight.id} className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:border-slate-300 transition space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  type === 'anomaly' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                  type === 'opportunity' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {type}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  Impact: <strong className="text-slate-700">{insight.impact.toUpperCase()}</strong>
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{insight.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{insight.description}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  AI Recommendation:
                </div>
                <p className="text-slate-600 mt-1">{recommendation}</p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Confidence: {confidence}%</span>
                <button className="font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                  Execute Action <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
