import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { GraduationCap, Plus, Users, School, X } from 'lucide-react';

export const ClassesView: React.FC = () => {
  const { t } = useAuth();
  const { classList, addClass, settings } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [className, setClassName] = useState('');
  const [department, setDepartment] = useState('Computer Craft Studies');
  const [capacity, setCapacity] = useState('40');

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;
    addClass(className.trim(), department, parseInt(capacity) || 40);
    setClassName('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-serif">
            {t.classes.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Technical Trades & Secondary Academic Arms
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
            {t.classes.allClasses}
          </h2>
          <p className="text-xs text-stone-500">
            {classList.length} active vocational & academic classes
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#801c1c] hover:bg-[#681616] text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.classes.addClassBtn}</span>
        </button>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classList.map((cls) => (
          <div
            key={cls.id}
            className="bg-white border border-[#E3DEC9] rounded-xl p-5 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg text-stone-900 font-serif">{cls.name}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">{cls.department}</p>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-stone-100 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span className="font-medium">Form Tutor:</span>
                  <span className="font-semibold text-stone-900">
                    {cls.formTeacherName === 'None' ? (
                      <span className="text-amber-700 italic">Unassigned</span>
                    ) : (
                      cls.formTeacherName
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span className="font-medium">Enrolled Students:</span>
                  <span className="font-semibold text-stone-900">
                    {cls.studentCount} / {cls.capacity}
                  </span>
                </div>
              </div>
            </div>

            {/* Capacity Bar */}
            <div className="mt-4">
              <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-700 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (cls.studentCount / cls.capacity) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-300">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <h3 className="text-lg font-bold text-stone-900 font-serif">Add New Class</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Class Name (e.g. Electrical 1, Science 1, CCS 2)
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g. Electrical Installation 1"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Department / Trade
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="Computer Craft Studies">Computer Craft Studies</option>
                  <option value="Vocational / Fashion Design">Vocational / Fashion Design (Garment)</option>
                  <option value="Electrical Installation">Electrical Installation & Maintenance</option>
                  <option value="Mechanical Engineering Craft">Mechanical Engineering Craft</option>
                  <option value="General Science">General Science</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Class Capacity (Seats)
                </label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  min="10"
                  max="100"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
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
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
