import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertSleepLogSchema, type InsertSleepLog } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { calculateDuration } from "@/lib/sleep-utils";

const qualityEmojis = ['😴', '😐', '🙂', '😊', '🌟'];
const qualityLabels = ['Poor', 'Fair', 'Good', 'Great', 'Excellent'];

export default function SleepLogForm() {
  const [selectedQuality, setSelectedQuality] = useState<number>(4);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertSleepLog>({
    resolver: zodResolver(insertSleepLogSchema),
    defaultValues: {
      bedtime: "22:30",
      wakeTime: "06:30",
      date: new Date().toISOString().split('T')[0],
      quality: 4,
      notes: "",
    },
  });

  const createSleepLogMutation = useMutation({
    mutationFn: async (data: InsertSleepLog) => {
      return apiRequest('POST', '/api/sleep-logs', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sleep-logs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
      toast({
        title: "Sleep log saved!",
        description: "Your sleep data has been recorded successfully.",
      });
      form.reset();
      setSelectedQuality(4);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save sleep log. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertSleepLog) => {
    createSleepLogMutation.mutate({ ...data, quality: selectedQuality });
  };

  const bedtime = form.watch("bedtime");
  const wakeTime = form.watch("wakeTime");
  const calculatedDuration = calculateDuration(bedtime, wakeTime);

  return (
    <div id="sleep-log-form" className="sleep-card glass-effect rounded-2xl p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white">+</span>
        </div>
        <h3 className="text-xl font-semibold text-white">Log Tonight's Sleep</h3>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="bedtime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-indigo-200 text-sm font-medium">Bedtime</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="time"
                        className="time-picker text-gray-800 font-medium focus:ring-2 focus:ring-yellow-400"
                        {...field}
                      />
                    </FormControl>
                    <span className="absolute right-3 top-3 text-gray-600">🌙</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="wakeTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-indigo-200 text-sm font-medium">Wake-up Time</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="time"
                        className="time-picker text-gray-800 font-medium focus:ring-2 focus:ring-yellow-400"
                        {...field}
                      />
                    </FormControl>
                    <span className="absolute right-3 top-3 text-gray-600">☀️</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-indigo-200 text-sm font-medium">Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className="time-picker text-gray-800 font-medium focus:ring-2 focus:ring-yellow-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div>
            <label className="block text-indigo-200 text-sm font-medium mb-3">Sleep Quality</label>
            <div className="flex justify-center space-x-4">
              {qualityEmojis.map((emoji, index) => {
                const quality = index + 1;
                return (
                  <button
                    key={quality}
                    type="button"
                    className={`quality-selector w-12 h-12 rounded-full flex items-center justify-center text-lg ${
                      selectedQuality === quality
                        ? 'active-quality'
                        : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                    }`}
                    onClick={() => setSelectedQuality(quality)}
                  >
                    {emoji}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-indigo-300 mt-2 px-2">
              {qualityLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-indigo-200 text-sm font-medium">Sleep Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-white bg-opacity-10 text-white placeholder-indigo-300 border-white border-opacity-20 focus:ring-2 focus:ring-yellow-400 resize-none"
                    rows={3}
                    placeholder="How did you sleep? Any dreams or disturbances?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex items-center justify-between">
            <div className="text-indigo-200">
              <span className="text-sm">Calculated Duration: </span>
              <span className="text-lg font-semibold text-white">{calculatedDuration}</span>
            </div>
            <Button
              type="submit"
              disabled={createSleepLogMutation.isPending}
              className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-semibold rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all transform hover:scale-105"
            >
              {createSleepLogMutation.isPending ? "Saving..." : "Save Sleep Log"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
