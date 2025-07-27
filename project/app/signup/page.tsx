"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../../app/components/auth/AuthLayout';
import { GoogleAuthButton } from '../../app/components/auth/GoogleAuthButton';
import { FormDivider } from '../../app/components/auth/FormDivider';
import { FormInput } from '../../app/components/auth/FormInput';
import { PasswordToggle } from '../../app/components/auth/PasswordToggle';
import { ErrorMessage } from '../../app/components/auth/ErrorMessage';
import { AuthButton } from '../../app/components/auth/AuthButton';
import { EmailIcon, PasswordIcon, UserIcon } from '../utils/auth-icons';

export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signup(firstName, lastName, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // Implement Google Sign-Up logic here
    console.log('Google Sign-Up clicked');
  };

  return (
    <AuthLayout title="Only Isabella Allowed!">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Create an Account</h2>
      
      {error && <ErrorMessage message={error} />}
      
      <GoogleAuthButton 
        text="Sign up with Google" 
        onClick={handleGoogleSignUp}
        disabled={isLoading}
      />

      <FormDivider />

      <form onSubmit={handleSubmit}>
        <FormInput
          id="firstName"
          label="First Name"
          type="text"
          placeholder="Your first name"
          value={firstName}
          onChange={setFirstName}
          icon={<UserIcon />}
          disabled={isLoading}
          required
          autoComplete="given-name"
        />

        <FormInput
          id="lastName"
          label="Last Name"
          type="text"
          placeholder="Your last name"
          value={lastName}
          onChange={setLastName}
          icon={<UserIcon />}
          disabled={isLoading}
          required
          autoComplete="family-name"
        />

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
          placeholder="Create a strong password"
          value={password}
          onChange={setPassword}
          icon={<PasswordIcon />}
          disabled={isLoading}
          required
          autoComplete="new-password"
          endAdornment={
            <PasswordToggle
              showPassword={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            />
          }
        />

        <FormInput
          id="confirmPassword"
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          icon={<PasswordIcon />}
          disabled={isLoading}
          required
          autoComplete="new-password"
        />

        {/* Terms and Conditions */}
        <div className="mb-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-500">
                I agree to the{' '}
                <Link href="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>
        </div>

        <AuthButton disabled={isLoading || !acceptTerms}>
          {isLoading ? 'Creating Account...' : 'Sign up'}
        </AuthButton>
      </form>

      {/* Login Link */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Log in
        </Link>
      </div>
    </AuthLayout>
  );
}