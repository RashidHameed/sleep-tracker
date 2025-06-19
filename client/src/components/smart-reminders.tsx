import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/use-notifications";
import type { Reminder } from "@shared/schema";

export default function SmartReminders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { scheduleNotification } = useNotifications();

  const { data: reminders = [] } = useQuery<Reminder[]>({
    queryKey: ['/api/reminders'],
  });

  const updateReminderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Reminder> }) => {
      return apiRequest('PUT', `/api/reminders/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reminders'] });
      toast({
        title: "Reminder updated!",
        description: "Your reminder settings have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update reminder. Please try again.",
        variant: "destructive",
      });
    },
  });

  const bedtimeReminder = reminders.find(r => r.type === 'bedtime');
  const winddownReminder = reminders.find(r => r.type === 'winddown');

  const handleReminderToggle = (reminder: Reminder, enabled: boolean) => {
    updateReminderMutation.mutate({
      id: reminder.id,
      data: { enabled: enabled ? 1 : 0 }
    });
  };

  const handleTimeChange = (reminder: Reminder, time: string) => {
    updateReminderMutation.mutate({
      id: reminder.id,
      data: { time }
    });
  };

  // Schedule notifications when reminders are enabled
  useEffect(() => {
    reminders.forEach(reminder => {
      if (reminder.enabled) {
        const message = reminder.type === 'bedtime' 
          ? "Time to start winding down for bed!" 
          : "Time to begin your relaxation routine!";
        
        scheduleNotification(reminder.time, message);
      }
    });
  }, [reminders, scheduleNotification]);

  return (
    <div className="sleep-card glass-effect rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
          <span className="text-purple-400">🔔</span>
          <span>Smart Reminders</span>
        </h3>
        <Button variant="ghost" size="icon" className="text-yellow-400 hover:text-yellow-300">
          <span>⚙️</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bedtimeReminder && (
          <div className="p-4 bg-white bg-opacity-5 rounded-xl border border-white border-opacity-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 bg-opacity-30 rounded-full flex items-center justify-center">
                  <span className="text-purple-400 text-sm">🌙</span>
                </div>
                <span className="text-white font-medium">Bedtime Reminder</span>
              </div>
              <Switch
                checked={bedtimeReminder.enabled === 1}
                onCheckedChange={(checked) => handleReminderToggle(bedtimeReminder, checked)}
              />
            </div>
            <p className="text-indigo-200 text-sm mb-3">Get notified 30 minutes before your optimal bedtime</p>
            <div className="flex items-center space-x-2">
              <Input
                type="time"
                value={bedtimeReminder.time}
                onChange={(e) => handleTimeChange(bedtimeReminder, e.target.value)}
                className="px-3 py-2 rounded-lg bg-white bg-opacity-10 text-white text-sm border border-white border-opacity-20"
              />
              <span className="text-indigo-200 text-sm">every night</span>
            </div>
          </div>
        )}
        
        {winddownReminder && (
          <div className="p-4 bg-white bg-opacity-5 rounded-xl border border-white border-opacity-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500 bg-opacity-30 rounded-full flex items-center justify-center">
                  <span className="text-orange-400 text-sm">🧘</span>
                </div>
                <span className="text-white font-medium">Wind-down Routine</span>
              </div>
              <Switch
                checked={winddownReminder.enabled === 1}
                onCheckedChange={(checked) => handleReminderToggle(winddownReminder, checked)}
              />
            </div>
            <p className="text-indigo-200 text-sm mb-3">Start your relaxation routine before bed</p>
            <div className="flex items-center space-x-2">
              <Input
                type="time"
                value={winddownReminder.time}
                onChange={(e) => handleTimeChange(winddownReminder, e.target.value)}
                className="px-3 py-2 rounded-lg bg-white bg-opacity-10 text-white text-sm border border-white border-opacity-20"
              />
              <span className="text-indigo-200 text-sm">every night</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
