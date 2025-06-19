import { pgTable, text, serial, integer, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sleepLogs = pgTable("sleep_logs", {
  id: serial("id").primaryKey(),
  bedtime: text("bedtime").notNull(), // Store as HH:MM format
  wakeTime: text("wake_time").notNull(), // Store as HH:MM format
  date: text("date").notNull(), // Store as YYYY-MM-DD format
  quality: integer("quality").notNull(), // 1-5 scale
  notes: text("notes"),
  duration: real("duration").notNull(), // Duration in hours
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'bedtime' or 'winddown'
  time: text("time").notNull(), // HH:MM format
  enabled: integer("enabled").notNull().default(1), // 1 for enabled, 0 for disabled
});

export const alarmSettings = pgTable("alarm_settings", {
  id: serial("id").primaryKey(),
  enabled: integer("enabled").notNull().default(1),
  windowStart: text("window_start").notNull(),
  windowEnd: text("window_end").notNull(),
  tone: text("tone").notNull().default("Gentle Chimes"),
});

export const insertSleepLogSchema = createInsertSchema(sleepLogs).omit({
  id: true,
  duration: true,
  createdAt: true,
});

export const insertReminderSchema = createInsertSchema(reminders).omit({
  id: true,
});

export const insertAlarmSettingsSchema = createInsertSchema(alarmSettings).omit({
  id: true,
});

export type InsertSleepLog = z.infer<typeof insertSleepLogSchema>;
export type SleepLog = typeof sleepLogs.$inferSelect;
export type InsertReminder = z.infer<typeof insertReminderSchema>;
export type Reminder = typeof reminders.$inferSelect;
export type InsertAlarmSettings = z.infer<typeof insertAlarmSettingsSchema>;
export type AlarmSettings = typeof alarmSettings.$inferSelect;
