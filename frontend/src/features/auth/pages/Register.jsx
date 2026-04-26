import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/Card';

export default function Register() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    role: 'User'
  });
  const { register, isAuthenticated, isInitialized, user, error, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'Staff' ? '/staff/dashboard' : '/user/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData).unwrap();
      navigate('/login', { state: { message: 'Registration successful! Please check your email to verify your account.' } });
    } catch (err) {
      console.error(err);
    }
  };

  if (!isInitialized || (loading && !isAuthenticated)) {
    return <div className="flex h-screen items-center justify-center bg-surface text-on-surface">Loading...</div>;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-surface p-4">
      <Card className="w-full max-w-md border-0">
        <CardHeader>
          <CardTitle className="text-3xl text-primary font-display font-bold">Create Account</CardTitle>
          <CardDescription>Join the Crisis Response System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/50 border border-red-500/50 p-3 rounded-md text-red-200 text-sm">
                {error.message || (error.errors && error.errors[0]?.msg) || (typeof error === 'string' ? error : 'Registration failed')}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-on-surface">Full Name</label>
              <Input
                name="fullname"
                placeholder="John Doe"
                value={formData.fullname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-on-surface">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-on-surface">Phone</label>
              <Input
                name="phone"
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-on-surface">Password</label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-on-surface">Role</label>
              <Select name="role" value={formData.role} onChange={handleChange} className="bg-surface-container-highest border-transparent text-on-surface focus:border-outline focus:border-2 transition-all h-11 rounded-[12px] px-4">
                <option value="User">Guest / Visitor (User)</option>
                <option value="Staff">Hotel Staff</option>
              </Select>
            </div>
            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-slate-400">
            Already have an account? <Link to="/login" className="text-red-500 hover:underline">Login</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
