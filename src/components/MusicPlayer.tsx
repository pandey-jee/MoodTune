import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, X } from "lucide-react";
import { SpotifyRecommendation } from "@shared/schema";

interface MusicPlayerProps {
  track: SpotifyRecommendation;
  onClose: () => void;
}

export default function MusicPlayer({ track, onClose }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (track.previewUrl) {
      const audioElement = new Audio(track.previewUrl);
      setAudio(audioElement);

      audioElement.addEventListener("timeupdate", () => {
        if (audioElement.duration) {
          setProgress((audioElement.currentTime / audioElement.duration) * 100);
        }
      });

      audioElement.addEventListener("ended", () => {
        setIsPlaying(false);
        setProgress(0);
      });

      return () => {
        audioElement.pause();
        audioElement.remove();
      };
    }
  }, [track.previewUrl]);

  const togglePlayback = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentTime = () => {
    return audio ? audio.currentTime : 0;
  };

  const getDuration = () => {
    return audio ? audio.duration : track.duration || 30;
  };

  if (!track.previewUrl) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-6 z-30">
        <Card className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm ml-auto">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">Preview not available</p>
                <p className="text-xs text-slate-600">{track.trackName} by {track.artistName}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={onClose}
                className="w-8 h-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-6 z-30">
      <Card className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm ml-auto">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <img 
              src={track.albumImageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
              alt={`${track.trackName} album cover`}
              className="w-12 h-12 rounded-lg shadow-md object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{track.trackName}</p>
              <p className="text-xs text-slate-600 truncate">{track.artistName}</p>
              
              {/* Progress bar */}
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs text-slate-500">
                  {formatTime(getCurrentTime())}
                </span>
                <div className="flex-1 bg-slate-200 rounded-full h-1">
                  <div 
                    className="bg-primary-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500">
                  {formatTime(getDuration())}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={togglePlayback}
                className="w-8 h-8 p-0 bg-primary-500 hover:bg-primary-600 text-white"
              >
                {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onClose}
                className="w-8 h-8 p-0 bg-slate-200 hover:bg-slate-300 text-slate-600"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
