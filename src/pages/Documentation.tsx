
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Documentation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl font-display font-semibold mb-4 tracking-tight">
              Documentation
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Everything you need to know about the Artifact Pipeline process and technologies.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div>
              <div className="sticky top-24 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Overview</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="#introduction" className="text-workflow-blue hover:underline">Introduction</a>
                    </li>
                    <li>
                      <a href="#getting-started" className="text-muted-foreground hover:text-foreground transition-colors">Getting Started</a>
                    </li>
                    <li>
                      <a href="#key-concepts" className="text-muted-foreground hover:text-foreground transition-colors">Key Concepts</a>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Technical Stack</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="#airflow" className="text-muted-foreground hover:text-foreground transition-colors">Apache Airflow</a>
                    </li>
                    <li>
                      <a href="#typespec" className="text-muted-foreground hover:text-foreground transition-colors">TypeSpec</a>
                    </li>
                    <li>
                      <a href="#zod" className="text-muted-foreground hover:text-foreground transition-colors">Zod</a>
                    </li>
                    <li>
                      <a href="#drizzle" className="text-muted-foreground hover:text-foreground transition-colors">Drizzle ORM</a>
                    </li>
                    <li>
                      <a href="#supabase" className="text-muted-foreground hover:text-foreground transition-colors">Supabase</a>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Workflow Steps</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="#prd" className="text-muted-foreground hover:text-foreground transition-colors">PRD Extraction</a>
                    </li>
                    <li>
                      <a href="#domain" className="text-muted-foreground hover:text-foreground transition-colors">Domain Entities</a>
                    </li>
                    <li>
                      <a href="#api" className="text-muted-foreground hover:text-foreground transition-colors">API Actions</a>
                    </li>
                    <li>
                      <a href="#typespec-gen" className="text-muted-foreground hover:text-foreground transition-colors">TypeSpec Generation</a>
                    </li>
                    <li>
                      <a href="#schema-gen" className="text-muted-foreground hover:text-foreground transition-colors">Schema Generation</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2 prose max-w-none">
              <section id="introduction" className="mb-12">
                <h2 className="text-2xl font-display font-semibold mb-4">Introduction</h2>
                <p className="mb-4">
                  The Artifact Pipeline is a comprehensive workflow system designed to streamline the software development process
                  from initial product requirements to implemented database schemas and type-safe APIs.
                </p>
                <p className="mb-4">
                  Built on Apache Airflow 3.x, this pipeline orchestrates the transformation of software artifacts through
                  various stages, with each transition requiring appropriate stakeholder sign-offs to ensure quality and alignment.
                </p>
                <p>
                  This documentation provides a complete guide to understanding, using, and extending the Artifact Pipeline system.
                </p>
              </section>
              
              <section id="getting-started" className="mb-12">
                <h2 className="text-2xl font-display font-semibold mb-4">Getting Started</h2>
                <h3 className="text-lg font-medium mt-6 mb-3">Prerequisites</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li>Node.js (v16 or higher)</li>
                  <li>Apache Airflow 3.x</li>
                  <li>Supabase account or compatible PostgreSQL database</li>
                  <li>TypeSpec CLI tools</li>
                </ul>
                
                <h3 className="text-lg font-medium mt-6 mb-3">Installation</h3>
                <div className="bg-slate-950 text-white p-4 rounded-md my-4 overflow-x-auto">
                  <pre className="text-sm leading-relaxed">
                    <code>
{`# Clone the repository
git clone https://github.com/your-org/artifact-pipeline.git

# Navigate to the project directory
cd artifact-pipeline

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev`}
                    </code>
                  </pre>
                </div>
                
                <h3 className="text-lg font-medium mt-6 mb-3">Configuration</h3>
                <p>
                  Configure your environment variables in the <code>.env</code> file:
                </p>
                <div className="bg-slate-950 text-white p-4 rounded-md my-4 overflow-x-auto">
                  <pre className="text-sm leading-relaxed">
                    <code>
{`# Airflow connection
AIRFLOW_API_URL=http://localhost:8080/api/v1
AIRFLOW_USERNAME=airflow
AIRFLOW_PASSWORD=airflow

# Supabase connection
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key

# TypeSpec configuration
TYPESPEC_OUTPUT_DIR=./generated`}
                    </code>
                  </pre>
                </div>
              </section>
              
              <section id="key-concepts" className="mb-12">
                <h2 className="text-2xl font-display font-semibold mb-4">Key Concepts</h2>
                
                <h3 className="text-lg font-medium mt-6 mb-3">Artifacts</h3>
                <p className="mb-4">
                  Artifacts represent the deliverables that flow through the pipeline. Each artifact has a type,
                  status, and associated metadata. Artifacts progress through the pipeline as they are approved
                  by stakeholders and processed by operators.
                </p>
                
                <h3 className="text-lg font-medium mt-6 mb-3">Workflow Steps</h3>
                <p className="mb-4">
                  Each step in the workflow pipeline corresponds to an Apache Airflow task that processes artifacts.
                  Steps are executed in sequence, with dependencies ensuring that prerequisites are met before a step begins.
                </p>
                
                <h3 className="text-lg font-medium mt-6 mb-3">Operators</h3>
                <p className="mb-4">
                  Operators are the Airflow tasks that perform the actual processing of artifacts. Each operator is
                  specialized for a specific transformation, such as extracting domain entities from PRDs or generating
                  TypeSpec files from API definitions.
                </p>
                
                <h3 className="text-lg font-medium mt-6 mb-3">Sign-offs</h3>
                <p className="mb-4">
                  The sign-off process ensures that stakeholders review and approve artifacts before they proceed to the next step.
                  Each workflow step can define required approvers, and the artifact will not proceed until all required approvals are received.
                </p>
              </section>
              
              <div className="p-6 bg-workflow-lightBlue rounded-lg border border-workflow-blue/20 mb-12">
                <h3 className="text-lg font-medium mb-3">Need more detailed documentation?</h3>
                <p className="mb-4">
                  This is a high-level overview of the Artifact Pipeline. For more detailed documentation on each component,
                  refer to the specific sections or download the comprehensive documentation package.
                </p>
                <button className="inline-flex items-center bg-workflow-blue text-white px-4 py-2 rounded-md hover:bg-workflow-blue/90 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download Full Documentation
                </button>
              </div>
              
              <section id="airflow" className="mb-12">
                <h2 className="text-2xl font-display font-semibold mb-4">Apache Airflow</h2>
                <p className="mb-4">
                  Apache Airflow 3.x serves as the workflow orchestration engine for the Artifact Pipeline.
                  It provides the infrastructure for defining, scheduling, and monitoring the workflow steps
                  that process artifacts through the pipeline.
                </p>
                
                <h3 className="text-lg font-medium mt-6 mb-3">DAG Definition</h3>
                <p className="mb-4">
                  The Artifact Pipeline is defined as a Directed Acyclic Graph (DAG) in Airflow:
                </p>
                <div className="bg-slate-950 text-white p-4 rounded-md my-4 overflow-x-auto">
                  <pre className="text-sm leading-relaxed">
                    <code>
{`from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime

from operators.prd_extraction import PRDExtractionOperator
from operators.domain_entity import DomainEntityOperator
from operators.business_logic import BusinessLogicOperator
from operators.typespec_generator import TypeSpecGeneratorOperator
from operators.zod_emitter import ZodEmitterOperator
from operators.drizzle_schema import DrizzleSchemaOperator

with DAG(
    'artifact_pipeline',
    description='Software Artifact Delivery Pipeline',
    schedule_interval=None,
    start_date=datetime(2023, 1, 1),
    catchup=False,
    tags=['artifact', 'pipeline'],
) as dag:
    
    prd_extraction = PRDExtractionOperator(
        task_id='prd_extraction',
        artifact_id="{{ dag_run.conf['artifact_id'] }}",
    )
    
    domain_entity = DomainEntityOperator(
        task_id='domain_entity_extraction',
        artifact_id="{{ dag_run.conf['artifact_id'] }}",
    )
    
    business_logic = BusinessLogicOperator(
        task_id='business_logic_conversion',
        artifact_id="{{ dag_run.conf['artifact_id'] }}",
    )
    
    typespec_generator = TypeSpecGeneratorOperator(
        task_id='typespec_generation',
        artifact_id="{{ dag_run.conf['artifact_id'] }}",
    )
    
    zod_emitter = ZodEmitterOperator(
        task_id='zod_schema_generation',
        artifact_id="{{ dag_run.conf['artifact_id'] }}",
    )
    
    drizzle_schema = DrizzleSchemaOperator(
        task_id='database_schema_creation',
        artifact_id="{{ dag_run.conf['artifact_id'] }}",
    )
    
    # Define task dependencies
    prd_extraction >> domain_entity >> business_logic >> typespec_generator >> zod_emitter >> drizzle_schema`}
                    </code>
                  </pre>
                </div>
              </section>
              
              <div className="p-6 bg-gray-50 rounded-lg border border-border mb-12">
                <h3 className="text-lg font-medium mb-3">Technical stack documentation continues...</h3>
                <p className="text-muted-foreground">
                  Detailed documentation for TypeSpec, Zod, Drizzle, and Supabase integration is available
                  in their respective sections.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Documentation;
