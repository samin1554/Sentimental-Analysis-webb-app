import { useState, useMemo, useEffect } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Progress } from "./ui/progress";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { Search, Download, ChevronUp, ChevronDown, ChevronsUpDown, Loader2, RefreshCw } from "lucide-react";
import { getAnalyzedFeedback, transformToFrontendFormat, FrontendFeedback } from "../lib/api";
import { format } from "date-fns";

type SortField = 'userName' | 'email' | 'sentiment' | 'score' | 'source' | 'timestamp';
type SortOrder = 'asc' | 'desc';

export function FeedbackTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<FrontendFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const itemsPerPage = 10;

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const analyzedFeedback = await getAnalyzedFeedback();
      const transformedFeedback = transformToFrontendFormat(analyzedFeedback);
      setFeedback(transformedFeedback);
      setError(null);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError('Failed to load feedback data');
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="w-4 h-4 ml-1 text-neutral-400" />;
    }
    return sortOrder === 'asc' ? 
      <ChevronUp className="w-4 h-4 ml-1" /> : 
      <ChevronDown className="w-4 h-4 ml-1" />;
  };

  const filteredAndSortedFeedback = useMemo(() => {
    let filtered = feedback.filter(feedbackItem => {
      const searchLower = searchQuery.toLowerCase();
      return (
        feedbackItem.userName.toLowerCase().includes(searchLower) ||
        feedbackItem.email.toLowerCase().includes(searchLower) ||
        feedbackItem.message.toLowerCase().includes(searchLower) ||
        feedbackItem.source.toLowerCase().includes(searchLower)
      );
    });

    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'timestamp') {
        aValue = a.timestamp.getTime();
        bValue = b.timestamp.getTime();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [feedback, searchQuery, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedFeedback.length / itemsPerPage);
  const paginatedFeedback = filteredAndSortedFeedback.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const exportToCSV = () => {
    const headers = ['User Name', 'Email', 'Message', 'Sentiment', 'Score', 'Source', 'Date/Time'];
    const rows = filteredAndSortedFeedback.map(f => [
      f.userName,
      f.email,
      f.message.replace(/,/g, ';'),
      f.sentiment,
      f.score.toFixed(2),
      f.source,
      format(f.timestamp, 'yyyy-MM-dd HH:mm:ss'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading feedback data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <Input
              placeholder="Search feedback..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={fetchFeedback}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => handleSort('userName')}
                    className="flex items-center hover:text-neutral-900"
                  >
                    User Name
                    <SortIcon field="userName" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('email')}
                    className="flex items-center hover:text-neutral-900"
                  >
                    Email
                    <SortIcon field="email" />
                  </button>
                </TableHead>
                <TableHead>Message</TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('sentiment')}
                    className="flex items-center hover:text-neutral-900"
                  >
                    Sentiment
                    <SortIcon field="sentiment" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('score')}
                    className="flex items-center hover:text-neutral-900"
                  >
                    Score
                    <SortIcon field="score" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('source')}
                    className="flex items-center hover:text-neutral-900"
                  >
                    Source
                    <SortIcon field="source" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('timestamp')}
                    className="flex items-center hover:text-neutral-900"
                  >
                    Date/Time
                    <SortIcon field="timestamp" />
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedFeedback.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell>{feedback.userName || 'Anonymous'}</TableCell>
                  <TableCell>{feedback.email}</TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <p className={expandedRows.has(feedback.id) ? '' : 'truncate'}>
                        {feedback.message}
                      </p>
                      {feedback.message.length > 50 && (
                        <button
                          onClick={() => toggleRowExpansion(feedback.id)}
                          className="text-blue-600 hover:underline mt-1"
                          style={{ fontSize: '12px' }}
                        >
                          {expandedRows.has(feedback.id) ? 'Show less' : 'Show more'}
                        </button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSentimentBadgeColor(feedback.sentiment)}>
                      {feedback.sentiment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 min-w-[120px]">
                      <div className="flex items-center justify-between">
                        <span style={{ fontSize: '14px' }}>
                          {(feedback.score * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={feedback.score * 100} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>{feedback.source}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {format(feedback.timestamp, 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={currentPage === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        <div className="mt-4 text-center text-neutral-500" style={{ fontSize: '14px' }}>
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedFeedback.length)} of {filteredAndSortedFeedback.length} results
        </div>
      </Card>
    </div>
  );
}
