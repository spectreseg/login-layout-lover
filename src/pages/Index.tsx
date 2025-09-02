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
    setAuthMode(mode);
    if (mode === 'register') {
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

  // Show full-screen onboarding
  if (showOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <StarryBackground />
        <OnboardingScreen 
          onBack={handleOnboardingBack}
          onProceed={handleOnboardingProceed}
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
