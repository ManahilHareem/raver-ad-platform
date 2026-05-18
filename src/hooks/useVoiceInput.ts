"use client";

import { useState, useRef, useCallback, useEffect } from "react";

// Extend Window interface for SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

/**
 * Custom hook for real-time speech-to-text using the Web Speech API.
 * 
 * @param onFinalResult - Callback fired when a final (committed) transcript is available
 * @param lang - BCP-47 language tag (default: "en-US")
 * @returns { isListening, interimText, startListening, stopListening, isSupported }
 */
export function useVoiceInput(
  onFinalResult: (text: string) => void,
  lang: string = "en-US"
) {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const shouldBeListeningRef = useRef(false);
  const consecutiveRestartCountRef = useRef(0);
  const lastRestartTimeRef = useRef(0);

  // Check browser support on mount
  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
    setIsSupported(supported);
  }, []);

  const startRecognition = useCallback(() => {
    if (!isSupported) return;

    // Create a new recognition instance each time
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      setInterimText(interim);

      if (final) {
        onFinalResult(final);
        setInterimText("");
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      
      // Stop automatic listening on permission blocks or critical errors
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed" ||
        event.error === "language-not-supported"
      ) {
        shouldBeListeningRef.current = false;
      }
    };

    recognition.onend = () => {
      // If the user hasn't explicitly stopped listening, auto-restart the browser API
      if (shouldBeListeningRef.current) {
        const now = Date.now();
        if (now - lastRestartTimeRef.current < 1000) {
          consecutiveRestartCountRef.current += 1;
        } else {
          consecutiveRestartCountRef.current = 0;
        }
        lastRestartTimeRef.current = now;

        // Prevent rapid infinite restart loops if microphone is blocked or failing
        if (consecutiveRestartCountRef.current > 5) {
          console.warn("Speech recognition restarting too rapidly. Stopping to prevent loop.");
          shouldBeListeningRef.current = false;
          setIsListening(false);
          setInterimText("");
          return;
        }

        console.log("Speech recognition timeout detected. Auto-restarting loop...");
        try {
          // Slight delay to allow audio device state release/re-entry
          setTimeout(() => {
            if (shouldBeListeningRef.current) {
              startRecognition();
            }
          }, 100);
        } catch (err) {
          console.error("Failed to auto-restart speech recognition:", err);
          setIsListening(false);
          setInterimText("");
        }
      } else {
        setIsListening(false);
        setInterimText("");
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      shouldBeListeningRef.current = false;
      setIsListening(false);
      setInterimText("");
    }
  }, [isSupported, lang, onFinalResult]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }
    
    shouldBeListeningRef.current = true;
    consecutiveRestartCountRef.current = 0;
    lastRestartTimeRef.current = Date.now();
    startRecognition();
  }, [isSupported, startRecognition]);

  const stopListening = useCallback(() => {
    shouldBeListeningRef.current = false;
    if (recognitionRef.current) {
      // Unbind to prevent race conditions during intentional stop
      recognitionRef.current.onend = null;
      recognitionRef.current.onerror = null;
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn("Failed to stop recognition cleanly:", err);
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimText("");
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      shouldBeListeningRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        try {
          recognitionRef.current.abort();
        } catch (err) {
          // ignore
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  return {
    isListening,
    interimText,
    startListening,
    stopListening,
    isSupported,
  };
}
