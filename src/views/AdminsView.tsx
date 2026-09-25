import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Shield, Plus, UserCheck, Key, ShieldCheck, X } from 'lucide-react';
import { AdminUser } from '../types';

export const AdminsView: React.FC = () => {
  const { t } = useAuth();
  const { adminList, settings, showToast } = useData();

  const [admins, setAdmins] = useState<AdminUser[]>(adminList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<AdminUser['role']>('Exam Officer');
  const [email, setEmail] = useState('');

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim()) return;

    const newAdmin: AdminUser = {
      id: `adm-${Date.now()}`,
      username: username.trim().toLowerCase(),
      fullName: fullName.trim(),
      role,
      email: email.trim() || `${username.trim()}@gstcgarki.edu.ng`,
      lastActive: 'Never',
      status: 'Active',
    };

    setAdmins((prev) => [...prev, newAdmin]);
    showToast(`Administrator ${newAdmin.fullName} added`);
    setIsModalOpen(false);
    setFullName('');
    setUsername('');
    setEmail('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-serif">
            {t.nav.admins}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Role-Based Access Control & Portal System Officers
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-stone-100 border border-stone-300 text-stone-800 px-3.5 py-1.5 rounded-lg text-xs font-semibold">
          <span>{settings.currentTerm} · {settings.currentSession}</span>
        </div>
      </div>

      <div className="bg-white border border-[#E3DEC9] rounded-xl p-4 sm:p-5 shadow-2xs flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            System Administrators ({admins.length})
          </h2>
          <p className="text-xs text-stone-500">
            Privileged roles authorized for broadsheet publication and staff approvals
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#801c1c] hover:bg-[#681616] text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Administrator</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {admins.map((adm) => (
          <div
            key={adm.id}
            className="bg-white border border-[#E3DEC9] rounded-xl p-5 shadow-2xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">{adm.fullName}</h3>
                  <p className="text-xs text-stone-500 font-mono">@{adm.username}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                {adm.status}
              </span>
            </div>

            <div className="pt-3 border-t border-stone-100 text-xs space-y-1 text-stone-600">
              <p><strong>Designation:</strong> {adm.role}</p>
              <p><strong>Email:</strong> {adm.email}</p>
              <p><strong>Last Active:</strong> {adm.lastActive}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-300">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <h3 className="text-lg font-bold text-stone-900 font-serif">Add Administrator</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Officer Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Mal. Abdullahi Sanusi"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. sanusi_a"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Designated Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AdminUser['role'])}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="Exam Officer">Exam Officer</option>
                  <option value="Principal">Principal / Vice Principal</option>
                  <option value="Super Admin">Super Administrator</option>
                  <option value="System Admin">ICT System Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sanusi@gstcgarki.edu.ng"
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
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
