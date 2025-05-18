import { useState, useRef, useEffect } from "react";

// Robust, simple audio synthesis hook for play/pause, correct length, elapsed time, and speed
type UseAudioSynthesisOptions = {
  onEnd?: () => void;
};

export function useAudioSynthesis(
  contentRef: React.RefObject<HTMLDivElement | null>,
  options: UseAudioSynthesisOptions = {}
) {
  // State for audio playback
  // --- STATE ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioSpeed, setAudioSpeed] = useState(1);
  const [audioDuration, setAudioDuration] = useState(0); // Always recalc
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1); // 0 to 1

  // --- REFS FOR LATEST STATE ---
  const audioDurationRef = useRef(audioDuration);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    audioDurationRef.current = audioDuration;
  }, [audioDuration]);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // --- REFS ---
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);

  // Initialize audio duration when component mounts
  // --- CLEANUP ---
  useEffect(() => {
    // Cancel speech on unmount
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Cancel speech on page refresh or navigation away
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // --- FORMAT TIME ---
  const formatTime = (seconds: number): string => {
    const positiveSeconds = Math.max(0, seconds);
    const minutes = Math.floor(positiveSeconds / 60);
    const remainingSeconds = Math.floor(positiveSeconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // --- TIMER ---
  const startProgressInterval = () => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    startTimeRef.current = Date.now() - currentTime * 1000;
    progressIntervalRef.current = setInterval(() => {
    // Use functional state update to avoid stale closure
    setCurrentTime((prevTime) => {
      if (!isPlayingRef.current) return prevTime;
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const duration = audioDurationRef.current;
      const newTime = Math.min(elapsed, duration);
      setAudioProgress(
        duration > 0 ? (newTime / duration) * 100 : 0
      );
      if (newTime >= duration) {
        setIsPlaying(false);
        setAudioProgress(100);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
          console.log("[AUDIO] Cleared interval at end");
        }
        if (window.speechSynthesis) window.speechSynthesis.cancel();
      }
      return newTime;
    });
  }, 100);
    console.log("[AUDIO] Progress interval running");
  };

  // --- TEXT & DURATION ESTIMATION ---
  const extractTextContent = (): {
    text: string;
    estimatedDuration: number;
  } => {
    if (!contentRef.current) {
      return { text: "No content available to read.", estimatedDuration: 60 };
    }

    // Use getAllText on the entire container for whole-chapter mode
    function getAllText(element: Element): string {
      let text = "";
      const skipTags = ["button", "input", "select", "textarea", "style", "script", "noscript"];
      // Check for hidden elements
      const isHidden = (el: Element) => {
        const style = window.getComputedStyle(el as HTMLElement);
        return (
          style.display === "none" ||
          el.getAttribute("aria-hidden") === "true"
        );
      };
      element.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent) {
          text += node.textContent.trim() + " ";
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const elem = node as Element;
          const tagName = elem.tagName.toLowerCase();
          if (
            !skipTags.includes(tagName) &&
            !isHidden(elem)
          ) {
            text += getAllText(elem) + " ";
          }
        }
      });
      return text;
    }
    let textContent = getAllText(contentRef.current);

    // Clean up the text (remove extra spaces, normalize whitespace)
    textContent = textContent.replace(/\s+/g, " ").trim();

    // Calculate a better duration estimate based on actual speech rate
    // Average reading speed is about 150-180 words per minute for normal speech
    const wordCount = textContent.split(/\s+/).length;
    console.log("Word count for speech:", wordCount);

    // Get a more accurate estimate based on content length and browser speech rate
    // Different browsers have different speech rates, so we need to be conservative
    const wordsPerMinute = 180 / audioSpeed; // Base rate adjusted for speed

    // Calculate two estimates and use the longer one to ensure we don't end too early
    // 1. Based on word count
    const wordBasedDuration = Math.ceil((wordCount / wordsPerMinute) * 60);

    // 2. Based on character count (some browsers use this metric)
    const charCount = textContent.length;
    const charsPerSecond = 15 / audioSpeed; // Average chars per second
    const charBasedDuration = Math.ceil(charCount / charsPerSecond);

    // Use the longer estimate and add a small buffer
    const rawEstimatedDuration = Math.max(wordBasedDuration, charBasedDuration);
    let estimatedDuration = Math.ceil(rawEstimatedDuration * 1.1); // 10% buffer

    // Clamp duration to [3, 1800] seconds (up to 30 min for long chapters)
    estimatedDuration = Math.max(3, Math.min(estimatedDuration, 1800));
    return { text: textContent, estimatedDuration };
  };

  // Initialize speech synthesis
  const initSpeechSynthesis = () => {
    // Check if speech synthesis is available
    if (typeof window === "undefined" || !window.speechSynthesis) {
      console.error("Speech synthesis not available");
      return false;
    }

    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    console.log("Available voices:", voices.length);

    return true;
  };

  // Store the current position when pausing
  const pausedPositionRef = useRef<number>(0);

  // --- UPDATE DURATION WHEN CONTENT CHANGES ---
  useEffect(() => {
    if (!contentRef.current) return;
    const { estimatedDuration } = extractTextContent();
    setAudioDuration(estimatedDuration);
  }, [contentRef.current]);

  // --- PLAY/PAUSE ---
  const toggleAudio = () => {
    if (!window.speechSynthesis) {
      alert("Your browser does not support text-to-speech functionality.");
      return;
    }
    // If currently playing, pause
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      isPausedRef.current = true;
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      pausedTimeRef.current = currentTime;
      return;
    }
    // If paused, resume
    if (isPausedRef.current && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      isPausedRef.current = false;
      startProgressInterval();
      return;
    }

    // Otherwise, start from beginning
    window.speechSynthesis.cancel();
    setCurrentTime(0);
    setAudioProgress(0);
    pausedTimeRef.current = 0;

    // Get text and estimated duration (already clamped to 1800s in extractTextContent)
    const { text, estimatedDuration } = extractTextContent();
    setAudioDuration(estimatedDuration);
    const clampedDuration = estimatedDuration; // Use this everywhere below

    if (!text || text.length < 5) {
      alert("No content available to read.");
      return;
    }
    console.log(`[AUDIO] Text length: ${text.length}, Estimated duration: ${estimatedDuration}s, Clamped: ${clampedDuration}s`);
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = audioSpeed;
    utterance.volume = volume;
    // On end, stop everything
    utterance.onend = () => {
      setIsPlaying(false);
      setAudioProgress(100);
      setCurrentTime(clampedDuration);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      pausedTimeRef.current = 0;
      isPausedRef.current = false;
      if (options.onEnd) options.onEnd();
    };
    utteranceRef.current = utterance;
    setIsPlaying(true); // Set playing BEFORE starting interval
    window.speechSynthesis.speak(utterance);
    startProgressInterval();
    isPausedRef.current = false;
    console.log("[AUDIO] Started interval for timer");
  };

  // --- SLIDER DRAG ---
  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0];
    const newTime = (newProgress / 100) * audioDuration;
    setAudioProgress(newProgress);
    setCurrentTime(newTime);
    pausedTimeRef.current = newTime;
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setTimeout(() => toggleAudio(), 100); // restart from new position
    }
  };

  // --- SPEED CHANGE ---
  const handleSpeedChange = (value: number) => {
    setAudioSpeed(value);
    // Recalculate duration for new speed
    const { estimatedDuration } = extractTextContent();
    setAudioDuration(estimatedDuration / value); // Faster = shorter duration
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setTimeout(() => toggleAudio(), 100); // restart speech at new speed
    }
  };

  // --- VOLUME CHANGE ---
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (utteranceRef.current) utteranceRef.current.volume = newVolume;
  };

  // --- RETURN API ---
  return {
    isPlaying,
    audioProgress,
    audioSpeed,
    audioDuration,
    currentTime,
    volume,
    formatTime,
    toggleAudio,
    handleProgressChange,
    handleSpeedChange,
    handleVolumeChange,
  };

}
