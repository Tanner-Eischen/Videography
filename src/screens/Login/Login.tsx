import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { User } from 'lucide-react';

export const Login = (): JSX.Element => {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'admin' | 'client'>('client');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password, fullName, role);
      if (error) {
        setError(error.message || 'Failed to sign up');
        setLoading(false);
      } else {
        setSuccess('Account created successfully! Redirecting to dashboard...');
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message || 'Failed to sign in');
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#023c97] to-[#75c4cc] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="mb-8 text-center">
          <div className="w-20 h-20 bg-[#023c97] rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-3xl mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="[font-family:'Lexend',Helvetica] text-gray-600">
            {isSignUp ? 'Sign up to get started' : 'Sign in to access your dashboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg [font-family:'Lexend',Helvetica] text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg [font-family:'Lexend',Helvetica] text-sm">
              {success}
            </div>
          )}

          {isSignUp && (
            <div>
              <Label className="[font-family:'Lexend',Helvetica] font-semibold text-gray-700 mb-2 block">
                Full Name
              </Label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12 rounded-lg border-2 border-gray-300 focus:border-[#023c97] [font-family:'Lexend',Helvetica]"
                placeholder="John Doe"
                required
              />
            </div>
          )}

          <div>
            <Label className="[font-family:'Lexend',Helvetica] font-semibold text-gray-700 mb-2 block">
              Email Address
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-lg border-2 border-gray-300 focus:border-[#023c97] [font-family:'Lexend',Helvetica]"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <Label className="[font-family:'Lexend',Helvetica] font-semibold text-gray-700 mb-2 block">
              Password
            </Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-lg border-2 border-gray-300 focus:border-[#023c97] [font-family:'Lexend',Helvetica]"
              placeholder="Enter your password"
              required
            />
          </div>

          {isSignUp && (
            <div>
              <Label className="[font-family:'Lexend',Helvetica] font-semibold text-gray-700 mb-2 block">
                Role
              </Label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'client')}
                className="w-full h-12 rounded-lg border-2 border-gray-300 focus:border-[#023c97] [font-family:'Lexend',Helvetica] px-4"
                required
              >
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#023c97] hover:bg-[#022d70] text-white rounded-lg [font-family:'Lexend',Helvetica] font-bold text-lg"
          >
            {loading ? (isSignUp ? 'Creating Account...' : 'Signing in...') : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="[font-family:'Lexend',Helvetica] text-gray-600 text-sm">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setSuccess('');
              }}
              className="text-[#023c97] font-semibold hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};
