import { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import StarryBackground from '@/components/StarryBackground';
import OnboardingScreen from '@/components/OnboardingScreen';
import OnboardingFormScreen from '@/components/OnboardingFormScreen';

const Index = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [onboardingStep, setOnboardingStep] = useState<'none' | 'intro' | 'form'>('none');

  const handleLogin = () => {
    console.log('Login attempted');
    // Handle login logic here
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
    if (onboardingStep === 'form') {
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
    } else {
      setOnboardingStep('none');
      // Here you would proceed to the actual registration completion
      console.log('Completing registration');
    }
  };

  const handleFormBack = () => {
    setOnboardingStep('intro');
  };

  const handleFormProceed = () => {
    setOnboardingStep('none');
    // Complete the registration process
    console.log('Registration form completed');
  };

  console.log('Current state - authMode:', authMode, 'onboardingStep:', onboardingStep);

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
