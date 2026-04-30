"use client";

import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Custom hook for Text-to-Speech using the Web Speech API.
 */
export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback((text: string, lang: string = "en-US") => {
    if (!synthRef.current || !isSupported) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    // Clean up text (remove markdown-like characters if any)
    const cleanText = text
      .replace(/[*_#`~]/g, "") // Remove common markdown
      .replace(/\[.*?\]/g, "") // Remove [IMAGE], [VIDEO] etc.
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang;
    
    // Optional: customize voice
    const voices = synthRef.current.getVoices();
    // Try to find a premium/natural sounding female voice if possible
    const preferredVoice = voices.find(v => 
      (v.name.includes("Google") || v.name.includes("Premium") || v.name.includes("Natural")) && 
      v.name.includes("Female") && 
      v.lang.startsWith("en")
    ) || voices.find(v => v.lang.startsWith("en"));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  }, [isSupported]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported
  };
}
