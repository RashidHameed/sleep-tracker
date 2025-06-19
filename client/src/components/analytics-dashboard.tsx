import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { useSleepData } from "@/hooks/use-sleep-data";

Chart.register(...registerables);

export default function AnalyticsDashboard() {
  const { analytics } = useSleepData();
  const durationChartRef = useRef<HTMLCanvasElement>(null);
  const qualityChartRef = useRef<HTMLCanvasElement>(null);
  const durationChartInstance = useRef<Chart | null>(null);
  const qualityChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!analytics?.weeklyData?.length) return;

    // Destroy existing charts
    if (durationChartInstance.current) {
      durationChartInstance.current.destroy();
    }
    if (qualityChartInstance.current) {
      qualityChartInstance.current.destroy();
    }

    const labels = analytics.weeklyData.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    });

    // Duration Chart
    if (durationChartRef.current) {
      const ctx = durationChartRef.current.getContext('2d');
      if (ctx) {
        durationChartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Sleep Duration (hours)',
              data: analytics.weeklyData.map(item => item.duration),
              borderColor: '#ffc107',
              backgroundColor: 'rgba(255, 193, 7, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: { color: 'white' }
              }
            },
            scales: {
              y: {
                beginAtZero: false,
                min: Math.max(0, Math.min(...analytics.weeklyData.map(item => item.duration)) - 1),
                max: Math.max(...analytics.weeklyData.map(item => item.duration)) + 1,
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
              },
              x: {
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
              }
            }
          }
        });
      }
    }

    // Quality Chart
    if (qualityChartRef.current) {
      const ctx = qualityChartRef.current.getContext('2d');
      if (ctx) {
        qualityChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Sleep Quality (1-5)',
              data: analytics.weeklyData.map(item => item.quality),
              backgroundColor: analytics.weeklyData.map(item => {
                const alpha = item.quality / 5;
                return `rgba(255, 193, 7, ${alpha})`;
              }),
              borderColor: '#ffc107',
              borderWidth: 1,
              borderRadius: 8
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: { color: 'white' }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 5,
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
              },
              x: {
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
              }
            }
          }
        });
      }
    }

    return () => {
      if (durationChartInstance.current) {
        durationChartInstance.current.destroy();
      }
      if (qualityChartInstance.current) {
        qualityChartInstance.current.destroy();
      }
    };
  }, [analytics]);

  if (!analytics?.weeklyData?.length) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="sleep-card glass-effect rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
            <span className="text-blue-400">📈</span>
            <span>Sleep Duration Trends</span>
          </h3>
          <div className="h-64 flex items-center justify-center text-indigo-300">
            No sleep data available. Start logging your sleep to see trends!
          </div>
        </div>
        
        <div className="sleep-card glass-effect rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
            <span className="text-yellow-400">⭐</span>
            <span>Sleep Quality Patterns</span>
          </h3>
          <div className="h-64 flex items-center justify-center text-indigo-300">
            No sleep data available. Start logging your sleep to see patterns!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="sleep-card glass-effect rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
          <span className="text-blue-400">📈</span>
          <span>Sleep Duration Trends</span>
        </h3>
        <div className="h-64">
          <canvas ref={durationChartRef} className="w-full h-full"></canvas>
        </div>
      </div>
      
      <div className="sleep-card glass-effect rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
          <span className="text-yellow-400">⭐</span>
          <span>Sleep Quality Patterns</span>
        </h3>
        <div className="h-64">
          <canvas ref={qualityChartRef} className="w-full h-full"></canvas>
        </div>
      </div>
    </div>
  );
}
