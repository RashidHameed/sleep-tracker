import { useEffect } from "react";
import { Moon, Bell, Settings } from "lucide-react";
import SleepLogForm from "@/components/sleep-log-form";
import AnalyticsDashboard from "@/components/analytics-dashboard";
import SmartReminders from "@/components/smart-reminders";
import SmartAlarm from "@/components/smart-alarm";
import SleepInsights from "@/components/sleep-insights";
import RelaxationTools from "@/components/relaxation-tools";
import { Button } from "@/components/ui/button";
import { useSleepData } from "@/hooks/use-sleep-data";
import { useNotifications } from "@/hooks/use-notifications";
import { formatDuration } from "@/lib/sleep-utils";

export default function SleepTracker() {
  const { sleepLogs, analytics } = useSleepData();
  const { requestPermission } = useNotifications();

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const lastNight = sleepLogs?.[0];
  const weeklyAverage = analytics?.averageDuration || 0;
  const averageQuality = analytics?.averageQuality || 0;

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sleep-data.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-night opacity-90"></div>
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1519638831568-d9897f54ed69?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=400")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full flex items-center justify-center">
                <Moon className="text-slate-900 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">DreamTracker</h1>
                <p className="text-indigo-200 text-sm">Your Sleep Wellness Companion</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="glass-effect hover:bg-white hover:bg-opacity-20">
                <Bell className="text-white" />
              </Button>
              <Button variant="ghost" size="icon" className="glass-effect hover:bg-white hover:bg-opacity-20">
                <Settings className="text-white" />
              </Button>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-light text-white mb-2">Good Evening, <span>Sarah</span></h2>
            <p className="text-indigo-200">Ready for a restful night's sleep?</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="sleep-card glass-effect rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-200 text-sm font-medium">Last Night</p>
                <p className="text-2xl font-bold text-white">
                  {lastNight ? formatDuration(lastNight.duration) : "No data"}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <Moon className="text-green-400 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="sleep-card glass-effect rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-200 text-sm font-medium">Sleep Quality</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-white">
                    {lastNight ? `${lastNight.quality}/5` : "N/A"}
                  </p>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-sm ${
                          lastNight && star <= lastNight.quality
                            ? "text-yellow-400"
                            : "text-gray-400"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-yellow-400 text-xl">★</span>
              </div>
            </div>
          </div>
          
          <div className="sleep-card glass-effect rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-200 text-sm font-medium">Weekly Average</p>
                <p className="text-2xl font-bold text-white">
                  {formatDuration(weeklyAverage)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-blue-400 text-xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        <SleepLogForm />
        <AnalyticsDashboard />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SmartReminders />
          <SmartAlarm />
        </div>
        
        <SleepInsights />
        <RelaxationTools />

        {/* Data Management */}
        <div className="sleep-card glass-effect rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
            <span className="text-gray-400">🗄️</span>
            <span>Data & Privacy</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-white font-medium">Export Your Data</h4>
              <p className="text-indigo-200 text-sm">Download all your sleep data as a CSV file for analysis or backup.</p>
              <Button 
                onClick={handleExportData}
                className="bg-blue-500 bg-opacity-20 text-blue-400 hover:bg-opacity-30 flex items-center space-x-2"
              >
                <span>📥</span>
                <span>Export Sleep Data</span>
              </Button>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-white font-medium">Privacy Settings</h4>
              <p className="text-indigo-200 text-sm">Manage your data and privacy preferences.</p>
              <div className="space-y-2">
                <Button 
                  variant="destructive"
                  className="w-full bg-red-500 bg-opacity-20 text-red-400 hover:bg-opacity-30 text-left justify-start"
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete all sleep data? This action cannot be undone.')) {
                      try {
                        await fetch('/api/sleep-logs', { method: 'DELETE' });
                        window.location.reload();
                      } catch (error) {
                        console.error('Failed to delete data:', error);
                      }
                    }
                  }}
                >
                  <span className="mr-2">🗑️</span>Delete All Sleep Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button 
          size="icon"
          className="w-14 h-14 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all"
          onClick={() => {
            document.getElementById('sleep-log-form')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-slate-900 text-xl">+</span>
        </Button>
      </div>
    </div>
  );
}
