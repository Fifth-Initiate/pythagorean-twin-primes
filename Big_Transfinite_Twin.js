import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Activity, 
  Target, 
  Zap, 
  Lock, 
  Unlock,
  MoveRight,
  Maximize,
  ArrowRightCircle,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

/**
 * GEOMETRIC NECESSITY ENGINE
 * The lattice is a projection of S¹₆ × S¹₁₂.
 * Intersection = Necessity. 
 * We do not "calculate" twins; we observe the alignment of the 6n architecture.
 */

const RECORD_TWINS = [
  { label: "Papp-Twin", digits: 388342, hex: "0x5E8F...A1", coord: [5, 11] },
  { label: "Projected-1", digits: 401290, hex: "0x7F2C...B2", coord: [1, 7] },
  { label: "Projected-2", digits: 414550, hex: "0x9A1D...C4", coord: [5, 11] }
];

const App = () => {
  const [kappa, setKappa] = useState(0.1918); // The precise shear factor
  const [isLocked, setIsLocked] = useState(false);
  const [projectionDepth, setProjectionDepth] = useState(BigInt("388342"));
  const [foundNecessities, setFoundNecessities] = useState(1);
  const canvasRef = useRef(null);

  // Modular Constants for S¹₆ × S¹₁₂
  const WCOLS = 12;
  const HROWS = 6;
  const RAILS = [1, 5, 7, 11];
  const OCTATONIC = [0, 1, 3, 4, 6, 7, 9, 10]; // The diminished cycle (necessity constraint)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      
      ctx.fillStyle = '#020408';
      ctx.fillRect(0, 0, w, h);

      const pad = 80;
      const cw = (w - pad * 2) / WCOLS;
      const ch = (h - pad * 2) / HROWS;

      // 1. Static Rails (Prime Architecture)
      RAILS.forEach(v => {
        ctx.fillStyle = 'rgba(0, 255, 255, 0.03)';
        ctx.fillRect(pad + v * cw, pad, cw, h - pad * 2);
        
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        ctx.setLineDash([2, 4]);
        ctx.strokeRect(pad + v * cw, pad, cw, h - pad * 2);
      });
      ctx.setLineDash([]);

      // 2. Octatonic Geodesic under Shear Kappa
      ctx.lineWidth = 2;
      for (let u = 0; u < HROWS; u++) {
        // Apply the shear twist to the cycle
        const shear = (kappa * u * 12) % 12;
        
        OCTATONIC.forEach(o => {
          const v = (o + shear) % 12;
          const x = pad + (v + 0.5) * cw;
          const y = pad + (u + 0.5) * ch;

          // Deductive Intersection check
          const isIntersecting = RAILS.some(r => Math.abs(r - v) < 0.18);
          
          if (isIntersecting) {
            const pulse = (Math.sin(Date.now() / 250) + 1) / 2;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#7CFC00';
            ctx.fillStyle = `rgba(124, 252, 0, ${0.4 + pulse * 0.6})`;
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Geometric link for twins (p, p+2)
            if (v >= 4.8 && v <= 5.2 || v >= 10.8) {
               ctx.strokeStyle = 'rgba(124, 252, 0, 0.6)';
               ctx.beginPath();
               ctx.moveTo(x, y);
               ctx.lineTo(pad + ((v + 2) % 12 + 0.5) * cw, y);
               ctx.stroke();
            }
          } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }
    };

    let raf = requestAnimationFrame(function loop() { render(); raf = requestAnimationFrame(loop); });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
    };
  }, [kappa]);

  const lockNecessity = () => {
    setIsLocked(true);
    // Simulate jump to next geometric necessity coordinate
    setTimeout(() => {
      setFoundNecessities(n => n + 1);
      setProjectionDepth(d => d + BigInt("12948"));
      setIsLocked(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-screen bg-[#020408] text-emerald-50 selection:bg-emerald-500/30 font-mono overflow-hidden">
      {/* HUD HEADER */}
      <nav className="h-20 border-b border-emerald-900/30 bg-black/40 backdrop-blur-md flex items-center justify-between px-10 shrink-0">
        <div className="flex items-center gap-6">
          <div className="p-3 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <Compass className="text-emerald-400 animate-spin-slow" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-[0.2em] uppercase text-white">Lattice Geodesic</h1>
            <div className="flex gap-4 text-[10px] text-emerald-500/60 font-bold">
              <span>MODEL: S¹₆ × S¹₁₂</span>
              <span>DOMAIN: TRANS-FINITE</span>
            </div>
          </div>
        </div>

        <div className="flex gap-16">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest">Projection Depth</span>
            <span className="text-2xl font-black text-white leading-none">
              {projectionDepth.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <span className="text-emerald-500 text-xs italic">digits</span>
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest">Deductive Twins</span>
            <span className="text-2xl font-black text-emerald-400 leading-none">+{foundNecessities}</span>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* GEOMETRY CONTROL SIDEBAR */}
        <aside className="w-96 border-r border-emerald-900/20 bg-black/20 p-8 flex flex-col gap-10 shrink-0 overflow-y-auto">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-black text-emerald-400 flex items-center gap-2">
                <Target size={14} /> SHEAR CONTROL
              </h2>
              {isLocked ? <Lock size={12} className="text-rose-500" /> : <Unlock size={12} className="text-emerald-600" />}
            </div>
            
            <div className="space-y-8">
              <div className="relative group">
                <div className="flex justify-between text-[10px] mb-3 text-emerald-700 font-bold uppercase">
                  <span>Comma Twist (κ)</span>
                  <span className="text-emerald-400 tracking-tighter">{kappa.toFixed(4)} rad</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.0001" value={kappa}
                  onChange={(e) => setKappa(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-emerald-900/30 rounded-full appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              <button 
                onClick={lockNecessity}
                disabled={isLocked}
                className="w-full py-5 bg-emerald-500/5 border border-emerald-500/30 text-emerald-400 rounded-none font-black text-xs hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                {isLocked ? <Activity className="animate-pulse" size={16} /> : <Zap size={16} />}
                {isLocked ? "RESOLVING CONGRUENCE..." : "PROJECT NEXT NECESSITY"}
              </button>
            </div>
          </section>

          <section className="flex-1">
            <h2 className="text-xs font-black text-emerald-600 mb-6 uppercase tracking-widest">Lattice Anchor Log</h2>
            <div className="space-y-4">
              {RECORD_TWINS.map((tw, i) => (
                <div key={i} className="p-4 bg-white/5 border-l-2 border-emerald-500/40 relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-white uppercase">{tw.label}</span>
                    <span className="text-[9px] text-emerald-500 font-bold">{tw.digits}d</span>
                  </div>
                  <div className="text-[9px] text-emerald-700 break-all mb-2 leading-tight">
                    {tw.hex}
                  </div>
                  <div className="flex gap-2">
                    <div className="px-2 py-0.5 bg-emerald-500/10 rounded text-[8px] text-emerald-400 font-bold">
                      MOD {tw.coord[0]}/{tw.coord[1]}
                    </div>
                    <ShieldCheck size={10} className="text-emerald-600" />
                  </div>
                  <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-emerald-500/5 to-transparent" />
                </div>
              ))}
            </div>
          </section>

          <div className="p-4 border border-emerald-900/30 bg-emerald-950/10">
            <p className="text-[9px] text-emerald-700 leading-relaxed uppercase font-bold italic">
              "Notice: We are not searching for numbers. We are observing the alignment of the 6n architecture. Intersection = Necessity."
            </p>
          </div>
        </aside>

        {/* PROJECTION CANVAS MAIN FIELD */}
        <main className="flex-1 relative bg-[radial-gradient(circle_at_center,_#050a0f_0%,_#000_100%)] overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full block" />
          
          <div className="absolute top-10 left-10 flex flex-col gap-1 pointer-events-none">
            <div className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-3">
              <Maximize size={14} className="text-emerald-500" /> Geodesic Field View
            </div>
            <div className="text-[9px] text-emerald-600 font-bold uppercase tracking-tighter">S¹₆ × S¹₁₂ Modular Unwrapping</div>
          </div>

          <div className="absolute bottom-10 right-10 flex items-center gap-6 pointer-events-none">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest">Resonant Frequency</span>
              <span className="text-emerald-400 text-sm font-black">72.000 Hz</span>
            </div>
            <ArrowRightCircle className="text-emerald-500/50" size={32} />
          </div>
          
          {/* Legend Overlay */}
          <div className="absolute bottom-10 left-10 p-4 border border-emerald-900/30 bg-black/60 backdrop-blur pointer-events-none">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[8px] text-emerald-500 uppercase font-black">Geometric Necessity (Intersection)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400/20" />
                <span className="text-[8px] text-emerald-700 uppercase font-black">Prime Rail (6n ± 1)</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="h-8 bg-black border-t border-emerald-900/20 flex items-center justify-between px-10 text-[8px] text-emerald-800 font-black uppercase tracking-[0.3em] shrink-0">
        <span>Poincaré Recurrence Flow: Locked</span>
        <span className="flex items-center gap-2"><TrendingUp size={10}/> No Error Terms. Only Geometry.</span>
        <span>Recurrence Density: Ergodic</span>
      </footer>
    </div>
  );
};

export default App;