import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Settings as SettingsIcon, Save, RotateCcw, ShieldCheck, Globe, School } from 'lucide-react';
import { Language } from '../types';

export const SettingsView: React.FC = () => {
  const { language, setLanguage, t } = useAuth();
  const { settings, updateSettings, resetToInitialDemo } = useData();

  const [schoolName, setSchoolName] = useState(settings.schoolName);
  const [subtitle, setSubtitle] = useState(settings.subtitle);
  const [motto, setMotto] = useState(settings.motto);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [currentTerm, setCurrentTerm] = useState(settings.currentTerm);
  const [currentSession, setCurrentSession] = useState(settings.currentSession);
  const [nextTermResumption, setNextTermResumption] = useState(settings.nextTermResumption);
  const [principalName, setPrincipalName] = useState(settings.principalName);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      schoolName,
      subtitle,
      motto,
      address,
      phone,
      email,
      currentTerm,
      currentSession,
      nextTermResumption,
      principalName,
    });
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English (United Kingdom / International)', flag: '🇬🇧' },
    { code: 'ha', label: 'Hausa (Harshen Hausa - Abuja/Northern Nigeria)', flag: '🇳🇬' },
    { code: 'yo', label: 'Yorùbá (Èdè Yorùbá)', flag: '🇳🇬' },
    { code: 'ig', label: 'Igbo (Asụsụ Igbo)', flag: '🇳🇬' },
    { code: 'fr', label: 'Français (French - ECOWAS Standard)', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية (Arabic - International Standard)', flag: '🇸🇦' },
    { code: 'es', label: 'Español (Spanish)', flag: '🇪🇸' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-serif">
            {t.nav.settings}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            College Profile, Academic Calendar &amp; Localization Configuration
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* College Profile */}
        <div className="bg-white border border-[#E3DEC9] rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <School className="w-4 h-4 text-emerald-800" />
            <span>Institution Profile &amp; Letterhead</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                College Short Name
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Full Official Subtitle
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                School Motto
              </label>
              <input
                type="text"
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Official Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Administrative Desk Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Official Registry Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>
        </div>

        {/* Academic Calendar */}
        <div className="bg-white border border-[#E3DEC9] rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-emerald-800" />
            <span>Active Academic Session &amp; Term</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Academic Session
              </label>
              <select
                value={currentSession}
                onChange={(e) => setCurrentSession(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="2025/2026">2025/2026</option>
                <option value="2026/2027">2026/2027</option>
                <option value="2024/2025">2024/2025</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Active Term
              </label>
              <select
                value={currentTerm}
                onChange={(e) => setCurrentTerm(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="First Term">First Term</option>
                <option value="Second Term">Second Term</option>
                <option value="Third Term">Third Term</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Next Term Resumption
              </label>
              <input
                type="text"
                value={nextTermResumption}
                onChange={(e) => setNextTermResumption(e.target.value)}
                placeholder="e.g. 12th January 2026"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>
        </div>

        {/* Global Multi-Language Configuration */}
        <div className="bg-white border border-[#E3DEC9] rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-800" />
            <span>Global Language &amp; Accessibility</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-2">
              Select Active Interface Language
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code)}
                  className={`p-3 rounded-lg border text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                    language === l.code
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </span>
                  {language === l.code && (
                    <span className="text-emerald-800 font-bold text-[11px]">Active</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200">
          <button
            type="button"
            onClick={resetToInitialDemo}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo to Initial Video Snapshot (0 Staff)</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#14532D] hover:bg-[#0f4022] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition"
          >
            <Save className="w-4 h-4" />
            <span>{t.common.save} Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
