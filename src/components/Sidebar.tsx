import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Lightbulb, Clock, TrendingUp } from "lucide-react";
import { MoodEntryWithReflection, MoodEntry } from "@shared/schema";

interface SidebarProps {
  currentMoodEntry: MoodEntryWithReflection | null;
}

export default function Sidebar({ currentMoodEntry }: SidebarProps) {
  const { data: recentMoods } = useQuery<MoodEntry[]>({
    queryKey: ["/api/mood-entries/recent?limit=5"],
  });

  const { data: affirmationData } = useQuery<{ affirmation: string }>({
    queryKey: ["/api/affirmation"],
  });

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const getEnergyBarWidth = (energy: number) => {
    return `${(energy / 10) * 100}%`;
  };

  const getEnergyColor = (energy: number) => {
    if (energy >= 8) return "bg-secondary-500";
    if (energy >= 6) return "bg-accent-500";
    if (energy >= 4) return "bg-primary-500";
    return "bg-slate-400";
  };

  return (
    <div className="space-y-6">
      {/* AI Reflection Card */}
      {currentMoodEntry?.aiReflection && (
        <Card className="bg-gradient-to-br from-accent-50 to-primary-50 border-accent-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Lightbulb className="text-white h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">AI Reflection</h3>
                <p className="text-sm text-slate-600">Personalized insight</p>
              </div>
            </div>
            <p className="text-slate-700 leading-relaxed mb-4">
              {currentMoodEntry.aiReflection.content}
            </p>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Clock className="h-3 w-3" />
              <span>Generated {formatTimeAgo(currentMoodEntry.aiReflection.createdAt)}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Affirmation */}
      {affirmationData && (
        <Card className="bg-gradient-to-br from-secondary-50 to-primary-50 border-secondary-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="text-white h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Daily Affirmation</h3>
                <p className="text-sm text-slate-600">Based on your recent moods</p>
              </div>
            </div>
            <p className="text-slate-700 leading-relaxed">
              {affirmationData.affirmation}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recent Moods */}
      <Card className="bg-white rounded-2xl shadow-lg border border-slate-200">
        <CardHeader>
          <CardTitle className="font-semibold text-slate-900">Recent Moods</CardTitle>
        </CardHeader>
        <CardContent>
          {recentMoods && recentMoods.length > 0 ? (
            <div className="space-y-4">
              {recentMoods.slice(0, 3).map((mood) => (
                <div key={mood.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="text-xl">{mood.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {mood.quickMood ? mood.quickMood.charAt(0).toUpperCase() + mood.quickMood.slice(1) : "Mixed Feelings"}
                      </p>
                      <span className="text-xs text-slate-500">{formatTimeAgo(mood.createdAt)}</span>
                    </div>
                    <p className="text-xs text-slate-600 truncate">{mood.text.slice(0, 50)}...</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-4 h-1 bg-slate-200 rounded-full">
                        <div 
                          className={`h-1 rounded-full ${getEnergyColor(mood.energy)}`}
                          style={{ width: getEnergyBarWidth(mood.energy) }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">Energy: {mood.energy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600 text-center py-4">
              No recent moods to display. Start by creating your first mood entry!
            </p>
          )}
          
          <Button
            variant="ghost"
            className="w-full mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            View All Entries
          </Button>
        </CardContent>
      </Card>

      {/* Mood Insights */}
      <Card className="bg-white rounded-2xl shadow-lg border border-slate-200">
        <CardHeader>
          <CardTitle className="font-semibold text-slate-900">Weekly Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMoods && recentMoods.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Average Mood</span>
                  <div className="flex items-center space-x-2">
                    <div className="text-lg">
                      {recentMoods[0]?.emoji || "😊"}
                    </div>
                    <span className="text-sm font-medium text-slate-900">
                      {recentMoods.length > 0 
                        ? `${(recentMoods.reduce((sum, mood) => sum + mood.valence, 0) / recentMoods.length).toFixed(1)}/10`
                        : "N/A"
                      }
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Most Common</span>
                  <span className="text-sm font-medium text-slate-900">
                    {(recentMoods && recentMoods[0]?.quickMood) ? 
                      recentMoods[0].quickMood.charAt(0).toUpperCase() + recentMoods[0].quickMood.slice(1) : 
                      "Mixed"
                    }
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Entries This Week</span>
                  <span className="text-sm font-medium text-slate-900">{recentMoods.length}</span>
                </div>

                <div className="mt-4 p-3 bg-secondary-50 rounded-lg border border-secondary-200">
                  <div className="flex items-start space-x-2">
                    <TrendingUp className="text-secondary-600 h-4 w-4 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-secondary-800">Keep It Up!</p>
                      <p className="text-xs text-secondary-600">
                        You're building great emotional awareness through regular mood tracking.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-slate-600">
                  Start tracking your moods to see insights here!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
