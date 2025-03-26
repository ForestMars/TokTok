
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type StepStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface StepProps {
  id: string;
  title: string;
  description: string;
  status: StepStatus;
  operator: string;
  isActive?: boolean;
  index: number;
  totalSteps: number;
  onClick?: () => void;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  in_progress: {
    label: 'In Progress',
    color: 'text-workflow-blue',
    bgColor: 'bg-workflow-blue',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  completed: {
    label: 'Completed',
    color: 'text-workflow-green',
    bgColor: 'bg-workflow-green',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
  },
  failed: {
    label: 'Failed',
    color: 'text-workflow-red',
    bgColor: 'bg-workflow-red',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    ),
  },
};

const StepCard: React.FC<StepProps> = ({
  id,
  title,
  description,
  status,
  operator,
  isActive = false,
  index,
  totalSteps,
  onClick,
}) => {
  const statusInfo = statusConfig[status];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={cn(
        "relative p-4 rounded-lg border transition-all duration-300",
        isActive 
          ? "border-workflow-blue bg-workflow-lightBlue shadow-sm" 
          : "border-border bg-card hover:border-muted-foreground/30"
      )}
      onClick={onClick}
    >
      {/* Step number circle */}
      <div 
        className={cn(
          "absolute -left-3 top-4 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white",
          status === 'completed' 
            ? 'bg-workflow-green' 
            : status === 'in_progress' 
              ? 'bg-workflow-blue' 
              : status === 'failed' 
                ? 'bg-workflow-red' 
                : 'bg-muted-foreground'
        )}
      >
        {index + 1}
      </div>
      
      {/* Connector line */}
      {index < totalSteps - 1 && (
        <div className="line-connector left-0 top-10 h-full translate-x-0 translate-y-4">
          {status === 'completed' && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: '100%' }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="w-full h-full bg-workflow-green"
            />
          )}
        </div>
      )}
      
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium">{title}</h3>
        <div className={cn("inline-flex items-center text-xs px-2 py-1 rounded-full", `text-${statusInfo.color}`)}>
          <span className="mr-1">{statusInfo.icon}</span>
          {statusInfo.label}
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      
      <div className="bg-secondary p-3 rounded-md text-xs">
        <div className="font-mono text-muted-foreground mb-1">Operator</div>
        <code className="text-foreground">{operator}</code>
      </div>
      
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-workflow-blue text-sm font-medium cursor-pointer hover:underline flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          View details
        </motion.div>
      )}
    </motion.div>
  );
};

export default StepCard;
