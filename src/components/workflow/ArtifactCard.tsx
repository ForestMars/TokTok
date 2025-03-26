
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type ArtifactStatus = 'pending' | 'in_progress' | 'approved' | 'rejected';

export interface ArtifactProps {
  id: string;
  title: string;
  type: string;
  status: ArtifactStatus;
  progress: number;
  approvals: {
    required: number;
    current: number;
  };
  createdAt: string;
  updatedAt: string;
  onClick?: () => void;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-blue-100 text-workflow-blue',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  approved: {
    label: 'Approved',
    color: 'bg-green-100 text-green-800',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    ),
  },
};

const ArtifactCard: React.FC<ArtifactProps> = ({
  id,
  title,
  type,
  status,
  progress,
  approvals,
  createdAt,
  updatedAt,
  onClick,
}) => {
  const statusInfo = statusConfig[status];
  const formattedDate = new Date(updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="artifact-card cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col">
          <div className="inline-flex items-center text-xs font-medium text-muted-foreground mb-1 bg-secondary py-0.5 px-2 rounded-full">
            {type}
          </div>
          <h3 className="font-medium">{title}</h3>
        </div>
        <div className={cn('px-2 py-1 rounded-full text-xs font-medium flex items-center', statusInfo.color)}>
          <span className="mr-1">{statusInfo.icon}</span>
          {statusInfo.label}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-value" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center text-xs text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-1">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center">
          <div className="text-xs font-medium">
            <span className={approvals.current === approvals.required ? 'text-workflow-green' : 'text-muted-foreground'}>
              {approvals.current}
            </span>
            <span className="text-muted-foreground">/{approvals.required} approvals</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArtifactCard;
