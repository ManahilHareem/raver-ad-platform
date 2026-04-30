"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  url: string;
  title?: string;
  className?: string;
}

export function AudioPlayer({ url, title, className }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
    };
  }, [url]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
      setIsMuted(v === 0);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className={cn(
      "bg-slate-50/50 backdrop-blur-sm border border-slate-100 rounded-[28px] p-5 flex flex-col gap-4 group/player transition-all hover:border-blue-100 hover:bg-white active:scale-[0.99]", 
      className
    )}>
      <audio ref={audioRef} src={url} />
      
      {/* Title & Type Badge Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
           <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#01012A] to-[#2E2C66]  flex items-center justify-center shrink-0">
              <Icons.Mic className="w-4 h-4 text-white" />
           </div>
           <span className="text-[11px] font-black uppercase tracking-widest text-[#01012A] truncate opacity-60">
              {title || "Neural Audio Asset"}
           </span>
        </div>
        <div className="flex items-center gap-1.5">
           <div className={cn("w-1 h-1 rounded-full animate-pulse", isPlaying ? "bg-emerald-500" : "bg-slate-300")} />
           <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">
             {isPlaying ? "Transmitting" : "Buffered"}
           </span>
        </div>
      </div>

      {/* Main Controls Row */}
      <div className="flex items-center gap-5">
        <button 
          onClick={togglePlay}
          className="w-12 h-12 bg-linear-to-r from-[#01012A] to-[#2E2C66]  text-white rounded-[18px] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-[#01012A]/10 group/btn"
        >
          {isPlaying ? (
            <Icons.Pause className="w-5 h-5 fill-current" />
          ) : (
            <Icons.Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        <div className="flex flex-col flex-1 gap-2">
           <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black text-[#01012A] tabular-nums">{formatTime(currentTime)}</span>
              <span className="text-[10px] font-black text-slate-300 tabular-nums">{formatTime(duration)}</span>
           </div>
           
           <div className="relative h-2 group/slider">
              <input 
                type="range"
                min="0"
                max={duration || 0}
                step="0.01"
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div className="absolute inset-0 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[linear-gradient(90deg,#01012A_0%,#2B7FFF_100%)] rounded-full transition-all duration-100 relative"
                  style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#01012A] rounded-full shadow-md scale-0 group-hover/slider:scale-100 transition-transform" />
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Footer / Meta Row */}
      <div className="flex items-center justify-between mt-1">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 group/vol">
               <Icons.Volume2 className="w-3.5 h-3.5 text-slate-400" />
               <div className="w-16 h-1 bg-slate-100 rounded-full relative overflow-hidden group/vol">
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div 
                    className="h-full bg-slate-300 rounded-full"
                    style={{ width: `${volume * 100}%` }}
                  />
               </div>
            </div>
         </div>
         
         {/* Neural Visualization Mockup */}
         <div className="flex items-center gap-0.5 h-4">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className={cn(
                  "w-0.5 bg-blue-500/20 rounded-full transition-all duration-300",
                  isPlaying ? "animate-pulse" : "h-1"
                )}
                style={{ 
                  height: isPlaying ? `${Math.random() * 100}%` : '4px',
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
         </div>
      </div>
    </div>
  );
}
