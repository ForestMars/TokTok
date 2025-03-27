
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldX, Home } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-lg text-center"
      >
        <ShieldX className="w-16 h-16 mx-auto text-workflow-red" />
        
        <h1 className="text-2xl font-display font-semibold tracking-tight mt-6">
          Access Denied
        </h1>
        
        <p className="text-muted-foreground mt-4 mb-6">
          You don't have the required permissions to access this page. Please contact your administrator.
        </p>
        
        <Button 
          onClick={() => navigate('/')}
          className="bg-workflow-blue hover:bg-workflow-blue/90"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
