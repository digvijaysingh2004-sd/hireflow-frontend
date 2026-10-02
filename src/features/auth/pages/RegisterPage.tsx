import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Lock, Mail, User as UserIcon, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { registerSchema, RegisterSchemaType } from '../schemas';
import { useAuth } from '../hooks/useAuth';

export const RegisterPage: React.FC = () => {
  const { register: registerUser, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'Candidate',
    },
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    setServerError(null);
    clearError();
    try {
      await registerUser(data);
      navigate('/verify-email', { state: { email: data.email } });
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : 'Registration failed. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-[85vh] flex rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xl my-4">
      {/* Left Brand Panel */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 font-black text-2xl text-white mb-8">
            <Briefcase className="w-7 h-7 text-indigo-400" />
            <span>HireFlow</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-6">
            <ShieldCheck className="w-4 h-4 text-indigo-400" /> Candidate Portal Registration
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight leading-tight mb-4">
            Join Thousands of Engineers Accelerating Their Career.
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed max-w-md">
            Create your profile once, verify via email OTP, and apply directly to top tech companies with real-time status history.
          </p>
        </div>

        <div className="relative z-10 space-y-3 pt-6 border-t border-slate-800 text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Fast 6-Digit Email OTP Verification
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-Time Application Timeline Tracking
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Direct Interview Calendar Invites
          </div>
        </div>
      </div>

      {/* Right Form Card */}
      <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-slate-500 text-xs mt-1">
              Already registered?{' '}
              <Link to="/login" className="font-bold text-indigo-600 hover:underline">
                Sign in to your account
              </Link>
            </p>
          </div>

          {(serverError || error) && (
            <div className="rounded-xl bg-red-50 p-4 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>{serverError || error}</div>
            </div>
          )}

          <form className="space-y-3.5" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    {...register('firstName')}
                    className={`block w-full pl-9 pr-3 py-2 border ${
                      errors.firstName ? 'border-red-300' : 'border-slate-300'
                    } rounded-xl text-sm placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden`}
                    placeholder="Jane"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  {...register('lastName')}
                  className={`block w-full px-3 py-2 border ${
                    errors.lastName ? 'border-red-300' : 'border-slate-300'
                  } rounded-xl text-sm placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  className={`block w-full pl-9 pr-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-slate-300'
                  } rounded-xl text-sm placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden`}
                  placeholder="jane.doe@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  {...register('password')}
                  className={`block w-full pl-9 pr-3 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-slate-300'
                  } rounded-xl text-sm placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  {...register('confirmPassword')}
                  className={`block w-full pl-9 pr-3 py-2 border ${
                    errors.confirmPassword ? 'border-red-300' : 'border-slate-300'
                  } rounded-xl text-sm placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer transition-all"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
