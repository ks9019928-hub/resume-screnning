import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Globe, MessageCircle, Monitor, Hexagon } from 'lucide-react';

export default function DarkThemeLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login action
    console.log('Logging in with:', { email, password });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col md:flex-row font-sans text-gray-300">
      
      {/* Left Side - Branding/Decorative (Hidden on small screens) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-900 via-purple-900 to-black items-center justify-center p-12 relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-10 right-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 text-center space-y-6 max-w-lg">
          <Hexagon className="w-24 h-24 text-indigo-400 mx-auto" strokeWidth={1.5} />
          <h1 className="text-5xl font-bold text-white tracking-tight">Nexus Portal</h1>
          <p className="text-xl text-indigo-200 font-light">
            Enter the dashboard to manage your projects, connect with your team, and track your progress in real-time.
          </p>
        </div>
      </div>

      { }
      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-[#0a0a0a]">
        <div className="w-full max-w-md space-y-8">
          
          {/* Form Header */}
          <div className="text-center md:text-left">
            <div className="md:hidden flex justify-center mb-6">
               {/* Simple abstract logo for mobile */}
               <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                 <span className="text-white font-bold text-xl">N</span>
               </div>
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Don't have an account?{' '}
              <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                Sign up for free
              </a>
            </p>
          </div>

          { }
          {/* Form Section */}
          <div className="bg-[#121212] p-8 rounded-2xl border border-gray-800 shadow-2xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email address
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" aria-hidden="true" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl bg-[#1a1a1a] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" aria-hidden="true" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-700 rounded-xl bg-[#1a1a1a] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-200 focus:outline-none transition-colors p-1"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              { }
              {/* Options */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-700 bg-[#1a1a1a] text-indigo-500 focus:ring-indigo-500 focus:ring-offset-gray-900 cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400 cursor-pointer">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-[#121212] transition-colors"
                >
                  Sign in to account
                </button>
              </div>
            </form>

            { }
            {/* Social Login Separator */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#121212] text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Buttons */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-700 rounded-xl shadow-sm bg-[#1a1a1a] text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <span className="sr-only">Sign in with Google</span>
                  <Globe className="w-5 h-5"/>
                </a>

                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-700 rounded-xl shadow-sm bg-[#1a1a1a] text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <span className="sr-only">Sign in with Twitter</span>
                  <MessageCircle className="w-5 h-5"/>
                </a>

                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-700 rounded-xl shadow-sm bg-[#1a1a1a] text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <span className="sr-only">Sign in with GitHub</span>
                  <Monitor className="w-5 h-5"/>
                </a>
              </div>
            </div>
          </div>
          
          {/* Footer Text */}
          <p className="text-center text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <a href="#" className="underline hover:text-gray-300 transition-colors">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="underline hover:text-gray-300 transition-colors">Privacy Policy</a>.
          </p>

        </div>
      </div>
      
      { }
      {/* Add custom styles for the background blobs animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}} />
    </div>
  );
}