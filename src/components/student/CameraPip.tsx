import React, { useRef, useEffect } from 'react';
import { AlertCircle, Eye } from 'lucide-react';

interface CameraPipProps {
  stream: MediaStream | null;
  useFallback: boolean;
  isPaused?: boolean;
}

export const CameraPip: React.FC<CameraPipProps> = ({ stream, useFallback, isPaused }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Attach real stream if available
  useEffect(() => {
    if (videoRef.current && stream && !useFallback) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(err => {
        console.warn('Video play error:', err);
      });
    }
  }, [stream, useFallback]);

  // Synthetic Biometric Stream Simulator (for hardware camera fallback)
  useEffect(() => {
    if (!useFallback || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const renderSyntheticFace = () => {
      angle += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      // Dark background with subtle grid
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center animated simulated face avatar
      const centerX = width / 2 + Math.sin(angle * 0.7) * 4;
      const centerY = height / 2 + Math.cos(angle * 0.5) * 3;

      // Head silhouette
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY - 8, 38, 48, 0, 0, Math.PI * 2);
      ctx.fill();

      // Shoulders silhouette
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 55, 62, 28, 0, 0, Math.PI * 2);
      ctx.fill();

      // Facial wireframe points
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 1.5;

      // Eyes
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(centerX - 14, centerY - 14, 3, 0, Math.PI * 2);
      ctx.arc(centerX + 14, centerY - 14, 3, 0, Math.PI * 2);
      ctx.fill();

      // Nose bridge line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 10);
      ctx.lineTo(centerX, centerY + 4);
      ctx.stroke();

      // Smile / mouth line
      ctx.beginPath();
      ctx.arc(centerX, centerY + 10, 10, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.stroke();

      // Synthetic simulation tag
      ctx.fillStyle = '#64748B';
      ctx.font = '9px monospace';
      ctx.fillText('STREAM: SIMULATED BIOMETRIC 1080P', 10, height - 10);

      animId = requestAnimationFrame(renderSyntheticFace);
    };

    renderSyntheticFace();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [useFallback]);

  return (
    <div className="relative bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-elevated w-64 sm:w-72">
      {/* Video / Canvas Element */}
      <div className="relative h-44 sm:h-48 w-full bg-slate-900 flex items-center justify-center overflow-hidden">
        {useFallback ? (
          <canvas
            ref={canvasRef}
            width={288}
            height={192}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
        )}

        {/* Scanline Effect */}
        <div className="scanline-effect"></div>

        {/* Biometric Green Face Detection Bounding Box */}
        <div className="absolute inset-x-12 inset-y-6 border-2 border-dashed border-trust-400 rounded-xl pointer-events-none animate-biometric flex flex-col justify-between p-1.5">
          <div className="flex justify-between items-start">
            <span className="w-2.5 h-2.5 border-t-2 border-l-2 border-trust-400 -mt-2 -ml-2"></span>
            <span className="w-2.5 h-2.5 border-t-2 border-r-2 border-trust-400 -mt-2 -mr-2"></span>
          </div>
          
          <div className="text-center">
            <span className="inline-block bg-slate-950/80 backdrop-blur-sm text-trust-300 font-mono text-[9px] px-2 py-0.5 rounded border border-trust-500/40">
              Face Detected: Biometric Anchor Active
            </span>
          </div>

          <div className="flex justify-between items-end">
            <span className="w-2.5 h-2.5 border-b-2 border-l-2 border-trust-400 -mb-2 -ml-2"></span>
            <span className="w-2.5 h-2.5 border-b-2 border-r-2 border-trust-400 -mb-2 -mr-2"></span>
          </div>
        </div>

        {/* Paused Overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-red-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-3 text-center z-20">
            <AlertCircle className="w-8 h-8 text-alert-400 mb-2 animate-bounce" />
            <p className="text-xs font-bold text-white uppercase tracking-wider">Telemetry Lost</p>
            <p className="text-[10px] text-red-200 mt-1">Camera Feed Suspended</p>
          </div>
        )}
      </div>

      {/* Floating PIP Footer Status Bar */}
      <div className="bg-slate-900 border-t border-slate-800 px-3 py-2 flex items-center justify-between text-[11px]">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-trust-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-trust-500"></span>
          </span>
          <span className="text-slate-300 font-medium">AI Vision Proctor</span>
        </div>
        <div className="flex items-center space-x-1 text-trust-400 font-mono text-[10px]">
          <Eye className="w-3 h-3" />
          <span>Tracking 60 FPS</span>
        </div>
      </div>
    </div>
  );
};
