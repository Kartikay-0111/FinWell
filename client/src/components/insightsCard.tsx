import { useState, useEffect, useRef } from 'react';
import { Sparkles, TrendingUp, Zap, ArrowRight, BarChart } from 'lucide-react';

export default function PremiumInsightsDisplay({insights}) {
  // const insights = [
  //   "Wow, ₹0 spent across the board! Have you achieved peak minimalism, or just forgotten to link your accounts?",
  //   "Zero income and zero spending... Are you a financial ghost or just *really* good at pretending money doesn't exist?",
  //   "With a grand total of 0 transactions, your bank account must be feeling awfully lonely."
  // ];
  const icons = [Sparkles, TrendingUp, Zap];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);

  // Auto-rotate insights
  useEffect(() => {
    const interval = setInterval(() => {
      rotateInsight();
    }, 6000);
    
    return () => clearInterval(interval);
  }, [activeIndex]);

  const rotateInsight = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % insights.length);
      setIsAnimating(false);
    }, 500);
  };

  const IconComponent = icons[activeIndex] || Sparkles;

  return (
    <div 
      ref={containerRef}
      className="w-full max-w-4xl mx-auto p-8 bg-finWhite rounded-xl shadow-xl overflow-hidden relative"
    > 
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute right-0 top-0 w-64 h-64 bg-finOrange rounded-full -mr-16 -mt-16"></div>
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-finDarkBlue rounded-full -ml-16 -mb-16"></div>
      </div>
      
      <h2 className="text-3xl font-bold mb-6 text-center text-finDarkBlue relative z-10 animate-fade-in">
        Financial Insights
        <div className="h-1 w-24 bg-finOrange mx-auto mt-2 rounded-full"></div>
      </h2>
      
      <div className="relative bg-finLightGray rounded-xl shadow-lg overflow-hidden transform hover:scale-102 transition-all duration-300 group z-10">
        {/* Animated border */}
        <div className="absolute inset-0 p-1">
          <div className="absolute inset-0 bg-gradient-to-r from-finOrange via-finDarkBlue to-finOrange bg-[length:200%_100%]" 
               style={{animation: "gradient 3s linear infinite"}}></div>
        </div>
        
        <div className="relative m-[1px] bg-finWhite rounded-xl p-8 h-full">
          {/* Icon with highlight effect */}
          <div className="absolute -top-4 -right-4 w-24 h-24 flex items-center justify-center bg-finDarkBlue rounded-full shadow-lg transform -rotate-12 group-hover:rotate-0 transition-all duration-500">
            <IconComponent size={32} className="text-finOrange animate-pulse" />
          </div>
          
          <div className={`relative z-10 ${isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'} transition-all duration-500`}>
            <div className="pb-2 mb-4 border-b border-finLightGray">
              <div className="flex items-center space-x-2">
                <BarChart size={20} className="text-finOrange" />
                <span className="text-sm font-medium text-finDarkBlue/70">Insight #{activeIndex + 1}</span>
              </div>
            </div>
            
            <p className="text-xl font-medium text-finDarkBlue animate-scale-in leading-relaxed">
              {insights[activeIndex]}
            </p>
            
            <div className="mt-6 flex items-center justify-between">
              <div className="flex space-x-2">
                {insights.map((_: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (index !== activeIndex && !isAnimating) {
                        setIsAnimating(true);
                        setTimeout(() => {
                          setActiveIndex(index);
                          setIsAnimating(false);
                        }, 500);
                      }
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeIndex 
                        ? "bg-finOrange scale-125" 
                        : "bg-finLightGray hover:bg-finDarkBlue"
                    }`}
                    aria-label={`View insight ${index + 1}`}
                  />
                ))}
              </div>
              
              <button 
                onClick={rotateInsight}
                className="flex items-center space-x-2 px-4 py-2 bg-finDarkBlue text-finWhite rounded-full text-sm font-medium hover:bg-finOrange transition-colors duration-300"
              >
                <span>Next</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Card stack effect */}
      <div className="mt-12 relative z-0">
        <div className="absolute -top-8 left-4 right-4 h-24 bg-finLightGray rounded-xl shadow-md -z-10 transform -rotate-1"></div>
        <div className="absolute -top-6 left-8 right-8 h-20 bg-finLightGray rounded-xl shadow-sm -z-20 transform rotate-1"></div>
      </div>
      
      {/* Floating icons for visual interest */}
      <div className="absolute top-20 left-5 text-finOrange animate-bounce delay-300">
        <Sparkles size={24} />
      </div>
      <div className="absolute bottom-20 right-10 text-finOrange/20 animate-bounce delay-700">
        <TrendingUp size={28} />
      </div>
      
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}