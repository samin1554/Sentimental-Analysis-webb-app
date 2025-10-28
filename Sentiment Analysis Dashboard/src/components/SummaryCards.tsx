import { Card } from "./ui/card";
import { TrendingUp, TrendingDown, MessageSquare, BarChart3 } from "lucide-react";

interface SummaryCardsProps {
  total: number;
  positivePercent: number;
  negativePercent: number;
  avgScore: number;
}

export function SummaryCards({ total, positivePercent, negativePercent, avgScore }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-600">Total Feedback</p>
            <p className="mt-2" style={{ fontSize: '32px' }}>{total}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <MessageSquare className="w-6 h-6" style={{ color: '#3B82F6' }} />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-600">Positive Sentiment</p>
            <p className="mt-2" style={{ fontSize: '32px' }}>{positivePercent.toFixed(1)}%</p>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <TrendingUp className="w-6 h-6" style={{ color: '#10B981' }} />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-600">Negative Sentiment</p>
            <p className="mt-2" style={{ fontSize: '32px' }}>{negativePercent.toFixed(1)}%</p>
          </div>
          <div className="p-3 bg-red-100 rounded-lg">
            <TrendingDown className="w-6 h-6" style={{ color: '#EF4444' }} />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-600">Average Score</p>
            <p className="mt-2" style={{ fontSize: '32px' }}>{avgScore.toFixed(1)}</p>
          </div>
          <div className="p-3 bg-gray-100 rounded-lg">
            <BarChart3 className="w-6 h-6" style={{ color: '#6B7280' }} />
          </div>
        </div>
      </Card>
    </div>
  );
}
