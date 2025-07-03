import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const diffInMs = now.getTime() - dateObj.getTime();
  
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return dateObj.toLocaleDateString();
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function mapMoodToSpotifyFeatures(energy: number, valence: number) {
  return {
    energy: Math.max(0, Math.min(1, energy / 10)),
    valence: Math.max(0, Math.min(1, valence / 10)),
  };
}

export function getEnergyLabel(energy: number | null): string {
  if (!energy) return "Unknown";
  if (energy > 0.7) return "High Energy";
  if (energy > 0.4) return "Medium Energy";
  return "Low Energy";
}

export function getEnergyColor(energy: number | null): string {
  if (!energy) return "bg-slate-500";
  if (energy > 0.7) return "bg-secondary-500";
  if (energy > 0.4) return "bg-accent-500";
  return "bg-primary-500";
}

export function getMoodEmoji(valence: number, energy: number): string {
  if (valence >= 7 && energy >= 7) return "🤗"; // Excited
  if (valence >= 7 && energy < 5) return "😌"; // Peaceful
  if (valence >= 7) return "😊"; // Happy
  if (valence <= 3 && energy >= 7) return "😠"; // Angry
  if (valence <= 3 && energy < 5) return "😢"; // Sad
  if (valence <= 3) return "😰"; // Anxious
  if (energy < 5) return "😴"; // Tired
  return "😐"; // Neutral
}
