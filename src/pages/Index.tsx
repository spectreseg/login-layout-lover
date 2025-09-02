import { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import StarryBackground from '@/components/StarryBackground';
import OnboardingScreen from '@/components/OnboardingScreen';

const Index = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleLogin = () => {
    console.log('Login attempted');
    // Handle login logic here
  };

  const handleToggleMode = (mode: 'login' | 'register') => {
    console.log('handleToggleMode called with:', mode);
    setAuthMode(mode);
    if (mode === 'register') {
      console.log('Setting showOnboarding to true');
      setShowOnboarding(true);
    }
  };

  const handleOnboardingBack = () => {
    setShowOnboarding(false);
    setAuthMode('login');
  };

  const handleOnboardingProceed = () => {
    setShowOnboarding(false);
    // Here you would proceed to the actual registration form
    console.log('Proceeding to registration form');
  };

  console.log('Current state - authMode:', authMode, 'showOnboarding:', showOnboarding);

  // Show full-screen onboarding
  if (showOnboarding) {
    console.log('Rendering onboarding screen');
    return (
      <OnboardingScreen 
        onBack={handleOnboardingBack}
        onProceed={handleOnboardingProceed}
      />
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
