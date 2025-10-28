import { useState } from "react";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Sparkles, X, Loader2 } from "lucide-react";
import { analyzeSentiment } from "../lib/api";

export function RealtimeAnalyzer() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<{
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    confidence: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (text.trim().length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await analyzeSentiment(text);
      
      // Transform backend response to frontend format
      const transformedResult = {
        sentiment: result.sentiment_label.toLowerCase() as 'positive' | 'negative' | 'neutral',
        score: result.sentiment_score,
        confidence: result.sentiment_score, // Using score as confidence for now
      };
      
      setAnalysis(transformedResult);
    } catch (err) {
      console.error('Error analyzing sentiment:', err);
      setError('Failed to analyze sentiment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setAnalysis(null);
    setError(null);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '#10B981';
      case 'negative':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getSentimentBgColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-50';
      case 'negative':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2>Real-time Sentiment Analyzer</h2>
          {text && (
            <Button variant="outline" size="sm" onClick={handleClear}>
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Textarea
              placeholder="Type or paste text here to analyze sentiment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              className="resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-neutral-500" style={{ fontSize: '14px' }}>
                {text.length} characters
              </span>
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={text.trim().length === 0 || loading}
            className="w-full"
            style={{ backgroundColor: '#3B82F6' }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze Sentiment
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </Card>

      {analysis && (
        <Card 
          className={`p-6 border-2 transition-all duration-300 ${getSentimentBgColor(analysis.sentiment)}`}
          style={{ borderColor: getSentimentColor(analysis.sentiment) }}
        >
          <h3 className="mb-6">Analysis Results</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-neutral-600 mb-2">Sentiment</p>
              <Badge 
                className="px-4 py-2"
                style={{ 
                  backgroundColor: getSentimentColor(analysis.sentiment),
                  color: 'white',
                  fontSize: '16px'
                }}
              >
                {analysis.sentiment.toUpperCase()}
              </Badge>
            </div>

            <div>
              <p className="text-neutral-600 mb-2">Sentiment Score</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '24px', color: getSentimentColor(analysis.sentiment) }}>
                    {(analysis.score * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={analysis.score * 100} 
                  className="h-3"
                  style={{ 
                    '--progress-background': getSentimentColor(analysis.sentiment) 
                  } as any}
                />
              </div>
            </div>

            <div>
              <p className="text-neutral-600 mb-2">Confidence Level</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '24px', color: getSentimentColor(analysis.sentiment) }}>
                    {(analysis.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={analysis.confidence * 100} 
                  className="h-3"
                  style={{ 
                    '--progress-background': getSentimentColor(analysis.sentiment) 
                  } as any}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg border">
            <p className="text-neutral-600 mb-2">Interpretation</p>
            <p>
              {analysis.sentiment === 'positive' && 
                'This text expresses positive emotions, satisfaction, or favorable opinions. The sentiment analysis indicates an overall optimistic or appreciative tone.'
              }
              {analysis.sentiment === 'negative' && 
                'This text expresses negative emotions, dissatisfaction, or critical opinions. The sentiment analysis indicates an overall pessimistic or disapproving tone.'
              }
              {analysis.sentiment === 'neutral' && 
                'This text expresses neutral or mixed emotions. The sentiment analysis indicates a balanced or objective tone without strong positive or negative feelings.'
              }
            </p>
          </div>
        </Card>
      )}

      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="mb-3" style={{ color: '#3B82F6' }}>How it works</h3>
        <ul className="space-y-2 text-neutral-700">
          <li className="flex items-start gap-2">
            <span style={{ color: '#3B82F6' }}>•</span>
            <span>Enter any text in the input area above</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#3B82F6' }}>•</span>
            <span>Click "Analyze Sentiment" to get instant results</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#3B82F6' }}>•</span>
            <span>The analyzer evaluates word choice, tone, and context to determine sentiment</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: '#3B82F6' }}>•</span>
            <span>Results include sentiment type (positive/negative/neutral), confidence score, and detailed interpretation</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
