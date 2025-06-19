import { db } from "./db";
import { sleepLogs } from "@shared/schema";

export async function addSampleData() {
  try {
    // Check if sample data already exists
    const existingLogs = await db.select().from(sleepLogs);
    
    if (existingLogs.length > 0) {
      console.log('Sample data already exists, skipping...');
      return;
    }

    // Generate sample sleep data for the last 10 days
    const sampleData = [];
    const today = new Date();
    
    for (let i = 9; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Vary bedtime between 21:30 and 23:30
      const bedtimeHour = 21 + Math.floor(Math.random() * 2);
      const bedtimeMinute = Math.random() < 0.5 ? 30 : Math.floor(Math.random() * 60);
      const bedtime = `${bedtimeHour.toString().padStart(2, '0')}:${bedtimeMinute.toString().padStart(2, '0')}`;
      
      // Vary wake time between 6:00 and 8:00
      const wakeHour = 6 + Math.floor(Math.random() * 2);
      const wakeMinute = Math.floor(Math.random() * 60);
      const wakeTime = `${wakeHour.toString().padStart(2, '0')}:${wakeMinute.toString().padStart(2, '0')}`;
      
      // Calculate duration
      const bedtimeMinutes = bedtimeHour * 60 + bedtimeMinute;
      const wakeTimeMinutes = wakeHour * 60 + wakeMinute;
      let durationMinutes = wakeTimeMinutes - bedtimeMinutes;
      if (durationMinutes < 0) {
        durationMinutes += 24 * 60; // Add 24 hours if wake time is next day
      }
      const duration = durationMinutes / 60;
      
      // Quality based on duration (better sleep with 7-8 hours)
      let quality;
      if (duration >= 7 && duration <= 8.5) {
        quality = Math.random() < 0.7 ? 4 + Math.floor(Math.random() * 2) : 3 + Math.floor(Math.random() * 2);
      } else if (duration >= 6 && duration < 7) {
        quality = 3 + Math.floor(Math.random() * 2);
      } else {
        quality = 1 + Math.floor(Math.random() * 3);
      }
      
      // Random notes
      const notes = [
        null,
        "Woke up feeling refreshed",
        "Had trouble falling asleep",
        "Woke up several times during the night",
        "Great night's sleep",
        "Felt a bit tired in the morning",
        "Dream about flying",
        "Room was too warm",
        "Perfect temperature",
        "Had a late dinner"
      ];
      
      sampleData.push({
        bedtime,
        wakeTime,
        date: date.toISOString().split('T')[0],
        quality,
        notes: notes[Math.floor(Math.random() * notes.length)],
        duration
      });
    }

    // Insert sample data
    await db.insert(sleepLogs).values(sampleData);
    console.log(`✓ Added ${sampleData.length} sample sleep log entries`);
  } catch (error) {
    console.error('Error adding sample data:', error);
  }
}