import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { CrestLogo } from '../components/CrestLogo';
import { Award, Printer, Download, Search, CheckCircle, UserCheck } from 'lucide-react';
import { StudentResult } from '../types';

interface ResultsViewProps {
  initialStudentId?: string;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ initialStudentId }) => {
  const { t } = useAuth();
  const { resultsList, studentList, classList, settings } = useData();

  const [selectedClass, setSelectedClass] = useState('CCS 1');
  const [activeTab, setActiveTab] = useState<'broadsheet' | 'report'>('broadsheet');
  const [selectedResult, setSelectedResult] = useState<StudentResult>(() => {
    if (initialStudentId) {
      const match = resultsList.find((r) => r.studentId === initialStudentId);
      if (match) return match;
    }
    return resultsList[0] || ({} as StudentResult);
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-serif">
            {t.results.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Continuous Assessment (CA 40%) & Terminal Examination (60%)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex bg-stone-200/80 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('broadsheet')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === 'broadsheet'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.results.broadsheet}
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === 'report'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.results.studentReportCard}
            </button>
          </div>

          {activeTab === 'report' && (
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#14532D] text-white rounded-lg text-xs font-semibold shadow-xs hover:bg-[#0f4022] transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.results.printReport}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Broadsheet */}
      {activeTab === 'broadsheet' && (
        <div className="space-y-4 print:hidden">
          {/* Class Filter */}
          <div className="bg-white border border-[#E3DEC9] rounded-xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-700">Filter Class:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                {classList.map((cls) => (
                  <option key={cls.id} value={cls.name}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-xs text-stone-500 font-medium">
              Academic Term: <strong>{settings.currentTerm} · {settings.currentSession}</strong>
            </span>
          </div>

          {/* Broadsheet Table */}
          <div className="bg-white border border-[#E3DEC9] rounded-xl shadow-2xs overflow-hidden">
            <div className="p-4 bg-[#FAF8F3] border-b border-stone-200 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-stone-900">
                  {selectedClass} Terminal Master Sheet
                </h3>
                <p className="text-[11px] text-stone-500">
                  Grading Scale: A1 (75-100), B2 (70-74), B3 (65-69), C4-C6 (50-64), D7-E8 (40-49), F9 (&lt;40)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4">ADMISSION NO</th>
                    <th className="py-3 px-4">STUDENT NAME</th>
                    <th className="py-3 px-4">SUBJECT</th>
                    <th className="py-3 px-4 text-center">CA 1 (20)</th>
                    <th className="py-3 px-4 text-center">CA 2 (20)</th>
                    <th className="py-3 px-4 text-center">EXAM (60)</th>
                    <th className="py-3 px-4 text-center font-bold text-stone-900">TOTAL (100)</th>
                    <th className="py-3 px-4 text-center font-bold">GRADE</th>
                    <th className="py-3 px-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {resultsList.map((res) => (
                    <React.Fragment key={res.id}>
                      {res.scores.map((sc, scIdx) => (
                        <tr key={scIdx} className="hover:bg-stone-50/80">
                          {scIdx === 0 && (
                            <>
                              <td
                                rowSpan={res.scores.length}
                                className="py-3 px-4 font-mono font-bold text-stone-900 align-top border-r border-stone-100"
                              >
                                {res.admissionNo}
                              </td>
                              <td
                                rowSpan={res.scores.length}
                                className="py-3 px-4 font-semibold text-stone-900 align-top border-r border-stone-100"
                              >
                                {res.studentName}
                                <div className="text-[11px] text-stone-500 font-normal">
                                  Avg: {res.averageScore}% · Pos: {res.position} of {res.outOf}
                                </div>
                              </td>
                            </>
                          )}
                          <td className="py-2.5 px-4 font-medium text-stone-800">
                            {sc.subjectName}
                          </td>
                          <td className="py-2.5 px-4 text-center text-stone-600">{sc.ca1}</td>
                          <td className="py-2.5 px-4 text-center text-stone-600">{sc.ca2}</td>
                          <td className="py-2.5 px-4 text-center text-stone-600">{sc.exam}</td>
                          <td className="py-2.5 px-4 text-center font-bold text-emerald-900">
                            {sc.total}
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                sc.grade.startsWith('A')
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : sc.grade.startsWith('B')
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-stone-100 text-stone-800'
                              }`}
                            >
                              {sc.grade}
                            </span>
                          </td>
                          {scIdx === 0 && (
                            <td
                              rowSpan={res.scores.length}
                              className="py-3 px-4 text-right align-top border-l border-stone-100"
                            >
                              <button
                                onClick={() => {
                                  setSelectedResult(res);
                                  setActiveTab('report');
                                }}
                                className="px-3 py-1.5 bg-[#14532D] text-white rounded text-xs font-semibold hover:bg-emerald-900 transition"
                              >
                                Report Card
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Official Term Report Card */}
      {(activeTab === 'report' || typeof window !== 'undefined') && (
        <div className={`space-y-4 ${activeTab !== 'report' ? 'hidden print:block' : ''}`}>
          {/* Printable Report Sheet */}
          <div className="bg-white border-2 border-stone-800 p-6 sm:p-10 rounded-xl shadow-lg max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
            {/* School Header */}
            <div className="flex items-center justify-between pb-6 border-b-2 border-stone-800">
              <CrestLogo size={74} />
              <div className="text-center flex-1 px-4">
                <p className="text-xs font-bold text-stone-600 uppercase tracking-widest">
                  FEDERAL CAPITAL TERRITORY SECONDARY EDUCATION BOARD
                </p>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-serif">
                  GOVERNMENT SCIENCE & TECHNICAL COLLEGE, GARKI
                </h2>
                <p className="text-xs font-semibold text-emerald-800 italic mt-0.5">
                  &ldquo;{settings.motto}&rdquo;
                </p>
                <p className="text-[11px] text-stone-600 mt-1">
                  Area 10, Garki, Abuja, FCT · Email: info@gstcgarki.edu.ng
                </p>
                <div className="mt-2 inline-block px-4 py-1 bg-stone-900 text-white font-bold text-xs uppercase tracking-wider rounded">
                  OFFICIAL TERMINAL STUDENT CONTINUOUS ASSESSMENT REPORT
                </div>
              </div>
              <div className="w-20 h-24 border-2 border-dashed border-stone-400 rounded flex flex-col items-center justify-center text-[10px] text-stone-400 text-center font-medium bg-stone-50">
                <span>Passport</span>
                <span>Photograph</span>
              </div>
            </div>

            {/* Student Metadata Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 p-3.5 bg-stone-50 border border-stone-300 rounded text-xs">
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Student Name</span>
                <span className="font-bold text-stone-900 text-sm">{selectedResult.studentName || 'Amina Bello'}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Admission Number</span>
                <span className="font-mono font-bold text-stone-900">{selectedResult.admissionNo || 'GSTC/2025/001'}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Class & Term</span>
                <span className="font-bold text-stone-900">{selectedResult.className} · {selectedResult.term}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Academic Session</span>
                <span className="font-bold text-stone-900">{selectedResult.session || settings.currentSession}</span>
              </div>
            </div>

            {/* Performance Summary Metrics */}
            <div className="grid grid-cols-4 gap-2 mb-5 text-center text-xs">
              <div className="p-2 border border-stone-300 rounded bg-[#FBF9F4]">
                <p className="text-[10px] text-stone-500 uppercase font-bold">Total Marks</p>
                <p className="text-lg font-bold text-stone-900">{selectedResult.totalScore}</p>
              </div>
              <div className="p-2 border border-stone-300 rounded bg-[#FBF9F4]">
                <p className="text-[10px] text-stone-500 uppercase font-bold">Average Score</p>
                <p className="text-lg font-bold text-emerald-800">{selectedResult.averageScore}%</p>
              </div>
              <div className="p-2 border border-stone-300 rounded bg-[#FBF9F4]">
                <p className="text-[10px] text-stone-500 uppercase font-bold">Class Position</p>
                <p className="text-lg font-bold text-stone-900">{selectedResult.position}st of {selectedResult.outOf}</p>
              </div>
              <div className="p-2 border border-stone-300 rounded bg-[#FBF9F4]">
                <p className="text-[10px] text-stone-500 uppercase font-bold">Attendance</p>
                <p className="text-lg font-bold text-stone-900">
                  {selectedResult.timesPresent} / {selectedResult.timesSchoolOpened} days
                </p>
              </div>
            </div>

            {/* Subject Scores Table */}
            <div className="mb-6">
              <table className="w-full text-left text-xs border border-stone-400 border-collapse">
                <thead>
                  <tr className="bg-stone-200 text-stone-800 font-bold border-b border-stone-400">
                    <th className="p-2 border-r border-stone-400">SUBJECT TITLE</th>
                    <th className="p-2 border-r border-stone-400 text-center w-16">CA 1 (20)</th>
                    <th className="p-2 border-r border-stone-400 text-center w-16">CA 2 (20)</th>
                    <th className="p-2 border-r border-stone-400 text-center w-16">EXAM (60)</th>
                    <th className="p-2 border-r border-stone-400 text-center w-20 font-black">TOTAL (100)</th>
                    <th className="p-2 border-r border-stone-400 text-center w-16 font-black">GRADE</th>
                    <th className="p-2">REMARK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-300">
                  {selectedResult.scores?.map((sc, i) => (
                    <tr key={i} className="hover:bg-stone-50">
                      <td className="p-2 font-semibold text-stone-900 border-r border-stone-300">
                        {sc.subjectName}
                      </td>
                      <td className="p-2 text-center text-stone-700 border-r border-stone-300">{sc.ca1}</td>
                      <td className="p-2 text-center text-stone-700 border-r border-stone-300">{sc.ca2}</td>
                      <td className="p-2 text-center text-stone-700 border-r border-stone-300">{sc.exam}</td>
                      <td className="p-2 text-center font-bold text-stone-900 border-r border-stone-300">
                        {sc.total}
                      </td>
                      <td className="p-2 text-center font-bold text-stone-900 border-r border-stone-300">
                        {sc.grade}
                      </td>
                      <td className="p-2 text-stone-700">{sc.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Affective Domain & Remarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-300 text-xs">
              <div className="p-3 bg-stone-50 border border-stone-300 rounded space-y-2">
                <span className="font-bold text-stone-900 block text-xs">
                  Class Tutor&apos;s Appraisal &amp; Signature
                </span>
                <p className="italic text-stone-700">{selectedResult.teacherRemarks}</p>
                <div className="pt-4 flex justify-between items-end text-[11px] text-stone-500">
                  <span>Sign: <em>Yahaya (Form Tutor)</em></span>
                  <span>Date: 25/09/2026</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-300 rounded space-y-2">
                <span className="font-bold text-stone-900 block text-xs">
                  Principal&apos;s Commendation &amp; Stamp
                </span>
                <p className="italic text-stone-700">{selectedResult.principalRemarks}</p>
                <div className="pt-4 flex justify-between items-end text-[11px] text-stone-500">
                  <span>Sign: <em>Engr. D. K. Mohammed</em></span>
                  <span className="px-2 py-0.5 border border-emerald-700 text-emerald-800 font-bold uppercase rounded text-[10px]">
                    OFFICIAL STAMP
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-stone-200 text-center text-[11px] text-stone-500">
              Next Term Resumption Date: <strong>{selectedResult.nextTermBegins || settings.nextTermResumption}</strong> · Generated from GSTC Garki Portal
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
