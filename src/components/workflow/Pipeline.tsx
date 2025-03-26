
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ArtifactCard, { ArtifactProps } from './ArtifactCard';
import StepCard, { StepProps } from './StepCard';
import SignoffModal from './SignoffModal';

// Sample data for artifacts
const artifactsData: ArtifactProps[] = [
  {
    id: '1',
    title: 'User Authentication Service',
    type: 'PRD',
    status: 'approved',
    progress: 100,
    approvals: { required: 3, current: 3 },
    createdAt: '2023-09-10T13:45:00Z',
    updatedAt: '2023-09-15T09:30:00Z',
  },
  {
    id: '2',
    title: 'Payment Processing API',
    type: 'DDD Model',
    status: 'in_progress',
    progress: 65,
    approvals: { required: 4, current: 2 },
    createdAt: '2023-09-12T10:15:00Z',
    updatedAt: '2023-09-16T14:20:00Z',
  },
  {
    id: '3',
    title: 'Inventory Management System',
    type: 'API Design',
    status: 'pending',
    progress: 30,
    approvals: { required: 3, current: 0 },
    createdAt: '2023-09-14T08:45:00Z',
    updatedAt: '2023-09-17T11:10:00Z',
  }
];

// Sample data for workflow steps
const stepsData: StepProps[] = [
  {
    id: '1',
    title: 'PRD Document Creation',
    description: 'Create and validate the Product Requirements Document with stakeholders',
    status: 'completed',
    operator: 'PRDExtractionOperator',
    index: 0,
    totalSteps: 6,
  },
  {
    id: '2',
    title: 'Domain Entity Extraction',
    description: 'Extract domain entities for the DDD model from the PRD',
    status: 'in_progress',
    operator: 'DomainEntityOperator',
    index: 1,
    totalSteps: 6,
  },
  {
    id: '3',
    title: 'Business Logic Conversion',
    description: 'Convert business logic into API actions and operations',
    status: 'pending',
    operator: 'BusinessLogicOperator',
    index: 2,
    totalSteps: 6,
  },
  {
    id: '4',
    title: 'TypeSpec Generation',
    description: 'Generate TypeSpec files from the API actions and model',
    status: 'pending',
    operator: 'TypeSpecGeneratorOperator',
    index: 3,
    totalSteps: 6,
  },
  {
    id: '5',
    title: 'Zod Schema Generation',
    description: 'Create Zod validation schemas from TypeSpec definitions',
    status: 'pending',
    operator: 'ZodEmitterOperator',
    index: 4,
    totalSteps: 6,
  },
  {
    id: '6',
    title: 'Database Schema Creation',
    description: 'Generate database schema from the domain model and Zod schemas',
    status: 'pending',
    operator: 'DrizzleSchemaOperator',
    index: 5,
    totalSteps: 6,
  }
];

const Pipeline: React.FC = () => {
  const [activeStep, setActiveStep] = useState<string | null>('2');
  const [isSignoffModalOpen, setIsSignoffModalOpen] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState<ArtifactProps | null>(null);
  
  const handleArtifactClick = (artifact: ArtifactProps) => {
    setSelectedArtifact(artifact);
    setIsSignoffModalOpen(true);
  };
  
  const handleStepClick = (stepId: string) => {
    setActiveStep(stepId);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-10">
      <div className="lg:col-span-1 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 rounded-lg border border-border bg-white"
        >
          <h2 className="text-lg font-medium mb-4">Artifacts</h2>
          <div className="space-y-4">
            {artifactsData.map((artifact) => (
              <ArtifactCard
                key={artifact.id}
                {...artifact}
                onClick={() => handleArtifactClick(artifact)}
              />
            ))}
          </div>
        </motion.div>
      </div>
      
      <div className="lg:col-span-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="p-4 rounded-lg border border-border bg-white"
        >
          <h2 className="text-lg font-medium mb-6">Workflow Pipeline</h2>
          <div className="relative space-y-6 pl-8">
            {stepsData.map((step) => (
              <StepCard
                key={step.id}
                {...step}
                isActive={activeStep === step.id}
                onClick={() => handleStepClick(step.id)}
              />
            ))}
          </div>
        </motion.div>
      </div>
      
      {selectedArtifact && (
        <SignoffModal
          isOpen={isSignoffModalOpen}
          onClose={() => setIsSignoffModalOpen(false)}
          artifactTitle={selectedArtifact.title}
          artifactType={selectedArtifact.type}
          stage={stepsData.find(step => step.id === activeStep)?.title || 'Unknown Stage'}
        />
      )}
    </div>
  );
};

export default Pipeline;
