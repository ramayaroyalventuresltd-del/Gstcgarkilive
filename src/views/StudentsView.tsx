import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Student } from '../types';
import { UserCheck, Plus, Eye, KeyRound, Phone, MapPin, X, Award } from 'lucide-react';

interface StudentsViewProps {
  onViewStudentResult?: (studentId: string) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({ onViewStudentResult }) => {
  const { t } = useAuth();
  const { studentList, classList, addStudent, settings } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Female');
  const [className, setClassName] = useState('CCS 1');
  const [dob, setDob] = useState('2009-05-15');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleRegisterStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !guardianPhone.trim()) return;

    addStudent({
      fullName: fullName.trim(),
      gender,
      className,
      dob,
      guardianName: guardianName.trim() || 'Parent/Guardian',
      guardianPhone: guardianPhone.trim(),
      address: address.trim() || 'Garki, Abuja',
    });

    setFullName('');
    setGuardianName('');
    setGuardianPhone('');
    setAddress('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-serif">
            {t.students.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Student Admissions Register & Scratch Card Binding
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-stone-100 border border-stone-300 text-stone-800 px-3.5 py-1.5 rounded-lg text-xs font-semibold">
          <span>{settings.currentTerm} · {settings.currentSession}</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white border border-[#E3DEC9] rounded-xl p-4 sm:p-5 shadow-2xs flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            {t.students.allStudents}
          </h2>
          <p className="text-xs text-stone-500">
            {studentList.length} enrolled student{studentList.length === 1 ? '' : 's'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#801c1c] hover:bg-[#681616] text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.students.registerStudentBtn}</span>
        </button>
      </div>

      {/* Students Table */}
      <div className="bg-white border border-[#E3DEC9] rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#FAF8F3] border-b border-stone-200 text-stone-600 font-semibold text-[11px] sm:text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">{t.students.colAdmissionNo}</th>
                <th className="py-3.5 px-4 sm:px-6">{t.students.colName}</th>
                <th className="py-3.5 px-4 sm:px-6">{t.students.colGender}</th>
                <th className="py-3.5 px-4 sm:px-6">{t.students.colClass}</th>
                <th className="py-3.5 px-4 sm:px-6">{t.students.colGuardianPhone}</th>
                <th className="py-3.5 px-4 sm:px-6">CARD PIN</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">REPORT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {studentList.map((st) => (
                <tr key={st.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-4 px-4 sm:px-6 font-mono font-bold text-stone-900 whitespace-nowrap">
                    {st.admissionNo}
                  </td>
                  <td className="py-4 px-4 sm:px-6 font-semibold text-stone-900">
                    {st.fullName}
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-stone-600">
                    {st.gender}
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {st.className}
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-stone-600 whitespace-nowrap">
                    {st.guardianPhone}
                  </td>
                  <td className="py-4 px-4 sm:px-6 font-mono text-xs text-stone-600">
                    {st.scratchCardPin || 'None'}
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                    <button
                      onClick={() => onViewStudentResult?.(st.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded border border-emerald-300 transition"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Result</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-300 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <h3 className="text-lg font-bold text-stone-900 font-serif">
                {t.students.registerStudentBtn}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ibrahim Musa"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Admitted Class
                  </label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    {classList.map((cls) => (
                      <option key={cls.id} value={cls.name}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Parent / Guardian Name
                </label>
                <input
                  type="text"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="e.g. Alh. Musa Suleiman"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Guardian Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  placeholder="e.g. 0803 123 4567"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Home Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Area 10, Garki, Abuja"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800">
                <p className="font-semibold">Auto-Generated Upon Registration:</p>
                <ul className="list-disc list-inside mt-1 text-[11px] text-emerald-700 space-y-0.5">
                  <li>Admission Number (GSTC/2025/XXX)</li>
                  <li>12-Digit Online Scratch Card PIN with 5 Result Check Allocations</li>
                </ul>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-[#14532D] text-white rounded-lg hover:bg-emerald-900"
                >
                  Admit Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
