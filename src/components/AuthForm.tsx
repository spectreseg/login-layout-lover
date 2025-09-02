import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
interface AuthFormProps {
  mode: 'login' | 'register';
  onToggleMode: (mode: 'login' | 'register') => void;
  onLogin: () => void;
}
export default function AuthForm({
  mode,
  onToggleMode,
  onLogin
}: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };
  return <div className="bg-card rounded-2xl shadow-auth-form w-full relative overflow-visible backdrop-blur-sm bg-opacity-95 mt-12 sm:mt-16 md:mt-20">
      {/* Logo Section - positioned to straddle background and form */}
      <div className="absolute -top-12 sm:-top-16 md:-top-20 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 relative">
          <img src="/lovable-uploads/00927cad-9b22-41ba-9858-efcf7069f623.png" alt="Tiger Logo" className="w-full h-full object-contain drop-shadow-lg" />
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="flex border-b border-auth-gray-300 mt-16 sm:mt-20 md:mt-24">
        <button onClick={() => onToggleMode('login')} className={`flex-1 py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base text-center font-medium transition-smooth ${mode === 'login' ? 'text-auth-purple border-b-2 border-auth-purple bg-auth-purple-light' : 'text-auth-gray-500 hover:text-auth-gray-700 hover:bg-auth-gray-50'}`}>
          Login
        </button>
        <button onClick={() => onToggleMode('register')} className={`flex-1 py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base text-center font-medium transition-smooth ${mode === 'register' ? 'text-auth-purple border-b-2 border-auth-purple bg-auth-purple-light' : 'text-auth-gray-500 hover:text-auth-gray-700 hover:bg-auth-gray-50'}`}>
          Register
        </button>
      </div>

      {/* Form Content */}
      <div className="p-4 sm:p-6 md:p-8">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-auth-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-auth-gray-600 font-normal">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-auth-purple" />
            </div>
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base border border-auth-gray-300 rounded-lg focus:ring-2 focus:ring-auth-purple focus:border-transparent transition-smooth bg-auth-gray-50 focus:bg-card font-normal" required />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-auth-purple" />
            </div>
            <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} className="w-full pl-8 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base border border-auth-gray-300 rounded-lg focus:ring-2 focus:ring-auth-purple focus:border-transparent transition-smooth bg-auth-gray-50 focus:bg-card font-normal" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-auth-purple hover:text-auth-purple-dark transition-colors">
              {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-auth-purple focus:ring-auth-purple border-auth-gray-300 rounded" />
              <span className="ml-2 text-sm text-auth-gray-600 font-normal">Remember me</span>
            </label>
            <button type="button" className="text-xs sm:text-sm text-auth-purple hover:text-auth-purple-dark transition-colors font-normal">
              Forgot password?
            </button>
          </div>

          <button type="submit" className="w-full bg-gradient-purple text-primary-foreground py-2 sm:py-2.5 md:py-3 px-4 text-sm sm:text-base rounded-lg font-medium hover:bg-gradient-purple-hover focus:ring-2 focus:ring-auth-purple focus:ring-offset-2 transition-smooth transform hover:scale-[1.02] active:scale-[0.98] shadow-auth-button">
            Sign In
          </button>
        </form>
      </div>

      {/* Decorative elements */}
      
    </div>;
}