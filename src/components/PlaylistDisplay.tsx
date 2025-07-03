import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Play, Heart, Music } from "lucide-react";
import { MoodEntryWithReflection, SpotifyRecommendation } from "@shared/schema";

interface PlaylistDisplayProps {
  moodEntry: MoodEntryWithReflection | null;
  onPlayTrack: (track: SpotifyRecommendation) => void;
}

export default function PlaylistDisplay({ moodEntry, onPlayTrack }: PlaylistDisplayProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());

  const refreshMutation = useMutation({
    mutationFn: async (moodEntryId: number) => {
      const response = await apiRequest("POST", `/api/mood-entries/${moodEntryId}/refresh-recommendations`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Playlist refreshed!",
        description: "New recommendations have been generated for your mood.",
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/mood-entries"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to refresh playlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const savePlaylistMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/playlists/save", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Playlist saved!",
        description: "Your mood playlist has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save playlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleRefresh = () => {
    if (moodEntry) {
      refreshMutation.mutate(moodEntry.id);
    }
  };

  const handleSavePlaylist = () => {
    if (moodEntry) {
      savePlaylistMutation.mutate({
        moodEntryId: moodEntry.id,
        spotifyPlaylistId: `mood_${moodEntry.id}_${Date.now()}`,
        playlistName: `${moodEntry.emoji} ${moodEntry.quickMood || 'Mood'} Playlist`,
      });
    }
  };

  const handleLikeTrack = (trackId: string) => {
    setLikedTracks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  };

  const getEnergyLabel = (energy: number | null) => {
    if (!energy) return "Unknown";
    if (energy > 0.7) return "High Energy";
    if (energy > 0.4) return "Medium Energy";
    return "Low Energy";
  };

  const getEnergyColor = (energy: number | null) => {
    if (!energy) return "bg-slate-500";
    if (energy > 0.7) return "bg-secondary-500";
    if (energy > 0.4) return "bg-accent-500";
    return "bg-primary-500";
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!moodEntry) {
    return (
      <Card className="bg-white rounded-2xl shadow-lg border border-slate-200">
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Music className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Your Mood Playlist</h3>
            <p className="text-slate-600">
              Create a mood entry to get personalized music recommendations
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-2xl shadow-lg border border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold text-slate-900">Your Mood Playlist</CardTitle>
          <p className="text-slate-600">Curated for your current emotional state</p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={refreshMutation.isPending}
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
        >
          <RefreshCw className={`h-4 w-4 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {moodEntry.recommendations && moodEntry.recommendations.length > 0 ? (
          <div className="space-y-4">
            {moodEntry.recommendations.map((track, index) => (
              <div 
                key={`${track.spotifyTrackId}-${index}`}
                className="flex items-center space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <img 
                  src={track.albumImageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"} 
                  alt={`${track.trackName} album cover`}
                  className="w-16 h-16 rounded-lg shadow-md object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 truncate">{track.trackName}</h4>
                  <p className="text-sm text-slate-600 truncate">{track.artistName}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-slate-500">{formatDuration(track.duration)}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${getEnergyColor(track.energy)}`} />
                      <span className="text-xs text-slate-500">{getEnergyLabel(track.energy)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    className="w-8 h-8 p-0 bg-primary-500 hover:bg-primary-600 text-white"
                    onClick={() => onPlayTrack(track)}
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`w-8 h-8 p-0 ${
                      likedTracks.has(track.spotifyTrackId) 
                        ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-600'
                    }`}
                    onClick={() => handleLikeTrack(track.spotifyTrackId)}
                  >
                    <Heart className={`h-3 w-3 ${likedTracks.has(track.spotifyTrackId) ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-600">No recommendations available. Try refreshing or creating a new mood entry.</p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-200">
          <Button 
            className="w-full bg-secondary-500 hover:bg-secondary-600 text-white"
            onClick={handleSavePlaylist}
            disabled={savePlaylistMutation.isPending || !moodEntry.recommendations?.length}
          >
            {savePlaylistMutation.isPending ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Music className="mr-2 h-4 w-4" />
                Save to Spotify
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
