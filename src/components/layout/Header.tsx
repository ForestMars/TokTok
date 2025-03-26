
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navItems = [
    { name: 'Pipeline', path: '/' },
    { name: 'Documentation', path: '/documentation' },
  ];
  
  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b',
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md border-border/60 py-3'
          : 'bg-transparent border-transparent py-5'
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center"
          >
            <div className="h-8 w-8 bg-workflow-blue rounded-md flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <span className="font-display font-medium text-lg tracking-tight">Artifact Pipeline</span>
          </motion.div>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item, index) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                'relative px-4 py-2 rounded-md text-sm font-medium transition-colors',
                location.pathname === item.path
                  ? 'text-workflow-blue'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              {location.pathname === item.path && (
                <motion.span 
                  layoutId="navbar-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-workflow-blue"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex items-center bg-workflow-blue text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm hover:bg-workflow-blue/90 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            New Artifact
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;
