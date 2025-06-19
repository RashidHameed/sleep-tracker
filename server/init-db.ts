import { db } from "./db";
import { reminders, alarmSettings } from "@shared/schema";

export async function initializeDatabase() {
  try {
    // Check if reminders already exist
    const existingReminders = await db.select().from(reminders);
    
    if (existingReminders.length === 0) {
      // Insert default reminders
      await db.insert(reminders).values([
        {
          type: 'bedtime',
          time: '22:00',
          enabled: 1
        },
        {
          type: 'winddown',
          time: '21:30',
          enabled: 1
        }
      ]);
      console.log('✓ Default reminders created');
    }

    // Check if alarm settings already exist
    const existingSettings = await db.select().from(alarmSettings);
    
    if (existingSettings.length === 0) {
      // Insert default alarm settings
      await db.insert(alarmSettings).values({
        enabled: 1,
        windowStart: '06:30',
        windowEnd: '07:00',
        tone: 'Gentle Chimes'
      });
      console.log('✓ Default alarm settings created');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}