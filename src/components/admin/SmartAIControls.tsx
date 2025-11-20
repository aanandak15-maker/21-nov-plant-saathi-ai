import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { smartAIService } from '@/lib/ai/SmartAIService';
import { enhancedGeminiService } from '@/lib/ai/EnhancedGeminiService';
import { useToast } from '@/hooks/use-toast';
import { Brain, DollarSign, MessageSquare, TrendingDown, Save } from 'lucide-react';

export const SmartAIControls = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = () => {
    const currentRules = smartAIService.getRules();
    setRules(currentRules);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Rules are already updated in state, just show confirmation
      toast({
        title: 'Settings Saved',
        description: 'Smart AI rules have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRule = async (path: string, value: any) => {
    await smartAIService.updateRule(path, value);
    loadRules();
  };

  if (!rules) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Smart AI Controls</h2>
          <p className="text-muted-foreground">Configure AI behavior and cost optimization</p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Cost Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Cost Optimization
          </CardTitle>
          <CardDescription>Control AI spending and caching</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="cost-enabled">Enable Cost Optimization</Label>
            <Switch
              id="cost-enabled"
              checked={rules.costOptimization.enabled}
              onCheckedChange={(checked) => updateRule('costOptimization.enabled', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-calls">Max Gemini Calls Per Day (per user)</Label>
            <Input
              id="max-calls"
              type="number"
              value={rules.costOptimization.maxGeminiCallsPerDay}
              onChange={(e) => updateRule('costOptimization.maxGeminiCallsPerDay', parseInt(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Current: {rules.costOptimization.maxGeminiCallsPerDay} calls/day
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cache-hours">Cache Responses For (hours)</Label>
            <Input
              id="cache-hours"
              type="number"
              value={rules.costOptimization.cacheResponsesForHours}
              onChange={(e) => updateRule('costOptimization.cacheResponsesForHours', parseInt(e.target.value))}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="local-first">Use Local Intelligence First</Label>
            <Switch
              id="local-first"
              checked={rules.costOptimization.useLocalIntelligenceFirst}
              onCheckedChange={(checked) => updateRule('costOptimization.useLocalIntelligenceFirst', checked)}
            />
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <p className="text-sm font-semibold text-green-800 dark:text-green-200">
              💰 Estimated Monthly Savings
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ~90% cost reduction
            </p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
              Based on local intelligence + caching
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Intelligent Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Intelligent Questions
          </CardTitle>
          <CardDescription>Proactive learning from user behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="questions-enabled">Enable Intelligent Questions</Label>
            <Switch
              id="questions-enabled"
              checked={rules.intelligentQuestions.enabled}
              onCheckedChange={(checked) => updateRule('intelligentQuestions.enabled', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-questions">Max Questions Per Week (per user)</Label>
            <Input
              id="max-questions"
              type="number"
              value={rules.intelligentQuestions.maxQuestionsPerWeek}
              onChange={(e) => updateRule('intelligentQuestions.maxQuestionsPerWeek', parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cooldown">Question Cooldown (days)</Label>
            <Input
              id="cooldown"
              type="number"
              value={rules.learningBehavior.questionCooldownDays}
              onChange={(e) => updateRule('learningBehavior.questionCooldownDays', parseInt(e.target.value))}
            />
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
              📊 Active Question Triggers
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {rules.intelligentQuestions.triggers.length}
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Context-aware questions configured
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Learning Behavior */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Learning Behavior
          </CardTitle>
          <CardDescription>How AI learns from user patterns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="analyze-blackbox">Analyze BlackBox Data</Label>
            <Switch
              id="analyze-blackbox"
              checked={rules.learningBehavior.analyzeBlackBoxData}
              onCheckedChange={(checked) => updateRule('learningBehavior.analyzeBlackBoxData', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="analysis-freq">Analysis Frequency</Label>
            <select
              id="analysis-freq"
              className="w-full p-2 border rounded-md"
              value={rules.learningBehavior.analysisFrequency}
              onChange={(e) => updateRule('learningBehavior.analysisFrequency', e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="min-interactions">Min Interactions Before Analysis</Label>
            <Input
              id="min-interactions"
              type="number"
              value={rules.learningBehavior.minInteractionsBeforeAnalysis}
              onChange={(e) => updateRule('learningBehavior.minInteractionsBeforeAnalysis', parseInt(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Proactive Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-orange-600" />
            Proactive Recommendations
          </CardTitle>
          <CardDescription>Automatic alerts and suggestions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="proactive-enabled">Enable Proactive Recommendations</Label>
            <Switch
              id="proactive-enabled"
              checked={rules.proactiveRecommendations.enabled}
              onCheckedChange={(checked) => updateRule('proactiveRecommendations.enabled', checked)}
            />
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
            <p className="text-sm font-semibold text-orange-800 dark:text-orange-200">
              🎯 Active Triggers
            </p>
            <ul className="mt-2 space-y-1 text-xs text-orange-700 dark:text-orange-300">
              <li>• NDVI drop detection</li>
              <li>• Weather alerts</li>
              <li>• Market opportunities</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              enhancedGeminiService.clearCache();
              toast({ title: 'Cache Cleared', description: 'All cached responses have been removed.' });
            }}
          >
            Clear Response Cache
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              loadRules();
              toast({ title: 'Rules Reloaded', description: 'Configuration has been refreshed.' });
            }}
          >
            Reload Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
