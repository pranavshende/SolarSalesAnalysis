import React from 'react';
import { 
  Database, 
  BrainCircuit, 
  Layers, 
  Map, 
  Server, 
  Zap, 
  Code,
  Globe2,
  Cpu,
  BarChart4,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

const ProjectOverview = () => {
  return (
    <div className="relative min-h-screen space-y-12 animate-in fade-in duration-700 pb-20 overflow-hidden">
      
      {/* Background Decorative Blurs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-solar/20 rounded-full blur-[150px] pointer-events-none z-0 animate-pulse duration-[10000ms]"></div>
      <div className="fixed bottom-[10%] right-[-10%] w-[30%] h-[40%] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none z-0 animate-pulse duration-[12000ms]"></div>
      <div className="fixed top-[40%] left-[30%] w-[20%] h-[20%] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <div className="relative z-10 pt-4">
        <h1 className="text-5xl md:text-6xl font-display font-black bg-gradient-to-r from-solar via-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4 drop-shadow-sm leading-tight max-w-6xl">
          Development of Smart Predictive Analytics and Decision Support Platform for Solar Sales Growth
        </h1>
        <p className="text-2xl text-dark-300 font-medium">Graphical representation of the presentation guide</p>
      </div>

      {/* Hero / Problem & Solution */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-dark-900/60 backdrop-blur-2xl border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group hover:border-solar/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(249,115,22,0.1)]">
           <div className="absolute -top-10 -right-10 p-8 opacity-10 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 pointer-events-none">
              <Globe2 className="w-64 h-64 text-solar" />
           </div>
           <h2 className="text-3xl font-display font-bold text-white mb-6 relative z-10">The Problem</h2>
           <p className="text-xl text-dark-300 leading-relaxed relative z-10 mb-10">
             Currently, data regarding India's solar capacity, state-wise installations, and revenue generation is highly fragmented. Government agencies publish static PDFs or raw Excel sheets, making it incredibly difficult for manufacturers, investors, and policymakers to track trends or forecast future demand.
           </p>
           <h2 className="text-3xl font-display font-bold text-white mb-6 relative z-10">The Solution</h2>
           <p className="text-xl text-dark-300 leading-relaxed relative z-10">
             We built an integrated, AI-driven web platform that acts as a centralized <span className="bg-solar/20 text-solar px-2 py-1 rounded-md border border-solar/30 font-bold mx-1">'Single Source of Truth'</span>. It processes historical data, visualizes it interactively, and predicts future hardware requirements using Machine Learning.
           </p>
        </div>

        <div className="bg-dark-900/60 backdrop-blur-2xl border border-white/5 p-10 rounded-[2.5rem] shadow-2xl hover:border-solar/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(249,115,22,0.1)] relative z-10">
           <h2 className="text-3xl font-display font-bold text-white mb-8 flex items-center gap-4">
             <div className="bg-solar/20 p-3 rounded-2xl border border-solar/30">
               <Database className="w-8 h-8 text-solar" />
             </div>
             Dataset Architecture
           </h2>
           
           <div className="space-y-6 mb-8">
             <div className="bg-dark-950/80 border border-white/5 p-6 rounded-[2rem] hover:bg-dark-800/80 transition-colors">
               <div className="flex justify-between items-start mb-3">
                 <div>
                   <p className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-2">State-Wise Macro Data</p>
                   <p className="text-xl font-bold text-white">"Year & state Wise Data.xlsx" (13 KB)</p>
                 </div>
                 <span className="px-4 py-2 bg-blue-500/10 text-blue-400 text-sm font-black rounded-xl uppercase border border-blue-500/20">360+ Records</span>
               </div>
               <p className="text-lg text-dark-400 leading-relaxed">Tracks aggregate capacity and investment over 10 years (2014-2024) across all 36 Indian States and Union Territories.</p>
             </div>

             <div className="bg-dark-950/80 border border-white/5 p-6 rounded-[2rem] hover:bg-dark-800/80 transition-colors">
               <div className="flex justify-between items-start mb-3">
                 <div>
                   <p className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-2">City-Wise Micro Data</p>
                   <p className="text-xl font-bold text-white">"city_wise_solar_2014_2024.csv" (2.6 KB)</p>
                 </div>
                 <span className="px-4 py-2 bg-purple-500/10 text-purple-400 text-sm font-black rounded-xl uppercase border border-purple-500/20">Hyper-Local</span>
               </div>
               <p className="text-lg text-dark-400 leading-relaxed">Tracks concentrated mega-projects and solar parks (e.g., Bhadla, Pavagada, Rewa) to identify regional momentum spikes.</p>
             </div>
           </div>

           <div className="bg-gradient-to-r from-solar/20 to-orange-500/10 border border-solar/30 p-8 rounded-[2rem] flex items-center gap-6 relative overflow-hidden">
             <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-solar/20 to-transparent pointer-events-none"></div>
             <BarChart4 className="w-12 h-12 text-solar shrink-0 relative z-10" />
             <div className="relative z-10">
               <p className="text-4xl font-display font-black text-white leading-none mb-2">500+ <span className="text-solar">Total Data Points</span></p>
               <p className="text-base text-dark-300">Mathematically normalized to prevent state-city double counting.</p>
             </div>
           </div>
        </div>
      </div>

      {/* Problem Definition Section */}
      <div className="relative z-10 bg-dark-900/60 backdrop-blur-2xl border border-white/5 p-12 rounded-[3rem] shadow-2xl overflow-hidden group hover:border-red-500/20 transition-all duration-700">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-10 transition-opacity pointer-events-none">
          <AlertCircle className="w-96 h-96 text-red-500" />
        </div>

        <div className="text-center mb-16 relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6">
            3. Problem Definition
          </h2>
          <div className="max-w-4xl mx-auto p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <p className="text-xl md:text-2xl text-dark-200 leading-relaxed">
              India's solar market is growing rapidly but <span className="text-white font-bold">demand is uneven</span>, <span className="text-white font-bold">revenue is concentrated</span> in a few states, and <span className="text-white font-bold">future sales targets lack data-backed direction</span> — making it difficult for solar companies to make informed investment and expansion decisions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {[
            {
              title: "Problem 1 — Uneven Demand Distribution (No Visibility)",
              desc: "Solar demand is not uniform across India, but without structured analysis, this is invisible to decision-makers.",
              example: "Rajasthan holds 26.09% of India's total solar capacity while Nagaland holds only 0.004%. A solar company entering the market without this data would waste resources targeting low-demand states or miss high-demand ones entirely."
            },
            {
              title: "Problem 2 — No Clear Revenue Benchmark",
              desc: "There is no standardised way for companies to estimate how much revenue a state or region can generate from solar sales.",
              example: "Without a revenue model, it would be unknown that Rajasthan alone generated ₹67,951 Cr cumulatively while Jharkhand generated only ₹479 Cr over the same 10 years — a 141x difference — which completely changes sales planning priorities."
            },
            {
              title: "Problem 3 — Market Cycles Are Ignored in Forecasts",
              desc: "Solar demand does not grow in a straight line, yet most basic forecasts treat it as linear.",
              example: "Annual additions fell from 95.6 lakh kW (2018) to 56.3 lakh kW (2021) — a 41% drop — due to COVID-19 and policy gaps. Any forecast that ignores this cycle would overestimate demand and lead to poor inventory and sales planning decisions."
            },
            {
              title: "Problem 4 — Growth Potential in Smaller States Is Overlooked",
              desc: "High-growth emerging states are often ignored because their absolute numbers appear small.",
              example: "Pondicherry has only 49,910 kW installed — which looks insignificant — but with an 88.1% CAGR, it is growing faster than any state in India. Without CAGR analysis, this opportunity would be completely missed by a sales team that only looks at current capacity."
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-dark-950/80 border border-white/5 p-8 rounded-[2.5rem] hover:bg-dark-800/80 transition-all group/item hover:border-red-500/30">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-red-500/20 p-2 rounded-full mt-1 shrink-0">
                  <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                </div>
                <h3 className="text-xl font-bold text-white group-hover/item:text-red-400 transition-colors">{item.title}</h3>
              </div>
              <p className="text-lg text-dark-300 leading-relaxed mb-6 pl-11">
                {item.desc}
              </p>
              <div className="bg-dark-900/50 p-6 rounded-2xl border border-white/5 ml-11">
                <p className="text-sm font-black text-red-400 uppercase tracking-widest mb-2">Real-World Case</p>
                <p className="text-base text-dark-400 leading-relaxed italic">
                  {item.example}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-red-500/10 to-transparent border-l-4 border-red-500 rounded-r-2xl relative z-10">
          <p className="text-xl text-dark-200 leading-relaxed italic">
            The core problem is the <span className="text-white font-bold underline decoration-red-500 underline-offset-4">absence of a structured, data-driven solar sales intelligence system</span> that connects raw installation data to actionable <span className="text-red-400 font-bold">insights on demand, revenue, growth cycles, and future forecasting</span> — which this project directly addresses.
          </p>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="relative z-10 bg-dark-900/60 backdrop-blur-2xl border border-white/5 p-12 rounded-[3rem] shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-solar to-transparent opacity-50"></div>
        <h2 className="text-4xl font-display font-bold text-white mb-12 text-center">System Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
           <div className="flex flex-col items-center text-center p-8 bg-dark-950/80 border border-white/5 rounded-[2.5rem] hover:-translate-y-2 hover:border-cyan-400/50 hover:shadow-[0_10px_40px_rgba(34,211,238,0.15)] transition-all duration-300 group">
              <div className="bg-cyan-400/10 p-5 rounded-3xl mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-12 h-12 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">Frontend</h3>
              <p className="text-base text-dark-400 leading-relaxed">React.js, Tailwind CSS, Recharts for responsive, modern UI components.</p>
           </div>
           <div className="flex flex-col items-center text-center p-8 bg-dark-950/80 border border-white/5 rounded-[2.5rem] hover:-translate-y-2 hover:border-green-400/50 hover:shadow-[0_10px_40px_rgba(74,222,128,0.15)] transition-all duration-300 group">
              <div className="bg-green-400/10 p-5 rounded-3xl mb-6 group-hover:scale-110 transition-transform">
                <Server className="w-12 h-12 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">Backend API</h3>
              <p className="text-base text-dark-400 leading-relaxed">Node.js & Express.js orchestrating data logic and external microservices.</p>
           </div>
           <div className="flex flex-col items-center text-center p-8 bg-dark-950/80 border border-white/5 rounded-[2.5rem] hover:-translate-y-2 hover:border-blue-500/50 hover:shadow-[0_10px_40px_rgba(59,130,246,0.15)] transition-all duration-300 group">
              <div className="bg-blue-500/10 p-5 rounded-3xl mb-6 group-hover:scale-110 transition-transform">
                <Database className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-500 transition-colors">Database</h3>
              <p className="text-base text-dark-400 leading-relaxed">MongoDB Atlas storing user profiles, cached metrics, and session data.</p>
           </div>
           <div className="flex flex-col items-center text-center p-8 bg-dark-950/80 border border-white/5 rounded-[2.5rem] hover:-translate-y-2 hover:border-purple-400/50 hover:shadow-[0_10px_40px_rgba(192,132,252,0.15)] transition-all duration-300 group">
              <div className="bg-purple-400/10 p-5 rounded-3xl mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">AI / ML Layer</h3>
              <p className="text-base text-dark-400 leading-relaxed">Python FastAPI + Scikit-Learn executing polynomial forecasting models.</p>
           </div>
        </div>

        {/* Visual Architecture Flow */}
        <div className="relative p-12 bg-dark-950/50 border border-white/5 rounded-[3rem] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-solar/5 to-blue-500/5 pointer-events-none"></div>
          <h3 className="text-2xl font-display font-bold text-white mb-32 text-center opacity-70 tracking-wide">System Connectivity & Data Pipeline</h3>
          
          <div className="relative max-w-5xl mx-auto py-10 px-4">
            {/* Desktop Diagram */}
            <div className="hidden md:flex items-center justify-between relative z-10">
              
              {/* 1. Client App */}
              <div className="flex flex-col items-center group">
                <div className="w-24 h-24 bg-dark-900 border-2 border-cyan-400/30 rounded-2xl flex items-center justify-center mb-4 group-hover:border-cyan-400 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all duration-500">
                  <Layers className="w-12 h-12 text-cyan-400" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white leading-tight">Client App</p>
                  <p className="text-xs text-dark-400 font-mono">React / Vite</p>
                </div>
              </div>

              {/* Arrow 1 */}
              <div className="flex-1 px-8 flex flex-col items-center justify-center">
                <div className="h-px w-full bg-gradient-to-r from-cyan-400 to-green-400 relative">
                  <div className="absolute right-0 -top-1 border-y-4 border-y-transparent border-l-8 border-l-green-400"></div>
                </div>
                <span className="text-[10px] text-dark-400 font-mono mt-2 uppercase tracking-tighter">REST API / JWT</span>
              </div>

              {/* 2. API Gateway with Database */}
              <div className="flex flex-col items-center group relative">
                {/* Database (Absolute Top) */}
                <div className="absolute bottom-[calc(100%+1rem)] left-1/2 -translate-x-1/2 flex flex-col items-center group/db">
                  <div className="w-16 h-16 bg-dark-900 border-2 border-blue-500/20 rounded-xl flex items-center justify-center mb-2 group-hover/db:border-blue-500 transition-all">
                    <Database className="w-8 h-8 text-blue-500" />
                  </div>
                  <span className="text-xs font-bold text-white opacity-60">MongoDB</span>
                  <div className="w-px h-8 bg-gradient-to-b from-blue-500 to-green-400 mt-2 relative">
                    <div className="absolute bottom-0 -left-1 border-x-4 border-x-transparent border-t-8 border-t-green-400"></div>
                  </div>
                </div>

                <div className="w-24 h-24 bg-dark-900 border-2 border-green-400/30 rounded-2xl flex items-center justify-center mb-4 group-hover:border-green-400 group-hover:shadow-[0_0_30px_rgba(74,222,128,0.3)] transition-all duration-500">
                  <Server className="w-12 h-12 text-green-400" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white leading-tight">API Gateway</p>
                  <p className="text-xs text-dark-400 font-mono">Node.js Express</p>
                </div>
              </div>

              {/* Arrow 2 */}
              <div className="flex-1 px-8 flex flex-col items-center justify-center">
                <div className="h-px w-full bg-gradient-to-r from-green-400 to-purple-400 relative">
                  <div className="absolute right-0 -top-1 border-y-4 border-y-transparent border-l-8 border-l-purple-400"></div>
                </div>
                <span className="text-[10px] text-dark-400 font-mono mt-2 uppercase tracking-tighter">Microservice RPC</span>
              </div>

              {/* 3. ML Intelligence with Datasets */}
              <div className="flex flex-col items-center group relative">
                <div className="w-24 h-24 bg-dark-900 border-2 border-purple-400/30 rounded-2xl flex items-center justify-center mb-4 group-hover:border-purple-400 group-hover:shadow-[0_0_30_px_rgba(192,132,252,0.3)] transition-all duration-500">
                  <BrainCircuit className="w-12 h-12 text-purple-400" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white leading-tight">ML Intelligence</p>
                  <p className="text-xs text-dark-400 font-mono">FastAPI / Python</p>
                </div>

                {/* Datasets (Absolute Bottom) */}
                <div className="absolute top-[calc(100%+1rem)] left-1/2 -translate-x-1/2 flex flex-col items-center group/data">
                  <div className="w-px h-8 bg-gradient-to-b from-purple-400 to-solar mb-2 relative">
                    <div className="absolute top-0 -left-1 border-x-4 border-x-transparent border-t-8 border-t-purple-400 rotate-180"></div>
                  </div>
                  <div className="w-16 h-16 bg-dark-900 border-2 border-solar/20 rounded-xl flex items-center justify-center mb-2 group-hover/data:border-solar transition-all">
                    <Zap className="w-8 h-8 text-solar" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-white opacity-60 leading-none">Solar Datasets</p>
                    <p className="text-[10px] text-dark-500 font-mono">CSV / XLSX</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Mobile View Diagram */}
            <div className="md:hidden flex flex-col items-center gap-12 relative z-10">
              <div className="flex flex-col items-center">
                <Layers className="w-16 h-16 text-cyan-400 mb-2" />
                <span className="text-white font-bold">Client App</span>
              </div>
              <div className="w-1 h-12 bg-gradient-to-b from-cyan-400 to-green-400"></div>
              <div className="flex flex-col items-center">
                <Server className="w-16 h-16 text-green-400 mb-2" />
                <span className="text-white font-bold">API Gateway</span>
              </div>
              <div className="w-1 h-12 bg-gradient-to-b from-green-400 to-purple-400"></div>
              <div className="flex flex-col items-center">
                <BrainCircuit className="w-16 h-16 text-purple-400 mb-2" />
                <span className="text-white font-bold">ML Intelligence</span>
              </div>
            </div>
          </div>


          
          <div className="mt-20 p-6 bg-dark-900/50 border border-white/5 rounded-2xl max-w-3xl mx-auto text-center">
            <p className="text-sm text-dark-300 leading-relaxed italic">
              "The architecture follows a decoupled micro-service pattern. The <span className="text-green-400">Node backend</span> acts as a central orchestrator, delegating heavy mathematical computations to the <span className="text-purple-400">Python ML service</span> while serving lightweight visual data directly from <span className="text-blue-400">MongoDB</span> to the <span className="text-cyan-400">React frontend</span>."
            </p>
          </div>
        </div>
      </div>


      {/* Feature Walkthrough */}
      <div className="relative z-10 space-y-8">
        <h2 className="text-4xl font-display font-bold text-white pl-4 flex items-center gap-4">
          <span className="w-2 h-10 bg-solar rounded-full inline-block"></span>
          Platform Modules (Slide-by-Slide)
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-dark-900/60 backdrop-blur-xl border border-white/5 p-10 rounded-[2.5rem] flex gap-8 hover:bg-dark-800/60 transition-colors">
            <div className="bg-solar/10 p-5 rounded-3xl h-fit border border-solar/20 shrink-0 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
              <BarChart4 className="w-10 h-10 text-solar" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">1. Executive & Revenue</h3>
              <p className="text-lg text-dark-400 leading-relaxed mb-3">
                <strong className="text-dark-200">Physical Footprint vs CapEx:</strong> The system aggregates thousands of records to reflect over 81.8 GW of national capacity. It isolates the financial aspect by calculating the Capital Expenditure required to build that capacity using a 70/30 utility-to-rooftop cost matrix.
              </p>
            </div>
          </div>

          <div className="bg-dark-900/60 backdrop-blur-xl border border-white/5 p-10 rounded-[2.5rem] flex gap-8 hover:bg-dark-800/60 transition-colors">
            <div className="bg-green-400/10 p-5 rounded-3xl h-fit border border-green-400/20 shrink-0 shadow-[0_0_20px_rgba(74,222,128,0.1)]">
              <Code className="w-10 h-10 text-green-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">2. Detailed Analytics</h3>
              <p className="text-lg text-dark-400 leading-relaxed mb-3">
                <strong className="text-dark-200">CAGR & YoY Momentum:</strong> Provides mathematically smoothed metrics like 10-Year CAGR to highlight long-term sustainable growth. City-Wise YoY flags regions where massive new mega-projects have come online.
              </p>
            </div>
          </div>

          <div className="bg-dark-900/60 backdrop-blur-xl border border-white/5 p-10 rounded-[2.5rem] flex gap-8 hover:bg-dark-800/60 transition-colors">
            <div className="bg-blue-400/10 p-5 rounded-3xl h-fit border border-blue-400/20 shrink-0 shadow-[0_0_20px_rgba(96,165,250,0.1)]">
              <Map className="w-10 h-10 text-blue-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">3. Geo-Intelligence Hub</h3>
              <p className="text-lg text-dark-400 leading-relaxed mb-3">
                <strong className="text-dark-200">Spatial Heatmaps:</strong> Integrates interactive React-Leaflet maps querying Postgres. Visualizes capacity as interactive heatmaps, allowing EPCs to identify 'dark zones' ripe for future solar investment.
              </p>
            </div>
          </div>

          <div className="bg-dark-900/60 backdrop-blur-xl border border-white/5 p-10 rounded-[2.5rem] flex gap-8 hover:bg-dark-800/60 transition-colors">
            <div className="bg-purple-400/10 p-5 rounded-3xl h-fit border border-purple-400/20 shrink-0 shadow-[0_0_20px_rgba(192,132,252,0.1)]">
              <Zap className="w-10 h-10 text-purple-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">4. Innovation Hub & AI</h3>
              <p className="text-lg text-dark-400 leading-relaxed mb-3">
                <strong className="text-dark-200">AR Simulator:</strong> Hooks into the device camera to mathematically calculate max panels on a detected surface. <br/><br/>
                <strong className="text-dark-200">Chatbot:</strong> A context-aware assistant deployed across all screens to guide users.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ML Deep Dive Highlight */}
      <div className="relative z-10 bg-gradient-to-br from-dark-900/90 to-dark-950/90 backdrop-blur-3xl border border-solar/30 p-12 rounded-[3rem] shadow-[0_0_80px_rgba(249,115,22,0.15)] overflow-hidden group">
         <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4 group-hover:scale-110 group-hover:opacity-20 transition-all duration-1000 pointer-events-none">
            <Cpu className="w-[600px] h-[600px] text-solar" />
         </div>
         <div className="relative z-10 max-w-5xl">
           <div className="flex items-center gap-6 mb-10">
             <div className="bg-solar/20 p-5 rounded-3xl border border-solar/40 shadow-[0_0_30px_rgba(249,115,22,0.2)]">
               <BrainCircuit className="w-10 h-10 text-solar" />
             </div>
             <h2 className="text-4xl font-display font-bold text-white">Deep Dive: AI Polynomial Forecasting</h2>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
             <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-black text-solar uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-solar inline-block"></span>1. Mathematical Logic</h3>
                  <p className="text-xl text-dark-300 leading-relaxed">
                    Unlike standard linear regression that predicts a straight line (<span className="font-mono text-white italic">y = mx + c</span>), our model uses a <strong className="text-white">second-degree polynomial (quadratic)</strong>. It transforms the input variable (Year) into multiple features:
                  </p>
                  <div className="mt-4 p-4 bg-dark-950/50 rounded-2xl border border-white/5 font-mono text-center text-2xl text-solar italic">
                    y = ax² + bx + c
                  </div>
                  <p className="mt-4 text-lg text-dark-400">
                    This captures the <span className="text-white italic">"accelerating growth"</span> typical of solar adoption, which a simple straight line would consistently under-forecast.
                  </p>
                </div>

               <div>
                 <h3 className="text-lg font-black text-solar uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-solar inline-block"></span>Model Parameters</h3>
                 <div className="grid grid-cols-2 gap-4 text-dark-300">
                   <div className="bg-dark-950/80 p-4 rounded-xl border border-white/5">
                     <p className="text-xs font-bold text-dark-500 uppercase mb-1">Independent Variable (X)</p>
                     <p className="text-lg font-bold text-white">The Year</p>
                   </div>
                   <div className="bg-dark-950/80 p-4 rounded-xl border border-white/5">
                     <p className="text-xs font-bold text-dark-500 uppercase mb-1">Target Variable (Y)</p>
                     <p className="text-lg font-bold text-white">Capacity (kW)</p>
                   </div>
                   <div className="bg-dark-950/80 p-4 rounded-xl border border-white/5">
                     <p className="text-xs font-bold text-dark-500 uppercase mb-1">Hyperparameter</p>
                     <p className="text-lg font-bold text-white">Degree = 2</p>
                   </div>
                   <div className="bg-dark-950/80 p-4 rounded-xl border border-white/5">
                     <p className="text-xs font-bold text-dark-500 uppercase mb-1">Validation</p>
                     <p className="text-lg font-bold text-white">80/20 Split</p>
                   </div>
                 </div>
               </div>
             </div>

            <div className="bg-dark-950/50 rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col">
                <div className="p-6 bg-white/5 border-b border-white/5 flex justify-between items-center">
                  <h4 className="text-xl font-bold text-white">Model Selection & Validation</h4>
                  <span className="text-xs font-black bg-solar/20 text-solar px-3 py-1 rounded-full border border-solar/30">RMSE VALIDATED</span>
                </div>
                <div className="p-8 flex-1 space-y-6">
                  <div>
                    <h5 className="text-sm font-black text-dark-500 uppercase tracking-widest mb-3">"Best Fit" Selection Logic</h5>
                    <p className="text-base text-dark-300 leading-relaxed">
                      To prevent <span className="text-white italic">overfitting</span>, the system doesn't blindly use Polynomials. It calculates the <strong className="text-white">Root Mean Squared Error (RMSE)</strong> for Linear, Exponential Smoothing, and Polynomial models.
                    </p>
                    <div className="mt-4 p-4 bg-solar/5 border-l-4 border-solar rounded-r-xl">
                      <p className="text-sm text-dark-200">
                        <strong className="text-white">The 5% Rule:</strong> The Polynomial model is only chosen if its accuracy is at least <span className="text-solar font-bold">5% better</span> than the simple Linear baseline.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-dark-400 font-medium">1. Linear Regression</span>
                      <span className="text-dark-500 italic">Baseline Growth</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-dark-400 font-medium">2. Exponential Smoothing</span>
                      <span className="text-dark-500 italic">Time-Weighted Trend</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white font-bold">3. Polynomial (Degree 2)</span>
                      <span className="text-solar font-black">Momentum-Aware</span>
                    </div>
                  </div>
                </div>
             </div>
           </div>

           {/* AI Pipeline Flow Diagram */}
           <div className="mb-12">
             <h3 className="text-lg font-black text-white uppercase tracking-[0.2em] mb-10 text-center opacity-50 flex items-center justify-center gap-4">
               <div className="h-px w-12 bg-white/10"></div>
               Model Execution Pipeline
               <div className="h-px w-12 bg-white/10"></div>
             </h3>
             <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
                <div className="absolute hidden md:block top-1/2 left-0 w-full h-px bg-gradient-to-r from-solar/0 via-solar/20 to-solar/0 -z-0"></div>
                
                {[
                  { icon: Database, label: "Data Ingestion", sub: "CSV / XLSX Processing", detail: "Normalization & Cleaning" },
                  { icon: Layers, label: "Feature Engineering", sub: "Poly-Transformation", detail: "x → [1, x, x²] Matrix" },
                  { icon: Cpu, label: "Model Training", sub: "Scikit-Learn Engine", detail: "Least Squares Fit" },
                  { icon: BarChart4, label: "Inference Hub", sub: "Trend Extrapolation", detail: "2024-2030 Forecasts" },
                  { icon: Zap, label: "Optimization", sub: "Supply Chain Intel", detail: "RMSE-Validated Results" }
                ].map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center group relative z-10 bg-dark-900/80 p-8 rounded-[2rem] border border-white/5 hover:border-solar/40 transition-all w-full md:w-56 text-center hover:-translate-y-2 duration-500 shadow-2xl">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-solar text-dark-950 text-[10px] font-black px-3 py-1 rounded-full uppercase">Step 0{idx + 1}</div>
                    <div className="bg-dark-950 p-5 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-inner border border-white/5">
                      <step.icon className="w-10 h-10 text-solar" />
                    </div>
                    <span className="text-base font-bold text-white mb-1">{step.label}</span>
                    <span className="text-[10px] text-solar font-bold uppercase tracking-widest mb-3 opacity-80">{step.sub}</span>
                    <div className="h-px w-8 bg-white/10 mb-3 mx-auto"></div>
                    <span className="text-xs text-dark-400 leading-tight">{step.detail}</span>
                    {idx < 4 && (
                      <div className="md:hidden w-px h-12 bg-gradient-to-b from-solar/50 to-transparent my-4"></div>
                    )}
                  </div>
                ))}
             </div>
           </div>


            <div className="bg-gradient-to-r from-dark-900 to-dark-800 border border-white/10 p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden">
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-solar"></div>
               <div className="flex-1">
                 <h4 className="text-2xl text-white font-bold mb-4 flex items-center gap-3">
                   <Zap className="w-6 h-6 text-solar" />
                   System Integration & Data Flow
                 </h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                   <div className="space-y-2">
                     <p className="text-dark-400 font-bold uppercase text-[10px] tracking-widest">Frontend Ingress</p>
                     <p className="text-dark-300 leading-relaxed">Forecasting page triggers a POST request to <code className="text-solar">/forecast</code> with state-specific historical data.</p>
                   </div>
                   <div className="space-y-2">
                     <p className="text-dark-400 font-bold uppercase text-[10px] tracking-widest">Backend Logic</p>
                     <p className="text-dark-300 leading-relaxed">Python service executes the best-fit model and returns predictions with <code className="text-white">95% Confidence Intervals</code>.</p>
                   </div>
                 </div>
               </div>
               
               <div className="shrink-0 bg-dark-950/80 p-6 rounded-2xl border border-white/5">
                 <p className="text-[10px] font-black text-dark-500 uppercase tracking-widest mb-3">Code Pointer</p>
                 <div className="space-y-3 font-mono text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span className="text-white">models.py</span>
                      <span className="text-dark-500">L82-152</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span className="text-white">main.py</span>
                      <span className="text-dark-500">L69-96</span>
                    </div>
                 </div>
               </div>
            </div>
         </div>
      </div>


      {/* Computer Vision Deep Dive Highlight */}
      <div className="relative z-10 bg-gradient-to-br from-dark-900/90 to-dark-950/90 backdrop-blur-3xl border border-blue-500/30 p-12 rounded-[3rem] shadow-[0_0_80px_rgba(59,130,246,0.15)] overflow-hidden group">
         <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4 group-hover:scale-110 group-hover:opacity-20 transition-all duration-1000 pointer-events-none">
            <Map className="w-[600px] h-[600px] text-blue-500" />
         </div>
         <div className="relative z-10 max-w-5xl">
           <div className="flex items-center gap-6 mb-10">
             <div className="bg-blue-500/20 p-5 rounded-3xl border border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
               <Map className="w-10 h-10 text-blue-400" />
             </div>
             <h2 className="text-4xl font-display font-bold text-white">Deep Dive: Computer Vision Analysis</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-12">
             <div>
               <h3 className="text-lg font-black text-blue-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>1. Spectral Isolation</h3>
               <p className="text-xl text-dark-300 leading-relaxed mb-6">
                 <strong className="text-white">HSV Color Thresholding:</strong> The algorithm transforms raw RGB satellite snapshots into the HSV (Hue, Saturation, Value) spectrum. It isolates Photovoltaic (PV) silicon by applying a strict blue/black Hue mask (90-130).
               </p>
               <p className="text-xl text-dark-300 leading-relaxed">
                 <strong className="text-white">Noise Filtering:</strong> It runs polygon contour detection on the isolated colors. To prevent falsely classifying small blue objects (like swimming pools or cars), it explicitly drops any contours with a pixel area smaller than 100.
               </p>
             </div>
             <div>
               <h3 className="text-lg font-black text-blue-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>2. Spatial Calculation</h3>
               <p className="text-xl text-dark-300 leading-relaxed mb-6">
                 <strong className="text-white">Total Pixel Density:</strong> The pipeline aggregates the area of all valid, filtered solar panel contours found on the screen.
               </p>
               <p className="text-xl text-dark-300 leading-relaxed">
                 <strong className="text-white">Dynamic Zoom Scaling:</strong> A pixel at Zoom Level 15 represents more land than at Zoom 19. The model mathematically applies an inverse scaling factor (`20 - zoom_level`), converting the raw pixel count into an estimated real-world Megawatt (MW) capacity limit.
               </p>
             </div>
           </div>

           <div className="bg-gradient-to-r from-dark-900 to-dark-800 border border-white/10 p-8 rounded-[2rem] flex items-center justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
              <div>
                <h4 className="text-2xl text-white font-bold mb-3">Real-World Impact: Instant Site Discovery</h4>
                <p className="text-xl text-dark-300 max-w-3xl leading-relaxed">
                  Instead of sending survey teams physically on-site to measure operational solar parks, EPCs and grid managers can instantly estimate capacity output straight from orbit.
                </p>
              </div>
              <ArrowRight className="w-12 h-12 text-blue-400 shrink-0" />
           </div>
         </div>
      </div>

      {/* Output Graphs Gallery */}
      <div className="relative z-10 bg-dark-900/60 backdrop-blur-xl border border-white/5 p-12 rounded-[3rem] shadow-2xl">
        <h2 className="text-4xl font-display font-bold text-white mb-4 flex items-center gap-4">
          <span className="w-2 h-10 bg-solar rounded-full inline-block"></span>
          Data Visualization Output
        </h2>
        <p className="text-xl text-dark-400 mb-12 ml-6 font-medium">Static outputs generated during model training and historical analysis.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { img: "01_india_capacity_forecast.png", title: "Capacity Forecast", desc: "Polynomial projection with confidence intervals up to 2030." },
            { img: "04_revenue_forecast_2030.png", title: "Revenue Forecast", desc: "Capital Expenditure (CapEx) tracking alongside capacity growth." },
            { img: "06_revenue_vs_capacity_scatter.png", title: "Revenue vs Capacity", desc: "Scatter correlation between state installations and generated revenue." },
            { img: "08_market_share_pie.png", title: "National Market Share", desc: "Top contributing states dominating the total MW installations." },
            { img: "09_top15_state_cagr.png", title: "Top 15 State CAGR", desc: "Compound Annual Growth Rate tracking 10-year momentum." },
            { img: "11_top6_state_trends.png", title: "Top 6 State Trends", desc: "Individual time-series breakdowns for the highest-performing regions." }
          ].map((item, idx) => (
            <a key={idx} href={`/charts/${item.img}`} target="_blank" rel="noopener noreferrer" className="bg-dark-950 rounded-3xl border border-white/5 overflow-hidden group block cursor-pointer hover:border-solar/50 hover:-translate-y-2 transition-all duration-300 shadow-xl hover:shadow-[0_20px_40px_rgba(249,115,22,0.15)]">
              <div className="relative overflow-hidden aspect-video">
                <img src={`/charts/${item.img}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="p-6 border-t border-white/5 bg-dark-950 relative z-10">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-solar transition-colors">{item.title}</h3>
                <p className="text-base text-dark-400">{item.desc}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Post-Analysis Insights */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 border-t border-white/5 pt-16">
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-2 h-8 bg-solar rounded-full"></div>
              Findings After Analysis
            </h3>
            <div className="space-y-4">
              {[
                { title: "Concentrated Dominance", detail: "Rajasthan and Gujarat alone account for over 45% of total national capacity, creating massive economies of scale." },
                { title: "Hidden Growth Engines", detail: "Smaller regions like Pondicherry exhibit 88.1% CAGR, growing faster than established leaders in relative terms." },
                { title: "Non-Linear Momentum", detail: "Solar adoption is accelerating quadratically ($y=ax^2+bx+c$), making linear forecasts increasingly inaccurate." },
                { title: "Regional Momentum Spikes", detail: "Mega-projects like Bhadla Solar Park cause 'spikes' that drive 80%+ of their state's annual growth targets." }
              ].map((finding, idx) => (
                <div key={idx} className="bg-dark-950/50 p-6 rounded-2xl border border-white/5 hover:border-solar/20 transition-colors group">
                  <p className="text-solar font-black text-xs uppercase tracking-widest mb-1 group-hover:tracking-[0.2em] transition-all">{finding.title}</p>
                  <p className="text-dark-300 leading-relaxed">{finding.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
              How These Findings Help Our Analysis
            </h3>
            <div className="space-y-4">
              {[
                { title: "Targeted Sales Planning", detail: "Pivot sales teams from low-yield 'dark zones' to high-CAGR 'hidden gems' before they saturate." },
                { title: "Inventory Optimization", detail: "Forecast-driven supply chain management prevents overstocking in slow regions and ensures readiness for boom phases." },
                { title: "Revenue Benchmarking", detail: "Establishes a standard 'Revenue per MW' baseline, allowing for data-backed sales targets per territory." },
                { title: "Risk Mitigation", detail: "Identifies historic market cycles (like the 2018-2021 dip) to build resilience against policy or economic shifts." }
              ].map((benefit, idx) => (
                <div key={idx} className="bg-dark-950/50 p-6 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-colors group">
                  <p className="text-blue-400 font-black text-xs uppercase tracking-widest mb-1 group-hover:tracking-[0.2em] transition-all">{benefit.title}</p>
                  <p className="text-dark-300 leading-relaxed">{benefit.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProjectOverview;
