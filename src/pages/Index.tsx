import { useState } from 'react';
import AuthForm from '@/components/AuthForm';

const Index = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleLogin = () => {
    console.log('Login attempted');
    // Handle login logic here
  };

  const handleToggleMode = (mode: 'login' | 'register') => {
    setAuthMode(mode);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-auth-purple-light via-background to-auth-gray-50 p-4">
      <div className="w-full max-w-md">
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
