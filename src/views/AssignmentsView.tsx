import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ClipboardList, Plus, User, BookOpen, GraduationCap, Calendar, CheckCircle } from 'lucide-react';

export const AssignmentsView: React.FC = () => {
  const { t } = useAuth();
  const { assignmentList, staffList, classList, subjectList, settings } = useData();

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-serif">
            {t.nav.assignments}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Subject & Class Allocations Matrix
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-stone-100 border border-stone-300 text-stone-800 px-3.5 py-1.5 rounded-lg text-xs font-semibold">
          <span>{settings.currentTerm} · {settings.currentSession}</span>
        </div>
      </div>

      {/* Summary card */}
      <div className="bg-white border border-[#E3DEC9] rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Active Teaching Assignments ({assignmentList.length})
            </h2>
            <p className="text-xs text-stone-500">
              Derived automatically from instructor subject authorizations and class assignments
            </p>
          </div>
        </div>

        {assignmentList.length === 0 ? (
          <div className="py-12 text-center text-stone-400 italic text-sm">
            No teaching assignments recorded yet. Register staff with subjects to auto-populate.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignmentList.map((asg) => (
              <div
                key={asg.id}
                className="p-4 rounded-xl bg-[#FAF8F3] border border-stone-200/90 shadow-2xs space-y-3"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900">{asg.staffName}</h3>
                    <p className="text-[11px] text-stone-500">Instructor</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-stone-500 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                      Subject:
                    </span>
                    <span className="font-semibold text-emerald-900">{asg.subjectName}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-stone-500 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-stone-400" />
                      Class Arm:
                    </span>
                    <span className="font-semibold text-stone-900">{asg.className}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-stone-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      Session:
                    </span>
                    <span className="text-stone-600">{asg.term}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
