import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { AlarmSettings } from "@shared/schema";

const alarmTones = [
  "Gentle Chimes",
  "Forest Sounds", 
  "Ocean Waves",
  "Bird Songs"
];

export default function SmartAlarm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alarmSettings } = useQuery<AlarmSettings>({
    queryKey: ['/api/alarm-settings'],
  });

  const updateAlarmMutation = useMutation({
    mutationFn: async (data: Partial<AlarmSettings>) => {
      return apiRequest('PUT', '/api/alarm-settings', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alarm-settings'] });
      toast({
        title: "Alarm settings updated!",
        description: "Your smart alarm has been configured.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update alarm settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleToggle = (enabled: boolean) => {
    updateAlarmMutation.mutate({ enabled: enabled ? 1 : 0 });
  };

  const handleWindowStartChange = (windowStart: string) => {
    updateAlarmMutation.mutate({ windowStart });
  };

  const handleWindowEndChange = (windowEnd: string) => {
    updateAlarmMutation.mutate({ windowEnd });
  };

  const handleToneChange = (tone: string) => {
    updateAlarmMutation.mutate({ tone });
  };

  const previewTone = () => {
    // Simple beep sound for preview
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    
    oscillator.connect(gain);
    gain.connect(context.destination);
    
    oscillator.frequency.setValueAtTime(440, context.currentTime);
    gain.gain.setValueAtTime(0.1, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 1);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 1);

    toast({
      title: "Preview",
      description: `Playing ${alarmSettings?.tone || "Gentle Chimes"}`,
    });
  };

  if (!alarmSettings) {
    return (
      <div className="sleep-card glass-effect rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-white mb-6">Smart Alarm</h3>
        <p className="text-indigo-200">Loading alarm settings...</p>
      </div>
    );
  }

  return (
    <div className="sleep-card glass-effect rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
          <span className="text-green-400">⏰</span>
          <span>Smart Alarm</span>
        </h3>
        <Switch
          checked={alarmSettings.enabled === 1}
          onCheckedChange={handleToggle}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-indigo-200 text-sm font-medium mb-2">Wake-up Window</label>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-white text-sm">From:</span>
              <Input
                type="time"
                value={alarmSettings.windowStart}
                onChange={(e) => handleWindowStartChange(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white bg-opacity-10 text-white border border-white border-opacity-20"
              />
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-white text-sm">To:</span>
              <Input
                type="time"
                value={alarmSettings.windowEnd}
                onChange={(e) => handleWindowEndChange(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white bg-opacity-10 text-white border border-white border-opacity-20"
              />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-indigo-200 text-sm font-medium mb-2">Alarm Tone</label>
          <Select value={alarmSettings.tone} onValueChange={handleToneChange}>
            <SelectTrigger className="w-full px-3 py-2 rounded-lg bg-white bg-opacity-10 text-white border border-white border-opacity-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {alarmTones.map((tone) => (
                <SelectItem key={tone} value={tone}>
                  {tone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-3">
            <Button
              onClick={previewTone}
              className="px-4 py-2 bg-green-500 bg-opacity-20 text-green-400 rounded-lg hover:bg-opacity-30 transition-all text-sm"
            >
              <span className="mr-2">▶️</span>Preview
            </Button>
          </div>
        </div>
      </div>
      
      {alarmSettings.enabled === 1 && (
        <div className="mt-6 p-4 bg-green-500 bg-opacity-10 rounded-xl border border-green-500 border-opacity-20">
          <div className="flex items-center space-x-2 text-green-400">
            <span>💡</span>
            <span className="font-medium">Smart Wake-up Active</span>
          </div>
          <p className="text-green-300 text-sm mt-1">Your alarm will wake you during light sleep phase for a more refreshed feeling</p>
        </div>
      )}
    </div>
  );
}
