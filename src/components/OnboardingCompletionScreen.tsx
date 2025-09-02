import React, { useEffect, useState } from 'react';

interface OnboardingCompletionScreenProps {
  onComplete: () => void;
}

export default function OnboardingCompletionScreen({ onComplete }: OnboardingCompletionScreenProps) {
  const [tigerVisible, setTigerVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    console.log('OnboardingCompletionScreen mounted');
    
    // Tiger flies up first
    const tigerTimer = setTimeout(() => {
      console.log('Tiger animation triggered');
      setTigerVisible(true);
    }, 300);

    // Text fades in after tiger
    const textTimer = setTimeout(() => {
      console.log('Text animation triggered');
      setTextVisible(true);
    }, 800);

    // Auto redirect after 3 seconds
    const redirectTimer = setTimeout(() => {
      console.log('Auto redirecting to dashboard');
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(tigerTimer);
      clearTimeout(textTimer);
      clearTimeout(redirectTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen relative z-10 overflow-hidden">
      {/* Main content */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-4 md:py-8">
        
        {/* Content container */}
        <div className="relative flex flex-col items-center justify-center space-y-8">
          
          {/* Thank you message */}
          <div className={`text-center transition-opacity duration-700 ${textVisible ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Thanks for registering!
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Redirecting to dashboard...
            </p>
          </div>
          
          {/* Monte mascot with heart */}
          <div className={`flex-shrink-0 transition-transform duration-1000 ease-out ${tigerVisible ? 'translate-y-0' : 'translate-y-full'}`}>
            <img
              src="/lovable-uploads/monte-tiger-heart.png"
              alt="Monte the Tiger with Heart"
              className="w-[350px] h-[350px] md:w-[550px] md:h-[550px] object-contain drop-shadow-2xl"
              onLoad={() => console.log('Tiger heart image loaded successfully')}
              onError={() => console.log('Tiger heart image failed to load')}
            />
          </div>
          
        </div>
        
      </div>
    </div>
  );
}