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
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

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
  // Additional refs to track progress without causing re-renders
  const currentProgressRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);

  // Initialize voices and load saved preference
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);

      // Load saved voice preference from localStorage
      const savedVoiceName = localStorage.getItem('tts-voice-preference');
      
      if (savedVoiceName) {
        const savedVoice = voices.find(voice => voice.name === savedVoiceName);
        if (savedVoice) {
          setSelectedVoice(savedVoice);
          return;
        }
      }

      // Find the best default voice
      let bestVoice = null;
      
      // Priority order for default voice selection - Google voices first
      const preferences = [
        // Google English voices (prioritize US, then UK, then others)
        (v: SpeechSynthesisVoice) => v.lang.startsWith('en-US') && v.name.includes('Google'),
        (v: SpeechSynthesisVoice) => v.lang.startsWith('en-GB') && v.name.includes('Google'),
        (v: SpeechSynthesisVoice) => v.lang.startsWith('en') && v.name.includes('Google'),
        // Other high-quality English voices
        (v: SpeechSynthesisVoice) => v.lang.startsWith('en') && v.name.includes('Microsoft'),
        (v: SpeechSynthesisVoice) => v.lang.startsWith('en') && v.name.includes('Apple'),
        (v: SpeechSynthesisVoice) => v.lang.startsWith('en') && v.name.includes('Amazon'),
        (v: SpeechSynthesisVoice) => v.lang.startsWith('en') && v.default,
        (v: SpeechSynthesisVoice) => v.lang.startsWith('en-US'),
        (v: SpeechSynthesisVoice) => v.lang.startsWith('en'),
        (v: SpeechSynthesisVoice) => v.default,
      ];

      for (const preference of preferences) {
        bestVoice = voices.find(preference);
        if (bestVoice) break;
      }

      // Fallback to first available voice
      if (!bestVoice && voices.length > 0) {
        bestVoice = voices[0];
      }

      setSelectedVoice(bestVoice);
    };

    // Load voices immediately if available
    loadVoices();

    // Also listen for voiceschanged event (some browsers load voices asynchronously)
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      }
    };
  }, []);

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
    
    // Initialize progress tracking refs with current values
    currentProgressRef.current = audioProgress;
    currentTimeRef.current = currentTime;
    
    // Rather than updating state directly in the interval, we'll batch updates
    let pendingTimeUpdate: number | null = null;
    let pendingProgressUpdate: number | null = null;
    
    progressIntervalRef.current = setInterval(() => {
      // Only process if still playing
      if (!isPlayingRef.current) return;
      
      // Calculate new time values
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const duration = audioDurationRef.current;
      const newTime = Math.min(elapsed, duration);
      const newProgress = duration > 0 ? (newTime / duration) * 100 : 0;
      
      // Update refs without triggering state changes
      currentTimeRef.current = newTime;
      currentProgressRef.current = newProgress;
      
      // Schedule updates to happen outside the interval
      pendingTimeUpdate = newTime;
      pendingProgressUpdate = newProgress;
      
      // Use requestAnimationFrame to batch updates outside of the interval
      if (typeof window !== 'undefined') {
        requestAnimationFrame(() => {
          if (pendingTimeUpdate !== null) {
            setCurrentTime(pendingTimeUpdate);
            pendingTimeUpdate = null;
          }
          if (pendingProgressUpdate !== null) {
            setAudioProgress(pendingProgressUpdate);
            pendingProgressUpdate = null;
          }
        });
      }
      
      // Handle completion separately
      if (newTime >= duration) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
          // console.log("[AUDIO] Cleared interval at end");
        }
        setIsPlaying(false);
        setAudioProgress(100);
        setCurrentTime(duration);
        if (window.speechSynthesis) window.speechSynthesis.cancel();
      }
    }, 100);
    
    // console.log("[AUDIO] Progress interval running");
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
    // console.log("Word count for speech:", wordCount);

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
    // console.log("Available voices:", voices.length);

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
    // console.log(`[AUDIO] Text length: ${text.length}, Estimated duration: ${estimatedDuration}s, Clamped: ${clampedDuration}s`);
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = audioSpeed;
    utterance.volume = volume;
    
    // Set the selected voice if available
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
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
    // console.log("[AUDIO] Started interval for timer");
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
      // Restart from beginning with new speed
      window.speechSynthesis.cancel();
      setTimeout(() => toggleAudio(), 100);
    }
  };

  // --- VOLUME CHANGE ---
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (utteranceRef.current) utteranceRef.current.volume = newVolume;
  };

  // --- VOICE CHANGE ---
  const handleVoiceChange = (voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
    
    // Save preference to localStorage
    localStorage.setItem('tts-voice-preference', voice.name);
    
    // If currently playing, restart with new voice from beginning
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setTimeout(() => toggleAudio(), 100);
    }
  };

  // --- VOICE LABEL HELPER ---
  const getVoiceLabel = (voice: SpeechSynthesisVoice): string => {
    const name = voice.name;
    const lang = voice.lang;
    
    // Handle Google voices
    if (name.includes('Google')) {
      if (lang.includes('en-US')) return 'Google US';
      if (lang.includes('en-GB')) return 'Google UK';
      if (lang.includes('en-AU')) return 'Google AU';
      if (lang.includes('en-IN')) return 'Google IN';
      return 'Google';
    }
    
    // Handle Microsoft voices
    if (name.includes('Microsoft')) {
      if (name.includes('Zira')) return 'Zira';
      if (name.includes('David')) return 'David';
      if (name.includes('Mark')) return 'Mark';
      if (name.includes('Hazel')) return 'Hazel';
      if (lang.includes('en-US')) return 'Microsoft US';
      if (lang.includes('en-GB')) return 'Microsoft UK';
      return 'Microsoft';
    }
    
    // Handle Apple voices
    if (name.includes('Apple')) {
      if (name.includes('Samantha')) return 'Samantha';
      if (name.includes('Alex')) return 'Alex';
      if (name.includes('Victoria')) return 'Victoria';
      if (name.includes('Daniel')) return 'Daniel';
      if (lang.includes('en-US')) return 'Apple US';
      if (lang.includes('en-GB')) return 'Apple UK';
      return 'Apple';
    }
    
    // Handle Amazon voices
    if (name.includes('Amazon')) {
      return 'Amazon';
    }
    
    // Handle other voices - extract meaningful names
    if (name.includes('Samantha')) return 'Samantha';
    if (name.includes('Alex')) return 'Alex';
    if (name.includes('Victoria')) return 'Victoria';
    if (name.includes('Daniel')) return 'Daniel';
    if (name.includes('Karen')) return 'Karen';
    if (name.includes('Moira')) return 'Moira';
    if (name.includes('Tessa')) return 'Tessa';
    if (name.includes('Veena')) return 'Veena';
    if (name.includes('Fiona')) return 'Fiona';
    
    // Default: clean up the name
    return name.split(' ').slice(0, 2).join(' ');
  };

  // --- VOICE DETAIL HELPER (for full descriptions) ---
  const getVoiceDetail = (voice: SpeechSynthesisVoice): string => {
    const name = voice.name;
    const lang = voice.lang;
    
    // Handle Google voices
    if (name.includes('Google')) {
      if (lang.includes('en-US')) return 'Google US English (Female)';
      if (lang.includes('en-GB')) return 'Google UK English (Female)';
      if (lang.includes('en-AU')) return 'Google Australian English (Female)';
      if (lang.includes('en-IN')) return 'Google Indian English (Female)';
      return 'Google English';
    }
    
    // Handle Microsoft voices
    if (name.includes('Microsoft')) {
      if (name.includes('Zira')) return 'Microsoft Zira (Female)';
      if (name.includes('David')) return 'Microsoft David (Male)';
      if (name.includes('Mark')) return 'Microsoft Mark (Male)';
      if (name.includes('Hazel')) return 'Microsoft Hazel (Female)';
      if (lang.includes('en-US')) return 'Microsoft US English';
      if (lang.includes('en-GB')) return 'Microsoft UK English';
      return 'Microsoft English';
    }
    
    // Handle Apple voices
    if (name.includes('Apple')) {
      if (name.includes('Samantha')) return 'Apple Samantha (Female)';
      if (name.includes('Alex')) return 'Apple Alex (Male)';
      if (name.includes('Victoria')) return 'Apple Victoria (Female)';
      if (name.includes('Daniel')) return 'Apple Daniel (Male)';
      if (lang.includes('en-US')) return 'Apple US English';
      if (lang.includes('en-GB')) return 'Apple UK English';
      return 'Apple English';
    }
    
    // Handle Amazon voices
    if (name.includes('Amazon')) {
      return 'Amazon Polly';
    }
    
    // Handle other voices - extract meaningful names
    if (name.includes('Samantha')) return 'Samantha (Female)';
    if (name.includes('Alex')) return 'Alex (Male)';
    if (name.includes('Victoria')) return 'Victoria (Female)';
    if (name.includes('Daniel')) return 'Daniel (Male)';
    if (name.includes('Karen')) return 'Karen (Female)';
    if (name.includes('Moira')) return 'Moira (Female)';
    if (name.includes('Tessa')) return 'Tessa (Female)';
    if (name.includes('Veena')) return 'Veena (Female)';
    if (name.includes('Fiona')) return 'Fiona (Female)';
    
    // Default: clean up the name
    return name.split(' ').slice(0, 2).join(' ');
  };

  // --- RETURN API ---
  return {
    isPlaying,
    audioProgress,
    audioSpeed,
    audioDuration,
    currentTime,
    volume,
    availableVoices,
    selectedVoice,
    formatTime,
    toggleAudio,
    handleProgressChange,
    handleSpeedChange,
    handleVolumeChange,
    handleVoiceChange,
    getVoiceLabel,
    getVoiceDetail,
  };

}
