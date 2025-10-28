import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert } from "./ui/alert";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { analyzeSentiment } from "../lib/mockData";

export function FeedbackForm() {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    message: '',
    source: 'Web' as 'Web' | 'Mobile App' | 'Email' | 'Other',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const maxCharacters = 500;
  const messageLength = formData.message.length;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.message) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Analyze sentiment
    const analysis = analyzeSentiment(formData.message);
    console.log('Feedback submitted:', { ...formData, ...analysis });

    setIsSubmitting(false);
    setSubmitStatus('success');

    // Reset form
    setTimeout(() => {
      setFormData({
        userName: '',
        email: '',
        message: '',
        source: 'Web',
      });
      setSubmitStatus('idle');
    }, 3000);
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="mb-6">Submit Your Feedback</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="userName">Name (Optional)</Label>
          <Input
            id="userName"
            type="text"
            placeholder="Your name"
            value={formData.userName}
            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) {
                setErrors({ ...errors, email: '' });
              }
            }}
            disabled={isSubmitting}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-red-500" style={{ fontSize: '14px' }}>{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Select
            value={formData.source}
            onValueChange={(value) => setFormData({ ...formData, source: value as any })}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Web">Web</SelectItem>
              <SelectItem value="Mobile App">Mobile App</SelectItem>
              <SelectItem value="Email">Email</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="message">Message *</Label>
            <span 
              className={`${messageLength > maxCharacters ? 'text-red-500' : 'text-neutral-500'}`}
              style={{ fontSize: '14px' }}
            >
              {messageLength}/{maxCharacters}
            </span>
          </div>
          <Textarea
            id="message"
            placeholder="Share your feedback…"
            value={formData.message}
            onChange={(e) => {
              if (e.target.value.length <= maxCharacters) {
                setFormData({ ...formData, message: e.target.value });
                if (errors.message) {
                  setErrors({ ...errors, message: '' });
                }
              }
            }}
            disabled={isSubmitting}
            className={errors.message ? 'border-red-500' : ''}
            rows={6}
          />
          {errors.message && (
            <p className="text-red-500" style={{ fontSize: '14px' }}>{errors.message}</p>
          )}
        </div>

        {submitStatus === 'success' && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4" style={{ color: '#10B981' }} />
            <div className="ml-2">
              <p style={{ color: '#10B981' }}>Feedback submitted successfully!</p>
            </div>
          </Alert>
        )}

        {submitStatus === 'error' && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4" style={{ color: '#EF4444' }} />
            <div className="ml-2">
              <p style={{ color: '#EF4444' }}>Failed to submit feedback. Please try again.</p>
            </div>
          </Alert>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
          style={{ backgroundColor: '#3B82F6' }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Feedback'
          )}
        </Button>
      </form>
    </Card>
  );
}
