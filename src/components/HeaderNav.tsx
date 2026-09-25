import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CrestLogo } from './CrestLogo';
import {
  Menu,
  X,
  Globe,
  LogOut,
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Users,
  UserCheck,
  ClipboardList,
  Award,
  CreditCard,
  Shield,
  Settings as SettingsIcon,
} from 'lucide-react';
import { Language } from '../types';

export type TabType =
  | 'overview'
  | 'classes'
  | 'subjects'
  | 'staff'
  | 'students'
  | 'assignments'
  | 'results'
  | 'scratchCards'
  | 'admins'
  | 'settings';

interface HeaderNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ activeTab, onSelectTab }) => {
  const { user, logout, language, setLanguage, t, isRTL } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: t.nav.overview, icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'classes', label: t.nav.classes, icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'subjects', label: t.nav.subjects, icon: <BookOpen className="w-4 h-4" /> },
    { id: 'staff', label: t.nav.staff, icon: <Users className="w-4 h-4" /> },
    { id: 'students', label: t.nav.students, icon: <UserCheck className="w-4 h-4" /> },
    { id: 'assignments', label: t.nav.assignments, icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'results', label: t.nav.results, icon: <Award className="w-4 h-4" /> },
    { id: 'scratchCards', label: t.nav.scratchCards, icon: <CreditCard className="w-4 h-4" /> },
    { id: 'admins', label: t.nav.admins, icon: <Shield className="w-4 h-4" /> },
    { id: 'settings', label: t.nav.settings, icon: <SettingsIcon className="w-4 h-4" /> },
  ];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ha', label: 'Hausa', flag: '🇳🇬' },
    { code: 'yo', label: 'Yorùbá', flag: '🇳🇬' },
    { code: 'ig', label: 'Igbo', flag: '🇳🇬' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  const handleTabClick = (tab: TabType) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-[#14532D] text-white sticky top-0 z-40 shadow-md">
      {/* Top Banner & Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & School Name - Matching video */}
          <div
            onClick={() => onSelectTab('overview')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <CrestLogo size={44} className="group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl tracking-tight leading-tight text-white">
                GSTC Garki
              </span>
              <span className="text-[11px] sm:text-xs text-emerald-100/90 font-medium">
                Govt. Science & Tech. College
              </span>
            </div>
          </div>

          {/* Right side: Language, User Profile, Sign out */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Language dropdown */}
            <div className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-900/60 border border-emerald-700/60 rounded-full px-2.5 py-1 text-xs text-emerald-50">
              <Globe className="w-3.5 h-3.5 text-emerald-300" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                aria-label="Change Language"
                className="bg-transparent border-none text-emerald-50 font-medium focus:outline-none cursor-pointer pr-1"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code} className="text-stone-900 bg-white">
                    {l.flag} {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Current user badge */}
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-semibold text-white truncate max-w-[140px]">
                {user?.name}
              </span>
              <span className="text-[10px] text-emerald-200 capitalize font-medium">
                {user?.role}
              </span>
            </div>

            {/* Sign out link - Exact match to video top right */}
            <button
              onClick={logout}
              className="text-xs sm:text-sm font-medium text-emerald-100 hover:text-white underline underline-offset-4 flex items-center gap-1.5 px-2 py-1 rounded-md transition"
              title="Sign out of portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.nav.signOut}</span>
            </button>

            {/* Mobile menu hamburger toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Row (Sub-bar matching the video's vertical/horizontal links) */}
        <nav
          className="hidden lg:flex items-center gap-1 py-2 border-t border-emerald-800/80 overflow-x-auto text-sm"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-medium text-xs sm:text-sm transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-emerald-950/80 text-white shadow-xs font-bold border-b-2 border-emerald-400'
                    : 'text-emerald-100/80 hover:text-white hover:bg-emerald-800/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Navigation (Matching the video layout when viewed on phone) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0F4022] border-t border-emerald-800 px-4 py-4 space-y-1 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-emerald-800/60">
            <div className="flex items-center gap-2 text-xs text-emerald-200">
              <span className="font-semibold text-white">{user?.name}</span>
              <span>·</span>
              <span className="capitalize">{user?.role}</span>
            </div>
            {/* Mobile language picker */}
            <div className="inline-flex items-center gap-1 bg-emerald-900 border border-emerald-700 rounded-full px-2 py-0.5 text-xs text-emerald-100">
              <Globe className="w-3 h-3" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent border-none text-emerald-100 text-xs font-medium focus:outline-none"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code} className="text-stone-900 bg-white">
                    {l.flag} {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-left transition ${
                    isActive
                      ? 'bg-emerald-950 text-white font-bold ring-1 ring-emerald-400'
                      : 'text-emerald-100 hover:bg-emerald-800/70 hover:text-white'
                  }`}
                >
                  <span className="shrink-0 text-emerald-300">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 mt-3 border-t border-emerald-800/80 flex justify-between items-center text-xs">
            <span className="text-emerald-300/80">Govt. Science & Tech. College Garki</span>
            <button
              onClick={logout}
              className="text-white underline font-semibold flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.nav.signOut}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
