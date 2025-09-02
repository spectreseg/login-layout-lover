
import React, { useEffect, useState } from 'react';
import SpeechBubble from './SpeechBubble';

interface OnboardingScreenProps {
  onBack: () => void;
  onProceed: () => void;
}

export default function OnboardingScreen({ onBack, onProceed }: OnboardingScreenProps) {
  const [showAnimations, setShowAnimations] = useState(false);

  useEffect(() => {
    console.log('OnboardingScreen mounted');
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      console.log('Triggering animations');
      setShowAnimations(true);
    }, 500); // Increased delay to ensure proper mounting
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8 relative z-10">
      {/* Speech Bubble - fades in */}
      <div className={`mb-8 transition-all duration-1000 delay-1500 ${
        showAnimations ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <SpeechBubble text="Hi, I'm Monte. I'll help with registration. Ready to proceed?" />
      </div>

      {/* Tiger Character - flies up from bottom */}
      <div className={`mb-12 transition-all duration-1000 ease-out ${
        showAnimations ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}>
        <img 
          src="/lovable-uploads/66d848c6-3010-4a7c-ae3f-ef4b712ad9f6.png" 
          alt="Monte the Tiger" 
          className="w-64 h-64 sm:w-80 sm:h-80 object-contain"
          onLoad={() => console.log('Tiger image loaded successfully')}
          onError={() => console.log('Tiger image failed to load')}
        />
      </div>

      {/* Action Buttons - fly up together */}
      <div className={`flex gap-6 transition-all duration-1000 delay-2000 ease-out ${
        showAnimations ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}>
        <button
          onClick={onBack}
          className="px-8 py-3 text-lg font-medium text-purple-600 bg-white border-2 border-purple-600 rounded-xl hover:bg-purple-50 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all transform hover:scale-105 active:scale-95"
        >
          Back
        </button>
        <button
          onClick={onProceed}
          className="px-8 py-3 text-lg font-semibold text-white bg-purple-600 border-2 border-purple-600 rounded-xl hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
