import { useSleepData } from "@/hooks/use-sleep-data";

const insightIcons = {
  pattern: "📊",
  quality: "⭐",
  consistency: "🌙",
  default: "🧠"
};

export default function SleepInsights() {
  const { analytics } = useSleepData();

  const insights = analytics?.insights || [];

  if (!insights.length) {
    return (
      <div className="sleep-card glass-effect rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
          <span className="text-pink-400">🧠</span>
          <span>Sleep Insights & Patterns</span>
        </h3>
        <div className="text-center py-8">
          <p className="text-indigo-200 text-lg">Need more data for insights</p>
          <p className="text-indigo-300 text-sm mt-2">
            Log at least 7 nights of sleep to unlock personalized insights and patterns!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="sleep-card glass-effect rounded-2xl p-8">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
        <span className="text-pink-400">🧠</span>
        <span>Sleep Insights & Patterns</span>
      </h3>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start space-x-4 p-4 bg-white bg-opacity-5 rounded-xl border border-white border-opacity-10">
            <div className="w-10 h-10 bg-blue-500 bg-opacity-30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-blue-400">
                {insightIcons[insight.type as keyof typeof insightIcons] || insightIcons.default}
              </span>
            </div>
            <div>
              <h4 className="text-white font-medium mb-1">{insight.title}</h4>
              <p className="text-indigo-200 text-sm">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
