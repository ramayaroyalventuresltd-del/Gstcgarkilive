import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { BookOpen, Plus, X } from 'lucide-react';
import { Subject } from '../types';

export const SubjectsView: React.FC = () => {
  const { t } = useAuth();
  const { subjectList, addSubject, settings } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<Subject['category']>('Vocational / Technical');

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;
    addSubject(name.trim(), code.trim().toUpperCase(), category);
    setName('');
    setCode('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-serif">
            {t.subjects.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            NABTEB & WAEC Technical Curriculum
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-stone-100 border border-stone-300 text-stone-800 px-3.5 py-1.5 rounded-lg text-xs font-semibold">
          <span>{settings.currentTerm} · {settings.currentSession}</span>
        </div>
      </div>

      <div className="bg-white border border-[#E3DEC9] rounded-xl p-4 sm:p-5 shadow-2xs flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            {t.subjects.allSubjects}
          </h2>
          <p className="text-xs text-stone-500">
            {subjectList.length} approved subjects
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#801c1c] hover:bg-[#681616] text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.subjects.addSubjectBtn}</span>
        </button>
      </div>

      {/* Subjects Table */}
      <div className="bg-white border border-[#E3DEC9] rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#FAF8F3] border-b border-stone-200 text-stone-600 font-semibold text-[11px] sm:text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">{t.subjects.colCode}</th>
                <th className="py-3.5 px-4 sm:px-6">{t.subjects.colName}</th>
                <th className="py-3.5 px-4 sm:px-6">{t.subjects.colCategory}</th>
                <th className="py-3.5 px-4 sm:px-6">{t.subjects.colTeachers}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {subjectList.map((sub) => (
                <tr key={sub.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-4 px-4 sm:px-6 font-mono font-bold text-emerald-800">
                    {sub.code}
                  </td>
                  <td className="py-4 px-4 sm:px-6 font-semibold text-stone-900">
                    {sub.name}
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-stone-600">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-stone-100 border border-stone-200">
                      {sub.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    {sub.assignedTeachers.length > 0 ? (
                      <span className="font-semibold text-stone-900">
                        {sub.assignedTeachers.join(', ')}
                      </span>
                    ) : (
                      <span className="text-amber-700 italic">No teacher assigned yet</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Subject Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-300">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <h3 className="text-lg font-bold text-stone-900 font-serif">Add New Subject</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Physics, Basic Electricity"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Subject Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. PHY 101, ELEC 101"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Subject['category'])}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="Core">Core</option>
                  <option value="Vocational / Technical">Vocational / Technical</option>
                  <option value="Science">Science</option>
                </select>
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
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
