"use client";

import React, { useState, useCallback, useRef, memo, useEffect } from "react";
import { Play, Pause, Volume2, ChevronDown, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioPlayerProps {
  isPlaying: boolean;
  audioProgress: number;
  audioDuration: number;
  currentTime: number;
  audioSpeed: number;
  volume: number;
  availableVoices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  onTogglePlay: () => void;
  onProgressChange: (value: number[]) => void;
  onSpeedChange: (value: number) => void;
  onVolumeChange: (value: number[]) => void;
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
  getVoiceLabel: (voice: SpeechSynthesisVoice) => string;
  getVoiceDetail: (voice: SpeechSynthesisVoice) => string;
  formatTime: (seconds: number) => string;
}

// Enhanced slider with internal state management
const BasicSlider = memo(function BasicSlider({
  value,
  max,
  onChange,
  className,
}: {
  value: number;
  max: number;
  onChange: (value: number) => void;
  className?: string;
}) {
  // Use internal state to prevent parent re-renders
  const [localValue, setLocalValue] = useState(value);
  const isDraggingRef = useRef(false);

  // Sync with parent but only when not being dragged
  useEffect(() => {
    if (!isDraggingRef.current) {
      setLocalValue(value);
    }
  }, [value]);

  // Handle drag start
  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  // Handle drag end and notify parent
  const handleMouseUp = () => {
    isDraggingRef.current = false;
    onChange(localValue);
  };

  // Update local state while dragging
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setLocalValue(newValue);
    // Only send to parent when dragging ends to prevent loops
  };

  return (
    <div className={`relative w-full ${className ?? ""}`}>
      <input
        type="range"
        min="0"
        max={max}
        value={localValue}
        onChange={handleChange}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        className="audio-progress-slider w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
});

// Use memo to prevent unnecessary re-renders
const AudioPlayerComponent = ({
  isPlaying,
  audioProgress,
  audioDuration,
  currentTime,
  audioSpeed,
  volume,
  availableVoices,
  selectedVoice,
  onTogglePlay,
  onProgressChange,
  onSpeedChange,
  onVolumeChange,
  onVoiceChange,
  getVoiceLabel,
  getVoiceDetail,
  formatTime,
}: AudioPlayerProps) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);
  const prevProgressRef = useRef(audioProgress);
  const prevVolumeRef = useRef(volume);
  const voiceMenuRef = useRef<HTMLDivElement>(null);

  // Using callbackRef pattern for stable callbacks
  const progressChangeCallbackRef = useRef(onProgressChange);
  const volumeChangeCallbackRef = useRef(onVolumeChange);

  // Keep callback refs updated without causing re-renders
  useEffect(() => {
    progressChangeCallbackRef.current = onProgressChange;
    volumeChangeCallbackRef.current = onVolumeChange;
  }, [onProgressChange, onVolumeChange]);

  // Update ref values silently
  useEffect(() => {
    prevProgressRef.current = audioProgress;
  }, [audioProgress]);

  useEffect(() => {
    prevVolumeRef.current = volume;
  }, [volume]);

  // Stable callbacks that don't change when parent re-renders
  const handleProgressChange = useCallback((value: number) => {
    if (Math.abs(value - prevProgressRef.current) > 0.5) {
      progressChangeCallbackRef.current([value]);
    }
  }, []);

  const handleVolumeChange = useCallback((value: number) => {
    if (Math.abs(value / 100 - prevVolumeRef.current) > 0.01) {
      volumeChangeCallbackRef.current([value / 100]);
    }
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (voiceMenuRef.current && !voiceMenuRef.current.contains(event.target as Node)) {
        setShowVoiceMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 mb-8 shadow-sm">
      <div className="flex items-center gap-4">
        <Button onClick={onTogglePlay} variant="outline" size="icon" className="h-10 w-10 rounded-full">
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
        </Button>

        <div className="flex-grow">
          <BasicSlider
            value={audioProgress}
            max={100}
            onChange={handleProgressChange}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-[#6B7280] mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(audioDuration)}</span>
          </div>
        </div>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
          >
            <Volume2 className="h-5 w-5 text-[#6B7280]" />
          </Button>

          {showVolumeSlider && (
            <div className="absolute right-0 bottom-full mb-2 bg-white border border-[#E5E7EB] rounded-lg p-3 shadow-md w-32">
              <BasicSlider
                value={volume * 100}
                max={100}
                onChange={handleVolumeChange}
                className="cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Voice Selector */}
        <div className="relative" ref={voiceMenuRef}>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-[#4B5563] hover:bg-[#F3F4F6] flex items-center gap-1"
            onClick={() => setShowVoiceMenu(!showVoiceMenu)}
          >
            <Mic className="h-3 w-3" />
            <span className="hidden sm:inline max-w-[60px] truncate">
              {selectedVoice ? getVoiceLabel(selectedVoice) : 'Voice'}
            </span>
            <ChevronDown className="h-3 w-3" />
          </Button>

          {showVoiceMenu && (
            <div className="absolute right-0 bottom-full mb-2 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
              <div className="p-2">
                <div className="text-xs font-medium text-[#374151] mb-2 px-2">Select Voice</div>
                {availableVoices
                  .filter(voice => voice.lang.startsWith('en'))
                  .map((voice) => (
                    <button
                      key={voice.name}
                      onClick={() => {
                        onVoiceChange(voice);
                        setShowVoiceMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-[#F3F4F6] transition-colors ${
                        selectedVoice?.name === voice.name ? 'bg-[#1EB53A]/10 text-[#1EB53A]' : 'text-[#4B5563]'
                      }`}
                    >
                      <div className="font-medium">{getVoiceLabel(voice)}</div>
                      <div className="text-xs text-[#6B7280]">{getVoiceDetail(voice)}</div>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        <select
          value={audioSpeed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="bg-[#F3F4F6] border border-[#E5E7EB] rounded px-2 py-1 text-sm text-[#4B5563]"
        >
          <option value="0.5">0.5x</option>
          <option value="0.75">0.75x</option>
          <option value="1">1x</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </select>
      </div>
    </div>
  );
};

// Export as a function component to match the original export signature
export function AudioPlayer(props: AudioPlayerProps) {
  return <AudioPlayerComponent {...props} />;
}
