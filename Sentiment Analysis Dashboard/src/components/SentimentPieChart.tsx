import { Card } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface SentimentPieChartProps {
  positive: number;
  negative: number;
  neutral: number;
}

export function SentimentPieChart({ positive, negative, neutral }: SentimentPieChartProps) {
  const data = [
    { name: 'Positive', value: positive, color: '#10B981' },
    { name: 'Negative', value: negative, color: '#EF4444' },
    { name: 'Neutral', value: neutral, color: '#6B7280' },
  ];

  return (
    <Card className="p-6">
      <h3 className="mb-4">Sentiment Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
