import { 
  sleepLogs, 
  reminders, 
  alarmSettings,
  type SleepLog, 
  type InsertSleepLog,
  type Reminder,
  type InsertReminder,
  type AlarmSettings,
  type InsertAlarmSettings
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Sleep logs
  getSleepLogs(): Promise<SleepLog[]>;
  getSleepLog(id: number): Promise<SleepLog | undefined>;
  createSleepLog(sleepLog: InsertSleepLog): Promise<SleepLog>;
  deleteSleepLog(id: number): Promise<void>;
  deleteAllSleepLogs(): Promise<void>;
  
  // Reminders
  getReminders(): Promise<Reminder[]>;
  updateReminder(id: number, reminder: Partial<InsertReminder>): Promise<Reminder>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  
  // Alarm settings
  getAlarmSettings(): Promise<AlarmSettings | undefined>;
  updateAlarmSettings(settings: Partial<InsertAlarmSettings>): Promise<AlarmSettings>;
  createAlarmSettings(settings: InsertAlarmSettings): Promise<AlarmSettings>;
}

export class DatabaseStorage implements IStorage {
  async getSleepLogs(): Promise<SleepLog[]> {
    return await db.select().from(sleepLogs).orderBy(sleepLogs.createdAt).then(logs => 
      logs.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
    );
  }

  async getSleepLog(id: number): Promise<SleepLog | undefined> {
    const [log] = await db.select().from(sleepLogs).where(eq(sleepLogs.id, id));
    return log || undefined;
  }

  async createSleepLog(insertSleepLog: InsertSleepLog): Promise<SleepLog> {
    // Calculate duration
    const bedtimeParts = insertSleepLog.bedtime.split(':');
    const waketimeParts = insertSleepLog.wakeTime.split(':');
    
    const bedtimeMinutes = parseInt(bedtimeParts[0]) * 60 + parseInt(bedtimeParts[1]);
    const waketimeMinutes = parseInt(waketimeParts[0]) * 60 + parseInt(waketimeParts[1]);
    
    let durationMinutes = waketimeMinutes - bedtimeMinutes;
    if (durationMinutes < 0) {
      durationMinutes += 24 * 60; // Add 24 hours if wake time is next day
    }
    
    const duration = durationMinutes / 60;

    const [log] = await db
      .insert(sleepLogs)
      .values({
        ...insertSleepLog,
        duration,
        notes: insertSleepLog.notes || null,
      })
      .returning();
    return log;
  }

  async deleteSleepLog(id: number): Promise<void> {
    await db.delete(sleepLogs).where(eq(sleepLogs.id, id));
  }

  async deleteAllSleepLogs(): Promise<void> {
    await db.delete(sleepLogs);
  }

  async getReminders(): Promise<Reminder[]> {
    return await db.select().from(reminders);
  }

  async updateReminder(id: number, reminder: Partial<InsertReminder>): Promise<Reminder> {
    const [updated] = await db
      .update(reminders)
      .set(reminder)
      .where(eq(reminders.id, id))
      .returning();
    
    if (!updated) {
      throw new Error(`Reminder with id ${id} not found`);
    }
    
    return updated;
  }

  async createReminder(reminder: InsertReminder): Promise<Reminder> {
    const [newReminder] = await db
      .insert(reminders)
      .values({
        ...reminder,
        enabled: reminder.enabled ?? 1
      })
      .returning();
    return newReminder;
  }

  async getAlarmSettings(): Promise<AlarmSettings | undefined> {
    const [settings] = await db.select().from(alarmSettings).limit(1);
    return settings || undefined;
  }

  async updateAlarmSettings(settings: Partial<InsertAlarmSettings>): Promise<AlarmSettings> {
    const existing = await this.getAlarmSettings();
    
    if (!existing) {
      // Create new settings if none exist
      const [newSettings] = await db
        .insert(alarmSettings)
        .values({
          enabled: settings.enabled ?? 1,
          windowStart: settings.windowStart ?? '06:30',
          windowEnd: settings.windowEnd ?? '07:00',
          tone: settings.tone ?? 'Gentle Chimes'
        })
        .returning();
      return newSettings;
    }
    
    const [updated] = await db
      .update(alarmSettings)
      .set(settings)
      .where(eq(alarmSettings.id, existing.id))
      .returning();
    
    return updated;
  }

  async createAlarmSettings(settings: InsertAlarmSettings): Promise<AlarmSettings> {
    const [newSettings] = await db
      .insert(alarmSettings)
      .values({
        ...settings,
        enabled: settings.enabled ?? 1,
        tone: settings.tone ?? 'Gentle Chimes'
      })
      .returning();
    return newSettings;
  }
}

export class MemStorage implements IStorage {
  private sleepLogsData: Map<number, SleepLog>;
  private remindersData: Map<number, Reminder>;
  private alarmSettingsData: AlarmSettings | undefined;
  private currentSleepLogId: number;
  private currentReminderId: number;

  constructor() {
    this.sleepLogsData = new Map();
    this.remindersData = new Map();
    this.currentSleepLogId = 1;
    this.currentReminderId = 1;
    
    // Initialize with default reminders
    this.remindersData.set(1, {
      id: 1,
      type: 'bedtime',
      time: '22:00',
      enabled: 1
    });
    this.remindersData.set(2, {
      id: 2,
      type: 'winddown',
      time: '21:30',
      enabled: 1
    });
    this.currentReminderId = 3;
    
    // Initialize with default alarm settings
    this.alarmSettingsData = {
      id: 1,
      enabled: 1,
      windowStart: '06:30',
      windowEnd: '07:00',
      tone: 'Gentle Chimes'
    };
  }

  async getSleepLogs(): Promise<SleepLog[]> {
    return Array.from(this.sleepLogsData.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getSleepLog(id: number): Promise<SleepLog | undefined> {
    return this.sleepLogsData.get(id);
  }

  async createSleepLog(insertSleepLog: InsertSleepLog): Promise<SleepLog> {
    // Calculate duration
    const bedtimeParts = insertSleepLog.bedtime.split(':');
    const waketimeParts = insertSleepLog.wakeTime.split(':');
    
    const bedtimeMinutes = parseInt(bedtimeParts[0]) * 60 + parseInt(bedtimeParts[1]);
    const waketimeMinutes = parseInt(waketimeParts[0]) * 60 + parseInt(waketimeParts[1]);
    
    let durationMinutes = waketimeMinutes - bedtimeMinutes;
    if (durationMinutes < 0) {
      durationMinutes += 24 * 60; // Add 24 hours if wake time is next day
    }
    
    const duration = durationMinutes / 60;

    const id = this.currentSleepLogId++;
    const sleepLog: SleepLog = {
      ...insertSleepLog,
      id,
      duration,
      notes: insertSleepLog.notes || null,
      createdAt: new Date()
    };
    
    this.sleepLogsData.set(id, sleepLog);
    return sleepLog;
  }

  async deleteSleepLog(id: number): Promise<void> {
    this.sleepLogsData.delete(id);
  }

  async deleteAllSleepLogs(): Promise<void> {
    this.sleepLogsData.clear();
  }

  async getReminders(): Promise<Reminder[]> {
    return Array.from(this.remindersData.values());
  }

  async updateReminder(id: number, reminder: Partial<InsertReminder>): Promise<Reminder> {
    const existing = this.remindersData.get(id);
    if (!existing) {
      throw new Error(`Reminder with id ${id} not found`);
    }
    
    const updated = { ...existing, ...reminder };
    this.remindersData.set(id, updated);
    return updated;
  }

  async createReminder(reminder: InsertReminder): Promise<Reminder> {
    const id = this.currentReminderId++;
    const newReminder: Reminder = { 
      ...reminder, 
      id,
      enabled: reminder.enabled ?? 1
    };
    this.remindersData.set(id, newReminder);
    return newReminder;
  }

  async getAlarmSettings(): Promise<AlarmSettings | undefined> {
    return this.alarmSettingsData;
  }

  async updateAlarmSettings(settings: Partial<InsertAlarmSettings>): Promise<AlarmSettings> {
    if (!this.alarmSettingsData) {
      throw new Error('Alarm settings not found');
    }
    
    this.alarmSettingsData = { ...this.alarmSettingsData, ...settings };
    return this.alarmSettingsData;
  }

  async createAlarmSettings(settings: InsertAlarmSettings): Promise<AlarmSettings> {
    const newSettings: AlarmSettings = { 
      ...settings, 
      id: 1,
      enabled: settings.enabled ?? 1,
      tone: settings.tone ?? 'Gentle Chimes'
    };
    this.alarmSettingsData = newSettings;
    return newSettings;
  }
}

export const storage = new DatabaseStorage();
