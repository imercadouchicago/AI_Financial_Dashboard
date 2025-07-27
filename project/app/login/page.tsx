"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/auth/AuthLayout';
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton';
import { FormDivider } from '../components/auth/FormDivider';
import { FormInput } from '../components/auth/FormInput';
import { PasswordToggle } from '../components/auth/PasswordToggle';
import { ErrorMessage } from '../components/auth/ErrorMessage';
import { AuthButton } from '../components/auth/AuthButton';
import { EmailIcon, PasswordIcon } from '../utils/auth-icons';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Implement Google Sign-In logic here
    console.log('Google Sign-In clicked');
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Welcome back!</h2>
      
      {error && <ErrorMessage message={error} />}
      
      <GoogleAuthButton 
        text="Log in with Google" 
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      />

      <FormDivider />

      <form onSubmit={handleSubmit}>
        <FormInput
          id="email"
          label="E-Mail"
          type="email"
          placeholder="e.g.: email@email.com"
          value={email}
          onChange={setEmail}
          icon={<EmailIcon />}
          disabled={isLoading}
          required
          autoComplete="email"
        />

        <FormInput
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
          icon={<PasswordIcon />}
          disabled={isLoading}
          required
          autoComplete="current-password"
          endAdornment={
            <PasswordToggle
              showPassword={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            />
          }
        />

        {/* Remember Me and Forgot Password */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500">
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <Link href="/forgot-password" className="text-gray-500 hover:text-indigo-600">
              Forgot Password?
            </Link>
          </div>
        </div>

        <AuthButton disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </AuthButton>
      </form>

      {/* Sign Up Link */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign up
        </Link>
      </div>
    </AuthLayout>
  );
}