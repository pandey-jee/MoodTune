import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Brain } from "lucide-react";
import { MoodEntryWithReflection } from "@shared/schema";

interface MoodEntryProps {
  onMoodEntryCreated: (moodEntry: MoodEntryWithReflection) => void;
}

const MOOD_OPTIONS = [
  { emoji: "😊", label: "Happy", value: "happy" },
  { emoji: "🤗", label: "Excited", value: "excited" },
  { emoji: "😰", label: "Anxious", value: "anxious" },
  { emoji: "😌", label: "Calm", value: "calm" },
  { emoji: "😢", label: "Sad", value: "sad" },
  { emoji: "😠", label: "Angry", value: "angry" },
  { emoji: "😕", label: "Confused", value: "confused" },
  { emoji: "🧘", label: "Peaceful", value: "peaceful" },
];

export default function MoodEntry({ onMoodEntryCreated }: MoodEntryProps) {
  const [moodText, setMoodText] = useState("");
  const [energy, setEnergy] = useState([5]);
  const [valence, setValence] = useState([6]);
  const [selectedMood, setSelectedMood] = useState("excited");
  const { toast } = useToast();

  const createMoodMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/mood-entries", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Mood entry created!",
        description: "Your playlist has been generated based on your mood.",
      });
      onMoodEntryCreated(data);
      // Reset form
      setMoodText("");
      setEnergy([5]);
      setValence([6]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create mood entry. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to create mood entry:", error);
    },
  });

  const handleSubmit = () => {
    if (!moodText.trim()) {
      toast({
        title: "Missing mood description",
        description: "Please describe your current mood.",
        variant: "destructive",
      });
      return;
    }

    const selectedMoodOption = MOOD_OPTIONS.find(m => m.value === selectedMood);
    
    createMoodMutation.mutate({
      text: moodText,
      energy: energy[0],
      valence: valence[0],
      emoji: selectedMoodOption?.emoji || "😊",
      quickMood: selectedMood,
    });
  };

  return (
    <section className="mb-8">
      <Card className="bg-white rounded-2xl shadow-lg border border-slate-200">
        <CardContent className="p-6 lg:p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              How are you feeling today?
            </h2>
            <p className="text-slate-600">
              Express your mood and discover music that resonates with your emotions
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Mood Input */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Describe your mood
                </label>
                <Textarea 
                  value={moodText}
                  onChange={(e) => setMoodText(e.target.value)}
                  className="w-full h-32 resize-none"
                  placeholder="I'm feeling excited about the new project at work, but also a bit anxious about the upcoming deadline..."
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Energy Level
                  </label>
                  <Slider
                    value={energy}
                    onValueChange={setEnergy}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>😴 Low</span>
                    <span>⚡ High</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Positivity
                  </label>
                  <Slider
                    value={valence}
                    onValueChange={setValence}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>😢 Negative</span>
                    <span>😊 Positive</span>
                  </div>
                </div>
              </div>

              {/* Quick Mood Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Quick mood selection
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {MOOD_OPTIONS.map((mood) => (
                    <Button
                      key={mood.value}
                      variant="outline"
                      className={`p-3 h-auto flex flex-col items-center space-y-1 ${
                        selectedMood === mood.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-300 hover:border-blue-500 hover:bg-blue-50"
                      }`}
                      onClick={() => setSelectedMood(mood.value)}
                    >
                      <div className="text-2xl">{mood.emoji}</div>
                      <div className="text-xs text-slate-600">{mood.label}</div>
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 shadow-lg"
                onClick={handleSubmit}
                disabled={createMoodMutation.isPending}
              >
                {createMoodMutation.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Creating Your Playlist...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Create My Mood Playlist
                  </>
                )}
              </Button>
            </div>

            {/* Mood Analysis Preview */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Mood Analysis</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Energy Level</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(energy[0] / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-900">{energy[0]}/10</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Positivity</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(valence[0] / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-900">{valence[0]}/10</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white rounded-lg border border-slate-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Brain className="text-accent-600 h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 mb-1">AI Insight</h4>
                      <p className="text-sm text-slate-600">
                        {createMoodMutation.isPending 
                          ? "Analyzing your mood..."
                          : "Complete your mood entry to receive personalized insights and music recommendations tailored to your emotional state."
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
