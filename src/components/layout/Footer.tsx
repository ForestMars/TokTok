
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border py-8 mt-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-workflow-blue rounded-md flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <span className="font-display font-medium text-lg tracking-tight">PEDAL</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              Product Engineering Delivery Automation Lifecycle - A beautiful workflow pipeline for moving SWE artifacts through a delivery process with stakeholder approvals.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/documentation" className="text-sm text-foreground hover:text-workflow-blue transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-foreground hover:text-workflow-blue transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-foreground hover:text-workflow-blue transition-colors">
                  Workflow Steps
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-foreground hover:text-workflow-blue transition-colors">
                  Operators Guide
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground mb-4">Technical Stack</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <span className="w-16 text-muted-foreground">Airflow</span>
                <div className="h-1.5 w-1.5 rounded-full bg-workflow-blue mx-2"></div>
                <span>Workflow Engine</span>
              </li>
              <li className="flex items-center text-sm">
                <span className="w-16 text-muted-foreground">TypeSpec</span>
                <div className="h-1.5 w-1.5 rounded-full bg-workflow-green mx-2"></div>
                <span>API Specification</span>
              </li>
              <li className="flex items-center text-sm">
                <span className="w-16 text-muted-foreground">Drizzle</span>
                <div className="h-1.5 w-1.5 rounded-full bg-workflow-purple mx-2"></div>
                <span>ORM</span>
              </li>
              <li className="flex items-center text-sm">
                <span className="w-16 text-muted-foreground">Zod</span>
                <div className="h-1.5 w-1.5 rounded-full bg-workflow-orange mx-2"></div>
                <span>Schema Validation</span>
              </li>
              <li className="flex items-center text-sm">
                <span className="w-16 text-muted-foreground">Supabase</span>
                <div className="h-1.5 w-1.5 rounded-full bg-workflow-red mx-2"></div>
                <span>Database</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} PEDAL. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
