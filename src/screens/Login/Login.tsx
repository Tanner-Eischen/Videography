import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { useAuth } from '../../contexts/AuthContext';

export const Login = (): JSX.Element => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message || 'Failed to sign in');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#023c97] to-[#75c4cc] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="mb-8 text-center">
          <div className="w-20 h-20 bg-[#023c97] rounded-full mx-auto mb-4 flex items-center justify-center">
            <img className="w-12 h-12" alt="Logo" src="/v.png" />
          </div>
          <h1 className="[font-family:'Lexend',Helvetica] font-bold text-[#023c97] text-3xl mb-2">
            Welcome Back
          </h1>
          <p className="[font-family:'Lexend',Helvetica] text-gray-600">
            Sign in to access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg [font-family:'Lexend',Helvetica]">
              {error}
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

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#023c97] hover:bg-[#022d70] text-white rounded-lg [font-family:'Lexend',Helvetica] font-bold text-lg"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="[font-family:'Lexend',Helvetica] text-gray-600 text-sm">
            Don't have an account?{' '}
            <a href="#signup" className="text-[#023c97] font-semibold hover:underline">
              Contact your administrator
            </a>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="[font-family:'Lexend',Helvetica] text-gray-500 text-xs text-center">
            Demo Credentials:
          </p>
          <p className="[font-family:'Lexend',Helvetica] text-gray-500 text-xs text-center mt-1">
            Admin: admin@demo.com / Password: admin123
          </p>
          <p className="[font-family:'Lexend',Helvetica] text-gray-500 text-xs text-center">
            Client: client@demo.com / Password: client123
          </p>
        </div>
      </Card>
    </div>
  );
};
