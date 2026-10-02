import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { interviewsApi } from '../api/interviewsApi';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Calendar, Video, Clock, UserCheck, AlertCircle, ExternalLink } from 'lucide-react';
import { InterviewStatus } from '../types';

export const CandidateInterviewsPage: React.FC = () => {
  const [filter, setFilter] = useState<'UPCOMING' | 'ALL'>('UPCOMING');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['my-interviews'],
    queryFn: () => interviewsApi.getMyInterviews(),
  });

  const interviews = data?.data || [];

  const now = new Date();
  const displayedInterviews = interviews.filter((item) => {
    if (filter === 'UPCOMING') {
      return new Date(item.startTimeUtc) >= now || item.status === 'Scheduled';
    }
    return true;
  });

  const getStatusVariant = (status: InterviewStatus) => {
    switch (status) {
      case 'Scheduled':
        return 'primary';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'danger';
      case 'Rescheduled':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-600" />
            <span>My Scheduled Interviews</span>
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            View your upcoming technical screenings, interview dates, and video meeting room links.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setFilter('UPCOMING')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              filter === 'UPCOMING'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              filter === 'ALL'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Interviews
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500 font-medium">Loading interview schedule...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-center space-y-3">
          <p className="text-red-700 text-sm font-semibold">
            {(error as any)?.response?.data?.error?.message || 'Failed to load interviews schedule.'}
          </p>
          <Button variant="secondary" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : displayedInterviews.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {filter === 'UPCOMING' ? 'No upcoming interviews scheduled' : 'No interviews on record'}
            </h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              {filter === 'UPCOMING'
                ? 'When a recruiter schedules an interview with you, it will appear here with video meeting access.'
                : 'You have not participated in any scheduled interviews yet.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedInterviews.map((interview) => {
            const startDate = new Date(interview.startTimeUtc);
            const endDate = new Date(interview.endTimeUtc);

            return (
              <div
                key={interview.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 hover:border-indigo-200 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-slate-900 text-lg">
                      {interview.title || 'Scheduled Interview'}
                    </h3>
                    <Badge variant={getStatusVariant(interview.status)} size="sm">
                      {interview.status}
                    </Badge>
                  </div>
                  {interview.type && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {interview.type}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-slate-400 font-medium block">Date & Time</span>
                      <span className="font-semibold text-slate-800">
                        {startDate.toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="block text-slate-500 font-normal">
                        {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                        {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {interview.interviewerEmails && interview.interviewerEmails.length > 0 && (
                    <div className="flex items-start gap-2.5">
                      <UserCheck className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-slate-400 font-medium block">Interviewer(s)</span>
                        <span className="font-semibold text-slate-800 block truncate">
                          {interview.interviewerEmails.join(', ')}
                        </span>
                      </div>
                    </div>
                  )}

                  {interview.meetingUrl && (
                    <div className="flex items-start gap-2.5 sm:col-span-2 lg:col-span-1">
                      <Video className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <span className="text-slate-400 font-medium block">Meeting Access</span>
                        <a
                          href={interview.meetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-bold hover:underline mt-0.5"
                        >
                          <span>Join Video Session</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {interview.notes && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-700">
                    <span className="font-semibold text-slate-900 block mb-0.5">Meeting Notes / Agenda:</span>
                    <p>{interview.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
