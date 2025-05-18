"use client";

import { Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface AudioPlayerProps {
  isPlaying: boolean;
  audioProgress: number;
  audioDuration: number;
  currentTime: number;
  audioSpeed: number;
  volume: number;
  onTogglePlay: () => void;
  onProgressChange: (value: number[]) => void;
  onSpeedChange: (value: number) => void;
  onVolumeChange: (value: number[]) => void;
  formatTime: (seconds: number) => string;
}

export function AudioPlayer({
  isPlaying,
  audioProgress,
  audioDuration,
  currentTime,
  audioSpeed,
  volume,
  onTogglePlay,
  onProgressChange,
  onSpeedChange,
  onVolumeChange,
  formatTime,
}: AudioPlayerProps) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 mb-8 shadow-sm">
      <div className="flex items-center gap-4">
        <Button onClick={onTogglePlay} variant="outline" size="icon" className="h-10 w-10 rounded-full">
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
        </Button>

        <div className="flex-grow">
          <Slider
            value={[audioProgress]}
            max={100}
            step={1}
            onValueChange={onProgressChange}
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
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={(value) => onVolumeChange([value[0] / 100])}
                className="cursor-pointer"
              />
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
}
