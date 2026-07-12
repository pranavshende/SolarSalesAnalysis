import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import { ArrowLeft, Box, Sun, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SolarPanel = ({ position }) => (
  <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
    <mesh position={position} rotation={[-Math.PI / 4, 0, 0]}>
      <boxGeometry args={[2, 0.1, 1]} />
      <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[1.8, 0.01, 0.8]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.5} />
      </mesh>
    </mesh>
  </Float>
);

const EnergyCore = () => (
  <mesh position={[0, 2, 0]}>
    <sphereGeometry args={[1, 32, 32]} />
    <MeshDistortMaterial color="#f97316" speed={5} distort={0.4} radius={1} />
    <pointLight intensity={2} color="#f97316" />
  </mesh>
);

const SolarWalkthrough = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-dark-950 relative overflow-hidden">
      {/* HUD */}
      <div className="absolute top-4 md:p-8 left-8 z-10 space-y-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-dark-900/50 backdrop-blur-md border border-dark-800 rounded-2xl text-white hover:bg-solar hover:border-solar transition-all group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">3D Solar Farm Walkthrough</h1>
          <p className="text-dark-400 flex items-center gap-2">
            <Box className="w-4 h-4 text-solar" />
            Interactive Utility-Scale Simulation (Experimental)
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-10 max-w-sm bg-dark-900/50 backdrop-blur-xl border border-dark-800 p-6 rounded-[2rem] shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-solar/20 p-2 rounded-xl">
             <Zap className="w-5 h-5 text-solar" />
          </div>
          <h3 className="text-lg font-bold text-white">Grid Status</h3>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-dark-400">Total Array Units</span>
            <span className="text-white font-bold">128 PV Blocks</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-dark-400">Simulation Engine</span>
            <span className="text-solar font-bold">V-CORE 2.0</span>
          </div>
          <div className="pt-4 border-t border-dark-800">
            <p className="text-[10px] text-dark-500 uppercase font-black mb-2">Controls</p>
            <p className="text-[10px] text-dark-400 italic">Drag to rotate • Scroll to zoom • Right-click to pan</p>
          </div>
        </div>
      </div>

      {/* 3D Scene */}
      <Suspense fallback={<div className="flex items-center justify-center h-full text-solar font-black animate-pulse">Initializing Neural Engine...</div>}>
        <Canvas camera={{ position: [10, 10, 10], fov: 45 }}>
          <color attach="background" args={['#020617']} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />

          {/* Grid of Panels */}
          {[-4, -2, 0, 2, 4].map(x => 
            [-4, -2, 0, 2, 4].map(z => (
              <SolarPanel key={`${x}-${z}`} position={[x * 3, 0, z * 3]} />
            ))
          )}

          <EnergyCore />

          {/* Ground Plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
          <gridHelper args={[50, 50, '#1e293b', '#0f172a']} position={[0, -0.49, 0]} />

          <OrbitControls makeDefault />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default SolarWalkthrough;
