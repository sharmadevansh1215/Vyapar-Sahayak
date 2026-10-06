import React, { useState, useEffect } from 'react';
import { nearbyBanks } from '../data/locations';
import { Language, BankBranch, PincodeBankResponse } from '../types';

interface BankLocatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  initialPincode?: string;
}

export const BankLocatorModal: React.FC<BankLocatorModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  initialPincode = '221101',
}) => {
  const [pincode, setPincode] = useState<string>(initialPincode);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchemeFilter, setSelectedSchemeFilter] = useState('All');
  const [copiedIfsc, setCopiedIfsc] = useState<string | null>(null);

  // API State
  const [isLoading, setIsLoading] = useState(false);
  const [apiData, setApiData] = useState<PincodeBankResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch banks by pincode
  const fetchBanksForPincode = async (code: string) => {
    const cleanCode = code.trim();
    if (!/^\d{6}$/.test(cleanCode)) {
      setApiError('कृपया वैध 6-अंकीय पिनकोड दर्ज करें (Enter valid 6-digit PIN code)');
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch(`/api/banks-by-pincode?pincode=${cleanCode}`);
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const data: PincodeBankResponse = await response.json();
      setApiData(data);
    } catch (err: any) {
      console.warn('Live bank lookup failed, using local fallback:', err);
      setApiError('लाइव पिनकोड सर्वर से संपर्क नहीं हो पाया, स्थानीय डेटा दिखाया जा रहा है।');
      // Construct fallback from nearbyBanks
      setApiData({
        success: true,
        pincode: cleanCode,
        district: 'Varanasi',
        state: 'Uttar Pradesh',
        leadBank: 'Union Bank of India (Lead Bank for District)',
        branches: nearbyBanks.map((b) => ({
          name: b.name,
          nameHindi: b.nameHindi,
          bankName: b.name,
          branchName: b.address.split(',')[0] || 'Main Branch',
          ifsc: b.ifsc,
          address: b.address,
          distance: b.distance,
          managerName: b.managerName,
          phone: b.phone,
          workingHours: b.workingHours,
          schemesOffered: b.schemesOffered,
          isLeadBank: b.name.includes('Union') || b.name.includes('State Bank'),
          specialization: 'Rural Microfinance & PMEGP',
        })),
        source: 'cached_directory',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBanksForPincode(pincode);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Active branches list from API or fallback
  const allBranches: BankBranch[] = apiData?.branches && apiData.branches.length > 0
    ? apiData.branches
    : nearbyBanks.map((b) => ({
        name: b.name,
        nameHindi: b.nameHindi,
        bankName: b.name,
        branchName: b.address.split(',')[0] || 'Main Branch',
        ifsc: b.ifsc,
        address: b.address,
        distance: b.distance,
        managerName: b.managerName,
        phone: b.phone,
        workingHours: b.workingHours,
        schemesOffered: b.schemesOffered,
        isLeadBank: false,
      }));

  const filteredBanks = allBranches.filter((bank) => {
    const matchesSearch =
      bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bank.nameHindi && bank.nameHindi.toLowerCase().includes(searchTerm.toLowerCase())) ||
      bank.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.ifsc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesScheme =
      selectedSchemeFilter === 'All' || bank.schemesOffered.some((s) => s.includes(selectedSchemeFilter));
    return matchesSearch && matchesScheme;
  });

  const handleCopyIfsc = (ifsc: string) => {
    navigator.clipboard.writeText(ifsc);
    setCopiedIfsc(ifsc);
    setTimeout(() => setCopiedIfsc(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in-down">
      <div className="bg-white border border-[#c3c6d5] rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#c3c6d5] flex items-center justify-between bg-[#f7f9fc]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#003c90] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-2xl font-bold">account_balance</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-[#001945]">
                  नजदीकी बैंक शाखाएं (Authorised Rural Banks)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]">
                  RBI & MoSJE Nodal
                </span>
              </div>
              <p className="text-xs text-[#64748b]">
                {apiData?.district && apiData?.state
                  ? `${apiData.district}, ${apiData.state} • Lead Bank: ${apiData.leadBank || 'Nationalised Bank'}`
                  : 'पिनकोड के आधार पर नजदीकी ग्रामीण बैंक शाखाएं खोजें'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#e0e3e6] flex items-center justify-center text-[#434653] cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* PIN Code Lookup Bar */}
        <div className="p-3.5 sm:p-4 bg-[#f0f6ff] border-b border-[#cbd5e1] flex flex-col sm:flex-row gap-3 items-center">
          <div className="w-full sm:w-auto flex items-center gap-2">
            <label className="text-xs font-black text-[#0a3663] shrink-0">पिनकोड (PIN Code):</label>
            <div className="relative flex-1 sm:w-40">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="उदा. 221101"
                className="w-full h-9 px-3 font-mono font-bold text-sm bg-white border border-[#94a3b8] rounded-lg focus:border-[#003c90] outline-none shadow-2xs text-center"
              />
            </div>
            <button
              onClick={() => fetchBanksForPincode(pincode)}
              disabled={isLoading || pincode.length !== 6}
              className="h-9 px-4 bg-[#003c90] hover:bg-[#002d6c] disabled:opacity-50 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin text-xs">⟳</span>
                  <span>खोज रहे हैं...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">search</span>
                  <span>शाखाएं खोजें</span>
                </>
              )}
            </button>
          </div>

          {apiData && (
            <div className="w-full sm:flex-1 text-right text-[11px] text-[#475569] font-medium truncate">
              डाक मंडल: <span className="font-bold text-[#0f172a]">{apiData.district || 'Varanasi'}</span> | 
              सत्यापित शाखाएं: <span className="font-bold text-[#107c41]">{filteredBanks.length} उपलब्ध</span>
            </div>
          )}
        </div>

        {apiError && (
          <div className="px-4 py-2 bg-[#fffbeb] border-b border-[#fde68a] text-[#92400e] text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">info</span>
            <span>{apiError}</span>
          </div>
        )}

        {/* Search & Scheme Filter Controls */}
        <div className="p-3 sm:p-4 border-b border-[#eceef1] bg-white flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737784] text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="बैंक नाम, शाखा, IFSC या पता खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-3 text-xs md:text-sm bg-[#f7f9fc] border border-[#c3c6d5] rounded-xl focus:border-[#003c90] outline-none"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
            {['All', 'MoSJE', 'Mudra', 'PMEGP', 'NBCFDC'].map((sch) => (
              <button
                key={sch}
                onClick={() => setSelectedSchemeFilter(sch)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                  selectedSchemeFilter === sch
                    ? 'bg-[#003c90] text-white shadow-2xs'
                    : 'bg-[#f2f4f7] text-[#434653] hover:bg-[#e0e3e6]'
                }`}
              >
                {sch}
              </button>
            ))}
          </div>
        </div>

        {/* Bank List Content */}
        <div className="p-4 overflow-y-auto space-y-3.5 flex-1 bg-[#f8fafc]">
          {isLoading ? (
            <div className="py-12 text-center text-[#64748b] space-y-2">
              <span className="material-symbols-outlined text-4xl animate-spin text-[#003c90]">
                progress_activity
              </span>
              <p className="text-xs font-bold">भारतीय डाक एवं बैंक डायरेक्टरी से डेटा प्राप्त हो रहा है...</p>
            </div>
          ) : filteredBanks.length === 0 ? (
            <div className="py-12 text-center text-[#64748b] space-y-2 bg-white rounded-xl border border-[#cbd5e1]">
              <span className="material-symbols-outlined text-4xl text-[#94a3b8]">search_off</span>
              <p className="text-sm font-bold text-[#1e293b]">कोई बैंक शाखा नहीं मिली</p>
              <p className="text-xs">कृपया अन्य पिनकोड या फिल्टर का चयन करें।</p>
            </div>
          ) : (
            filteredBanks.map((bank) => (
              <div
                key={bank.ifsc}
                className={`border rounded-xl p-4 transition-all bg-white shadow-xs ${
                  bank.isLeadBank ? 'border-[#003c90] bg-[#fafcff]' : 'border-[#cbd5e1] hover:border-[#94a3b8]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm md:text-base text-[#001945] leading-tight">
                        {currentLanguage === 'en' ? bank.name : bank.nameHindi || bank.name}
                      </h4>
                      {bank.isLeadBank && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
                          District Lead Bank
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#475569] mt-0.5">{bank.address}</p>
                  </div>
                  <span className="bg-[#dcfce7] text-[#166534] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                    <span className="material-symbols-outlined text-sm">near_me</span>
                    {bank.distance}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-2.5 text-xs text-[#434653] bg-[#f1f5f9] p-2.5 rounded-lg">
                  <div>
                    <span className="text-[10px] text-[#64748b] block font-semibold uppercase">IFSC कोड</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-[#003c90]">{bank.ifsc}</span>
                      <button
                        onClick={() => handleCopyIfsc(bank.ifsc)}
                        className="text-[#003c90] hover:text-[#001945] text-[11px] font-bold cursor-pointer"
                        title="Copy IFSC"
                      >
                        {copiedIfsc === bank.ifsc ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#64748b] block font-semibold uppercase">शाखा अधिकारी</span>
                    <span className="font-semibold text-[#0f172a]">{bank.managerName}</span>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-[#64748b] block font-semibold uppercase">कार्य समय</span>
                    <span className="font-medium text-[#0f172a]">{bank.workingHours}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {bank.schemesOffered.map((s, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-[#dbeafe] text-[#1e40af] px-2 py-0.5 rounded-md font-bold"
                    >
                      {s}
                    </span>
                  ))}
                  {bank.specialization && (
                    <span className="text-[10px] bg-[#f3e8ff] text-[#6b21a8] px-2 py-0.5 rounded-md font-bold">
                      {bank.specialization}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <a
                    href={`tel:${bank.phone}`}
                    className="flex-1 py-2 bg-[#003c90] hover:bg-[#002d6c] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-sm">call</span>
                    <span>शाखा प्रबंधक से बात करें ({bank.phone})</span>
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${bank.name} ${bank.address}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-[#cbd5e1] hover:bg-white text-[#003c90] rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-sm">directions</span>
                    <span>Map</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-[#c3c6d5] bg-[#f7f9fc] flex items-center justify-between">
          <span className="text-xs text-[#64748b]">
            स्रोत: RBI Lead Bank Scheme & Department of Posts
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#334155] text-white rounded-xl text-xs font-bold hover:bg-[#1e293b] transition-colors cursor-pointer"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
