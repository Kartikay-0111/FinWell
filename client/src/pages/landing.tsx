import React, { useState, useEffect } from 'react';
import { ArrowRight, BarChart4, CalendarClock, ChevronRight, CreditCard, PieChart, Shield, Target, Zap } from 'lucide-react';

// Simple animation for revealing elements when they enter viewport
const FadeInSection = ({ children, delay = 0 }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = React.useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setVisible(true);
        observer.unobserve(domRef.current);
      }
    });
    
    observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Button component with hover effect
const Button = ({ children, primary = false, className = '' }) => (
  <button
    className={`${
      primary ? 'fin-button' : 'bg-muted text-foreground hover:bg-muted/80'
    } px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:translate-y-[-1px] ${className}`}
  >
    {children}
  </button>
);

// Feature card component
const FeatureCard = ({ icon, title, description }) => {
  const Icon = icon;
  
  return (
    <div className="fin-card p-6 h-full flex flex-col">
      <div className="mb-4 p-3 bg-background/60 rounded-lg w-fit">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground flex-grow">{description}</p>
    </div>
  );
};

// Testimonial card
const TestimonialCard = ({ quote, author, role }) => (
  <div className="fin-card p-6">
    <p className="text-lg italic mb-4">{quote}</p>
    <div className="flex items-center">
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
        {author[0]}
      </div>
      <div className="ml-3">
        <p className="font-medium">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  </div>
);

export default function LandingPage() {
  // State for animated counter
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prevCount => {
        const nextCount = prevCount + 1;
        if (nextCount > 95) {
          clearInterval(interval);
          return 95;
        }
        return nextCount;
      });
    }, 30);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center mr-3">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">FinTrackr</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="text-muted-foreground hover:text-foreground transition-colors px-4 py-2">Login</button>
            <Button primary>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/20 z-0"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
              <FadeInSection>
                <div className="inline-block px-4 py-2 rounded-full bg-muted mb-6 text-sm font-medium">
                  <span className="text-primary">✨</span> Smart Finance Management
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Master Your Money
                  <span className="block fin-gradient-text">Track Every Detail</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                  Take control of your finances with our comprehensive tracking, insights, 
                  and goal management system designed for your personal success.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button primary className="flex items-center justify-center">
                    Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button className="flex items-center justify-center">
                    Watch Demo <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                <div className="mt-8 flex items-center">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-background">
                        <span className="text-xs font-medium">{String.fromCharCode(65 + i)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm text-muted-foreground">Trusted by</div>
                    <div className="font-semibold">{count}k+ users</div>
                  </div>
                </div>
              </FadeInSection>
            </div>
            
            <div className="w-full lg:w-1/2 relative lg:pl-10">
              <FadeInSection delay={300}>
                <div className="fin-card p-6 rounded-xl relative overflow-hidden fin-shadow">
                  <div className="absolute top-0 right-0 bg-gradient-to-bl from-primary/10 to-transparent w-32 h-32 rounded-bl-full"></div>
                  
                  <div className="mb-6">
                    <h3 className="fin-heading mb-2">Monthly Overview</h3>
                    <p className="fin-subheading">April 2025</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <p className="text-sm text-muted-foreground mb-1">Income</p>
                      <p className="text-xl font-bold">₹85,400</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <p className="text-sm text-muted-foreground mb-1">Expenses</p>
                      <p className="text-xl font-bold">₹42,300</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <p className="text-sm text-muted-foreground mb-1">Savings</p>
                      <p className="text-xl font-bold text-primary">₹43,100</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="mb-2 flex justify-between items-center">
                      <h4 className="font-medium">Spending Categories</h4>
                      <span className="text-xs text-muted-foreground">Last 30 days</span>
                    </div>
                    <div className="h-8 rounded-full bg-muted overflow-hidden flex">
                      <div className="bg-primary h-full w-3/12" title="Food 25%"></div>
                      <div className="bg-blue-500 h-full w-2/12" title="Transport 15%"></div>
                      <div className="bg-purple-500 h-full w-4/12" title="Shopping 30%"></div>
                      <div className="bg-green-500 h-full w-2/12" title="Bills 20%"></div>
                      <div className="bg-red-500 h-full w-1/12" title="Others 10%"></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>Food</span>
                      <span>Transport</span>
                      <span>Shopping</span>
                      <span>Bills</span>
                      <span>Others</span>
                    </div>
                  </div>
                  
                  <div className="fin-divider"></div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Recent Transactions</h4>
                      <button className="text-xs text-primary">View All</button>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: 'Grocery Store', amount: '₹2,400', date: 'Today', category: 'Food' },
                        { name: 'Amazon.in', amount: '₹1,850', date: 'Yesterday', category: 'Shopping' },
                        { name: 'Uber Ride', amount: '₹320', date: '12 Apr', category: 'Transport' }
                      ].map((tx, i) => (
                        <div key={i} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3">
                              {tx.category === 'Food' && <PieChart className="h-4 w-4 text-primary-foreground" />}
                              {tx.category === 'Shopping' && <CreditCard className="h-4 w-4 text-primary-foreground" />}
                              {tx.category === 'Transport' && <Zap className="h-4 w-4 text-primary-foreground" />}
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
                  
                  <div className="p-3 rounded-lg bg-muted/30 border border-primary/20">
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
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-16">
              <p className="text-primary font-medium mb-2">POWERFUL FEATURES</p>
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
                icon={Zap}
                title="Gamified Experience"
                description="Make financial management fun with challenges, badges, and rewards that motivate you to build better financial habits."
              />
            </FadeInSection>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-16">
              <p className="text-primary font-medium mb-2">SIMPLE PROCESS</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How FinTrackr Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Getting started is easy. Follow these simple steps to take control of your financial future.
              </p>
            </div>
          </FadeInSection>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FadeInSection delay={100}>
              <div className="fin-card p-6 text-center relative">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">1</div>
                <div className="pt-6">
                  <h3 className="text-xl font-semibold mb-3 mt-3">Connect Your Data</h3>
                  <p className="text-muted-foreground">
                    Upload your bank statements or manually add transactions to start tracking your finances.
                  </p>
                </div>
              </div>
            </FadeInSection>
            
            <FadeInSection delay={300}>
              <div className="fin-card p-6 text-center relative">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">2</div>
                <div className="pt-6">
                  <h3 className="text-xl font-semibold mb-3 mt-3">Set Your Goals</h3>
                  <p className="text-muted-foreground">
                    Define your financial goals and spending limits to create a personalized plan.
                  </p>
                </div>
              </div>
            </FadeInSection>
            
            <FadeInSection delay={500}>
              <div className="fin-card p-6 text-center relative">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">3</div>
                <div className="pt-6">
                  <h3 className="text-xl font-semibold mb-3 mt-3">Track & Optimize</h3>
                  <p className="text-muted-foreground">
                    Monitor your progress, get insights, and optimize your spending habits to reach your goals.
                  </p>
                </div>
              </div>
            </FadeInSection>
          </div>
          
          <FadeInSection delay={600}>
            <div className="mt-16 text-center">
              <Button primary className="px-8 py-4">
                Start Your Financial Journey
              </Button>
            </div>
          </FadeInSection>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-16">
              <p className="text-primary font-medium mb-2">SUCCESS STORIES</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join thousands of happy users who have transformed their financial lives with FinTrackr.
              </p>
            </div>
          </FadeInSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FadeInSection delay={100}>
              <TestimonialCard 
                quote="FinTrackr completely changed my financial habits. I've saved over ₹50,000 in just three months by identifying unnecessary expenses."
                author="Priya Sharma"
                role="Product Designer"
              />
            </FadeInSection>
            
            <FadeInSection delay={300}>
              <TestimonialCard 
                quote="The goal system helped me save for my dream vacation. The app made it easy to track my progress and stay motivated."
                author="Rahul Mehta"
                role="Software Engineer"
              />
            </FadeInSection>
            
            <FadeInSection delay={500}>
              <TestimonialCard 
                quote="I love the daily financial wisdom! It's like having a personal finance coach in my pocket. The subscription tracking alone saved me thousands."
                author="Aanya Patel"
                role="Marketing Specialist"
              />
            </FadeInSection>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-16">
              <p className="text-primary font-medium mb-2">AFFORDABLE PLANS</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Simple, transparent pricing options designed to fit your financial management needs.
              </p>
            </div>
          </FadeInSection>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <FadeInSection delay={100}>
              <div className="fin-card p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold">Free</h3>
                  <p className="text-4xl font-bold mt-2">₹0<span className="text-muted-foreground text-sm font-normal">/month</span></p>
                  <p className="text-muted-foreground mt-2">Perfect for beginners</p>
                </div>
                <div className="fin-divider"></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-primary mr-2" />
                    <span>Manual transaction tracking</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-primary mr-2" />
                    <span>Basic dashboard</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-primary mr-2" />
                    <span>Limited reports</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-primary mr-2" />
                    <span>1 financial goal</span>
                  </li>
                </ul>
                <Button className="w-full">Get Started</Button>
              </div>
            </FadeInSection>
            
            <FadeInSection delay={300}>
              <div className="fin-card p-6 border-primary/50 relative transform scale-105">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-sm font-medium px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
                <div className="mb-6 pt-2">
                  <h3 className="text-xl font-semibold">Premium</h3>
                  <p className="text-4xl font-bold mt-2">₹299<span className="text-muted-foreground text-sm font-normal">/month</span></p>
                  <p className="text-muted-foreground mt-2">For serious personal finance</p>
                </div>
                <div className="fin-divider"></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-primary mr-2" />
                    <span>Automated PDF import</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-primary mr-2" />
                    <span>Full dashboard access</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-primary mr-2" />
                    <span>Weekly/Monthly reports</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-primary mr-2" />
                    <span>Unlimited goals</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-primary mr-2" />
                    <span>AI-powered insights</span>
                  </li>
                </ul>
                <Button primary className="w-full">Get Premium</Button>
              </div>
            </FadeInSection>
            
            <FadeInSection delay={500}>
              <div className="fin-card p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold">Family</h3>
                  <p className="text-4xl font-bold mt-2">₹499<span className="text-muted-foreground text-sm font-normal">/month</span></p>
                  <p className="text-muted-foreground mt-2">For household finances</p>
                </div>
                <div className="fin-divider"></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-primary mr-2" />
                    <span>All Premium features</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-primary mr-2" />
                    <span>Up to 5 user accounts</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-primary mr-2" />
                    <span>Family budget planning</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-primary mr-2" />
                    <span>Shared goals</span>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-primary mr-2" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="w-full">Get Family Plan</Button>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>
      
      {/* Call To Action */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-background/80 z-0"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <FadeInSection>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your <span className="fin-gradient-text">Financial Future</span>?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of users who have already taken control of their finances.
                Start your journey today.
              </p>
              <Button primary className="px-8 py-4 text-lg">
                Get Started For Free
              </Button>
              <p className="mt-4 text-muted-foreground">No credit card required</p>
            </div>
          </FadeInSection>
        </div>
      </section>
      </div>
  );
}

