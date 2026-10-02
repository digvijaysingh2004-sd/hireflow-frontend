import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { KeyRound, Mail, AlertCircle, CheckCircle2, RefreshCw, ArrowRight } from 'lucide-react';
import { verifyOtpSchema, VerifyOtpSchemaType } from '../schemas';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api';

export const VerifyOtpPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOtp, isLoading, error, clearError } = useAuth();

  const prefilledEmail = (location.state as { email?: string })?.email || '';

  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyOtpSchemaType>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: prefilledEmail,
      otp: '',
    },
  });

  useEffect(() => {
    if (prefilledEmail) {
      setValue('email', prefilledEmail);
    }
  }, [prefilledEmail, setValue]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const onSubmit = async (data: VerifyOtpSchemaType) => {
    clearError();
    setResendMessage(null);
    try {
      const success = await verifyOtp(data);
      if (success) {
        setIsSuccess(true);
        setTimeout(() => navigate('/login'), 2500);
      }
    } catch {
      // handled by AuthContext error state
    }
  };

  const handleResend = async (email: string) => {
    if (!email || resendCooldown > 0) return;
    setResendMessage(null);
    try {
      await authApi.resendOtp(email);
      setResendMessage('A new 6-digit OTP code has been sent to your email.');
      setResendCooldown(30);
    } catch (err: unknown) {
      setResendMessage(err instanceof Error ? err.message : 'Failed to resend OTP code.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2 text-indigo-600">
          <KeyRound className="w-8 h-8" />
          <span className="text-2xl font-black tracking-tight">Email Verification</span>
        </div>
        <p className="mt-2 text-center text-sm text-slate-600">
          Please enter the 6-digit verification code sent to your email.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xs sm:rounded-xl sm:px-10 border border-slate-200">
          {isSuccess && (
            <div className="mb-6 rounded-lg bg-emerald-50 p-4 border border-emerald-200 text-sm text-emerald-800 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Email Verified Successfully!</strong>
                Redirecting to login page...
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200 text-sm text-red-700 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {resendMessage && (
            <div className="mb-6 rounded-lg bg-indigo-50 p-4 border border-indigo-200 text-sm text-indigo-700">
              {resendMessage}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  placeholder="candidate@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">6-Digit Verification Code</label>
              <div className="mt-1">
                <input
                  type="text"
                  maxLength={6}
                  {...register('otp')}
                  className="block w-full text-center tracking-widest font-mono text-2xl py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  placeholder="123456"
                />
              </div>
              {errors.otp && (
                <p className="mt-1 text-xs text-red-600">{errors.otp.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-xs text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Verifying Code...' : 'Verify Email'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => handleResend(prefilledEmail)}
              disabled={resendCooldown > 0}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-500 disabled:text-slate-400 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP Code'}
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          Return to{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
