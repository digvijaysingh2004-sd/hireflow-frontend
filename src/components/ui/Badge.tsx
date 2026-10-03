import React from 'react';

export type StatusVariant =
  | 'Draft'
  | 'Published'
  | 'Closed'
  | 'Submitted'
  | 'UnderReview'
  | 'Shortlisted'
  | 'InterviewScheduled'
  | 'Offered'
  | 'Hired'
  | 'Rejected'
  | 'Withdrawn'
  | 'success'
  | 'danger'
  | 'warning'
  | 'primary'
  | 'info'
  | 'default';

interface BadgeProps {
  status?: string;
  variant?: StatusVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  variant,
  size = 'md',
  className = '',
  children,
}) => {
  const content = children || status || '';
  const resolvedVariant = (variant || status || 'default') as StatusVariant;

  const styleMap: Record<StatusVariant, string> = {
    Draft: 'bg-slate-100 text-slate-700 border-slate-200',
    Published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Closed: 'bg-rose-50 text-rose-700 border-rose-200',
    Submitted: 'bg-blue-50 text-blue-700 border-blue-200',
    UnderReview: 'bg-amber-50 text-amber-700 border-amber-200',
    Shortlisted: 'bg-purple-50 text-purple-700 border-purple-200',
    InterviewScheduled: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Offered: 'bg-teal-50 text-teal-700 border-teal-200',
    Hired: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold',
    Rejected: 'bg-red-50 text-red-700 border-red-200',
    Withdrawn: 'bg-gray-100 text-gray-600 border-gray-200',

    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    primary: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    default: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizeMap = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  const style = styleMap[resolvedVariant] || styleMap.default;
  const sizeStyle = sizeMap[size] || sizeMap.md;

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${style} ${sizeStyle} ${className}`}
    >
      {content}
    </span>
  );
};
