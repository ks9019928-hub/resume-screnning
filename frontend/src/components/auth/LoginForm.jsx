import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Globe, MessageCircle, Monitor } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-gray-300">
      
      {}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
           {/* Simple abstract logo */}
           <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
             <span className="text-white font-bold text-xl">L</span>
           </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Or{' '}
          <a href="#" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            create a new account
          </a>
        </p>
      </div>

      {}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#121212] py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-gray-800">
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
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
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-700 rounded-lg bg-[#1a1a1a] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
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
                  className="appearance-none block w-full pl-10 pr-10 py-2.5 border border-gray-700 rounded-lg bg-[#1a1a1a] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-300 focus:outline-none transition-colors"
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

            {}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-700 bg-[#1a1a1a] text-indigo-500 focus:ring-indigo-500 focus:ring-offset-gray-900"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot your password?
                </a>
              </div>
            </div>

            {}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-[#121212] transition-colors"
              >
                Sign in
              </button>
            </div>
          </form>

          {}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#121212] text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-700 rounded-lg shadow-sm bg-[#1a1a1a] text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <span className="sr-only">Sign in with Google</span>
                  <Globe className="w-5 h-5"/>
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-700 rounded-lg shadow-sm bg-[#1a1a1a] text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <span className="sr-only">Sign in with Twitter</span>
                  <MessageCircle className="w-5 h-5"/>
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-700 rounded-lg shadow-sm bg-[#1a1a1a] text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <span className="sr-only">Sign in with GitHub</span>
                  <Monitor className="w-5 h-5"/>
                </a>
              </div>
            </div>
          </div>
          
        </div>
        
        {}
        <p className="mt-8 text-center text-xs text-gray-500">
          By signing in, you agree to our{' '}
          <a href="#" className="underline hover:text-gray-400 transition-colors">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="underline hover:text-gray-400 transition-colors">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}