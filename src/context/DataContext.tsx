import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Staff,
  ClassRoom,
  Subject,
  Student,
  TeachingAssignment,
  ScratchCard,
  StudentResult,
  AdminUser,
  SchoolSettings,
} from '../types';

interface DataContextType {
  staffList: Staff[];
  classList: ClassRoom[];
  subjectList: Subject[];
  studentList: Student[];
  assignmentList: TeachingAssignment[];
  scratchCards: ScratchCard[];
  resultsList: StudentResult[];
  adminList: AdminUser[];
  settings: SchoolSettings;
  toastMessage: string | null;
  addStaff: (data: Omit<Staff, 'id' | 'username' | 'createdAt'>) => string;
  deleteStaff: (id: string) => void;
  addClass: (name: string, department: string, capacity?: number) => void;
  addSubject: (name: string, code: string, category: Subject['category']) => void;
  addStudent: (data: Omit<Student, 'id' | 'admissionNo' | 'status'>) => string;
  generateScratchCards: (count?: number) => void;
  verifyScratchCard: (admissionNo: string, pin: string) => { valid: boolean; message: string; result?: StudentResult };
  saveResult: (result: StudentResult) => void;
  updateSettings: (newSettings: Partial<SchoolSettings>) => void;
  showToast: (msg: string) => void;
  resetToInitialDemo: () => void;
}

const INITIAL_CLASSES: ClassRoom[] = [
  {
    id: 'cls-01',
    name: 'Garment 1',
    department: 'Vocational / Fashion Design',
    formTeacherName: 'None',
    studentCount: 0,
    capacity: 35,
  },
  {
    id: 'cls-02',
    name: 'CCS 1',
    department: 'Computer Craft Studies',
    formTeacherName: 'Yahaya',
    studentCount: 1,
    capacity: 40,
  },
];

const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-01',
    code: 'MTH 101',
    name: 'Mathematics',
    category: 'Core',
    assignedTeachers: [],
  },
  {
    id: 'sub-02',
    code: 'ENG 101',
    name: 'English Language',
    category: 'Core',
    assignedTeachers: ['Yahaya'],
  },
  {
    id: 'sub-03',
    code: 'CCS 101',
    name: 'Computer Craft Studies',
    category: 'Vocational / Technical',
    assignedTeachers: [],
  },
  {
    id: 'sub-04',
    code: 'TD 101',
    name: 'Technical Drawing',
    category: 'Vocational / Technical',
    assignedTeachers: [],
  },
];

const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-001',
    admissionNo: 'GSTC/2025/001',
    fullName: 'Amina Bello',
    gender: 'Female',
    className: 'CCS 1',
    dob: '2009-04-14',
    guardianName: 'Mallam Bello Garba',
    guardianPhone: '0803 456 7890',
    address: 'Plot 14, Area 10, Garki, Abuja',
    scratchCardPin: '9842-1049-5521',
    status: 'Active',
  },
];

const INITIAL_SCRATCH_CARDS: ScratchCard[] = [
  {
    id: 'crd-01',
    serialNumber: 'GSTC-2025-009842',
    pin: '9842-1049-5521',
    maxUsage: 5,
    usageCount: 1,
    status: 'active',
    usedByAdmissionNo: 'GSTC/2025/001',
    createdAt: '2026-09-01',
  },
  {
    id: 'crd-02',
    serialNumber: 'GSTC-2025-004312',
    pin: '7412-8820-3341',
    maxUsage: 5,
    usageCount: 0,
    status: 'active',
    createdAt: '2026-09-05',
  },
  {
    id: 'crd-03',
    serialNumber: 'GSTC-2025-007739',
    pin: '5561-9014-2287',
    maxUsage: 5,
    usageCount: 0,
    status: 'active',
    createdAt: '2026-09-10',
  },
];

const INITIAL_RESULTS: StudentResult[] = [
  {
    id: 'res-001',
    studentId: 'std-001',
    admissionNo: 'GSTC/2025/001',
    studentName: 'Amina Bello',
    className: 'CCS 1',
    term: 'First Term',
    session: '2025/2026',
    scores: [
      { subjectName: 'English Language', ca1: 18, ca2: 17, exam: 52, total: 87, grade: 'A1', remark: 'Distinction' },
      { subjectName: 'Mathematics', ca1: 16, ca2: 15, exam: 48, total: 79, grade: 'A1', remark: 'Distinction' },
      { subjectName: 'Computer Craft Studies', ca1: 19, ca2: 18, exam: 55, total: 92, grade: 'A1', remark: 'Excellent' },
      { subjectName: 'Technical Drawing', ca1: 14, ca2: 15, exam: 44, total: 73, grade: 'B2', remark: 'Very Good' },
    ],
    totalScore: 331,
    averageScore: 82.75,
    position: 1,
    outOf: 1,
    timesSchoolOpened: 110,
    timesPresent: 108,
    teacherRemarks: 'A very dedicated, punctual, and intellectually sharp student. Keep up the high standard.',
    principalRemarks: 'An outstanding performance. Approved for academic excellence commendation.',
    nextTermBegins: '12th January 2026',
  },
];

const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'adm-01',
    username: 'admin',
    fullName: 'Engr. D. K. Mohammed (Principal)',
    role: 'Principal',
    email: 'principal@gstcgarki.edu.ng',
    lastActive: 'Just now',
    status: 'Active',
  },
  {
    id: 'adm-02',
    username: 'exam_officer',
    fullName: 'Mrs. Fatima Aliyu',
    role: 'Exam Officer',
    email: 'exams@gstcgarki.edu.ng',
    lastActive: '2 hours ago',
    status: 'Active',
  },
];

const INITIAL_SETTINGS: SchoolSettings = {
  schoolName: 'GSTC Garki',
  subtitle: 'Govt. Science & Tech. College',
  motto: 'Technology for Self-Reliance',
  address: 'Area 10, Garki, Abuja, Federal Capital Territory, Nigeria',
  phone: '+234 (0) 803 000 1234',
  email: 'info@gstcgarki.edu.ng',
  currentTerm: 'First Term',
  currentSession: '2025/2026',
  nextTermResumption: '12th January 2026',
  principalName: 'Engr. D. K. Mohammed, FNSE',
  examOfficerName: 'Mrs. Fatima Aliyu',
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Staff list: initially load from local storage or empty (or with Yahaya if saved)
  const [staffList, setStaffList] = useState<Staff[]>(() => {
    const saved = localStorage.getItem('gstc_staff');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    // Default to Yahaya already registered as seen at end of video,
    // so if someone refreshes or wants to see the registered staff table it's there.
    return [
      {
        id: 'stf-001',
        username: 'GSTC/Stf/001',
        name: 'Yahaya',
        phone: '08063731128',
        email: 'habakkukemmanuel0@gmail.com',
        subjectsTaught: ['English Language'],
        formTeacherOf: 'CCS 1',
        createdAt: '2026-09-25',
      },
    ];
  });

  const [classList, setClassList] = useState<ClassRoom[]>(() => {
    const saved = localStorage.getItem('gstc_classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [subjectList, setSubjectList] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('gstc_subjects');
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  const [studentList, setStudentList] = useState<Student[]>(() => {
    const saved = localStorage.getItem('gstc_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [scratchCards, setScratchCards] = useState<ScratchCard[]>(() => {
    const saved = localStorage.getItem('gstc_cards');
    return saved ? JSON.parse(saved) : INITIAL_SCRATCH_CARDS;
  });

  const [resultsList, setResultsList] = useState<StudentResult[]>(() => {
    const saved = localStorage.getItem('gstc_results');
    return saved ? JSON.parse(saved) : INITIAL_RESULTS;
  });

  const [adminList] = useState<AdminUser[]>(INITIAL_ADMINS);
  const [settings, setSettings] = useState<SchoolSettings>(() => {
    const saved = localStorage.getItem('gstc_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('gstc_staff', JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem('gstc_classes', JSON.stringify(classList));
  }, [classList]);

  useEffect(() => {
    localStorage.setItem('gstc_subjects', JSON.stringify(subjectList));
  }, [subjectList]);

  useEffect(() => {
    localStorage.setItem('gstc_students', JSON.stringify(studentList));
  }, [studentList]);

  useEffect(() => {
    localStorage.setItem('gstc_cards', JSON.stringify(scratchCards));
  }, [scratchCards]);

  useEffect(() => {
    localStorage.setItem('gstc_results', JSON.stringify(resultsList));
  }, [resultsList]);

  useEffect(() => {
    localStorage.setItem('gstc_settings', JSON.stringify(settings));
  }, [settings]);

  // Derive teaching assignments: each staff member teaching subjects
  const assignmentList: TeachingAssignment[] = staffList.flatMap((stf) =>
    stf.subjectsTaught.map((subj, idx) => ({
      id: `asg-${stf.id}-${idx}`,
      staffId: stf.id,
      staffName: stf.name,
      subjectName: subj,
      className: stf.formTeacherOf !== 'None' ? stf.formTeacherOf : 'CCS 1',
      academicYear: settings.currentSession,
      term: settings.currentTerm,
    }))
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addStaff = (data: Omit<Staff, 'id' | 'username' | 'createdAt'>): string => {
    // Generate username like GSTC/Stf/001, GSTC/Stf/002...
    const count = staffList.length + 1;
    const formattedId = `GSTC/Stf/${String(count).padStart(3, '0')}`;
    const newStaff: Staff = {
      ...data,
      id: `stf-${Date.now()}`,
      username: formattedId,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setStaffList((prev) => [...prev, newStaff]);

    // Update class form teacher if assigned
    if (data.formTeacherOf && data.formTeacherOf !== 'None') {
      setClassList((prev) =>
        prev.map((cls) =>
          cls.name === data.formTeacherOf
            ? { ...cls, formTeacherName: data.name }
            : cls
        )
      );
    }

    showToast('Staff saved');
    return formattedId;
  };

  const deleteStaff = (id: string) => {
    setStaffList((prev) => prev.filter((s) => s.id !== id));
    showToast('Staff removed successfully');
  };

  const addClass = (name: string, department: string, capacity = 40) => {
    const newClass: ClassRoom = {
      id: `cls-${Date.now()}`,
      name,
      department,
      formTeacherName: 'None',
      studentCount: 0,
      capacity,
    };
    setClassList((prev) => [...prev, newClass]);
    showToast(`Class ${name} created`);
  };

  const addSubject = (name: string, code: string, category: Subject['category']) => {
    const newSubj: Subject = {
      id: `sub-${Date.now()}`,
      name,
      code,
      category,
      assignedTeachers: [],
    };
    setSubjectList((prev) => [...prev, newSubj]);
    showToast(`Subject ${name} added`);
  };

  const addStudent = (data: Omit<Student, 'id' | 'admissionNo' | 'status'>): string => {
    const currentYear = new Date().getFullYear();
    const count = studentList.length + 1;
    const admissionNo = `GSTC/${currentYear}/${String(count).padStart(3, '0')}`;
    
    // Auto-generate a scratch card for this student
    const pinPart1 = Math.floor(1000 + Math.random() * 9000);
    const pinPart2 = Math.floor(1000 + Math.random() * 9000);
    const pinPart3 = Math.floor(1000 + Math.random() * 9000);
    const generatedPin = `${pinPart1}-${pinPart2}-${pinPart3}`;

    const newStudent: Student = {
      ...data,
      id: `std-${Date.now()}`,
      admissionNo,
      scratchCardPin: generatedPin,
      status: 'Active',
    };

    setStudentList((prev) => [...prev, newStudent]);

    // Also register the scratch card
    const newCard: ScratchCard = {
      id: `crd-${Date.now()}`,
      serialNumber: `GSTC-${currentYear}-${Math.floor(100000 + Math.random() * 900000)}`,
      pin: generatedPin,
      maxUsage: 5,
      usageCount: 0,
      status: 'active',
      usedByAdmissionNo: admissionNo,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setScratchCards((prev) => [newCard, ...prev]);

    // Update class student count
    setClassList((prev) =>
      prev.map((cls) =>
        cls.name === data.className ? { ...cls, studentCount: cls.studentCount + 1 } : cls
      )
    );

    showToast(`Student registered: ${admissionNo}`);
    return admissionNo;
  };

  const generateScratchCards = (count = 5) => {
    const currentYear = new Date().getFullYear();
    const newCards: ScratchCard[] = [];

    for (let i = 0; i < count; i++) {
      const p1 = Math.floor(1000 + Math.random() * 9000);
      const p2 = Math.floor(1000 + Math.random() * 9000);
      const p3 = Math.floor(1000 + Math.random() * 9000);
      const pin = `${p1}-${p2}-${p3}`;
      const serial = `GSTC-${currentYear}-${Math.floor(100000 + Math.random() * 900000)}`;

      newCards.push({
        id: `crd-${Date.now()}-${i}`,
        serialNumber: serial,
        pin,
        maxUsage: 5,
        usageCount: 0,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
      });
    }

    setScratchCards((prev) => [...newCards, ...prev]);
    showToast(`Generated ${count} new Scratch Cards`);
  };

  const verifyScratchCard = (admissionNo: string, pin: string) => {
    const cleanAdm = admissionNo.trim().toUpperCase();
    const cleanPin = pin.trim().replace(/\s+/g, '');

    const card = scratchCards.find(
      (c) => c.pin.replace(/-/g, '') === cleanPin.replace(/-/g, '')
    );

    if (!card) {
      return { valid: false, message: 'Invalid Scratch Card PIN. Please check and try again.' };
    }

    if (card.status !== 'active') {
      return { valid: false, message: 'This Scratch Card has expired or been deactivated.' };
    }

    if (card.usageCount >= card.maxUsage) {
      return { valid: false, message: `Card usage limit exceeded (Max ${card.maxUsage} checks). Please purchase a new card.` };
    }

    // Find student
    const student = studentList.find((s) => s.admissionNo.toUpperCase() === cleanAdm);
    if (!student) {
      return { valid: false, message: `Admission Number "${admissionNo}" not found on GSTC portal.` };
    }

    // Increment usage
    setScratchCards((prev) =>
      prev.map((c) =>
        c.id === card.id
          ? {
              ...c,
              usageCount: c.usageCount + 1,
              usedByAdmissionNo: cleanAdm,
              status: c.usageCount + 1 >= c.maxUsage ? 'used' : 'active',
            }
          : c
      )
    );

    // Find or generate result
    let result = resultsList.find((r) => r.admissionNo.toUpperCase() === cleanAdm);
    if (!result) {
      // Default sample result for demo
      result = {
        id: `res-${student.id}`,
        studentId: student.id,
        admissionNo: student.admissionNo,
        studentName: student.fullName,
        className: student.className,
        term: settings.currentTerm,
        session: settings.currentSession,
        scores: [
          { subjectName: 'English Language', ca1: 17, ca2: 18, exam: 50, total: 85, grade: 'A1', remark: 'Distinction' },
          { subjectName: 'Mathematics', ca1: 15, ca2: 16, exam: 46, total: 77, grade: 'A1', remark: 'Distinction' },
          { subjectName: 'Computer Craft Studies', ca1: 18, ca2: 19, exam: 51, total: 88, grade: 'A1', remark: 'Distinction' },
          { subjectName: 'Technical Drawing', ca1: 13, ca2: 14, exam: 45, total: 72, grade: 'B2', remark: 'Very Good' },
        ],
        totalScore: 322,
        averageScore: 80.5,
        position: 1,
        outOf: 1,
        timesSchoolOpened: 110,
        timesPresent: 106,
        teacherRemarks: 'Excellent academic progress and behavior in class.',
        principalRemarks: 'A very commendable result. Keep it up.',
        nextTermBegins: settings.nextTermResumption,
      };
      setResultsList((prev) => [...prev, result!]);
    }

    return {
      valid: true,
      message: `Card verified! ${card.maxUsage - (card.usageCount + 1)} uses remaining.`,
      result,
    };
  };

  const saveResult = (result: StudentResult) => {
    setResultsList((prev) => {
      const idx = prev.findIndex((r) => r.id === result.id || r.admissionNo === result.admissionNo);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = result;
        return copy;
      }
      return [...prev, result];
    });
    showToast('Result saved successfully');
  };

  const updateSettings = (newSettings: Partial<SchoolSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Settings updated');
  };

  const resetToInitialDemo = () => {
    setStaffList([]);
    setClassList(INITIAL_CLASSES);
    setSubjectList(INITIAL_SUBJECTS);
    setStudentList(INITIAL_STUDENTS);
    setScratchCards(INITIAL_SCRATCH_CARDS);
    setResultsList(INITIAL_RESULTS);
    setSettings(INITIAL_SETTINGS);
    showToast('Portal reset to initial video snapshot (0 staff)');
  };

  return (
    <DataContext.Provider
      value={{
        staffList,
        classList,
        subjectList,
        studentList,
        assignmentList,
        scratchCards,
        resultsList,
        adminList,
        settings,
        toastMessage,
        addStaff,
        deleteStaff,
        addClass,
        addSubject,
        addStudent,
        generateScratchCards,
        verifyScratchCard,
        saveResult,
        updateSettings,
        showToast,
        resetToInitialDemo,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
