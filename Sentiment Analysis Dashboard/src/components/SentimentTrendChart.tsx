import { Card } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface TrendData {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
}

interface SentimentTrendChartProps {
  data: TrendData[];
}

export function SentimentTrendChart({ data }: SentimentTrendChartProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-4">Sentiment Trends Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="positive" 
            stroke="#10B981" 
            strokeWidth={2}
            name="Positive"
          />
          <Line 
            type="monotone" 
            dataKey="negative" 
            stroke="#EF4444" 
            strokeWidth={2}
            name="Negative"
          />
          <Line 
            type="monotone" 
            dataKey="neutral" 
            stroke="#6B7280" 
            strokeWidth={2}
            name="Neutral"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
