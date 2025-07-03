import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface MoodAnalysisRequest {
  text: string;
  energy: number;
  valence: number;
  emoji: string;
  quickMood: string;
}

export interface MoodAnalysisResponse {
  moodEntry: any;
  aiReflection: any;
  recommendations: any[];
  analysis: {
    energy: number;
    valence: number;
    dominantEmotions: string[];
    suggestedGenres: string[];
    reflection: string;
  };
}

export function useMoodAnalysis() {
  return useMutation<MoodAnalysisResponse, Error, MoodAnalysisRequest>({
    mutationFn: async (data) => {
      const response = await apiRequest("POST", "/api/mood-entries", data);
      return response.json();
    },
  });
}

export function useRefreshRecommendations() {
  return useMutation<any[], Error, number>({
    mutationFn: async (moodEntryId) => {
      const response = await apiRequest("POST", `/api/mood-entries/${moodEntryId}/refresh-recommendations`);
      return response.json();
    },
  });
}

export function useSavePlaylist() {
  return useMutation<any, Error, { moodEntryId: number; playlistName: string }>({
    mutationFn: async (data) => {
      const response = await apiRequest("POST", "/api/playlists/save", {
        ...data,
        spotifyPlaylistId: `mood_${data.moodEntryId}_${Date.now()}`,
      });
      return response.json();
    },
  });
}
