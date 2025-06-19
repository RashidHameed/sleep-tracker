import { useState, useCallback } from "react";
import { useToast } from "./use-toast";

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' ? Notification.permission : 'default'
  );
  const { toast } = useToast();

  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    if (permission === 'granted') {
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === 'granted') {
      toast({
        title: "Notifications enabled!",
        description: "You'll receive sleep reminders at your scheduled times.",
      });
    } else {
      toast({
        title: "Notifications disabled",
        description: "You can still use the app, but won't receive automatic reminders.",
        variant: "destructive",
      });
    }
  }, [permission, toast]);

  const scheduleNotification = useCallback((time: string, message: string) => {
    if (permission !== 'granted') {
      return;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If the time has already passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    setTimeout(() => {
      if (permission === 'granted') {
        new Notification('DreamTracker Reminder', {
          body: message,
          icon: '/favicon.ico', // You can add a custom icon
          tag: 'sleep-reminder',
        });
      }
    }, timeUntilNotification);
  }, [permission]);

  const showNotification = useCallback((title: string, message: string) => {
    if (permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico',
      });
    }
  }, [permission]);

  return {
    permission,
    requestPermission,
    scheduleNotification,
    showNotification,
  };
}
