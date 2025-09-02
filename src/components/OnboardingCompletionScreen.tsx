import React, { useEffect, useState } from 'react';

interface OnboardingCompletionScreenProps {
  onComplete: () => void;
}

export default function OnboardingCompletionScreen({ onComplete }: OnboardingCompletionScreenProps) {
  const [tigerVisible, setTigerVisible] = useState(true); // Start visible immediately
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    console.log('OnboardingCompletionScreen mounted');
    
    // Tiger is already visible - no delay needed
    // Text fades in quickly after mount
    const textTimer = setTimeout(() => {
      console.log('Text animation triggered');
      setTextVisible(true);
    }, 200); // Reduced from 800ms to 200ms

    // Auto redirect after 3 seconds
    const redirectTimer = setTimeout(() => {
      console.log('Auto redirecting to dashboard');
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(redirectTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen relative z-10 overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Main content */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-4 md:py-8">
        
        {/* Content container */}
        <div className="relative flex flex-col items-center justify-center space-y-8">
          
          {/* Thank you message with beautiful animation */}
          <div className={`text-center transition-all duration-1000 ease-out ${textVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4 animate-fade-in">
              🎉 Thanks for registering!
            </h1>
            <p className="text-xl md:text-2xl font-playfair font-medium text-white/90">
              Redirecting to dashboard...
            </p>
          </div>
          
          {/* Monte mascot with heart - bouncy entrance animation */}
          <div className={`flex-shrink-0 transition-all duration-1200 ease-out ${tigerVisible ? 'opacity-100 translate-y-0 scale-100 rotate-0' : 'opacity-0 translate-y-16 scale-75 rotate-12'}`}>
            <div className="animate-bounce">
              <img
                src="/lovable-uploads/bb95d81e-f824-4762-aed3-c6fb2af3cfba.png"
                alt="Monte the Tiger with Heart"
                className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                onLoad={() => console.log('Tiger heart image loaded successfully')}
                onError={() => console.log('Tiger heart image failed to load')}
              />
            </div>
          </div>
          
          {/* Floating hearts animation */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 text-red-400 text-2xl animate-bounce">💝</div>
            <div className="absolute top-1/3 right-1/4 text-pink-400 text-xl animate-pulse">💖</div>
            <div className="absolute bottom-1/3 left-1/3 text-red-300 text-lg animate-bounce delay-500">❤️</div>
          </div>
          
        </div>
        
      </div>
    </div>
  );
}