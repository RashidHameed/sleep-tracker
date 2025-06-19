import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function RelaxationTools() {
  const { toast } = useToast();

  const startBreathingExercise = () => {
    toast({
      title: "Breathing Exercise",
      description: "Starting 4-7-8 breathing technique for relaxation.",
    });
  };

  const playSleepSounds = () => {
    toast({
      title: "Sleep Sounds",
      description: "Playing relaxing nature sounds to help you sleep.",
    });
  };

  const startMeditation = () => {
    toast({
      title: "Meditation Started",
      description: "Beginning guided sleep meditation.",
    });
  };

  return (
    <div className="sleep-card glass-effect rounded-2xl p-8">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
        <span className="text-teal-400">🧘</span>
        <span>Relaxation & Wind-down</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white bg-opacity-5 rounded-xl border border-white border-opacity-10 text-center hover:bg-opacity-10 transition-all cursor-pointer">
          <div className="w-16 h-16 bg-teal-500 bg-opacity-30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-teal-400 text-2xl">🍃</span>
          </div>
          <h4 className="text-white font-medium mb-2">Breathing Exercise</h4>
          <p className="text-indigo-200 text-sm mb-4">4-7-8 breathing technique for deep relaxation</p>
          <Button 
            onClick={startBreathingExercise}
            className="bg-teal-500 bg-opacity-20 text-teal-400 hover:bg-opacity-30 text-sm"
          >
            Start Session
          </Button>
        </div>
        
        <div className="p-6 bg-white bg-opacity-5 rounded-xl border border-white border-opacity-10 text-center hover:bg-opacity-10 transition-all cursor-pointer">
          <div className="w-16 h-16 bg-purple-500 bg-opacity-30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-purple-400 text-2xl">🎵</span>
          </div>
          <h4 className="text-white font-medium mb-2">Sleep Sounds</h4>
          <p className="text-indigo-200 text-sm mb-4">Calming nature sounds and white noise</p>
          <Button 
            onClick={playSleepSounds}
            className="bg-purple-500 bg-opacity-20 text-purple-400 hover:bg-opacity-30 text-sm"
          >
            Play Sounds
          </Button>
        </div>
        
        <div className="p-6 bg-white bg-opacity-5 rounded-xl border border-white border-opacity-10 text-center hover:bg-opacity-10 transition-all cursor-pointer">
          <div className="w-16 h-16 bg-indigo-500 bg-opacity-30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-indigo-400 text-2xl">🕐</span>
          </div>
          <h4 className="text-white font-medium mb-2">Sleep Meditation</h4>
          <p className="text-indigo-200 text-sm mb-4">Guided meditation for better sleep</p>
          <Button 
            onClick={startMeditation}
            className="bg-indigo-500 bg-opacity-20 text-indigo-400 hover:bg-opacity-30 text-sm"
          >
            Begin Meditation
          </Button>
        </div>
      </div>
    </div>
  );
}
