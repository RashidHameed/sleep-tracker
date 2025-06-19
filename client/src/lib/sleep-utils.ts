export function calculateDuration(bedtime: string, wakeTime: string): string {
  if (!bedtime || !wakeTime) return "0h 0m";

  const bedtimeParts = bedtime.split(':');
  const waketimeParts = wakeTime.split(':');
  
  const bedtimeMinutes = parseInt(bedtimeParts[0]) * 60 + parseInt(bedtimeParts[1]);
  const waketimeMinutes = parseInt(waketimeParts[0]) * 60 + parseInt(waketimeParts[1]);
  
  let durationMinutes = waketimeMinutes - bedtimeMinutes;
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60; // Add 24 hours if wake time is next day
  }
  
  return formatDuration(durationMinutes / 60);
}

export function formatDuration(hours: number): string {
  if (hours === 0) return "0h 0m";
  
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (wholeHours === 0) {
    return `${minutes}m`;
  }
  
  if (minutes === 0) {
    return `${wholeHours}h`;
  }
  
  return `${wholeHours}h ${minutes}m`;
}

export function getQualityColor(quality: number): string {
  if (quality <= 1) return "text-red-400";
  if (quality <= 2) return "text-orange-400";
  if (quality <= 3) return "text-yellow-400";
  if (quality <= 4) return "text-green-400";
  return "text-emerald-400";
}

export function getQualityEmoji(quality: number): string {
  const emojis = ['😴', '😐', '🙂', '😊', '🌟'];
  return emojis[quality - 1] || '😐';
}
