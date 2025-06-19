import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function RelaxationTools() {
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCount, setBreathingCount] = useState(0);
  const { toast } = useToast();

  const startBreathingExercise = () => {
    if (breathingActive) {
      setBreathingActive(false);
      setBreathingCount(0);
      return;
    }

    setBreathingActive(true);
    setBreathingCount(0);
    setBreathingPhase('inhale');

    const cycle = () => {
      if (!breathingActive) return;

      // 4-7-8 breathing pattern
      setTimeout(() => {
        setBreathingPhase('hold');
        setTimeout(() => {
          setBreathingPhase('exhale');
          setTimeout(() => {
            setBreathingCount(prev => prev + 1);
            setBreathingPhase('inhale');
            if (breathingCount < 4) {
              cycle();
            } else {
              setBreathingActive(false);
              toast({
                title: "Breathing exercise complete!",
                description: "Great job! You've completed 4 breathing cycles.",
              });
            }
          }, 8000); // 8 seconds exhale
        }, 7000); // 7 seconds hold
      }, 4000); // 4 seconds inhale
    };

    cycle();
  };

  const playSleepSounds = () => {
    toast({
      title: "Sleep Sounds",
      description: "Playing relaxing nature sounds to help you sleep.",
    });
    // In a real app, this would play actual audio files
  };

  const startMeditation = () => {
    toast({
      title: "Meditation Started",
      description: "Beginning a 10-minute guided sleep meditation.",
    });
    // In a real app, this would start a meditation session
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
          
          {breathingActive && (
            <div className="mb-4">
              <div className="text-white text-lg font-semibold mb-2">
                {breathingPhase === 'inhale' && 'Breathe In...'}
                {breathingPhase === 'hold' && 'Hold...'}
                {breathingPhase === 'exhale' && 'Breathe Out...'}
              </div>
              <div className="text-indigo-300 text-sm">
                Cycle {breathingCount + 1} of 4
              </div>
            </div>
          )}
          
          <Button 
            onClick={startBreathingExercise}
            className="bg-teal-500 bg-opacity-20 text-teal-400 hover:bg-opacity-30 text-sm"
          >
            {breathingActive ? 'Stop Session' : 'Start Session'}
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
