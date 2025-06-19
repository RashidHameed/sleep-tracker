import { useQuery } from "@tanstack/react-query";
import type { SleepLog } from "@shared/schema";

interface AnalyticsData {
  weeklyData: Array<{
    date: string;
    duration: number;
    quality: number;
  }>;
  qualityData: number[];
  averageDuration: number;
  averageQuality: number;
  insights: Array<{
    title: string;
    description: string;
    type: string;
  }>;
}

export function useSleepData() {
  const { data: sleepLogs, isLoading: sleepLogsLoading } = useQuery<SleepLog[]>({
    queryKey: ['/api/sleep-logs'],
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery<AnalyticsData>({
    queryKey: ['/api/analytics'],
  });

  return {
    sleepLogs,
    analytics,
    isLoading: sleepLogsLoading || analyticsLoading,
  };
}
