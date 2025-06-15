import { useState } from 'react';
import { PhoneIcon, MicrophoneIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { AuthService } from '../services/auth';
import { useApp } from '../contexts/AppContext';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const { mode, toggleMode, isDemo } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    clientName: '',
    companyName: '',
    phoneNumber: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          setIsLoading(false);
          return;
        }

        // Validate password length
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters long');
          setIsLoading(false);
          return;
        }

        const { user, error } = await AuthService.signUp({
          email: formData.email,
          password: formData.password,
          clientName: formData.clientName,
          companyName: formData.companyName,
          phoneNumber: formData.phoneNumber
        });

        if (error) {
          toast.error(error.message);
        } else if (user) {
          toast.success('Account created! Please check your email for verification.');
        }
      } else {
        const { user, error } = await AuthService.signIn({
          email: formData.email,
          password: formData.password
        });

        if (error) {
          toast.error(error.message);
        } else if (user) {
          toast.success('Signed in successfully!');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDemoLogin = async () => {
    const demoCredentials = AuthService.getDemoCredentials();
    setFormData({
      ...formData,
      email: demoCredentials.email,
      password: demoCredentials.password
    });
    
    setIsLoading(true);
    try {
      const { user, error } = await AuthService.signIn(demoCredentials);
      
      if (error) {
        toast.error(error.message);
      } else if (user) {
        toast.success('Demo login successful!');
      }
    } catch (error) {
      console.error('Demo login error:', error);
      toast.error('Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast.error('Please enter your email address first');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await AuthService.resetPassword({ email: formData.email });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password reset email sent! Check your inbox.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Failed to send password reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
            <div className="flex space-x-1">
              <PhoneIcon className="h-6 w-6 text-white" />
              <MicrophoneIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            AI CALL CENTER
          </h2>
          <p className="text-xl text-blue-200 mb-2">
            Intelligent Calling Platform
          </p>
          <p className="text-sm text-slate-300">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {isSignUp && (
              <>
                <div>
                  <label htmlFor="clientName" className="block text-sm font-medium text-white mb-2">
                    Full Name
                  </label>
                  <input
                    id="clientName"
                    name="clientName"
                    type="text"
                    required={isSignUp}
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-white mb-2">
                    Company Name (Optional)
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    placeholder="Acme Inc."
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-white mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/70 hover:text-white"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {isSignUp && (
                <p className="mt-1 text-xs text-blue-200">
                  Must be at least 6 characters
                </p>
              )}
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required={isSignUp}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/70 hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </div>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-blue-300 hover:text-blue-200 transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
              </button>
            </div>

            {!isSignUp && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-300 hover:text-blue-200 transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Demo Access */}
        {isDemo && !isSignUp && (
          <div className="bg-blue-900/30 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
            <h3 className="text-lg font-medium text-white mb-3">Demo Access</h3>
            <p className="text-sm text-blue-200 mb-4">
              Try the platform with our demo account to explore all features without registration.
            </p>
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-blue-400 text-sm font-medium rounded-lg text-white hover:bg-blue-700/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Accessing Demo...
                </div>
              ) : (
                'Access Demo Account'
              )}
            </button>
            <div className="mt-2 text-center">
              <p className="text-xs text-blue-300">
                Email: demo@example.com • Password: demo123
              </p>
            </div>
          </div>
        )}

        {/* Mode Toggle */}
        <div className="text-center">
          <button
            onClick={toggleMode}
            className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
          >
            {mode === 'demo' ? 'Switch to Live Mode' : 'Switch to Demo Mode'}
          </button>
        </div>
      </div>
    </div>
  );
}