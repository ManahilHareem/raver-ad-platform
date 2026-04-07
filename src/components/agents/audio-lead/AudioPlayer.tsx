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
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className={cn("bg-white border border-slate-100 rounded-2xl p-4 flex flex-col gap-3 shadow-sm group transition-all hover:border-slate-200", className)}>
      <audio ref={audioRef} src={url} />
      
      <div className="flex items-center gap-4">
        <button 
          onClick={togglePlay}
          className="w-10 h-10 bg-[#01012A] text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#01012A]/10"
        >
          {isPlaying ? (
            <Icons.Pause className="w-5 h-5 fill-current" />
          ) : (
            <Icons.Play className="w-5 h-5 fill-current translate-xl ml-0.5" />
          )}
        </button>

        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#01012A] truncate">
            {title || "Neural Audio Asset"}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-slate-400 tabular-nums">{formatTime(currentTime)}</span>
            <div className="flex-1 relative h-1.5 group/slider">
              <input 
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="absolute inset-0 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-[#01012A] to-[#2E2C66] rounded-full transition-all duration-100"
                  style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-[9px] font-bold text-slate-400 tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 group-hover:opacity-100 opacity-0 transition-opacity">
           <Icons.Volume2 className="w-3.5 h-3.5 text-slate-300" />
           <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-slate-300 rounded-full"
                style={{ width: `${volume * 100}%` }}
              />
           </div>
        </div>
      </div>
    </div>
  );
}
