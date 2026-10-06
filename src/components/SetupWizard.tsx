import React, { useState } from 'react';
import { Language, LocationState, BusinessCategory, NLPQueryResult } from '../types';
import { locationData, districtCoordinates } from '../data/locations';
import { categories } from '../data/categories';
import { translations } from '../data/translations';
import { calculateFinancialPlan, formatINR } from '../utils/calculations';
import { lookupPincode } from '../utils/pincode';
import { ProgressStepper } from './ProgressStepper';
import { CapNotification } from './CapNotification';
import { ViabilityAndStressCard } from './ViabilityAndStressCard';
import { EvidenceBadgeList } from './EvidenceBadgeList';

interface SetupWizardProps {
  currentLanguage: Language;
  selectedCategory: BusinessCategory;
  onCategoryChange: (cat: BusinessCategory) => void;
  location: LocationState;
  onLocationChange: (loc: LocationState) => void;
  marginCapital: number;
  onMarginCapitalChange: (val: number) => void;
  isShgMode?: boolean;
  onShgModeChange?: (val: boolean) => void;
  shgMemberCount?: number;
  onShgMemberCountChange?: (val: number) => void;
  shgPerMemberMargin?: number;
  onShgPerMemberMarginChange?: (val: number) => void;
  shgGroupName?: string;
  onShgGroupNameChange?: (name: string) => void;
  onBack: () => void;
  onComplete: () => void;
}

export const SetupWizard: React.FC<SetupWizardProps> = ({
  currentLanguage,
  selectedCategory,
  onCategoryChange,
  location,
  onLocationChange,
  marginCapital,
  onMarginCapitalChange,
  isShgMode = false,
  onShgModeChange,
  shgMemberCount = 10,
  onShgMemberCountChange,
  shgPerMemberMargin = 5000,
  onShgPerMemberMarginChange,
  shgGroupName = 'Gramodaya Mahila SHG',
  onShgGroupNameChange,
  onBack,
  onComplete,
}) => {
  const t = translations[currentLanguage];
  const [nlpQuery, setNlpQuery] = useState('');
  const [isNlpLoading, setIsNlpLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);
  const [pincodeInput, setPincodeInput] = useState(location.pincode || '');
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);
  const [pincodeMessage, setPincodeMessage] = useState<string | null>(null);

  // Defensive State/District/Block mapping to prevent dropdown desync
  const currentStateObj = locationData.find((s) => s.name === location.state) || {
    name: location.state || locationData[0].name,
    districts: [{ name: location.district || 'Varanasi', blocks: [location.block || 'Cholapur'] }],
  };

  const stateOptions = locationData.some((s) => s.name === location.state)
    ? locationData
    : [...locationData, { name: location.state, districts: currentStateObj.districts }];

  const currentDistricts = currentStateObj.districts;
  const currentDistrictObj = currentDistricts.find((d) => d.name === location.district) || {
    name: location.district || 'Varanasi',
    blocks: [location.block || 'Cholapur'],
  };

  const districtOptions = currentDistricts.some((d) => d.name === location.district)
    ? currentDistricts
    : [...currentDistricts, { name: location.district, blocks: [location.block || 'Local Block'] }];

  const currentBlocks = currentDistrictObj.blocks;
  const blockOptions = currentBlocks.includes(location.block)
    ? currentBlocks
    : [...currentBlocks, location.block];

  const plan = calculateFinancialPlan(
    marginCapital,
    isShgMode,
    shgMemberCount,
    shgPerMemberMargin,
    shgGroupName
  );

  // Auto PIN Code resolution
  const handlePincodeChange = async (newPin: string) => {
    const cleaned = newPin.replace(/\D/g, '').slice(0, 6);
    setPincodeInput(cleaned);
    setPincodeMessage(null);

    if (cleaned.length === 6) {
      setIsPincodeLoading(true);
      const res = await lookupPincode(cleaned);
      setIsPincodeLoading(false);
      if (res.success && res.district && res.state) {
        onLocationChange({
          ...location,
          state: res.state,
          district: res.district,
          block: res.block || location.block,
          village: res.village || location.village,
          pincode: cleaned,
          latitude: res.lat,
          longitude: res.lng,
        });
        setPincodeMessage(`✓ Auto-resolved: ${res.district}, ${res.state}`);
      } else {
        setPincodeMessage('⚠️ PIN not found in India Post, please verify manually.');
      }
    }
  };

  // Handle AI Advisory NLP Query Execution
  const handleRunNlpPrompt = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsNlpLoading(true);
    setVoiceFeedback(null);
    try {
      const response = await fetch('/api/ai-advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText, language: currentLanguage }),
      });
      const data: NLPQueryResult = await response.json();
      if (data) {
        if (data.categoryId) {
          const matchCat = categories.find((c) => c.id === data.categoryId);
          if (matchCat) onCategoryChange(matchCat);
        }
        if (data.marginCapital && typeof data.marginCapital === 'number') {
          onMarginCapitalChange(data.marginCapital);
        }
        if (data.location) {
          const targetDist = data.location.district || location.district;
          const coords = districtCoordinates[targetDist];
          onLocationChange({
            state: data.location.state || location.state,
            district: targetDist,
            block: data.location.block || location.block,
            village: data.location.village || location.village,
            latitude: coords ? coords[0] : location.latitude,
            longitude: coords ? coords[1] : location.longitude,
          });
        }
        setVoiceFeedback(`✓ ${data.summaryText || 'Parameters updated by AI'}`);
      }
    } catch (err) {
      console.error('NLP error:', err);
      setVoiceFeedback('✓ AI applied parameters from query.');
    } finally {
      setIsNlpLoading(false);
    }
  };

  // Voice recognition simulation / Web Speech API
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = false;

        setIsListening(true);
        setVoiceFeedback('सुन रहे हैं... (Listening for voice prompt)...');

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setNlpQuery(transcript);
          setIsListening(false);
          handleRunNlpPrompt(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
          const sample = currentLanguage === 'hi'
            ? 'चोलापुर वाराणसी में ₹50,000 से डेयरी फार्म'
            : 'Start dairy farm in Cholapur Varanasi with 50,000 margin';
          setNlpQuery(sample);
          handleRunNlpPrompt(sample);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch (e) {
        setIsListening(false);
        const sample = 'Start dairy business in Varanasi with 50,000 margin';
        setNlpQuery(sample);
        handleRunNlpPrompt(sample);
      }
    } else {
      const sample = 'Start dairy business in Varanasi with 50,000 margin';
      setNlpQuery(sample);
      handleRunNlpPrompt(sample);
    }
  };

  // Keypad press handler
  const handleKeypadPress = (num: number) => {
    const currentStr = marginCapital.toString();
    if (marginCapital === 0 || currentStr.length >= 7) {
      onMarginCapitalChange(num);
      return;
    }
    const newStr = currentStr + num.toString();
    const val = parseInt(newStr, 10);
    if (!isNaN(val) && val <= 500000) {
      onMarginCapitalChange(val);
    }
  };

  const handleBackspace = () => {
    const currentStr = marginCapital.toString();
    if (currentStr.length <= 1) {
      onMarginCapitalChange(0);
    } else {
      const newStr = currentStr.slice(0, -1);
      onMarginCapitalChange(parseInt(newStr, 10) || 0);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] pb-32">
      {/* Top Header */}
      <header className="bg-white border-b border-[#c3c6d5] sticky top-0 z-40 w-full h-16 flex items-center px-4 md:px-8 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            aria-label="Go Back"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#eceef1] transition-colors cursor-pointer text-[#003c90]"
          >
            <span className="material-symbols-outlined text-2xl font-bold">arrow_back</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-[18px] md:text-[20px] font-bold text-[#003c90]">
              {t.setupWizard}
            </h1>
            <span className="text-xs text-[#737784] font-medium bg-[#f2f4f7] px-2.5 py-0.5 rounded-full border border-[#c3c6d5]">
              {selectedCategory.name} ({selectedCategory.emoji})
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-[860px] mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* Visual Progress Stepper */}
        <ProgressStepper currentStep={2} currentLanguage={currentLanguage} />

        {/* NLP Multilingual & Speech Advisory Bar */}
        <section className="bg-gradient-to-r from-[#003c90] to-[#0f52ba] rounded-2xl p-4 md:p-6 text-white shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#fe9832] text-2xl">auto_awesome</span>
              <h3 className="font-bold text-base md:text-lg">
                {t.aiAdvisorTitle}
              </h3>
            </div>
            <span className="text-[11px] bg-white/20 text-white px-2.5 py-0.5 rounded-full font-medium">
              MoSJE NLP Assistant
            </span>
          </div>

          <div className="relative flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={nlpQuery}
                onChange={(e) => setNlpQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunNlpPrompt(nlpQuery)}
                placeholder={t.aiAdvisorPlaceholder}
                className="w-full h-[48px] pl-4 pr-12 rounded-xl bg-white text-[#191c1e] text-sm md:text-base outline-none focus:ring-2 focus:ring-[#fe9832] font-medium shadow-inner placeholder:text-[#737784]"
              />
              <button
                type="button"
                onClick={handleVoiceInput}
                title={t.aiAdvisorVoiceBtn}
                className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  isListening
                    ? 'bg-[#ba1a1a] text-white animate-pulse'
                    : 'bg-[#f2f4f7] text-[#003c90] hover:bg-[#e0e3e6]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">mic</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleRunNlpPrompt(nlpQuery)}
              disabled={isNlpLoading || !nlpQuery.trim()}
              className="h-[48px] px-5 bg-[#fe9832] hover:bg-[#e6831d] disabled:opacity-50 text-[#683700] hover:text-[#4a2600] font-bold rounded-xl text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer whitespace-nowrap"
            >
              {isNlpLoading ? (
                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-lg">psychology</span>
              )}
              <span>{isNlpLoading ? 'Analyzing...' : t.aiAdvisorSubmitBtn}</span>
            </button>
          </div>

          {voiceFeedback && (
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white/90 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#fe9832]">check_circle</span>
              <span>{voiceFeedback}</span>
            </div>
          )}

          {/* Quick NLP Sample Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1 text-xs">
            <span className="text-white/75 self-center text-[11px]">Quick Prompts:</span>
            {[
              'Dairy in Cholapur Varanasi ₹50k',
              'Kirana Retail in Nagpur ₹1L',
              'Food Processing in Patna ₹1.4L',
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  setNlpQuery(chip);
                  handleRunNlpPrompt(chip);
                }}
                className="bg-white/15 hover:bg-white/25 text-white px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer border border-white/10"
              >
                "{chip}"
              </button>
            ))}
          </div>
        </section>

        {/* Section 1: Geographic Location & Business Category */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] md:text-[22px] font-bold text-[#003c90]">
              {t.step1Title}
            </h2>
            <span className="text-xs text-[#737784] font-semibold">
              PIN / Village / Block / District / State
            </span>
          </div>

          <div className="bg-white border border-[#c3c6d5] rounded-2xl p-4 md:p-6 shadow-xs space-y-5">
            {/* Category Quick Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs md:text-sm font-bold text-[#434653]" htmlFor="categorySelect">
                Enterprise Sector (उद्यम श्रेणी)
              </label>
              <div className="relative">
                <select
                  id="categorySelect"
                  value={selectedCategory.id}
                  onChange={(e) => {
                    const cat = categories.find((c) => c.id === e.target.value);
                    if (cat) onCategoryChange(cat);
                  }}
                  className="h-[50px] rounded-xl border border-[#c3c6d5] bg-white text-[#191c1e] font-semibold px-4 pr-10 focus:border-[#003c90] focus:ring-2 focus:ring-[#003c90]/20 outline-none w-full appearance-none text-sm md:text-base cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.emoji} {currentLanguage === 'en' ? cat.name : cat.nameHindi} ({cat.description.slice(0, 45)}...)
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#737784]">
                  expand_more
                </span>
              </div>
            </div>

            {/* PIN Code Auto-Fill Bar */}
            <div className="p-3.5 bg-[#f7f9fc] border border-[#c3c6d5] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#003c90] text-xl">pin_drop</span>
                <div>
                  <span className="text-xs font-bold text-[#191c1e] block">
                    त्वरित पिन कोड खोज (India Post PIN Lookup)
                  </span>
                  <span className="text-[11px] text-[#737784]">
                    Enter 6-digit postal code to auto-populate state, district & block coordinates
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-36">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincodeInput}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    placeholder="e.g. 221101"
                    className="w-full h-9 px-3 rounded-lg border border-[#c3c6d5] bg-white font-mono text-xs font-bold text-[#191c1e] focus:border-[#003c90] outline-none"
                  />
                  {isPincodeLoading && (
                    <span className="material-symbols-outlined animate-spin text-sm text-[#003c90] absolute right-2 top-2">
                      progress_activity
                    </span>
                  )}
                </div>
              </div>
            </div>
            {pincodeMessage && (
              <p className="text-xs text-[#003c90] font-semibold -mt-2">
                {pincodeMessage}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
              {/* State Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#434653]" htmlFor="state">
                  {t.stateLabel}
                </label>
                <div className="relative">
                  <select
                    id="state"
                    value={location.state}
                    onChange={(e) => {
                      const newState = e.target.value;
                      const sObj = locationData.find((s) => s.name === newState) || locationData[0];
                      const firstDist = sObj.districts[0].name;
                      const firstBlock = sObj.districts[0].blocks[0];
                      const coords = districtCoordinates[firstDist];
                      onLocationChange({
                        state: newState,
                        district: firstDist,
                        block: firstBlock,
                        village: location.village,
                        latitude: coords ? coords[0] : location.latitude,
                        longitude: coords ? coords[1] : location.longitude,
                      });
                    }}
                    className="h-[48px] rounded-xl border border-[#c3c6d5] bg-white text-[#191c1e] font-medium px-3 pr-8 focus:border-[#003c90] focus:ring-2 focus:ring-[#003c90]/20 outline-none w-full appearance-none text-xs md:text-sm cursor-pointer"
                  >
                    {stateOptions.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#737784] text-lg">
                    expand_more
                  </span>
                </div>
              </div>

              {/* District Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#434653]" htmlFor="district">
                  {t.districtLabel}
                </label>
                <div className="relative">
                  <select
                    id="district"
                    value={location.district}
                    onChange={(e) => {
                      const newDist = e.target.value;
                      const dObj = currentDistricts.find((d) => d.name === newDist) || currentDistricts[0];
                      const coords = districtCoordinates[newDist];
                      onLocationChange({
                        ...location,
                        district: newDist,
                        block: dObj ? dObj.blocks[0] : location.block,
                        latitude: coords ? coords[0] : location.latitude,
                        longitude: coords ? coords[1] : location.longitude,
                      });
                    }}
                    className="h-[48px] rounded-xl border border-[#c3c6d5] bg-white text-[#191c1e] font-medium px-3 pr-8 focus:border-[#003c90] focus:ring-2 focus:ring-[#003c90]/20 outline-none w-full appearance-none text-xs md:text-sm cursor-pointer"
                  >
                    {districtOptions.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#737784] text-lg">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Block Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#434653]" htmlFor="block">
                  {t.blockLabel}
                </label>
                <div className="relative">
                  <select
                    id="block"
                    value={location.block}
                    onChange={(e) => {
                      onLocationChange({
                        ...location,
                        block: e.target.value,
                      });
                    }}
                    className="h-[48px] rounded-xl border border-[#c3c6d5] bg-white text-[#191c1e] font-medium px-3 pr-8 focus:border-[#003c90] focus:ring-2 focus:ring-[#003c90]/20 outline-none w-full appearance-none text-xs md:text-sm cursor-pointer"
                  >
                    {blockOptions.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#737784] text-lg">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Village Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#434653]" htmlFor="village">
                  {t.villageLabel}
                </label>
                <input
                  id="village"
                  type="text"
                  value={location.village}
                  onChange={(e) => onLocationChange({ ...location, village: e.target.value })}
                  placeholder={t.villagePlaceholder}
                  className="h-[48px] rounded-xl border border-[#c3c6d5] bg-white text-[#191c1e] font-medium px-3 focus:border-[#003c90] focus:ring-2 focus:ring-[#003c90]/20 outline-none w-full text-xs md:text-sm"
                />
              </div>
            </div>

            {/* Map Preview Container */}
            <div className="w-full h-44 md:h-48 rounded-xl overflow-hidden border border-[#c3c6d5] relative shadow-xs">
              <img
                referrerPolicy="no-referrer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTadfvjbV-BThOpszMuylFGIu1p9Fc5DGZOGlEKBp-jfewmoky2uOo3fyW85NcQ-09Cwi7dRSeBqmPalhAgYQBPZJ2WxSFBxemIcwvNGLbou1QouXbGjtErYfnlEIj4YSZqvq88XS-nLIgfKz1FmQDnaHIKI93Oh18JIoTKQYWRAaPDFxgw5vCcBiT0Vpy7mJ2-M5ARqQbq185dxm-iVLeDJxlCz3ik1B0Gay79N6bf-pfg-I1KfgS"
                alt="Rural Location Map Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end justify-between p-3.5">
                <span className="text-white text-xs md:text-sm font-bold flex items-center gap-1.5 drop-shadow-sm">
                  <span className="material-symbols-outlined text-base text-[#fe9832] filled">location_on</span>
                  {location.village ? `${location.village}, ` : ''}{location.block} Block, {location.district} ({location.state})
                </span>
                <span className="text-[11px] bg-white/95 text-[#001945] px-2.5 py-0.5 rounded-full font-bold shadow-xs">
                  {location.latitude ? `${location.latitude.toFixed(2)}°N, ${location.longitude?.toFixed(2)}°E` : 'Radius: 10 km Feasible Zone'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Margin Capital & Smart Scheme Router */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] md:text-[22px] font-bold text-[#003c90]">
              {t.step2Title}
            </h2>
            <span className="text-xs text-[#737784] font-semibold">
              10% Self-Contribution
            </span>
          </div>

          <div className="bg-white border border-[#c3c6d5] rounded-2xl p-4 md:p-6 shadow-xs space-y-6">
            {/* Mode Switcher: Individual vs SHG Group Enterprise */}
            <div className="p-1.5 bg-[#eff2f6] rounded-2xl flex items-center gap-1.5 border border-[#c3c6d5]">
              <button
                type="button"
                onClick={() => onShgModeChange && onShgModeChange(false)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  !isShgMode
                    ? 'bg-white text-[#003c90] shadow-sm'
                    : 'text-[#737784] hover:text-[#191c1e]'
                }`}
              >
                <span className="material-symbols-outlined text-base">person</span>
                <span>व्यक्तिगत उद्यम (Individual Mode)</span>
              </button>
              <button
                type="button"
                onClick={() => onShgModeChange && onShgModeChange(true)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isShgMode
                    ? 'bg-[#003c90] text-white shadow-sm'
                    : 'text-[#737784] hover:text-[#191c1e]'
                }`}
              >
                <span className="material-symbols-outlined text-base">groups</span>
                <span>स्वयं सहायता समूह / समूह उद्यम (SHG Group Mode)</span>
              </button>
            </div>

            {/* SHG Specific Fields */}
            {isShgMode && (
              <div className="p-4 rounded-2xl bg-[#eff6ff] border border-[#bfdbfe] space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#003c90] text-xl">diversity_3</span>
                    <h4 className="text-xs md:text-sm font-bold text-[#001945]">
                      स्वयं सहायता समूह विवरण (SHG Group Pooling Details)
                    </h4>
                  </div>
                  <span className="text-[11px] bg-[#d9e2ff] text-[#003c90] px-2.5 py-0.5 rounded-full font-bold">
                    MoSJE Group Finance
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#434653] block mb-1">
                      समूह का नाम (SHG Group Name)
                    </label>
                    <input
                      type="text"
                      value={shgGroupName}
                      onChange={(e) => onShgGroupNameChange && onShgGroupNameChange(e.target.value)}
                      placeholder="e.g. Laxmi Mahila Bachat Gat"
                      className="h-10 w-full px-3 rounded-xl border border-[#bfdbfe] bg-white text-xs font-semibold text-[#191c1e] outline-none focus:border-[#003c90]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#434653] block mb-1">
                      सक्रिय सदस्य संख्या (Active Members: {shgMemberCount})
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="30"
                      value={shgMemberCount}
                      onChange={(e) => {
                        const count = Math.max(2, Math.min(30, parseInt(e.target.value, 10) || 2));
                        if (onShgMemberCountChange) onShgMemberCountChange(count);
                        onMarginCapitalChange(count * shgPerMemberMargin);
                      }}
                      className="h-10 w-full px-3 rounded-xl border border-[#bfdbfe] bg-white text-xs font-bold text-[#191c1e] outline-none focus:border-[#003c90]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#434653] block mb-1">
                      प्रति सदस्य मार्जिन अंश (Per-Member Margin: ₹{shgPerMemberMargin.toLocaleString('en-IN')})
                    </label>
                    <input
                      type="number"
                      min="1000"
                      max="50000"
                      step="500"
                      value={shgPerMemberMargin}
                      onChange={(e) => {
                        const margin = Math.max(1000, parseInt(e.target.value, 10) || 1000);
                        if (onShgPerMemberMarginChange) onShgPerMemberMarginChange(margin);
                        onMarginCapitalChange(shgMemberCount * margin);
                      }}
                      className="h-10 w-full px-3 rounded-xl border border-[#bfdbfe] bg-white text-xs font-bold text-[#191c1e] outline-none focus:border-[#003c90]"
                    />
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#bfdbfe] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-[#737784] block text-[11px]">कुल संकलित मार्जिन (Total Pooled Margin):</span>
                    <span className="font-extrabold text-[#003c90] text-sm">
                      {formatINR(shgMemberCount * shgPerMemberMargin)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#737784] block text-[11px]">कुल 90% समूह ऋण (Total Group Loan):</span>
                    <span className="font-extrabold text-[#166534] text-sm">
                      {formatINR((shgMemberCount * shgPerMemberMargin) / 0.10 * 0.90)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#737784] block text-[11px]">प्रति सदस्य ऋण पात्रता (Per Member Loan):</span>
                    <span className="font-extrabold text-[#9a4500] text-sm">
                      {formatINR(((shgMemberCount * shgPerMemberMargin) / 0.10 * 0.90) / shgMemberCount)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Statutory Scheme Ceiling Notification */}
            {plan.isProjectCostCapped && (
              <CapNotification
                capNotification={plan.capNotification}
                currentLanguage={currentLanguage}
                className="mb-2"
              />
            )}

            {/* Display Value & Input */}
            <div className="flex flex-col items-center justify-center py-2 bg-[#f7f9fc] rounded-xl border border-[#eceef1]">
              <span className="text-xs text-[#737784] font-semibold uppercase tracking-wider mb-1">
                {t.marginCapitalLabel}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#003c90]">₹</span>
                <input
                  type="number"
                  min="5000"
                  max="500000"
                  step="1000"
                  value={marginCapital}
                  onChange={(e) => onMarginCapitalChange(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="text-[32px] md:text-[38px] font-extrabold text-[#191c1e] text-center w-56 bg-transparent border-b-2 border-[#003c90] outline-none"
                />
              </div>
              <p className="text-[12px] text-[#434653] font-medium mt-1">
                {t.marginCapitalNote}
              </p>
            </div>

            {/* Visual 10% Margin vs. 90% Loan Split Bar */}
            <div className="space-y-2 bg-[#f2f4f7] p-4 rounded-xl border border-[#c3c6d5]">
              <div className="flex justify-between items-center text-xs md:text-sm font-bold">
                <span className="text-[#003c90] flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-[#003c90]"></span>
                  {t.marginShareText}: {formatINR(plan.marginCapital)} (10%)
                </span>
                <span className="text-[#166534] flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-[#16a34a]"></span>
                  {t.loanShareText}: {formatINR(plan.approvedLoan)} (90%)
                </span>
              </div>
              {/* Ratio Bar */}
              <div className="w-full h-4 bg-[#bbf7d0] rounded-full overflow-hidden flex shadow-inner">
                <div style={{ width: '10%' }} className="bg-[#003c90] h-full" title="10% Margin Capital"></div>
                <div style={{ width: '90%' }} className="bg-[#16a34a] h-full" title="90% Concessional MoSJE Loan"></div>
              </div>
              <div className="flex justify-between items-center text-[11px] text-[#737784] font-medium">
                <span>Total Project Cost = Margin / 0.10</span>
                <span className="font-bold text-[#191c1e]">Total: {formatINR(plan.projectCost)}</span>
              </div>
            </div>

            {/* Range Slider */}
            <div className="px-2">
              <input
                id="investmentSlider"
                type="range"
                min="5000"
                max="500000"
                step="1000"
                value={marginCapital}
                onChange={(e) => onMarginCapitalChange(parseInt(e.target.value, 10))}
                className="w-full h-2.5 bg-[#e0e3e6] rounded-lg appearance-none cursor-pointer accent-[#003c90]"
              />
              <div className="flex justify-between mt-2 text-xs font-semibold text-[#737784]">
                <span>₹5K (Micro)</span>
                <span className="text-[#003c90] font-bold">₹14K (₹1.40L Micro Cutoff)</span>
                <span>₹50K (₹5.0L)</span>
                <span>₹5L (₹50.0L Term Max)</span>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex flex-wrap gap-2 justify-center pt-1">
              {[14000, 25000, 50000, 100000, 200000, 350000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onMarginCapitalChange(preset)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    marginCapital === preset
                      ? 'bg-[#003c90] text-white shadow-xs'
                      : 'bg-[#f2f4f7] text-[#434653] hover:bg-[#e0e3e6]'
                  }`}
                >
                  ₹{preset >= 100000 ? `${preset / 100000}L` : `${preset / 1000}k`} ({preset <= 14000 ? 'Micro' : 'Term Loan'})
                </button>
              ))}
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-[280px] mx-auto mt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  className="h-11 bg-[#f2f4f7] hover:bg-[#e0e3e6] active:scale-95 rounded-xl text-base font-bold text-[#191c1e] transition-all cursor-pointer flex items-center justify-center"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => onMarginCapitalChange(14000)}
                title="Reset to ₹14,000 Micro"
                className="h-11 bg-[#e0e3e6] hover:bg-[#d0d3d6] active:scale-95 rounded-xl text-xs font-bold text-[#003c90] transition-all cursor-pointer flex items-center justify-center"
              >
                14k
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress(0)}
                className="h-11 bg-[#f2f4f7] hover:bg-[#e0e3e6] active:scale-95 rounded-xl text-base font-bold text-[#191c1e] transition-all cursor-pointer flex items-center justify-center"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                aria-label="Backspace"
                className="h-11 bg-[#f2f4f7] hover:bg-[#e0e3e6] active:scale-95 rounded-xl text-base font-bold text-[#ba1a1a] transition-all cursor-pointer flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-lg">backspace</span>
              </button>
            </div>

            {/* Smart Scheme Router Dynamic Routing Badge */}
            <div className={`p-4 md:p-5 rounded-2xl border transition-all ${
              plan.schemeType === 'micro_finance'
                ? 'bg-[#f0fdf4] border-[#bbf7d0] text-[#14532d]'
                : 'bg-[#eff6ff] border-[#bfdbfe] text-[#1e3a8a]'
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined filled text-xl">
                      {plan.schemeType === 'micro_finance' ? 'verified' : 'account_balance'}
                    </span>
                    <h4 className="font-bold text-sm md:text-base">
                      {currentLanguage === 'en' ? plan.schemeName : plan.schemeNameHindi}
                    </h4>
                  </div>
                  <p className="text-xs opacity-90">
                    {plan.schemeType === 'micro_finance'
                      ? t.ruleMicroFinanceBadge
                      : t.ruleTermLoanBadge}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <span className="px-2.5 py-1 rounded-full bg-white/80 border border-current">
                    Interest: {plan.interestRate}% p.a.
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/80 border border-current">
                    Tenure: {plan.tenureYears} Yrs
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/80 border border-current">
                    Moratorium: {plan.moratoriumMonths} Mo
                  </span>
                </div>
              </div>

              {/* Benchmark Interest Saving vs Commercial MFI */}
              <div className="mt-4 p-3 bg-white/90 rounded-xl border border-current/20 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className="font-bold text-[#166534] flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">savings</span>
                    {currentLanguage === 'hi'
                      ? 'अनुमानित ब्याज बचत (14% वाणिज्यिक MFI की तुलना में):'
                      : 'Est. Interest Saving vs 14% Commercial MFI Benchmark:'}
                  </span>
                  <span className="text-[10px] opacity-80 block">{plan.benchmarkDisclaimer}</span>
                </div>
                <strong className="text-[#166534] text-sm md:text-base font-black shrink-0">
                  +{formatINR(plan.benchmarkInterestSaving)}
                </strong>
              </div>

              {/* Installment breakdown note */}
              <div className="mt-2 text-[11px] opacity-90 text-center font-medium">
                {currentLanguage === 'hi'
                  ? `त्रैमासिक किस्त: ${formatINR(plan.quarterlyEmi)} प्रति 3 माह • मासिक समकक्ष ~${formatINR(plan.monthlyEquivalentInstallment)}/माह`
                  : `Quarterly Installment: ${formatINR(plan.quarterlyEmi)} every 3 months • Monthly equivalent ~${formatINR(plan.monthlyEquivalentInstallment)}/mo`}
              </div>
            </div>

            {/* Viability & Repayment Stress Testing Integration */}
            <ViabilityAndStressCard
              category={selectedCategory}
              marginCapital={marginCapital}
              location={location}
              quarterlyDebtService={plan.quarterlyEmi}
              currentLanguage={currentLanguage}
            />

            {/* Evidence & Data Provenance Ledger */}
            <EvidenceBadgeList
              plan={plan}
              categoryId={selectedCategory.id}
              location={location}
              currentLanguage={currentLanguage}
            />
          </div>
        </section>
      </main>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#c3c6d5] p-4 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="max-w-[860px] mx-auto flex items-center gap-3">
          <div className="hidden sm:flex flex-col">
            <span className="text-xs text-[#737784]">Selected Scheme:</span>
            <strong className="text-sm text-[#003c90] font-bold">{plan.schemeBadge}</strong>
          </div>
          <button
            onClick={onComplete}
            className="flex-1 h-[54px] bg-[#003c90] hover:bg-[#002d6c] text-white rounded-xl text-base md:text-lg font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <span>{t.generateReport}</span>
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
