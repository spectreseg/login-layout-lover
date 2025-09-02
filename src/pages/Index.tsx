import React, { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import StarryBackground from '@/components/StarryBackground';
import OnboardingScreen from '@/components/OnboardingScreen';
import OnboardingFormScreen from '@/components/OnboardingFormScreen';
import OnboardingPasswordScreen from '@/components/OnboardingPasswordScreen';
import OnboardingLocationScreen from '@/components/OnboardingLocationScreen';
import OnboardingAvatarScreen from '@/components/OnboardingAvatarScreen';
import OnboardingCompletionScreen from '@/components/OnboardingCompletionScreen';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [onboardingStep, setOnboardingStep] = useState<'none' | 'intro' | 'form' | 'password' | 'location' | 'avatar' | 'completion'>('none');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    console.log('Login attempted');
    setIsLoggedIn(true);
  };

  const handleToggleMode = (mode: 'login' | 'register') => {
    console.log('handleToggleMode called with:', mode);
    setAuthMode(mode);
    if (mode === 'register') {
      console.log('Setting onboardingStep to intro');
      setOnboardingStep('intro');
    }
  };

  const handleOnboardingBack = () => {
    if (onboardingStep === 'avatar') {
      setOnboardingStep('location');
    } else if (onboardingStep === 'location') {
      setOnboardingStep('password');
    } else if (onboardingStep === 'password') {
      setOnboardingStep('form');
    } else if (onboardingStep === 'form') {
      setOnboardingStep('intro');
    } else {
      setOnboardingStep('none');
      setAuthMode('login');
    }
  };

  const handleOnboardingProceed = () => {
    if (onboardingStep === 'intro') {
      console.log('Moving to form step');
      setOnboardingStep('form');
    } else if (onboardingStep === 'form') {
      console.log('Moving to password step');
      setOnboardingStep('password');
    } else if (onboardingStep === 'password') {
      console.log('Moving to location step');
      setOnboardingStep('location');
    } else if (onboardingStep === 'location') {
      console.log('Moving to avatar step');
      setOnboardingStep('avatar');
    } else if (onboardingStep === 'avatar') {
      console.log('Moving to completion step');
      setOnboardingStep('completion');
    } else {
      setOnboardingStep('none');
      console.log('Completing registration');
    }
  };

  const handleFormBack = () => {
    setOnboardingStep('intro');
  };

  const handleFormProceed = () => {
    setOnboardingStep('password');
    console.log('Moving to password step');
  };

  const handlePasswordBack = () => {
    setOnboardingStep('form');
  };

  const handlePasswordProceed = () => {
    setOnboardingStep('location');
    console.log('Moving to location step');
  };

  const handleLocationBack = () => {
    setOnboardingStep('password');
  };

  const handleLocationProceed = () => {
    setOnboardingStep('avatar');
    console.log('Moving to avatar step');
  };

  const handleAvatarBack = () => {
    setOnboardingStep('location');
  };

  const handleAvatarProceed = () => {
    setOnboardingStep('completion');
    console.log('Moving to completion step');
  };

  const handleCompletionFinish = () => {
    setOnboardingStep('none');
    setIsLoggedIn(true);
    console.log('Registration completed, navigating to dashboard');
  };

  console.log('Current state - authMode:', authMode, 'onboardingStep:', onboardingStep);

  // Preload all onboarding images for smooth transitions
  const preloadImages = () => {
    const imageUrls = [
      '/lovable-uploads/0ae562c5-5c88-4c2d-97cd-7d89c980721a.png', // Form screen tiger
      '/lovable-uploads/0665048e-ad40-4530-b849-0390b3667650.png', // Password screen tiger
      '/lovable-uploads/fc82ea5e-3e13-4240-8f8c-b4469c2153c4.png', // Location screen tiger
      '/lovable-uploads/4e2f3f60-20d2-4179-a8c3-d01aaedd6fb1.png', // Avatar screen tiger
      '/lovable-uploads/bb95d81e-f824-4762-aed3-c6fb2af3cfba.png'  // Completion screen tiger
    ];

    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  };

  // Preload images when component mounts
  React.useEffect(() => {
    preloadImages();
  }, []);

  // Show first onboarding screen
  if (onboardingStep === 'intro') {
    console.log('Rendering intro onboarding screen');
    return (
      <div className="min-h-screen relative">
        <StarryBackground />
        <OnboardingScreen 
          onBack={handleOnboardingBack}
          onProceed={handleOnboardingProceed}
        />
      </div>
    );
  }

  // Show avatar onboarding screen
  if (onboardingStep === 'avatar') {
    console.log('Rendering avatar onboarding screen');
    return (
      <div className="min-h-screen relative">
        <StarryBackground />
        <OnboardingAvatarScreen 
          onBack={handleAvatarBack}
          onProceed={handleAvatarProceed}
        />
      </div>
    );
  }

  // Show dashboard if user is logged in
  if (isLoggedIn) {
    console.log('Rendering dashboard');
    return <Dashboard />;
  }

  // Show completion onboarding screen
  if (onboardingStep === 'completion') {
    console.log('Rendering completion onboarding screen');
    return (
      <div className="min-h-screen relative">
        <StarryBackground />
        <OnboardingCompletionScreen 
          onComplete={handleCompletionFinish}
        />
      </div>
    );
  }

  // Show form onboarding screen
  if (onboardingStep === 'form') {
    console.log('Rendering form onboarding screen');
    return (
      <div className="min-h-screen relative">
        <StarryBackground />
        <OnboardingFormScreen 
          onBack={handleFormBack}
          onProceed={handleFormProceed}
        />
      </div>
    );
  }

  // Show password onboarding screen
  if (onboardingStep === 'password') {
    console.log('Rendering password onboarding screen');
    return (
      <div className="min-h-screen relative">
        <StarryBackground />
        <OnboardingPasswordScreen 
          onBack={handlePasswordBack}
          onProceed={handlePasswordProceed}
        />
      </div>
    );
  }

  // Show location onboarding screen
  if (onboardingStep === 'location') {
    console.log('Rendering location onboarding screen');
    return (
      <div className="min-h-screen relative">
        <StarryBackground />
        <OnboardingLocationScreen 
          onBack={handleLocationBack}
          onProceed={handleLocationProceed}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative pt-20">
      <StarryBackground />
      <div className="w-full max-w-lg relative z-10">
        <AuthForm 
          mode={authMode}
          onToggleMode={handleToggleMode}
          onLogin={handleLogin}
        />
      </div>
    </div>
  );
};

export default Index;
