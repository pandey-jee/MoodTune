import { useState } from "react";
import Header from "@/components/Header";
import MoodEntry from "@/components/MoodEntry";
import PlaylistDisplay from "@/components/PlaylistDisplay";
import Sidebar from "@/components/Sidebar";
import MusicPlayer from "@/components/MusicPlayer";
import { MoodEntryWithReflection } from "@shared/schema";

export default function Home() {
  const [currentMoodEntry, setCurrentMoodEntry] = useState<MoodEntryWithReflection | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<any>(null);

  const handleMoodEntryCreated = (moodEntry: MoodEntryWithReflection) => {
    setCurrentMoodEntry(moodEntry);
  };

  const handlePlayTrack = (track: any) => {
    setCurrentlyPlaying(track);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MoodEntry onMoodEntryCreated={handleMoodEntryCreated} />
        
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <PlaylistDisplay 
              moodEntry={currentMoodEntry} 
              onPlayTrack={handlePlayTrack}
            />
          </div>
          
          <div>
            <Sidebar currentMoodEntry={currentMoodEntry} />
          </div>
        </div>
      </main>

      {currentlyPlaying && (
        <MusicPlayer 
          track={currentlyPlaying} 
          onClose={() => setCurrentlyPlaying(null)}
        />
      )}
    </div>
  );
}
