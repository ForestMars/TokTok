
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SignoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  artifactTitle: string;
  artifactType: string;
  stage: string;
}

const SignoffModal: React.FC<SignoffModalProps> = ({
  isOpen,
  onClose,
  artifactTitle,
  artifactType,
  stage,
}) => {
  const [comment, setComment] = useState('');
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!decision) {
      toast.error('Please select a decision');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      if (decision === 'approve') {
        toast.success('Artifact approved successfully');
      } else {
        toast.error('Artifact rejected');
      }
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">Signoff Request</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Please review and provide your decision for this artifact
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-medium">{artifactTitle}</div>
                <div className="text-xs text-muted-foreground">{artifactType}</div>
              </div>
              <div className="px-2 py-1 bg-workflow-lightBlue text-workflow-blue text-xs rounded-full">
                {stage}
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your Comment</label>
                <Textarea
                  placeholder="Add your review comments here..."
                  className="resize-none"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Your Decision</label>
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setDecision('approve')}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      decision === 'approve'
                        ? 'border-workflow-green bg-green-50 text-workflow-green'
                        : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/50'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      <span className="font-medium">Approve</span>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setDecision('reject')}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      decision === 'reject'
                        ? 'border-workflow-red bg-red-50 text-workflow-red'
                        : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/50'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                      <span className="font-medium">Reject</span>
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!decision || isSubmitting}
            className="w-full sm:w-auto bg-workflow-blue hover:bg-workflow-blue/90"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Submit Decision'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignoffModal;
