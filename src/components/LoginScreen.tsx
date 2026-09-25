import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CrestLogo } from './CrestLogo';
import { Globe, Lock, ShieldCheck, KeyRound, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Language } from '../types';

interface LoginScreenProps {
  onOpenScratchChecker?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onOpenScratchChecker }) => {
  const { login, quickDemoLogin, language, setLanguage, t, isRTL } = useAuth();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!username.trim() || !password.trim()) {
      setErrorMessage(t.login.invalidCredentials);
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(username, password);
      if (!res.success) {
        setErrorMessage(res.message || t.login.invalidCredentials);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ha', label: 'Hausa', flag: '🇳🇬' },
    { code: 'yo', label: 'Yorùbá', flag: '🇳🇬' },
    { code: 'ig', label: 'Igbo', flag: '🇳🇬' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EE] flex flex-col justify-between items-center px-4 py-6 md:py-12">
      {/* Top Language & Accessibility Bar */}
      <header className="w-full max-w-md flex justify-between items-center mb-6">
        <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-white/80 border border-stone-200/80 px-3 py-1.5 rounded-full shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span className="font-medium">Portal v2.5 · SSL Secure</span>
        </div>

        {/* Language selector */}
        <div className="relative inline-flex items-center gap-1 bg-white border border-stone-300 rounded-full px-2.5 py-1 text-xs shadow-2xs">
          <Globe className="w-3.5 h-3.5 text-stone-500" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            aria-label="Select Language"
            className="bg-transparent border-none text-stone-800 font-medium focus:outline-none cursor-pointer pr-1"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Login Card - Exactly matching the video */}
      <main className="w-full max-w-[420px] bg-white border border-[#E5E0D3] rounded-2xl shadow-sm p-6 sm:p-8 my-auto">
        {/* School Emblem & Header */}
        <div className="flex items-center gap-4 mb-8">
          <CrestLogo size={58} />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900 leading-none">
              GSTC Garki
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">
              Govt. Science & Tech. College
            </p>
          </div>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Username / Admission No. */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-stone-800 mb-1.5"
            >
              {t.login.usernameLabel}
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t.login.usernamePlaceholder}
              autoComplete="username"
              required
              className="w-full px-3.5 py-3 rounded-lg border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 transition"
            />
          </div>

          {/* Password / PIN */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-stone-800 mb-1.5"
            >
              {t.login.passwordLabel}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.login.passwordPlaceholder}
                autoComplete="current-password"
                required
                className="w-full px-3.5 py-3 rounded-lg border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-stone-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs font-medium text-emerald-800 hover:text-emerald-900 underline underline-offset-2"
              >
                {t.login.forgotPassword}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-[#14532D] hover:bg-[#0f4022] active:bg-[#0b331b] text-white font-semibold text-sm rounded-lg shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
          >
            {isLoading ? (
              <span>{t.login.signingIn}</span>
            ) : (
              <span>{t.login.signInBtn}</span>
            )}
          </button>
        </form>

        {/* Demo Fast Login Helpers */}
        <div className="mt-8 pt-5 border-t border-stone-200">
          <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2.5">
            {t.login.demoAccounts}
          </p>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setUsername('admin');
                setPassword('admin123');
                quickDemoLogin('admin');
              }}
              className="text-left px-3 py-2 rounded-md bg-stone-100 hover:bg-stone-200/80 text-stone-800 transition flex items-center justify-between group"
            >
              <span>
                <strong>Admin:</strong> admin / admin123
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold group-hover:underline">
                Sign in &rarr;
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setUsername('GSTC/Stf/001');
                setPassword('1234');
                quickDemoLogin('staff');
              }}
              className="text-left px-3 py-2 rounded-md bg-stone-100 hover:bg-stone-200/80 text-stone-800 transition flex items-center justify-between group"
            >
              <span>
                <strong>Staff Yahaya:</strong> GSTC/Stf/001 / 1234
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold group-hover:underline">
                Sign in &rarr;
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setUsername('GSTC/2025/001');
                setPassword('9842-1049-5521');
                quickDemoLogin('student');
              }}
              className="text-left px-3 py-2 rounded-md bg-stone-100 hover:bg-stone-200/80 text-stone-800 transition flex items-center justify-between group"
            >
              <span>
                <strong>Student:</strong> GSTC/2025/001 / Scratch PIN
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold group-hover:underline">
                Sign in &rarr;
              </span>
            </button>
          </div>

          {onOpenScratchChecker && (
            <div className="mt-4 pt-3 border-t border-dashed border-stone-200 text-center">
              <button
                type="button"
                onClick={onOpenScratchChecker}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition"
              >
                <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
                <span>Check Term Results with Scratch Card PIN</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full max-w-md text-center mt-6 text-xs text-stone-500">
        <p className="font-medium text-stone-600">
          Govt. Science & Technical College, Garki, Abuja
        </p>
        <p className="text-[11px] text-stone-400 mt-0.5">
          FCT Secondary Education Board · Education Resource Centre
        </p>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-stone-800 mb-3">
              <Lock className="w-5 h-5 text-emerald-800" />
              <h3 className="font-bold text-base">Account Recovery & PIN Reset</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              For security, staff passwords and student admission PINs can only be reset through the GSTC Garki ICT Unit or Vice Principal Academics office.
            </p>
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs text-stone-700 mb-5 space-y-1">
              <p><strong>ICT Support:</strong> ict@gstcgarki.edu.ng</p>
              <p><strong>Admin Desk:</strong> +234 803 000 1234</p>
              <p className="text-[11px] text-stone-500 mt-1">Default demo password for test staff is <strong>1234</strong>.</p>
            </div>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold"
            >
              {t.common.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
