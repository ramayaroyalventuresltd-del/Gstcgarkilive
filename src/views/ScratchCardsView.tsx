import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { CreditCard, Plus, KeyRound, Check, Copy, Sparkles, AlertCircle, Award } from 'lucide-react';
import { CrestLogo } from '../components/CrestLogo';
import { ScratchCard, StudentResult } from '../types';

export const ScratchCardsView: React.FC = () => {
  const { t } = useAuth();
  const { scratchCards, generateScratchCards, verifyScratchCard, studentList, showToast } = useData();

  const [revealedPins, setRevealedPins] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Online Checker Simulator
  const [checkAdmissionNo, setCheckAdmissionNo] = useState('GSTC/2025/001');
  const [checkPin, setCheckPin] = useState('9842-1049-5521');
  const [checkerStatus, setCheckerStatus] = useState<{
    submitted: boolean;
    valid?: boolean;
    message?: string;
    result?: StudentResult;
  }>({ submitted: false });

  const toggleReveal = (id: string) => {
    setRevealedPins((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyPin = (id: string, pin: string) => {
    navigator.clipboard.writeText(pin);
    setCopiedId(id);
    showToast('PIN copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkAdmissionNo.trim() || !checkPin.trim()) return;
    const outcome = verifyScratchCard(checkAdmissionNo.trim(), checkPin.trim());
    setCheckerStatus({
      submitted: true,
      valid: outcome.valid,
      message: outcome.message,
      result: outcome.result,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-serif">
            {t.scratchCards.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            {t.scratchCards.subtitle}
          </p>
        </div>

        <button
          onClick={() => generateScratchCards(5)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#801c1c] hover:bg-[#681616] text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.scratchCards.generateBatchBtn}</span>
        </button>
      </div>

      {/* Interactive Result Checker Simulator */}
      <div className="bg-gradient-to-br from-[#14532D] to-[#0B331B] text-white rounded-2xl p-6 sm:p-8 shadow-md border border-emerald-800">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-3">
            <KeyRound className="w-5 h-5 text-emerald-300" />
            <h2 className="text-lg font-bold">Online Result Checker Terminal</h2>
          </div>
          <p className="text-xs text-emerald-100/90 leading-relaxed mb-5">
            Students and parents verify terminal report sheets using their Admission Number and 12-digit Scratch Card PIN. Test verification live below:
          </p>

          <form onSubmit={handleVerify} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[11px] font-semibold text-emerald-200 mb-1">
                Student Admission No.
              </label>
              <input
                type="text"
                value={checkAdmissionNo}
                onChange={(e) => setCheckAdmissionNo(e.target.value)}
                placeholder="e.g. GSTC/2025/001"
                className="w-full px-3 py-2 bg-emerald-950/80 border border-emerald-700/80 rounded-lg text-white text-xs font-mono placeholder:text-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-emerald-200 mb-1">
                Scratch Card PIN
              </label>
              <input
                type="text"
                value={checkPin}
                onChange={(e) => setCheckPin(e.target.value)}
                placeholder="e.g. 9842-1049-5521"
                className="w-full px-3 py-2 bg-emerald-950/80 border border-emerald-700/80 rounded-lg text-white text-xs font-mono placeholder:text-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end mt-1">
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold text-xs rounded-lg shadow-sm transition cursor-pointer"
              >
                Validate PIN &amp; Fetch Result
              </button>
            </div>
          </form>

          {/* Validation Result Box */}
          {checkerStatus.submitted && (
            <div
              className={`p-4 rounded-xl border text-xs ${
                checkerStatus.valid
                  ? 'bg-emerald-900/90 border-emerald-500 text-emerald-100'
                  : 'bg-red-950/90 border-red-500 text-red-200'
              }`}
            >
              <p className="font-bold flex items-center gap-2">
                {checkerStatus.valid ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                )}
                <span>{checkerStatus.message}</span>
              </p>

              {checkerStatus.valid && checkerStatus.result && (
                <div className="mt-3 pt-3 border-t border-emerald-700/80 space-y-1">
                  <p><strong>Student:</strong> {checkerStatus.result.studentName} ({checkerStatus.result.className})</p>
                  <p><strong>Term:</strong> {checkerStatus.result.term} · {checkerStatus.result.session}</p>
                  <p><strong>Average:</strong> {checkerStatus.result.averageScore}% · <strong>Rank:</strong> {checkerStatus.result.position}st</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cards Table */}
      <div className="bg-white border border-[#E3DEC9] rounded-xl shadow-2xs overflow-hidden">
        <div className="p-4 bg-[#FAF8F3] border-b border-stone-200 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm text-stone-900">
              Active Scratch Cards Inventory ({scratchCards.length})
            </h3>
            <p className="text-[11px] text-stone-500">
              Each card allows up to 5 verified result checks
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">{t.scratchCards.serialNo}</th>
                <th className="py-3 px-4">{t.scratchCards.pin}</th>
                <th className="py-3 px-4">{t.scratchCards.usagesLeft}</th>
                <th className="py-3 px-4">BOUND STUDENT</th>
                <th className="py-3 px-4">{t.scratchCards.status}</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {scratchCards.map((card) => {
                const isRevealed = revealedPins[card.id];
                const usagesLeft = card.maxUsage - card.usageCount;
                return (
                  <tr key={card.id} className="hover:bg-stone-50/80">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      {card.serialNumber}
                    </td>

                    {/* PIN with Scratch Reveal effect */}
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-2">
                        {isRevealed ? (
                          <span className="font-mono font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 tracking-wider">
                            {card.pin}
                          </span>
                        ) : (
                          <button
                            onClick={() => toggleReveal(card.id)}
                            className="font-mono text-stone-500 bg-stone-200/90 hover:bg-stone-300 px-2 py-0.5 rounded text-[11px] font-medium border border-stone-300 transition"
                          >
                            ••••-••••-•••• (Scratch)
                          </button>
                        )}

                        <button
                          onClick={() => handleCopyPin(card.id, card.pin)}
                          className="p-1 text-stone-400 hover:text-stone-700 rounded transition"
                          title="Copy PIN"
                        >
                          {copiedId === card.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-semibold">
                      <span className={usagesLeft > 0 ? 'text-emerald-800' : 'text-red-700'}>
                        {usagesLeft} of {card.maxUsage} left
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-stone-600">
                      {card.usedByAdmissionNo || (
                        <span className="text-stone-400 italic">Unbound / New</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          card.status === 'active' && usagesLeft > 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {card.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setCheckPin(card.pin);
                          if (card.usedByAdmissionNo) {
                            setCheckAdmissionNo(card.usedByAdmissionNo);
                          }
                          showToast('Loaded PIN into Result Checker Terminal');
                        }}
                        className="text-xs text-emerald-800 font-semibold hover:underline"
                      >
                        Use in Terminal
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
