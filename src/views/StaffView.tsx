import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Staff } from '../types';
import {
  Calendar,
  Plus,
  Trash2,
  Edit2,
  Mail,
  Phone,
  Check,
  X,
  Eye,
  EyeOff,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';

export const StaffView: React.FC = () => {
  const { t } = useAuth();
  const {
    staffList,
    classList,
    subjectList,
    settings,
    addStaff,
    deleteStaff,
    toastMessage,
  } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<Staff | null>(null);

  // Form State
  const nextStaffUsername = `GSTC/Stf/${String(staffList.length + 1).padStart(3, '0')}`;
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [formTeacherOf, setFormTeacherOf] = useState('None');
  const [formError, setFormError] = useState('');

  const handleOpenModal = () => {
    setFullName('');
    setPhoneNumber('');
    setEmail('');
    setPassword('');
    setSelectedSubjects(['English Language']); // matching video selection default ease
    setFormTeacherOf('None');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubjectToggle = (subjName: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjName) ? prev.filter((s) => s !== subjName) : [...prev, subjName]
    );
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setFormError('Full name is required.');
      return;
    }
    if (!phoneNumber.trim()) {
      setFormError('Phone number is required.');
      return;
    }

    addStaff({
      name: fullName.trim(),
      phone: phoneNumber.trim(),
      email: email.trim() || undefined,
      password: password.trim() || '1234',
      subjectsTaught: selectedSubjects,
      formTeacherOf: formTeacherOf,
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header - Staff + Term pill matching video at 00:15 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-serif">
            {t.staff.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Academic & Vocational Instructors Directorate
          </p>
        </div>

        {/* Term pill */}
        <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-stone-100/90 border border-stone-300 text-stone-800 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-stone-500" />
          <span>
            {settings.currentTerm} · {settings.currentSession}
          </span>
        </div>
      </div>

      {/* Sub-header Bar: "All staff" and Red button "+ Register staff" */}
      <div className="bg-white border border-[#E3DEC9] rounded-xl p-4 sm:p-5 shadow-2xs flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            {t.staff.allStaff}
          </h2>
          <p className="text-xs text-stone-500">
            {staffList.length} staff member{staffList.length === 1 ? '' : 's'} registered
          </p>
        </div>

        {/* Dark Red / Maroon "+ Register staff" button from video */}
        <button
          onClick={handleOpenModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#801c1c] hover:bg-[#681616] active:bg-[#521111] text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-700"
        >
          <Plus className="w-4 h-4" />
          <span>{t.staff.registerStaffBtn}</span>
        </button>
      </div>

      {/* Staff Table - Exact structure from video */}
      <div className="bg-white border border-[#E3DEC9] rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#FAF8F3] border-b border-stone-200 text-stone-600 font-semibold text-[11px] sm:text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">{t.staff.colUsername}</th>
                <th className="py-3.5 px-4 sm:px-6">{t.staff.colName}</th>
                <th className="py-3.5 px-4 sm:px-6">{t.staff.colPhone}</th>
                <th className="py-3.5 px-4 sm:px-6">{t.staff.colEmail}</th>
                <th className="py-3.5 px-4 sm:px-6">{t.staff.colSubjects}</th>
                <th className="py-3.5 px-4 sm:px-6">{t.staff.colFormTeacher}</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">{t.staff.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {staffList.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 px-6 text-center text-stone-400 italic text-sm"
                  >
                    {t.staff.noStaffRegistered}
                  </td>
                </tr>
              ) : (
                staffList.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-stone-50/80 transition-colors duration-100"
                  >
                    {/* Username like GSTC/Stf/001 */}
                    <td className="py-4 px-4 sm:px-6 font-mono font-bold text-stone-900 whitespace-nowrap">
                      {member.username}
                    </td>

                    {/* Name */}
                    <td className="py-4 px-4 sm:px-6 font-semibold text-stone-900">
                      {member.name}
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-4 sm:px-6 text-stone-700 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        <span>{member.phone}</span>
                      </span>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-4 sm:px-6 text-stone-600">
                      {member.email ? (
                        <span className="inline-flex items-center gap-1.5 text-stone-700">
                          <Mail className="w-3.5 h-3.5 text-stone-400" />
                          <span className="truncate max-w-[180px]">{member.email}</span>
                        </span>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>

                    {/* Subjects taught */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex flex-wrap gap-1">
                        {member.subjectsTaught.length > 0 ? (
                          member.subjectsTaught.map((sub, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
                            >
                              {sub}
                            </span>
                          ))
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </div>
                    </td>

                    {/* Form teacher of */}
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap font-medium">
                      {member.formTeacherOf && member.formTeacherOf !== 'None' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                          {member.formTeacherOf}
                        </span>
                      ) : (
                        <span className="text-stone-400">None</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => setDeleteCandidate(member)}
                        className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-md transition"
                        title="Delete staff"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Staff Modal - Exact recreation of 00:19 - 01:04 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-300 my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-5">
              <h3 className="text-xl font-bold text-stone-900 font-serif">
                {t.staff.modalTitle}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveStaff} className="space-y-4">
              {/* Field 1: Username (Readonly) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.staff.colUsername}
                </label>
                <input
                  type="text"
                  value={nextStaffUsername}
                  readOnly
                  className="w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-stone-100 text-stone-600 font-mono text-xs sm:text-sm cursor-not-allowed"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  {t.staff.usernameHelp}
                </p>
              </div>

              {/* Field 2: Full name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.staff.fullNameLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.staff.fullNamePlaceholder}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* Field 3: Phone number */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.staff.phoneLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={t.staff.phonePlaceholder}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* Field 4: Email (optional) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.staff.emailLabel}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.staff.emailPlaceholder}
                  className="w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* Field 5: Password */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.staff.passwordLabel}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.staff.passwordPlaceholder}
                    className="w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Field 6: Subjects taught (Checkboxes) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  {t.staff.subjectsTaughtLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#FAF8F3] p-3 rounded-lg border border-stone-200">
                  {subjectList.map((subject) => {
                    const isChecked = selectedSubjects.includes(subject.name);
                    return (
                      <label
                        key={subject.id}
                        className="flex items-center gap-2 text-xs font-medium text-stone-800 cursor-pointer p-1.5 rounded hover:bg-stone-200/50"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSubjectToggle(subject.name)}
                          className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 border-stone-300 cursor-pointer"
                        />
                        <span>{subject.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Field 7: Form teacher of (Dropdown) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.staff.formTeacherLabel}
                </label>
                <select
                  value={formTeacherOf}
                  onChange={(e) => setFormTeacherOf(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                >
                  <option value="None">{t.common.none}</option>
                  {classList.map((cls) => (
                    <option key={cls.id} value={cls.name}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 8: Green "Save staff" Button */}
              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#14532D] hover:bg-[#0f4022] text-white text-xs sm:text-sm font-semibold shadow-sm transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  {t.staff.saveStaffBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-stone-200">
            <h4 className="font-bold text-base text-stone-900 mb-2">Confirm Removal</h4>
            <p className="text-xs text-stone-600 mb-5 leading-relaxed">
              Are you sure you want to remove <strong>{deleteCandidate.name}</strong> ({deleteCandidate.username}) from staff records?
            </p>
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-3.5 py-2 border border-stone-300 rounded-lg text-stone-700 font-semibold"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={() => {
                  deleteStaff(deleteCandidate.id);
                  setDeleteCandidate(null);
                }}
                className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-semibold"
              >
                Remove Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
