
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Pipeline from '@/components/workflow/Pipeline';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-3 py-1 text-xs font-medium text-workflow-blue bg-workflow-lightBlue rounded-full mb-4">
              Artifact Workflow Pipeline
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-semibold mb-4 tracking-tight">
              Product Engineering Delivery Automation Lifecycle
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A fully automated development pipeline from product specs to production deployed software.
            </p>
          </motion.div>
          
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-workflow-blue/10 via-workflow-purple/10 to-workflow-blue/10 rounded-2xl transform rotate-1 scale-[1.03] blur-xl opacity-50"></div>
            <div className="relative bg-white rounded-xl border border-border shadow-sm p-6">
              <div className="flex flex-col lg:flex-row items-center justify-between mb-10 gap-4">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex items-center"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex -space-x-2">
                      <div className="w-10 h-10 rounded-full bg-workflow-blue flex items-center justify-center text-white text-sm font-medium">JD</div>
                      <div className="w-10 h-10 rounded-full bg-workflow-purple flex items-center justify-center text-white text-sm font-medium">LK</div>
                      <div className="w-10 h-10 rounded-full bg-workflow-green flex items-center justify-center text-white text-sm font-medium">SP</div>
                      <div className="w-10 h-10 rounded-full bg-workflow-orange text-white flex items-center justify-center text-sm font-medium">+2</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">5 stakeholders</span> active in workflow
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <select className="border border-border rounded-md px-3 py-2 bg-white text-foreground outline-none focus:ring-2 focus:ring-workflow-blue/30 transition-shadow">
                    <option>All Artifacts</option>
                    <option>PRD Documents</option>
                    <option>DDD Models</option>
                    <option>API Designs</option>
                  </select>
                  
                  <select className="border border-border rounded-md px-3 py-2 bg-white text-foreground outline-none focus:ring-2 focus:ring-workflow-blue/30 transition-shadow">
                    <option>All Statuses</option>
                    <option>In Progress</option>
                    <option>Pending Approval</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                </motion.div>
              </div>
              
              <Pipeline />
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            <div className="p-6 rounded-lg border border-border">
              <div className="w-12 h-12 rounded-lg bg-workflow-lightBlue flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-workflow-blue">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Automated Workflows</h3>
              <p className="text-muted-foreground">
                Built on Apache Airflow 3.x to orchestrate the entire artifact delivery process with custom operators.
              </p>
            </div>
            
            <div className="p-6 rounded-lg border border-border">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-workflow-green">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Stakeholder Sign-offs</h3>
              <p className="text-muted-foreground">
                Built-in approval processes ensure all stakeholders can review and sign off on artifacts before proceeding.
              </p>
            </div>
            
            <div className="p-6 rounded-lg border border-border">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-workflow-purple">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
                  <polyline points="7.5 19.79 7.5 14.6 3 12" />
                  <polyline points="21 12 16.5 14.6 16.5 19.79" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">End-to-End Integration</h3>
              <p className="text-muted-foreground">
                From PRD to database schema with TypeSpec, Zod, and Drizzle integration for full-stack type safety.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
