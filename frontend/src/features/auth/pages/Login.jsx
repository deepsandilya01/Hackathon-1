import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/Card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated, isInitialized, user, error, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'Staff' ? '/staff/dashboard' : '/user/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  if (!isInitialized || (loading && !isAuthenticated)) {
    return <div className="flex h-screen items-center justify-center bg-surface text-on-surface">Loading...</div>;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-surface p-4">
      <Card className="w-full max-w-md border-0">
        <CardHeader>
          <CardTitle className="text-3xl text-primary font-display font-bold">Crisis Response</CardTitle>
          <CardDescription>Login to access the system</CardDescription>
        </CardHeader>
        <CardContent>
          {successMessage && (
            <div className="bg-emerald-900/50 text-emerald-400 p-3 rounded-md text-sm mb-4 text-center border border-emerald-800">
              {successMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/50 border border-red-500/50 p-3 rounded-md text-red-200 text-sm">
                {error.message || (error.errors && error.errors[0]?.msg) || (typeof error === 'string' ? error : 'Login failed')}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-on-surface">Email</label>
              <Input
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-on-surface">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-slate-400">
            Don't have an account? <Link to="/register" className="text-red-500 hover:underline">Register</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
