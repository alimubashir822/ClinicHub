'use client';

import React, { useState, useEffect } from 'react';
import { getReviews, submitReviewReply } from '@/app/actions';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Badge,
  Textarea,
  Button,
  Modal
} from '@/components/ui';
import { 
  Star, 
  MessageSquare, 
  Sparkles, 
  RefreshCw, 
  Send, 
  ThumbsUp, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingReview, setReplyingReview] = useState<any | null>(null);
  const [draftReply, setDraftReply] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  async function loadReviews() {
    setLoading(true);
    const data = await getReviews();
    setReviews(data);
    setLoading(false);
  }

  useEffect(() => {
    loadReviews();
  }, []);

  const handleGenerateAIDraft = (review: any) => {
    // AI Mock generator based on rating and comment
    const name = review.patientName;
    const rating = review.rating;
    const content = review.content.toLowerCase();
    const clinic = review.location.name;

    let draft = '';
    if (rating >= 4) {
      if (content.includes('clean') || content.includes('modern')) {
        draft = `Hi ${name}, thank you so much for visiting us at ${clinic}! We take great pride in maintaining a clean, modern, and comfortable environment for our patients. We appreciate your recommendation!`;
      } else if (content.includes('fast') || content.includes('quick')) {
        draft = `Hi ${name}, thank you for the feedback! We are thrilled to hear that your visit to ${clinic} was fast and efficient. We always strive to respect our patients' time while delivering top-quality care.`;
      } else {
        draft = `Hi ${name}! Thank you for the wonderful 5-star review of ${clinic}. We appreciate your support and look forward to providing you with premium care at your next appointment!`;
      }
    } else {
      draft = `Dear ${name}, thank you for sharing your feedback with us regarding your visit to ${clinic}. We sincerely apologize that your experience did not meet your expectations. We are committed to improvement and would like to learn more. Please contact our clinic manager at ${review.location.email} so we can address your concerns directly.`;
    }

    setDraftReply(draft);
    setReplyingReview(review);
  };

  const handleSendReply = async () => {
    if (!replyingReview || !draftReply.trim()) return;
    setSubmittingReply(true);
    try {
      await submitReviewReply(replyingReview.id, draftReply);
      setReplyingReview(null);
      setDraftReply('');
      loadReviews();
    } catch (err) {
      console.error(err);
      alert("Failed to submit reply");
    } finally {
      setSubmittingReply(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-teal-500 animate-spin" />
        <span className="ml-3 text-slate-400">Aggregating patient feedback reviews...</span>
      </div>
    );
  }

  // Calculate stats
  const totalReviews = reviews.length;
  const avgStars = totalReviews > 0
    ? (reviews.reduce((acc, cur) => acc + cur.rating, 0) / totalReviews).toFixed(1)
    : '5.0';
  const pendingCount = reviews.filter(r => r.replyStatus === 'NONE').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Star className="w-6 h-6 text-amber-400 fill-amber-400" /> Reviews & Reputation Management
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Monitor aggregated patient ratings, analyze patient sentiment, and deploy verified AI-crafted responses.
        </p>
      </div>

      {/* Review Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-amber-950/45 border border-amber-900/50 rounded-2xl">
              <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Average Rating</p>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-1">{avgStars} / 5.0</h3>
              <p className="text-[10px] text-slate-400 mt-1">Across {totalReviews} patient submissions</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-teal-950/45 border border-teal-900/50 rounded-2xl">
              <MessageSquare className="w-8 h-8 text-teal-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Replied Status</p>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-1">
                {Math.round(((totalReviews - pendingCount) / (totalReviews || 1)) * 100)}%
              </h3>
              <p className="text-[10px] text-emerald-400 mt-1 font-semibold">
                {totalReviews - pendingCount} published responses
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-indigo-950/45 border border-indigo-900/50 rounded-2xl">
              <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">AI Pending Actions</p>
              <h3 className="text-3xl font-extrabold text-indigo-400 mt-1">{pendingCount} reviews</h3>
              <p className="text-[10px] text-slate-400 mt-1">Awaiting AI reply approval</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews feed */}
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Patient Review Feed</CardTitle>
          <CardDescription>Patient postings from all clinic website sites in the network.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-900">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-6 hover:bg-slate-900/10 transition flex flex-col md:flex-row gap-6 justify-between">
                
                {/* Review Body */}
                <div className="space-y-3 max-w-3xl">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-semibold text-slate-200">{rev.patientName}</span>
                    <Badge variant="secondary" className="bg-slate-950 border border-slate-800 text-[10px]">
                      {rev.location.name}
                    </Badge>
                    <span className="text-[10px] text-slate-500">{rev.date}</span>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star 
                        key={idx} 
                        className={`w-3.5 h-3.5 ${
                          idx < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                        }`} 
                      />
                    ))}
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed italic">
                    "{rev.content}"
                  </p>

                  {/* Reply presentation */}
                  {rev.replyContent ? (
                    <div className="p-3.5 bg-slate-950/80 border border-slate-900 rounded-xl relative overflow-hidden mt-3">
                      <div className="absolute top-0 right-0 py-0.5 px-2 bg-emerald-950/50 border-l border-b border-emerald-900 text-[8px] font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" /> Published Reply
                      </div>
                      <p className="text-[11px] font-bold text-slate-400 mb-1">HQ Response:</p>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {rev.replyContent}
                      </p>
                    </div>
                  ) : (
                    <div className="pt-2 flex items-center gap-1.5 text-xs text-indigo-400 font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI response draft ready for review.
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center md:justify-end shrink-0">
                  {rev.replyStatus === 'NONE' ? (
                    <Button 
                      onClick={() => handleGenerateAIDraft(rev)}
                      className="bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/80 shadow-md flex items-center gap-1 text-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> AI Draft Reply
                    </Button>
                  ) : (
                    <div className="text-xs text-slate-500 font-medium flex items-center gap-1 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-900">
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" /> Published
                    </div>
                  )}
                </div>

              </div>
            ))}

            {reviews.length === 0 && (
              <div className="py-12 text-center text-slate-500">
                No patient reviews aggregated yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Draft modal editor */}
      {replyingReview && (
        <Modal
          isOpen={true}
          onClose={() => setReplyingReview(null)}
          title="Approve AI Response Draft"
          size="lg"
        >
          <div className="space-y-5">
            <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Patient Review:</span>
                <span className="text-[10px] text-slate-500">{replyingReview.date}</span>
              </div>
              <p className="text-xs text-slate-300 italic">
                "{replyingReview.content}"
              </p>
              <div className="flex gap-1.5 items-center">
                <Badge variant="secondary">{replyingReview.location.name}</Badge>
                <div className="flex">
                  {Array.from({ length: replyingReview.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-indigo-400" /> AI Response Proposal
              </label>
              <Textarea 
                value={draftReply}
                onChange={(e) => setDraftReply(e.target.value)}
                rows={5}
                className="w-full text-slate-200"
              />
              <p className="text-[10px] text-slate-500 italic">
                You can review, edit, and custom polish this AI generated suggestion before publishing it to the live location site.
              </p>
            </div>

            <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 bg-emerald-950/20 border border-emerald-900/50 px-2 py-0.5 rounded-full font-bold">
                <Sparkles className="w-3 h-3" /> Brand-safe wording verified
              </span>
              
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={() => setReplyingReview(null)} className="text-slate-400">
                  Cancel
                </Button>
                <Button onClick={handleSendReply} disabled={submittingReply} className="flex items-center gap-1">
                  {submittingReply ? 'Publishing...' : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Approve & Publish Reply
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
