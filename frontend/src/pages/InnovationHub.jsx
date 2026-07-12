import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  Camera, 
  BookOpen, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Building2,
  RefreshCcw,
  Play,
  CheckCircle2,
  Award
} from 'lucide-react';

const InnovationHub = () => {
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState('roi');
  const [bill, setBill] = useState(5000);
  const [roofArea, setRoofArea] = useState(500);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanStatus, setScanStatus] = useState('idle'); // 'idle', 'scanning', 'detected'
  const [scanResult, setScanResult] = useState(null);
  const videoRef = useRef(null);
  
  // Need to store stream to stop it later
  const [streamObj, setStreamObj] = useState(null);

  // ROI Logic
  const savingsPerYear = bill * 12 * 0.8; // Assume 80% savings
  const systemCost = (roofArea / 10) * 50000; // Simplified cost
  const paybackYears = (systemCost / savingsPerYear).toFixed(1);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      setStreamObj(stream);
      setCameraActive(true);
      setScanStatus('scanning');
      setScanResult(null);

      // Simulate AR detection after 3.5 seconds
      setTimeout(() => {
        setScanStatus('detected');
        
        // Generate a mathematically realistic detection
        // Base it slightly around the user's currently selected roofArea so it feels somewhat expected, but with some variation
        const detectedArea = Math.max(100, Math.floor(roofArea * (0.9 + Math.random() * 0.2))); 
        
        // A standard solar panel needs roughly 40-50 sq ft of space
        const estimatedPanels = Math.floor(detectedArea / 45);
        
        setScanResult({
          area: detectedArea,
          panels: estimatedPanels,
          efficiency: 94
        });

        // Automatically sync the detected area back to the ROI simulator for a seamless demo
        setRoofArea(detectedArea);
      }, 3500);

    } catch (err) {
      console.error("Camera access denied", err);
      alert("Camera access denied or no camera found. Please check browser permissions.");
    }
  };

  const stopCamera = () => {
    if (streamObj) {
      streamObj.getTracks().forEach(track => track.stop());
      setStreamObj(null);
    }
    setCameraActive(false);
    setScanStatus('idle');
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Attach stream to video element securely when camera becomes active
  useEffect(() => {
    if (cameraActive && videoRef.current && streamObj) {
      videoRef.current.srcObject = streamObj;
    }
  }, [cameraActive, streamObj]);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamObj) {
        streamObj.getTracks().forEach(track => track.stop());
      }
    };
  }, [streamObj]);



  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">Innovation Hub</h1>
          <p className="text-dark-400">Advanced AI tools for solar simulation and site analysis</p>
        </div>
        <div className="flex bg-dark-900 border border-dark-800 rounded-2xl p-1.5 shadow-xl">
           <button 
             onClick={() => setActiveTool('roi')}
             className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTool === 'roi' ? 'bg-solar text-white shadow-lg' : 'text-dark-400 hover:text-white'}`}
           >
             <Calculator className="w-4 h-4" />
             ROI Simulator
           </button>
           <button 
             onClick={() => setActiveTool('ar')}
             className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTool === 'ar' ? 'bg-solar text-white shadow-lg' : 'text-dark-400 hover:text-white'}`}
           >
             <Camera className="w-4 h-4" />
             AR Estimator
           </button>
           <button 
             onClick={() => setActiveTool('policy')}
             className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTool === 'policy' ? 'bg-solar text-white shadow-lg' : 'text-dark-400 hover:text-white'}`}
           >
             <BookOpen className="w-4 h-4" />
             Policy Tracker
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Workspace */}
        <div className="lg:col-span-8">
          {activeTool === 'roi' && (
            <div className="bg-dark-900 border border-dark-800 p-8 rounded-[2.5rem] shadow-2xl space-y-8 h-full">
               <div className="flex items-center gap-4 mb-4">
                 <div className="bg-solar/10 p-4 rounded-2xl border border-solar/20">
                   <Zap className="w-8 h-8 text-solar" />
                 </div>
                 <div>
                   <h2 className="text-2xl font-display font-bold text-white">Solar ROI Financial Simulator</h2>
                   <p className="text-sm text-dark-500 font-medium">Estimate payback periods and long-term financial yield</p>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                   <div>
                     <label className="text-xs font-black text-dark-500 uppercase tracking-widest mb-3 block">Avg. Monthly Electricity Bill (₹)</label>
                     <input 
                       type="range" min="1000" max="50000" step="500"
                       value={bill} onChange={(e) => setBill(e.target.value)}
                       className="w-full h-2 bg-dark-950 rounded-lg appearance-none cursor-pointer accent-solar border border-dark-800"
                     />
                     <div className="flex justify-between mt-2 text-xl font-display font-bold text-white">
                        <span>₹{parseInt(bill).toLocaleString()}</span>
                     </div>
                   </div>
                   <div>
                     <label className="text-xs font-black text-dark-500 uppercase tracking-widest mb-3 block">Available Roof Area (Sq. Ft.)</label>
                     <input 
                       type="range" min="100" max="5000" step="100"
                       value={roofArea} onChange={(e) => setRoofArea(e.target.value)}
                       className="w-full h-2 bg-dark-950 rounded-lg appearance-none cursor-pointer accent-solar border border-dark-800"
                     />
                     <div className="flex justify-between mt-2 text-xl font-display font-bold text-white">
                        <span>{roofArea} Sq. Ft.</span>
                     </div>
                   </div>
                 </div>

                 <div className="bg-dark-950 rounded-[2rem] border border-dark-800 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                   <div className="absolute inset-0 bg-solar/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <p className="text-xs font-black text-dark-500 uppercase tracking-[0.2em] mb-4">Payback Period</p>
                   <div className="text-6xl font-display font-bold text-solar mb-4">
                     {paybackYears} <span className="text-xl text-dark-500">Years</span>
                   </div>
                   <div className="space-y-2">
                     <p className="text-sm text-white font-medium">Estimated 25-Year Savings</p>
                     <p className="text-2xl font-bold text-green-400">₹{(savingsPerYear * 25 / 100000).toFixed(1)} Lakhs</p>
                   </div>
                 </div>
               </div>
            </div>
          )}

          {activeTool === 'ar' && (
            <div className="bg-dark-900 border border-dark-800 p-8 rounded-[2.5rem] shadow-2xl space-y-8 h-full relative overflow-hidden">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20 text-blue-400">
                     <Camera className="w-8 h-8" />
                   </div>
                   <div>
                     <h2 className="text-2xl font-display font-bold text-white">Roof-Top Potential AI Estimator</h2>
                     <p className="text-sm text-dark-500 font-medium">Real-time AR analysis of installation area</p>
                   </div>
                 </div>
                 {!cameraActive ? (
                   <button 
                     onClick={startCamera}
                     className="px-6 py-3 bg-solar text-white rounded-xl text-sm font-bold shadow-lg shadow-solar-500/20 active:scale-95 transition-all"
                   >
                     Launch Scanner
                   </button>
                 ) : (
                   <button 
                     onClick={stopCamera}
                     className="px-6 py-3 bg-red-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 active:scale-95 transition-all"
                   >
                     Stop Scanner
                   </button>
                 )}
               </div>

               <div className="relative aspect-video bg-dark-950 rounded-[2rem] border-2 border-dashed border-dark-800 flex items-center justify-center overflow-hidden">
                  {cameraActive ? (
                    <div className="relative w-full h-full">
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                      
                      <div className="absolute inset-0 pointer-events-none">
                        {scanStatus === 'scanning' && (
                          <>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-solar rounded-lg animate-pulse">
                               <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-solar"></div>
                               <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-solar"></div>
                               <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-solar"></div>
                               <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-solar"></div>
                               <div className="absolute top-0 left-0 w-full h-1 bg-solar/30 animate-scan"></div>
                            </div>
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-dark-950/80 backdrop-blur-md px-6 py-3 rounded-full border border-solar/30">
                              <p className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                <RefreshCcw className="w-3 h-3 animate-spin" />
                                Detecting Surface...
                              </p>
                            </div>
                          </>
                        )}

                        {scanStatus === 'detected' && scanResult && (
                          <>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-green-500 bg-green-500/10 rounded-lg">
                               <div className="absolute inset-0 flex items-center justify-center">
                                  <CheckCircle2 className="w-12 h-12 text-green-400" />
                               </div>
                            </div>
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-dark-950/90 backdrop-blur-md p-4 rounded-2xl border border-green-500/30 flex gap-6">
                               <div className="text-center">
                                 <p className="text-[10px] text-dark-400 uppercase tracking-widest font-black">Area Detected</p>
                                 <p className="text-lg font-bold text-white">{scanResult.area} sq ft</p>
                               </div>
                               <div className="text-center border-l border-r border-dark-800 px-6">
                                 <p className="text-[10px] text-dark-400 uppercase tracking-widest font-black">Max Panels</p>
                                 <p className="text-lg font-bold text-solar">{scanResult.panels}</p>
                               </div>
                               <div className="text-center">
                                 <p className="text-[10px] text-dark-400 uppercase tracking-widest font-black">Efficiency</p>
                                 <p className="text-lg font-bold text-green-400">{scanResult.efficiency}%</p>
                               </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-dark-900 border border-dark-800 rounded-full flex items-center justify-center mx-auto">
                        <Play className="w-8 h-8 text-dark-500" />
                      </div>
                      <p className="text-dark-500 font-medium">Click "Launch Scanner" to analyze your roof potential</p>
                    </div>
                  )}
               </div>
            </div>
          )}

          {activeTool === 'policy' && (
            <div className="bg-dark-900 border border-dark-800 p-8 rounded-[2.5rem] shadow-2xl space-y-8 h-full">
               <div className="flex items-center gap-4 mb-4">
                 <div className="bg-purple-500/10 p-4 rounded-2xl border border-purple-500/20 text-purple-400">
                   <Building2 className="w-8 h-8" />
                 </div>
                 <div>
                   <h2 className="text-2xl font-display font-bold text-white">Solar Policy & Subsidy Tracker</h2>
                   <p className="text-sm text-dark-500 font-medium">Stay updated with live state-wise incentives</p>
                 </div>
               </div>

               <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {[
                    { state: "Rajasthan", policy: "Solar Energy Policy 2023", subsidy: "Up to 30% Central + 10% State", status: "Active" },
                    { state: "Gujarat", policy: "Surya Gujarat Yojna", subsidy: "40% for up to 3kW", status: "Active" },
                    { state: "Karnataka", policy: "PM-KUSUM Component B", subsidy: "60% for Solar Pumps", status: "Active" },
                    { state: "Maharashtra", policy: "Off-Grid Solar Policy", subsidy: "State Subsidy for Housing Soc.", status: "Review" },
                    { state: "Tamil Nadu", policy: "Solar Rooftop Net-Metering", subsidy: "Feed-in Tariff Benefits", status: "Active" }
                  ].map((p, i) => (
                    <div key={i} className="p-6 bg-dark-950 border border-dark-800 rounded-[1.5rem] hover:border-purple-500/30 transition-all flex justify-between items-center group">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-dark-900 border border-dark-800 flex items-center justify-center text-xs font-black text-purple-400">
                          {p.state.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white mb-1">{p.state}</p>
                          <p className="text-xs text-dark-500">{p.policy}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-green-400 mb-1">{p.subsidy}</p>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${p.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>

        {/* Intelligence Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           {/* Feature 2: Sustainability Badges */}
           <div className="bg-dark-900 border border-dark-800 p-8 rounded-[2.5rem] shadow-xl">
             <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
               <TrendingUp className="w-5 h-5 text-green-400" />
               Impact Leaderboard
             </h3>
             <div className="space-y-4">
                {[
                  { name: "Global Solar Corp", impact: "2.4k Tons CO2", icon: ShieldCheck },
                  { name: "EcoGrid Solutions", impact: "1.9k Tons CO2", icon: Award },
                  { name: "SolarIntel Admin", impact: "1.2k Tons CO2", icon: CheckCircle2 }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-dark-950 rounded-2xl border border-dark-800">
                    <div className="bg-green-500/10 p-2.5 rounded-xl">
                      <item.icon className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{item.name}</p>
                      <p className="text-xs text-dark-500">{item.impact}</p>
                    </div>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default InnovationHub;
