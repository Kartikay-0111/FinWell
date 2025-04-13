import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, BarChart4, CalendarClock, ChevronRight, CreditCard, 
         PieChart, Shield, Target, Zap, TrendingUp, Wallet, Gift } from 'lucide-react';

// Improved animation for revealing elements
const FadeInSection = ({ children, delay = 0, direction = 'up' }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setVisible(true);
        observer.unobserve(domRef.current);
      }
    }, { threshold: 0.1 });
    
    observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    switch(direction) {
      case 'up': return `translateY(${isVisible ? 0 : '30px'})`;
      case 'down': return `translateY(${isVisible ? 0 : '-30px'})`;
      case 'left': return `translateX(${isVisible ? 0 : '30px'})`;
      case 'right': return `translateX(${isVisible ? 0 : '-30px'})`;
      default: return `translateY(${isVisible ? 0 : '30px'})`;
    }
  };

  return (
    <div
      ref={domRef}
      className={`transition-all duration-700 ease-out`}
      style={{ 
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transitionDelay: `${delay}ms` 
      }}
    >
      {children}
    </div>
  );
};

// Enhanced Button component
const Button = ({ children, primary = false, className = '', onClick }) => (
  <button
    onClick={onClick}
    className={`${
      primary ? 'fin-button bg-gradient-to-r from-primary to-purple-500 text-white' : 
      'bg-muted text-foreground hover:bg-muted/80'
    } px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md 
    hover:shadow-lg hover:translate-y-[-2px] flex items-center justify-center ${className}`}
  >
    {children}
  </button>
);

// Enhanced Feature card component with hover effects
const FeatureCard = ({ icon, title, description }) => {
  const Icon = icon;
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="fin-card p-6 h-full flex flex-col transition-all duration-300 hover:shadow-lg"
      style={{ 
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 10px 25px rgba(0,0,0,0.1)' : ''
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mb-4 p-3 bg-background/60 rounded-lg w-fit 
                    transition-all duration-300 group-hover:bg-primary/20">
        <Icon className={`h-6 w-6 text-primary transition-all duration-300 
                        ${isHovered ? 'scale-110' : 'scale-100'}`} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground flex-grow">{description}</p>
    </div>
  );
};

// Animated number counter component
const AnimatedCounter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let startTime;
        const startValue = 0;
        
        const step = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const value = Math.floor(progress * (target - startValue) + startValue);
          
          setCount(value);
          
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        
        window.requestAnimationFrame(step);
        observer.unobserve(counterRef.current);
      }
    }, { threshold: 0.1 });
    
    if (counterRef.current) {
      observer.observe(counterRef.current);
    }
    
    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [target, duration]);
  
  return <span ref={counterRef}>{count}</span>;
};

// Character animation component
const AnimatedCharacter = () => {
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsActive(prev => !prev);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative">
      <div className="w-64 h-64 bg-blue-100 rounded-full absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="character-container transition-all duration-500" style={{ transform: isActive ? 'translateY(-5px)' : 'translateY(5px)' }}>
        {/* We'll use a placeholder SVG that represents our character */}
        <div className="w-48 h-48 relative mx-auto">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-amber-200 flex items-center justify-center">
              <div className="face flex flex-col items-center justify-center">
                <div className="eyes flex space-x-4 mb-2">
                  <div className="eye w-4 h-4 rounded-full bg-blue-900"></div>
                  <div className="eye w-4 h-4 rounded-full bg-blue-900"></div>
                </div>
                <div className={`mouth w-8 h-4 bg-red-400 rounded-full transition-all duration-300 ${isActive ? 'h-6' : 'h-2'}`}></div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 w-full">
            <div className="w-32 h-12 bg-purple-500 rounded-t-full mx-auto transform translate-y-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Floating elements animation
const FloatingElement = ({ children, delay = 0, duration = 3, offsetY = 10 }) => {
  return (
    <div 
      className="transition-all"
      style={{ 
        animation: `float ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      {children}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-${offsetY}px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
};

// Cartoon Icon component
const CartoonIcon = ({ icon, color = 'bg-blue-500', size = 'md' }) => {
  const Icon = icon;
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };
  
  return (
    <div className={`${color} ${sizeClasses[size]} rounded-2xl flex items-center justify-center 
                    shadow-lg transform rotate-3`}>
      <Icon className="text-white h-8 w-8" />
    </div>
  );
};

export default function EnhancedLandingPage() {
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Parallax effect for background elements
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full filter blur-3xl" 
             style={{ transform: `translate(${scrollY * 0.02}px, ${scrollY * -0.01}px)` }}></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/5 rounded-full filter blur-3xl"
             style={{ transform: `translate(${scrollY * -0.03}px, ${scrollY * 0.02}px)` }}></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-green-500/5 rounded-full filter blur-3xl"
             style={{ transform: `translate(${scrollY * -0.01}px, ${scrollY * -0.02}px)` }}></div>
      </div>
      
      {/* Header/Navigation - Enhanced */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-primary to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center mr-3 shadow-md">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">FinTrackr</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How it Works</a>
            <a href="#demo" className="text-muted-foreground hover:text-primary transition-colors">Demo</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="hidden md:block text-muted-foreground hover:text-primary transition-colors px-4 py-2">Login</button>
            <Button primary className="hidden md:flex" onClick={() => {}}>
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="container mx-auto px-4 py-2 space-y-4 bg-background">
            <a href="#features" className="block py-2 text-muted-foreground hover:text-primary">Features</a>
            <a href="#how-it-works" className="block py-2 text-muted-foreground hover:text-primary">How it Works</a>
            <a href="#demo" className="block py-2 text-muted-foreground hover:text-primary">Demo</a>
            <div className="pt-2 pb-4 flex flex-col space-y-3">
              <button className="text-muted-foreground hover:text-primary transition-colors py-2">Login</button>
              <Button primary onClick={() => { console.log('Get Started clicked'); }}>Get Started <ArrowRight className="ml-2 h-5 w-5" /></Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Enhanced with floating elements and animated characters */}
      <section className="relative pt-16 md:pt-24 pb-24 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/20 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
              <FadeInSection delay={0} direction="right">
                <div className="inline-block px-4 py-2 rounded-full bg-primary/10 mb-6 text-sm font-medium">
                  <span className="text-primary mr-2">✨</span> Smart Finance Management
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Master Your Money
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Track Every Detail</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                  Take control of your finances with our comprehensive tracking, insights, 
                  and goal management system designed for your personal success.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button primary className="flex items-center justify-center group" onClick={() => { console.log('Start Your Journey clicked'); }}>
                    Start Your Journey 
                    <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button className="flex items-center justify-center" onClick={() => {}}>
                    Watch Demo <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                <div className="mt-8 flex items-center">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-10 h-10 rounded-full flex items-center justify-center border border-background"
                        style={{ 
                          backgroundColor: ['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'][i],
                          zIndex: 4-i
                        }}
                      >
                        <span className="text-xs font-medium text-white">{String.fromCharCode(65 + i)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm text-muted-foreground">Trusted by</div>
                    <div className="font-semibold"><AnimatedCounter target={95} />k+ users</div>
                  </div>
                </div>
              </FadeInSection>
            </div>
            
            <div className="w-full lg:w-1/2 relative lg:pl-10">
              {/* Floating animated elements */}
              <div className="absolute left-0 top-20 opacity-70 pointer-events-none">
                <FloatingElement delay={0.5} duration={4}>
                  <CartoonIcon icon={Target} color="bg-green-400" size="sm" />
                </FloatingElement>
              </div>
              <div className="absolute right-10 top-10 opacity-70 pointer-events-none">
                <FloatingElement delay={0} duration={5}>
                  <CartoonIcon icon={Wallet} color="bg-amber-400" size="sm" />
                </FloatingElement>
              </div>
              <div className="absolute right-0 bottom-20 opacity-70 pointer-events-none">
                <FloatingElement delay={1.5} duration={4.5}>
                  <CartoonIcon icon={Zap} color="bg-purple-400" size="sm" />
                </FloatingElement>
              </div>
              <div className="absolute left-10 bottom-0 opacity-70 pointer-events-none">
                <FloatingElement delay={2} duration={3.5}>
                  <CartoonIcon icon={Gift} color="bg-blue-400" size="sm" />
                </FloatingElement>
              </div>
              
              <FadeInSection delay={300}>
                <div className="fin-card p-6 rounded-xl relative overflow-hidden fin-shadow border border-white/10 backdrop-blur-sm">
                  <div className="absolute top-0 right-0 bg-gradient-to-bl from-primary/10 to-transparent w-32 h-32 rounded-bl-full"></div>
                  
                  {/* Character animation */}
                  <div className="absolute -right-12 -top-12 opacity-20 pointer-events-none">
                    <AnimatedCharacter />
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2 flex items-center">
                      <CalendarClock className="mr-2 h-5 w-5 text-primary" />
                      Monthly Overview
                    </h3>
                    <p className="text-muted-foreground">April 2025</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-muted/30 border border-border backdrop-blur">
                      <p className="text-sm text-muted-foreground mb-1">Income</p>
                      <p className="text-xl font-bold">₹85,400</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30 border border-border backdrop-blur">
                      <p className="text-sm text-muted-foreground mb-1">Expenses</p>
                      <p className="text-xl font-bold">₹42,300</p>
                    </div>
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 backdrop-blur">
                      <p className="text-sm text-green-500 mb-1">Savings</p>
                      <p className="text-xl font-bold text-green-500">₹43,100</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="mb-3 flex justify-between items-center">
                      <h4 className="font-medium flex items-center">
                        <PieChart className="mr-2 h-4 w-4 text-primary" />
                        Spending Categories
                      </h4>
                      <span className="text-xs text-muted-foreground">Last 30 days</span>
                    </div>
                    <div className="h-8 rounded-full bg-muted/30 overflow-hidden flex">
                      <div className="bg-primary h-full w-3/12 relative group">
                        <span className="absolute inset-0 flex items-center justify-center text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">25%</span>
                      </div>
                      <div className="bg-blue-500 h-full w-2/12 relative group">
                        <span className="absolute inset-0 flex items-center justify-center text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">15%</span>
                      </div>
                      <div className="bg-purple-500 h-full w-4/12 relative group">
                        <span className="absolute inset-0 flex items-center justify-center text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">30%</span>
                      </div>
                      <div className="bg-green-500 h-full w-2/12 relative group">
                        <span className="absolute inset-0 flex items-center justify-center text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">20%</span>
                      </div>
                      <div className="bg-red-500 h-full w-1/12 relative group">
                        <span className="absolute inset-0 flex items-center justify-center text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">10%</span>
                      </div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>Food</span>
                      <span>Transport</span>
                      <span>Shopping</span>
                      <span>Bills</span>
                      <span>Others</span>
                    </div>
                  </div>
                  
                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-6"></div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium flex items-center">
                        <TrendingUp className="mr-2 h-4 w-4 text-primary" />
                        Recent Transactions
                      </h4>
                      <button className="text-xs text-primary hover:text-primary/80 transition-colors">View All</button>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: 'Grocery Store', amount: '₹2,400', date: 'Today', category: 'Food', icon: PieChart },
                        { name: 'Amazon.in', amount: '₹1,850', date: 'Yesterday', category: 'Shopping', icon: CreditCard },
                        { name: 'Uber Ride', amount: '₹320', date: '12 Apr', category: 'Transport', icon: Zap }
                      ].map((tx, i) => (
                        <div key={i} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/30 transition-colors">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mr-3">
                              <tx.icon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{tx.name}</p>
                              <p className="text-xs text-muted-foreground">{tx.date}</p>
                            </div>
                          </div>
                          <p className="font-medium">{tx.amount}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center text-amber-500">
                      <Zap className="h-4 w-4 mr-2" />
                      <p className="text-sm font-medium">Financial Fortune Cookie</p>
                    </div>
                    <p className="text-sm mt-1">Today, don't open Amazon. Trust me!</p>
                  </div>
                </div>
              </FadeInSection>
            </div>
          </div>
        </div>
      </section>

      {/* Cartoon Illustration Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="fin-card p-8 backdrop-blur">
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 mb-6 md:mb-0">
                  <svg viewBox="0 0 500 400" className="w-full max-w-md mx-auto">
                    {/* Background shapes */}
                    <circle cx="250" cy="200" r="180" fill="#f0f9ff" />
                    <circle cx="150" cy="150" r="50" fill="#e0f2fe" />
                    <circle cx="350" cy="250" r="70" fill="#dbeafe" />
                    
                    {/* Character */}
                    <g transform="translate(200, 120)">
                      {/* Head */}
                      <circle cx="50" cy="50" r="45" fill="#fdba74" />
                      
                      {/* Face */}
                      <circle cx="35" cy="40" r="5" fill="#1e40af" />
                      <circle cx="65" cy="40" r="5" fill="#1e40af" />
                      <path d="M35 65 Q50 75 65 65" stroke="#ef4444" strokeWidth="3" fill="none" />
                      
                      {/* Hair */}
                      <path d="M20 20 Q50 -20 80 20" fill="#7e22ce" />
                      
                      {/* Body */}
                      <rect x="25" y="95" width="50" height="70" fill="#fb7185" rx="10" />
                      <rect x="25" y="165" width="20" height="50" fill="#0ea5e9" rx="5" />
                      <rect x="55" y="165" width="20" height="50" fill="#0ea5e9" rx="5" />
                      
                      {/* Arms */}
                      <rect x="-5" y="100" width="30" height="15" fill="#fb7185" rx="5" />
                      <rect x="75" y="100" width="30" height="15" fill="#fb7185" rx="5" />
                      
                      {/* Collar */}
                      <path d="M35 95 Q50 105 65 95" fill="#93c5fd" />
                    </g>
                    
                    {/* Financial elements */}
                    <g transform="translate(80, 180)">
                      <rect x="0" y="0" width="80" height="50" fill="#ffffff" stroke="#d1d5db" strokeWidth="2" rx="5" />
                      <line x1="10" y1="15" x2="70" y2="15" stroke="#6366f1" strokeWidth="3" />
                      <line x1="10" y1="25" x2="50" y2="25" stroke="#d1d5db" strokeWidth="2" />
                      <line x1="10" y1="35" x2="60" y2="35" stroke="#d1d5db" strokeWidth="2" />
                      <circle cx="65" cy="35" r="10" fill="#10b981" />
                    </g>
                    
                    <g transform="translate(340, 150)">
                      <rect x="0" y="0" width="70" height="70" fill="#ffffff" stroke="#d1d5db" strokeWidth="2" rx="5" />
                      <circle cx="35" cy="20" r="10" fill="#6366f1" />
                      <rect x="15" y="40" width="40" height="5" fill="#d1d5db" rx="2" />
                      <rect x="15" y="50" width="30" height="5" fill="#d1d5db" rx="2" />
                    </g>
                    
                    {/* Charts and data */}
                    <g transform="translate(100, 70)">
                      <rect x="0" y="0" width="60" height="40" fill="#ffffff" stroke="#d1d5db" strokeWidth="2" rx="5" />
                      <line x1="10" y1="10" x2="10" y2="30" stroke="#d1d5db" strokeWidth="1" />
                      <line x1="10" y1="30" x2="50" y2="30" stroke="#d1d5db" strokeWidth="1" />
                      <path d="M10 25 L20 15 L30 20 L40 10" stroke="#6366f1" strokeWidth="2" fill="none" />
                    </g>
                    
                    <g transform="translate(340, 70)">
                      <circle cx="30" cy="30" r="25" fill="#ffffff" stroke="#d1d5db" strokeWidth="2" />
                      <path d="M30 5 A25 25 0 0 1 55 30" fill="none" stroke="#10b981" strokeWidth="4" />
                      <path d="M30 5 A25 25 0 0 0 5 30" fill="none" stroke="#6366f1" strokeWidth="4" />
                      <path d="M5 30 A25 25 0 0 0 30 55" fill="none" stroke="#f59e0b" strokeWidth="4" />
                      <path d="M30 55 A25 25 0 0 0 55 30" fill="none" stroke="#ef4444" strokeWidth="4" />
                    </g>
                    
                    {/* Floating coins and symbols */}
                    <g className="coin" transform="translate(320, 220)">
                      <circle cx="0" cy="0" r="15" fill="#f59e0b" />
                      <circle cx="0" cy="0" r="12" fill="#fbbf24" />
                      <text x="0" y="5" textAnchor="middle" fill="#92400e" fontSize="12" fontWeight="bold">₹</text>
                    </g>
                    
                    <g className="coin" transform="translate(150, 250)">
                      <circle cx="0" cy="0" r="12" fill="#f59e0b" />
                      <circle cx="0" cy="0" r="9" fill="#fbbf24" />
                      <text x="0" y="4" textAnchor="middle" fill="#92400e" fontSize="10" fontWeight="bold">₹</text>
                    </g>
                    
                    <g className="coin" transform="translate(270, 100)">
                      <circle cx="0" cy="0" r="10" fill="#f59e0b" />
                      <circle cx="0" cy="0" r="7" fill="#fbbf24" />
                      <text x="0" y="3" textAnchor="middle" fill="#92400e" fontSize="8" fontWeight="bold">₹</text>
                    </g>
                    
                    {/* Sparkles */}
                    <g transform="translate(170, 120)">
                      <path d="M0 0 L5 5 M0 5 L5 0" stroke="#6366f1" strokeWidth="2" />
                    </g>
                    <g transform="translate(350, 180)">
                      <path d="M0 0 L5 5 M0 5 L5 0" stroke="#10b981" strokeWidth="2" />
                    </g>
                    <g transform="translate(250, 70)">
                      <path d="M0 0 L5 5 M0 5 L5 0" stroke="#f59e0b" strokeWidth="2" />
                    </g>
                  </svg>
                </div>
                
                <div className="w-full md:w-1/2 md:pl-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Smart Finance Management</h2>
                  <p className="text-muted-foreground mb-6">
                    Financial tracking doesn't have to be boring or complicated. FinTrackr makes money management 
                    fun and easy with visual analytics, personalized insights, and smart recommendations.
                  </p>
                  <ul className="space-y-3">
                    {[
                      { text: "Upload bank statements with one click", icon: CreditCard },
                      { text: "Get personalized saving recommendations", icon: Target },
                      { text: "Set goals and track progress visually", icon: BarChart4 }
                    ].map((item, i) => (
                      <li key={i} className="flex items-center">
                        <div className="mr-3 p-2 bg-primary/10 rounded-full">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
      
      {/* Features Section - Enhanced */}
      <section id="features" className="py-20 bg-black/5">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 mb-4">
                <Zap className="h-4 w-4 text-primary mr-2" />
                <span className="text-primary font-medium">POWERFUL FEATURES</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Manage Finances</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our comprehensive suite of tools helps you track, analyze, and optimize your spending habits.
              </p>
            </div>
          </FadeInSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FadeInSection delay={100}>
              <FeatureCard 
                icon={CreditCard}
                title="Smart Transaction Tracking"
                description="Upload bank PDFs or manually add transactions. Our system automatically categorizes and organizes your financial data."
              />
            </FadeInSection>
            
            <FadeInSection delay={200}>
              <FeatureCard 
                icon={Target}
                title="Goal Management System"
                description="Set financial goals and track your progress with our advanced goal management system that helps you achieve your dreams."
              />
            </FadeInSection>
            
            <FadeInSection delay={300}>
              <FeatureCard 
                icon={BarChart4}
                title="Insightful Dashboard"
                description="Get a complete overview of your finances with our intuitive dashboard, featuring charts, insights, and personalized recommendations."
              />
            </FadeInSection>
            
            <FadeInSection delay={400}>
              <FeatureCard 
                icon={CalendarClock}
                title="Spending Limits & Alerts"
                description="Set daily, weekly, and monthly spending limits with smart alerts to help you stay on track with your budget."
              />
            </FadeInSection>
            
            <FadeInSection delay={500}>
              <FeatureCard 
                icon={Shield}
                title="Subscription Management"
                description="Track and manage your recurring payments to avoid unwanted charges and optimize your subscription expenses."
              />
            </FadeInSection>
            
            <FadeInSection delay={600}>
              <FeatureCard 
                icon={TrendingUp}
                title="Gamified Experience"
                description="Make financial management fun with challenges, badges, and rewards that motivate you to build better financial habits."
              />
            </FadeInSection>
          </div>
        </div>
      </section>
      
      {/* How It Works Section - Enhanced with animation */}
      <section id="how-it-works" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/20 z-0"></div>
        <div className="absolute top-40 left-10 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <FadeInSection>
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 mb-4">
                <ArrowRight className="h-4 w-4 text-primary mr-2" />
                <span className="text-primary font-medium">SIMPLE PROCESS</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How FinTrackr Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Getting started is easy. Follow these simple steps to take control of your financial future.
              </p>
            </div>
          </FadeInSection>
          
          <div className="relative">
            {/* Connector line for desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 transform -translate-y-1/2 z-0"></div>
            
            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              <FadeInSection delay={100} direction="up">
                <div className="fin-card p-6 text-center relative group hover:shadow-lg transition-all duration-300">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-primary to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">1</div>
                  <div className="pt-6">
                    <div className="mb-4 flex justify-center">
                      <FloatingElement offsetY={5}>
                        <CreditCard className="h-12 w-12 text-primary" />
                      </FloatingElement>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 mt-3">Connect Your Data</h3>
                    <p className="text-muted-foreground">
                      Upload your bank statements or manually add transactions to start tracking your finances.
                    </p>
                  </div>
                </div>
              </FadeInSection>
              
              <FadeInSection delay={300} direction="up">
                <div className="fin-card p-6 text-center relative group hover:shadow-lg transition-all duration-300">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-primary to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">2</div>
                  <div className="pt-6">
                    <div className="mb-4 flex justify-center">
                      <FloatingElement offsetY={5} delay={0.5}>
                        <Target className="h-12 w-12 text-primary" />
                      </FloatingElement>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 mt-3">Set Your Goals</h3>
                    <p className="text-muted-foreground">
                      Define your financial goals and spending limits to create a personalized plan.
                    </p>
                  </div>
                </div>
              </FadeInSection>
              
              <FadeInSection delay={500} direction="up">
                <div className="fin-card p-6 text-center relative group hover:shadow-lg transition-all duration-300">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-primary to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">3</div>
                  <div className="pt-6">
                    <div className="mb-4 flex justify-center">
                      <FloatingElement offsetY={5} delay={1}>
                        <BarChart4 className="h-12 w-12 text-primary" />
                      </FloatingElement>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 mt-3">Track & Optimize</h3>
                    <p className="text-muted-foreground">
                      Monitor your progress, get insights, and optimize your spending habits to reach your goals.
                    </p>
                  </div>
                </div>
              </FadeInSection>
            </div>
          </div>
          
          <FadeInSection delay={600}>
            <div className="mt-16 text-center">
              <Button primary className="px-8 py-4 text-lg" onClick={() => {}}>
                Start Your Financial Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </FadeInSection>
        </div>
      </section>
      
      {/* Interactive Demo Section */}
      <section id="demo" className="py-20 bg-black/5">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 mb-4">
                <Zap className="h-4 w-4 text-primary mr-2" />
                <span className="text-primary font-medium">INTERACTIVE DEMO</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience FinTrackr In Action</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                See how our platform makes financial management effortless and engaging.
              </p>
            </div>
          </FadeInSection>
          
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <FadeInSection delay={200} direction="right">
              <div className="space-y-8">
                <div className="flex">
                  <div className="mr-4 p-3 bg-primary/10 rounded-full flex-shrink-0">
                    <BarChart4 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Visual Analytics</h3>
                    <p className="text-muted-foreground">
                      Track your spending patterns with intuitive charts and graphs that make financial data easy to understand.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 p-3 bg-primary/10 rounded-full flex-shrink-0">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Smart Goal Setting</h3>
                    <p className="text-muted-foreground">
                      Create personalized savings goals with progress tracking to stay motivated on your financial journey.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 p-3 bg-primary/10 rounded-full flex-shrink-0">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Security First</h3>
                    <p className="text-muted-foreground">
                      Your financial data is protected with bank-level security. We never store your actual bank credentials.
                    </p>
                  </div>
                </div>
              </div>
            </FadeInSection>
            
            <FadeInSection delay={400} direction="left">
              <div className="relative">
                {/* Mock device frame */}
                <div className="bg-background rounded-3xl shadow-2xl border border-border p-3 max-w-md mx-auto">
                  <div className="rounded-2xl overflow-hidden bg-black">
                    {/* App screen content */}
                    <div className="bg-background p-4 min-h-96">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h3 className="font-bold">Dashboard</h3>
                          <p className="text-sm text-muted-foreground">Welcome back, Alex!</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-medium">A</span>
                        </div>
                      </div>
                      
                      <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-primary/80 to-purple-600/80 text-white">
                        <div className="flex justify-between mb-1">
                          <p className="text-sm text-white/80">Total Balance</p>
                          <Zap className="h-4 w-4" />
                        </div>
                        <p className="text-2xl font-bold mb-4">₹1,85,400</p>
                        <div className="flex justify-between">
                          <div>
                            <p className="text-xs text-white/80">Income</p>
                            <p className="font-medium">₹12,500</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/80">Expenses</p>
                            <p className="font-medium">₹8,320</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/80">Savings</p>
                            <p className="font-medium">₹4,180</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <div className="flex justify-between mb-3">
                          <h4 className="font-medium">Spending Overview</h4>
                          <span className="text-xs text-muted-foreground">This Week</span>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <p className="text-sm">Food & Dining</p>
                              <p className="text-sm font-medium">₹3,200</p>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div className="bg-primary h-full w-7/12"></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <p className="text-sm">Transportation</p>
                              <p className="text-sm font-medium">₹1,500</p>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div className="bg-blue-500 h-full w-4/12"></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <p className="text-sm">Shopping</p>
                              <p className="text-sm font-medium">₹2,400</p>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div className="bg-purple-500 h-full w-5/12"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-3">
                          <h4 className="font-medium">Savings Goals</h4>
                          <span className="text-xs text-primary">View All</span>
                        </div>
                        <div className="space-y-3">
                          <div className="p-3 rounded-lg bg-muted/50 border border-border">
                            <div className="flex justify-between mb-1">
                              <p className="text-sm font-medium">Vacation Fund</p>
                              <p className="text-xs text-green-500">40% Complete</p>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden mb-2">
                              <div className="bg-green-500 h-full w-5/12"></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>₹20,000 saved</span>
                              <span>₹50,000 goal</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-6 -right-4 opacity-80 pointer-events-none">
                  <FloatingElement delay={0.5} duration={4}>
                    <CartoonIcon icon={Wallet} color="bg-amber-400" size="sm" />
                  </FloatingElement>
                </div>
                <div className="absolute -bottom-6 -left-4 opacity-80 pointer-events-none">
                  <FloatingElement delay={1.2} duration={3.5}>
                    <CartoonIcon icon={CreditCard} color="bg-blue-400" size="sm" />
                  </FloatingElement>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>
      
      {/* Call To Action */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-background/80 z-0"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <FadeInSection>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Financial Future</span>?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of users who have already taken control of their finances.
                Start your journey today.
              </p>
              <Button primary className="px-8 py-4 text-lg group" onClick={() => { console.log('Get Started button clicked'); }}>
                Get Started For Free
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="mt-4 text-muted-foreground">No credit card required</p>
            </div>
          </FadeInSection>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-black/20 py-10 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="bg-gradient-to-br from-primary to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-md">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">FinTrackr</span>
            </div>
            
            <div className="flex flex-wrap gap-6 justify-center md:justify-end">
              <a href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">How it Works</a>
              <a href="#demo" className="text-sm text-muted-foreground hover:text-primary transition-colors">Demo</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
          
          <div className="h-px bg-border my-6"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} FinTrackr. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Global styles */}
      <style>{`
        .fin-card {
          background-color: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .fin-button {
          background: linear-gradient(135deg, var(--color-primary) 0%, #8b5cf6 100%);
          color: white;
          transition: all 0.3s ease;
        }
        
        .fin-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .fin-shadow {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .fin-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent);
          margin: 1.5rem 0;
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .floating {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
