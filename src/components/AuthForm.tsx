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
  return <div className="w-full relative overflow-visible mt-12 sm:mt-16 md:mt-20">
      {/* Logo Section - positioned to straddle background and form */}
      <div className="absolute -top-12 sm:-top-16 md:-top-20 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 relative">
          <img src="/lovable-uploads/00927cad-9b22-41ba-9858-efcf7069f623.png" alt="Tiger Logo" className="w-full h-full object-contain drop-shadow-lg" />
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="flex border-b border-white/20 mt-16 sm:mt-20 md:mt-24">
        <button onClick={() => onToggleMode('login')} className={`flex-1 py-3 sm:py-4 md:py-5 px-3 sm:px-5 md:px-7 text-sm sm:text-base md:text-lg text-center font-medium transition-smooth ${mode === 'login' ? 'text-white border-b-2 border-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
          Login
        </button>
        <button onClick={() => onToggleMode('register')} className={`flex-1 py-3 sm:py-4 md:py-5 px-3 sm:px-5 md:px-7 text-sm sm:text-base md:text-lg text-center font-medium transition-smooth ${mode === 'register' ? 'text-white border-b-2 border-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
          Register
        </button>
      </div>

      {/* Form Content */}
      <div className="p-6 sm:p-8 md:p-10">
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-white mb-3">
            Welcome Back
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 font-normal">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
            </div>
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className="w-full pl-12 sm:pl-14 pr-4 sm:pr-5 py-3 sm:py-4 md:py-5 text-base sm:text-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-smooth bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 font-normal" required />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
            </div>
            <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} className="w-full pl-12 sm:pl-14 pr-12 sm:pr-14 py-3 sm:py-4 md:py-5 text-base sm:text-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-smooth bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 font-normal" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors">
              {showPassword ? <EyeOff className="h-5 w-5 sm:h-6 sm:w-6" /> : <Eye className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="h-5 w-5 text-white focus:ring-white/30 border-white/30 rounded bg-white/10" />
              <span className="ml-3 text-sm sm:text-base text-gray-300 font-normal">Remember me</span>
            </label>
            <button type="button" className="text-sm sm:text-base text-white hover:text-gray-300 transition-colors font-normal">
              Forgot password?
            </button>
          </div>

          <button type="submit" className="w-full bg-white text-black py-3 sm:py-4 md:py-5 px-6 text-base sm:text-lg rounded-xl font-semibold hover:bg-gray-100 focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black transition-smooth transform hover:scale-[1.02] active:scale-[0.98] shadow-lg">
            Sign In
          </button>
        </form>
      </div>

      {/* Decorative elements */}
      
    </div>;
}