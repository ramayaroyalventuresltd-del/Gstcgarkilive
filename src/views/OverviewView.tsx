import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { TabType } from '../components/HeaderNav';
import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  UserCheck,
  ArrowRight,
  Sparkles,
  Calendar,
  CreditCard,
  Award,
  Bell,
  CheckCircle2,
} from 'lucide-react';

interface OverviewViewProps {
  onNavigate: (tab: TabType) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  const { t } = useAuth();
  const {
    staffList,
    studentList,
    classList,
    subjectList,
    assignmentList,
    settings,
  } = useData();

  const statCards = [
    {
      id: 'students',
      count: studentList.length,
      label: t.overview.studentsCount,
      tab: 'students' as TabType,
      icon: <UserCheck className="w-5 h-5 text-emerald-800" />,
    },
    {
      id: 'staff',
      count: staffList.length,
      label: t.overview.staffCount,
      tab: 'staff' as TabType,
      icon: <Users className="w-5 h-5 text-emerald-800" />,
    },
    {
      id: 'classes',
      count: classList.length,
      label: t.overview.classesCount,
      tab: 'classes' as TabType,
      icon: <GraduationCap className="w-5 h-5 text-emerald-800" />,
    },
    {
      id: 'subjects',
      count: subjectList.length,
      label: t.overview.subjectsCount,
      tab: 'subjects' as TabType,
      icon: <BookOpen className="w-5 h-5 text-emerald-800" />,
    },
    {
      id: 'assignments',
      count: assignmentList.length,
      label: t.overview.teachingAssignmentsCount,
      tab: 'assignments' as TabType,
      icon: <ClipboardList className="w-5 h-5 text-emerald-800" />,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Overview Top Header - Exact match to video */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-serif">
              {t.overview.title}
            </h1>
            <p className="text-sm text-stone-600 mt-0.5">
              {t.overview.subtitle}
            </p>
          </div>

          {/* Term pill badge from video */}
          <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-stone-100/90 border border-stone-300 text-stone-800 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-stone-500" />
            <span>
              {settings.currentTerm} · {settings.currentSession}
            </span>
          </div>
        </div>
      </div>

      {/* 5 Metric Stat Cards - Matches video grid at 00:11 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {statCards.map((card) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.tab)}
            className="group text-left bg-white border border-[#E3DEC9] hover:border-emerald-600 rounded-xl p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-150 flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-serif">
                {card.count}
              </span>
              <div className="p-2 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 transition-colors">
                {card.icon}
              </div>
            </div>
            <div className="flex items-center justify-between text-stone-600 text-xs sm:text-sm font-medium">
              <span>{card.label}</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-800" />
            </div>
          </button>
        ))}
      </div>

      {/* Notice Banner */}
      <div className="bg-emerald-950 text-white rounded-xl p-4 sm:p-5 shadow-sm border border-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-800/80 rounded-lg text-emerald-300 shrink-0 mt-0.5">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">GSTC Academic Advisory Notice</h2>
            <p className="text-xs text-emerald-100/85 mt-0.5 max-w-2xl leading-relaxed">
              {t.overview.schoolNotice}
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('results')}
          className="shrink-0 text-xs font-semibold px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition"
        >
          View Broadsheet &rarr;
        </button>
      </div>

      {/* Quick Action Hub */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-3">
          {t.overview.quickActions}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('staff')}
            className="flex items-center gap-3 p-3.5 bg-white border border-stone-200 hover:border-emerald-700 rounded-xl text-left shadow-2xs hover:shadow-xs transition group cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-red-50 text-red-800 font-bold group-hover:bg-red-100">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">{t.overview.registerStaff}</p>
              <p className="text-[11px] text-stone-500">Auto-assign GSTC/Stf ID</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('students')}
            className="flex items-center gap-3 p-3.5 bg-white border border-stone-200 hover:border-emerald-700 rounded-xl text-left shadow-2xs hover:shadow-xs transition group cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold group-hover:bg-emerald-100">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">{t.overview.registerStudent}</p>
              <p className="text-[11px] text-stone-500">Admit into CCS 1 or Garment</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('scratchCards')}
            className="flex items-center gap-3 p-3.5 bg-white border border-stone-200 hover:border-emerald-700 rounded-xl text-left shadow-2xs hover:shadow-xs transition group cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-800 font-bold group-hover:bg-amber-100">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">{t.overview.issueCard}</p>
              <p className="text-[11px] text-stone-500">Batch generate 12-digit PINs</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('results')}
            className="flex items-center gap-3 p-3.5 bg-white border border-stone-200 hover:border-emerald-700 rounded-xl text-left shadow-2xs hover:shadow-xs transition group cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-800 font-bold group-hover:bg-blue-100">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">{t.overview.checkResult}</p>
              <p className="text-[11px] text-stone-500">Official term report cards</p>
            </div>
          </button>
        </div>
      </div>

      {/* Breakdown Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classes & Departments Status */}
        <div className="bg-white border border-[#E3DEC9] rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-800" />
              <span>Active Classes & Form Tutors</span>
            </h2>
            <button
              onClick={() => onNavigate('classes')}
              className="text-xs text-emerald-800 font-medium hover:underline"
            >
              Manage &rarr;
            </button>
          </div>
          <div className="space-y-3">
            {classList.map((cls) => (
              <div
                key={cls.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#FAF8F3] border border-stone-200/80 text-xs"
              >
                <div>
                  <p className="font-bold text-stone-900">{cls.name}</p>
                  <p className="text-stone-500 text-[11px]">{cls.department}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-stone-800">
                    {cls.formTeacherName === 'None' ? (
                      <span className="text-amber-700">No Tutor Assigned</span>
                    ) : (
                      `Tutor: ${cls.formTeacherName}`
                    )}
                  </p>
                  <p className="text-stone-500 text-[11px]">
                    {cls.studentCount} / {cls.capacity} students
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subjects & Curriculum */}
        <div className="bg-white border border-[#E3DEC9] rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-800" />
              <span>Core & Vocational Subjects</span>
            </h2>
            <button
              onClick={() => onNavigate('subjects')}
              className="text-xs text-emerald-800 font-medium hover:underline"
            >
              View all &rarr;
            </button>
          </div>
          <div className="space-y-3">
            {subjectList.slice(0, 3).map((subj) => (
              <div
                key={subj.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#FAF8F3] border border-stone-200/80 text-xs"
              >
                <div>
                  <p className="font-bold text-stone-900">{subj.name}</p>
                  <p className="text-stone-500 text-[11px]">{subj.code} · {subj.category}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {subj.assignedTeachers.length > 0
                      ? subj.assignedTeachers.join(', ')
                      : 'Unassigned'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
