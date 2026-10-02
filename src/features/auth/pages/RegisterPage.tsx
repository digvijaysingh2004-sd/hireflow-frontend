import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Lock, Mail, User as UserIcon, AlertCircle, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2 text-indigo-600">
          <Briefcase className="w-8 h-8" />
          <span className="text-2xl font-black tracking-tight">HireFlow</span>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900">
          Create candidate account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xs sm:rounded-xl sm:px-10 border border-slate-200">
          {(serverError || error) && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200 text-sm text-red-700 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>{serverError || error}</div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700">First name</label>
                <div className="mt-1 relative rounded-md shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    {...register('firstName')}
                    className={`block w-full pl-9 pr-3 py-2 border ${
                      errors.firstName ? 'border-red-300' : 'border-slate-300'
                    } rounded-lg text-sm placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden`}
                    placeholder="Jane"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Last name</label>
                <div className="mt-1 relative rounded-md shadow-xs">
                  <input
                    type="text"
                    {...register('lastName')}
                    className={`block w-full px-3 py-2 border ${
                      errors.lastName ? 'border-red-300' : 'border-slate-300'
                    } rounded-lg text-sm placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden`}
                    placeholder="Doe"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  className={`block w-full pl-9 pr-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-slate-300'
                  } rounded-lg text-sm placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden`}
                  placeholder="jane.doe@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  {...register('password')}
                  className={`block w-full pl-9 pr-3 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-slate-300'
                  } rounded-lg text-sm placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Confirm password</label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  {...register('confirmPassword')}
                  className={`block w-full pl-9 pr-3 py-2 border ${
                    errors.confirmPassword ? 'border-red-300' : 'border-slate-300'
                  } rounded-lg text-sm placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden`}
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
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-xs text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
