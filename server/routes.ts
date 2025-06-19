import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSleepLogSchema, insertReminderSchema, insertAlarmSettingsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Sleep logs routes
  app.get("/api/sleep-logs", async (req, res) => {
    try {
      const sleepLogs = await storage.getSleepLogs();
      res.json(sleepLogs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sleep logs" });
    }
  });

  app.post("/api/sleep-logs", async (req, res) => {
    try {
      const validatedData = insertSleepLogSchema.parse(req.body);
      const sleepLog = await storage.createSleepLog(validatedData);
      res.json(sleepLog);
    } catch (error) {
      res.status(400).json({ message: "Invalid sleep log data" });
    }
  });

  app.delete("/api/sleep-logs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSleepLog(id);
      res.json({ message: "Sleep log deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete sleep log" });
    }
  });

  app.delete("/api/sleep-logs", async (req, res) => {
    try {
      await storage.deleteAllSleepLogs();
      res.json({ message: "All sleep logs deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete all sleep logs" });
    }
  });

  // Analytics route
  app.get("/api/analytics", async (req, res) => {
    try {
      const sleepLogs = await storage.getSleepLogs();
      
      if (sleepLogs.length === 0) {
        return res.json({
          weeklyData: [],
          qualityData: [],
          averageDuration: 0,
          averageQuality: 0,
          insights: []
        });
      }

      // Get last 7 days of data
      const last7Days = sleepLogs.slice(0, 7).reverse();
      
      const weeklyData = last7Days.map(log => ({
        date: log.date,
        duration: log.duration,
        quality: log.quality
      }));

      const qualityData = last7Days.map(log => log.quality);
      
      const averageDuration = sleepLogs.reduce((sum, log) => sum + log.duration, 0) / sleepLogs.length;
      const averageQuality = sleepLogs.reduce((sum, log) => sum + log.quality, 0) / sleepLogs.length;

      // Generate insights
      const insights = [];
      
      if (sleepLogs.length >= 7) {
        const weekdayLogs = sleepLogs.filter(log => {
          const date = new Date(log.date);
          const day = date.getDay();
          return day >= 1 && day <= 5; // Monday to Friday
        });
        
        const weekendLogs = sleepLogs.filter(log => {
          const date = new Date(log.date);
          const day = date.getDay();
          return day === 0 || day === 6; // Saturday and Sunday
        });

        if (weekdayLogs.length > 0 && weekendLogs.length > 0) {
          const weekdayAvg = weekdayLogs.reduce((sum, log) => sum + log.duration, 0) / weekdayLogs.length;
          const weekendAvg = weekendLogs.reduce((sum, log) => sum + log.duration, 0) / weekendLogs.length;
          
          if (weekendAvg - weekdayAvg > 0.5) {
            insights.push({
              title: "Weekend Sleep Pattern",
              description: `You sleep ${(weekendAvg - weekdayAvg).toFixed(1)} hours longer on weekends compared to weekdays. Consider adjusting your weekday bedtime for more consistent sleep.`,
              type: "pattern"
            });
          }
        }

        // Quality insights
        const highQualityLogs = sleepLogs.filter(log => log.quality >= 4);
        if (highQualityLogs.length > 0) {
          const optimalDuration = highQualityLogs.reduce((sum, log) => sum + log.duration, 0) / highQualityLogs.length;
          insights.push({
            title: "Optimal Sleep Duration",
            description: `Your sleep quality peaks at ${optimalDuration.toFixed(1)} hours. You rate nights with this duration ${averageQuality.toFixed(1)}/5 on average.`,
            type: "quality"
          });
        }

        // Bedtime consistency
        const bedtimes = sleepLogs.map(log => {
          const [hours, minutes] = log.bedtime.split(':').map(Number);
          return hours * 60 + minutes;
        });
        
        const avgBedtime = bedtimes.reduce((sum, time) => sum + time, 0) / bedtimes.length;
        const avgHours = Math.floor(avgBedtime / 60);
        const avgMinutes = Math.round(avgBedtime % 60);
        
        insights.push({
          title: "Bedtime Consistency",
          description: `Your most consistent bedtime is ${avgHours.toString().padStart(2, '0')}:${avgMinutes.toString().padStart(2, '0')}. Sticking to this schedule could improve your sleep quality.`,
          type: "consistency"
        });
      }

      res.json({
        weeklyData,
        qualityData,
        averageDuration,
        averageQuality,
        insights
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });

  // Reminders routes
  app.get("/api/reminders", async (req, res) => {
    try {
      const reminders = await storage.getReminders();
      res.json(reminders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reminders" });
    }
  });

  app.put("/api/reminders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertReminderSchema.partial().parse(req.body);
      const reminder = await storage.updateReminder(id, validatedData);
      res.json(reminder);
    } catch (error) {
      res.status(400).json({ message: "Invalid reminder data" });
    }
  });

  // Alarm settings routes
  app.get("/api/alarm-settings", async (req, res) => {
    try {
      const settings = await storage.getAlarmSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alarm settings" });
    }
  });

  app.put("/api/alarm-settings", async (req, res) => {
    try {
      const validatedData = insertAlarmSettingsSchema.partial().parse(req.body);
      const settings = await storage.updateAlarmSettings(validatedData);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: "Invalid alarm settings data" });
    }
  });



  const httpServer = createServer(app);
  return httpServer;
}
