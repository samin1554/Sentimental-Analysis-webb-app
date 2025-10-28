import { useState, useMemo } from "react";
import { SummaryCards } from "./SummaryCards";
import { SentimentPieChart } from "./SentimentPieChart";
import { SentimentTrendChart } from "./SentimentTrendChart";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { mockFeedback, calculateAnalytics, generateTrendData, Feedback } from "../lib/mockData";
import { format } from "date-fns";

export function AnalyticsDashboard() {
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const trendData = generateTrendData();

  const filteredFeedback = useMemo(() => {
    return mockFeedback.filter(feedback => {
      if (sentimentFilter !== 'all' && feedback.sentiment !== sentimentFilter) {
        return false;
      }
      if (sourceFilter !== 'all' && feedback.source !== sourceFilter) {
        return false;
      }
      if (dateRange.from && feedback.timestamp < dateRange.from) {
        return false;
      }
      if (dateRange.to) {
        const endOfDay = new Date(dateRange.to);
        endOfDay.setHours(23, 59, 59, 999);
        if (feedback.timestamp > endOfDay) {
          return false;
        }
      }
      return true;
    });
  }, [sentimentFilter, sourceFilter, dateRange]);

  const analytics = calculateAnalytics(filteredFeedback);

  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2>Sentiment Analytics Dashboard</h2>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Select value={sentimentFilter} onValueChange={(value: any) => setSentimentFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiments</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Web">Web</SelectItem>
                <SelectItem value="Mobile App">Mobile App</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="min-w-[200px] justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
                    </>
                  ) : (
                    format(dateRange.from, "MMM dd, yyyy")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.from}
                onSelect={(date) => setDateRange({ from: date, to: dateRange.to })}
              />
              <div className="p-3 border-t">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setDateRange({ from: undefined, to: undefined })}
                >
                  Clear
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <SummaryCards
        total={analytics.total}
        positivePercent={analytics.positivePercent}
        negativePercent={analytics.negativePercent}
        avgScore={analytics.avgScore}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SentimentPieChart
          positive={analytics.positive}
          negative={analytics.negative}
          neutral={analytics.neutral}
        />
        <SentimentTrendChart data={trendData} />
      </div>

      <Card className="p-6">
        <h3 className="mb-4">Recent Feedback</h3>
        <div className="space-y-4">
          {filteredFeedback.slice(0, 5).map((feedback) => (
            <div key={feedback.id} className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p>{feedback.userName || 'Anonymous'}</p>
                  <Badge className={getSentimentBadgeColor(feedback.sentiment)}>
                    {feedback.sentiment}
                  </Badge>
                  <span className="text-neutral-500" style={{ fontSize: '14px' }}>
                    {feedback.source}
                  </span>
                </div>
                <p className="text-neutral-600" style={{ fontSize: '14px' }}>
                  {feedback.message}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-neutral-500" style={{ fontSize: '12px' }}>
                    Score: {(feedback.score * 100).toFixed(0)}%
                  </span>
                  <span className="text-neutral-500" style={{ fontSize: '12px' }}>
                    {format(feedback.timestamp, 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
