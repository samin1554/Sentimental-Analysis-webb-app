import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { FeedbackForm } from "./components/FeedbackForm";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { FeedbackTable } from "./components/FeedbackTable";
import { RealtimeAnalyzer } from "./components/RealtimeAnalyzer";
import { Toaster } from "./components/ui/sonner";
import { BarChart3, MessageSquare, Table2, Sparkles } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Toaster />
      
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#3B82F6' }}>
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-neutral-900">Sentiment Analysis Platform</h1>
              <p className="text-neutral-600" style={{ fontSize: '14px' }}>
                Analyze feedback and track sentiment trends
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="submit" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Submit Feedback</span>
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Table2 className="w-4 h-4" />
              <span className="hidden sm:inline">Feedback List</span>
            </TabsTrigger>
            <TabsTrigger value="analyzer" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Analyzer</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="submit">
            <FeedbackForm />
          </TabsContent>

          <TabsContent value="table">
            <FeedbackTable />
          </TabsContent>

          <TabsContent value="analyzer">
            <RealtimeAnalyzer />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-white border-t border-neutral-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-neutral-600" style={{ fontSize: '14px' }}>
            © 2025 Sentiment Analysis Platform. Powered by AI-driven analytics.
          </p>
        </div>
      </footer>
    </div>
  );
}
