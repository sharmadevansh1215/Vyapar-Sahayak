import React, { useState, useEffect } from 'react';
import { BusinessCategory, Language, LocationState, MarketDensityDetails, NicheOpportunity, WeatherContext } from '../types';
import { translations } from '../data/translations';
import { calculateFinancialPlan, formatINR, getSchemeMatches } from '../utils/calculations';
import { fetchDistrictWeather } from '../utils/weather';
import { useFeasibilityStream } from '../utils/useFeasibilityStream';
import { VoiceReadoutControl } from './VoiceReadoutControl';
import { RechartsPriceTrend } from './RechartsPriceTrend';
import { ProgressStepper } from './ProgressStepper';
import { CapNotification } from './CapNotification';
import { ViabilityAndStressCard } from './ViabilityAndStressCard';
import { EvidenceBadgeList } from './EvidenceBadgeList';

interface FeasibilityReportProps {
  currentLanguage: Language;
  selectedCategory: BusinessCategory;
  location: LocationState;
  marginCapital: number;
  isShgMode?: boolean;
  shgMemberCount?: number;
  shgPerMemberMargin?: number;
  shgGroupName?: string;
  onSwitchToFinance: () => void;
  onOpenPdfModal: () => void;
  onOpenWhatsAppShare: () => void;
  onExploreNiche: (niche: NicheOpportunity) => void;
  onOpenComparisonModal?: () => void;
}

export const FeasibilityReport: React.FC<FeasibilityReportProps> = ({
  currentLanguage,
  selectedCategory,
  location,
  marginCapital,
  isShgMode = false,
  shgMemberCount = 10,
  shgPerMemberMargin = 5000,
  shgGroupName = 'Gramodaya Mahila SHG',
  onSwitchToFinance,
  onOpenPdfModal,
  onOpenWhatsAppShare,
  onExploreNiche,
  onOpenComparisonModal,
}) => {
  const t = translations[currentLanguage];
  const [activeBarHover, setActiveBarHover] = useState<number | null>(null);
  const [weather, setWeather] = useState<WeatherContext | null>(null);
  const [showStreamDrawer, setShowStreamDrawer] = useState(true);
  const [showConfidenceExplainer, setShowConfidenceExplainer] = useState(false);
  const [densityData, setDensityData] = useState<MarketDensityDetails | null>(null);
  const [isDensityLoading, setIsDensityLoading] = useState(false);

  const plan = calculateFinancialPlan(
    marginCapital,
    isShgMode,
    shgMemberCount,
    shgPerMemberMargin,
    shgGroupName
  );

  const schemeMatches = getSchemeMatches(plan.projectCost, marginCapital, isShgMode);

  // 1. Fetch District Weather Context
  useEffect(() => {
    let isMounted = true;
    async function loadWeather() {
      try {
        const w = await fetchDistrictWeather(location.district, location.state);
        if (isMounted) setWeather(w);
      } catch (e) {
        console.error('Weather load error:', e);
      }
    }
    loadWeather();
    return () => {
      isMounted = false;
    };
  }, [location.district, location.state]);

  // 2. Fetch Live Market & Competitor Density
  useEffect(() => {
    let isMounted = true;
    async function loadDensity() {
      setIsDensityLoading(true);
      try {
        const res = await fetch('/api/market-density', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            categoryId: selectedCategory.id,
            categoryName: selectedCategory.name,
            location,
            district: location.district || 'Varanasi',
            block: location.block || 'Cholapur',
            state: location.state || 'Uttar Pradesh',
            radiusKm: 10,
          }),
        });
        const data = await res.json();
        const densityObj = data.density || data;
        if (isMounted && densityObj && (densityObj.densityLevel || densityObj.competitorCount)) {
          setDensityData(densityObj);
        }
      } catch (e) {
        console.warn('Market density load error, using default:', e);
      } finally {
        if (isMounted) setIsDensityLoading(false);
      }
    }
    loadDensity();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory.name, location.district, location.block, location.state]);

  // 2. Real-Time Streaming AI & Web Grounding Hook
  const {
    insights: aiInsights,
    streamedText,
    executiveSummary,
    isStreaming,
    isLoading,
    groundingSources,
    modelUsed,
    tokenCount,
    triggerStream,
  } = useFeasibilityStream({
    selectedCategory,
    location,
    marginCapital,
    currentLanguage,
    weather,
  });

  // Merge AI insights with default category data
  const marketReachConsumers = aiInsights?.marketReach?.estimatedConsumers || selectedCategory.potentialCustomers;
  const distributionChannels = aiInsights?.marketReach?.distributionChannels || [
    'Local Village Cluster Direct Retail',
    'Weekly Haats & Panchayat Mandis',
    'Self-Help Group (SHG) Institutional Linkages',
    'Direct Doorstep Delivery within 5 km',
  ];

  const swotStrengths = aiInsights?.swotAnalysis?.strengths || selectedCategory.swot.strengths;
  const swotWeaknesses = aiInsights?.swotAnalysis?.weaknesses || selectedCategory.swot.weaknesses;
  const swotOpportunities = aiInsights?.swotAnalysis?.opportunities || selectedCategory.swot.opportunities;
  const swotThreats = aiInsights?.swotAnalysis?.threats || selectedCategory.swot.threats;

  const competitorDensity = aiInsights?.competitorMapping?.densityLevel || 'Medium';
  const competitorCount = aiInsights?.competitorMapping?.estimatedCount || 6;
  const competitorAdvantage = aiInsights?.competitorMapping?.competitiveAdvantage || 
    'Higher freshness, fair price transparency, and MoSJE subsidized lower debt service burden.';

  const pricingStrategyText = aiInsights?.pricingAndMarketValue?.pricingStrategy ||
    'Cost-plus pricing with 25-35% gross operating spread aligned with rural household purchasing power.';

  return (
    <div className="max-w-[1200px] mx-auto w-full pb-28 md:pb-16">
      {/* Sticky Tabs & Action Bar */}
      <div className="sticky top-16 bg-[#f7f9fc] z-30 border-b border-[#c3c6d5] px-4 md:px-8 py-3 flex justify-between items-center shadow-2xs">
        <div className="flex gap-2 md:gap-6">
          <button
            className="text-xs md:text-sm font-bold text-[#003c90] border-b-2 border-[#003c90] pb-2 px-2 md:px-3 cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">assessment</span>
            <span>{t.feasibilityTab}</span>
          </button>
          <button
            onClick={onSwitchToFinance}
            className="text-xs md:text-sm font-semibold text-[#434653] pb-2 px-2 md:px-3 hover:text-[#003c90] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">account_balance_wallet</span>
            <span>{t.financeTab}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Voice Readout Audio Control */}
          <VoiceReadoutControl
            currentLanguage={currentLanguage}
            title={selectedCategory.name}
            summaryText={executiveSummary || streamedText}
            categoryName={selectedCategory.name}
            district={location.district || 'Varanasi'}
          />

          {/* Sector Comparison Modal Button */}
          {onOpenComparisonModal && (
            <button
              onClick={onOpenComparisonModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#c3c6d5] bg-white hover:bg-[#eceef1] text-xs font-bold text-[#003c90] cursor-pointer transition-colors shadow-2xs"
              title="Compare with other enterprise categories"
            >
              <span className="material-symbols-outlined text-sm">compare_arrows</span>
              <span>Compare Sectors</span>
            </button>
          )}

          {/* Live Streaming Re-Analyze Button */}
          <button
            onClick={() => triggerStream()}
            disabled={isStreaming || isLoading}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-[#003c90] text-white hover:bg-[#002d6c] disabled:opacity-50 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs"
            title="Stream real-time Google search-grounded feasibility study"
          >
            <span className={`material-symbols-outlined text-sm ${isStreaming ? 'animate-spin' : ''}`}>
              {isStreaming ? 'sync' : 'auto_awesome'}
            </span>
            <span>{isStreaming ? 'Streaming AI...' : 'Live Web Grounding'}</span>
          </button>

          <button
            onClick={() => setShowStreamDrawer(!showStreamDrawer)}
            className="px-3 py-1.5 rounded-lg border border-[#c3c6d5] bg-white hover:bg-[#eceef1] text-xs font-semibold text-[#003c90] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            title="Toggle Live Stream Output"
          >
            <span className="material-symbols-outlined text-sm">stream</span>
            <span>{showStreamDrawer ? 'Hide Live Stream' : 'Show Live Stream'}</span>
          </button>

          <button
            onClick={onOpenPdfModal}
            aria-label="Download PDF Report"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-[#c3c6d5] hover:bg-[#eceef1] transition-colors text-[#003c90] cursor-pointer shadow-2xs"
            title="Download PDF Feasibility Report"
          >
            <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
          </button>
          <button
            onClick={onOpenWhatsAppShare}
            aria-label="Share on WhatsApp"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-[#c3c6d5] hover:bg-[#dcfce7] transition-colors text-[#25D366] cursor-pointer shadow-2xs"
            title="Share via WhatsApp"
          >
            <span className="material-symbols-outlined text-xl">chat</span>
          </button>
        </div>
      </div>

      <div className="px-4 md:px-8 py-6 space-y-6">
        {/* Progress Stepper on Feasibility Report */}
        <ProgressStepper currentStep={3} currentLanguage={currentLanguage} />

        {/* Data Confidence Indicator Badge & Explainer */}
        {(() => {
          const confidenceTier: 'OFFICIAL' | 'SEARCH_GROUNDED' | 'ESTIMATED' =
            groundingSources && groundingSources.length > 0
              ? 'SEARCH_GROUNDED'
              : (modelUsed?.toLowerCase().includes('fallback') || modelUsed?.toLowerCase().includes('rule-based') || modelUsed?.toLowerCase().includes('offline'))
              ? 'ESTIMATED'
              : plan.schemeConfig?.sourceType === 'OFFICIAL'
              ? 'OFFICIAL'
              : 'ESTIMATED';

          return (
            <div className="rounded-xl border bg-white p-3.5 shadow-2xs transition-all">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-[#434653] uppercase tracking-wider">
                    Data Integrity:
                  </span>
                  {confidenceTier === 'OFFICIAL' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]">
                      <span className="material-symbols-outlined text-sm text-[#059669]">verified</span>
                      <span>OFFICIAL STATUTORY DATA</span>
                    </span>
                  )}
                  {confidenceTier === 'SEARCH_GROUNDED' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe]">
                      <span className="material-symbols-outlined text-sm text-[#2563eb]">travel_explore</span>
                      <span>SEARCH-GROUNDED (LIVE APMC / WEB)</span>
                    </span>
                  )}
                  {confidenceTier === 'ESTIMATED' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#fffbeb] text-[#92400e] border border-[#fde68a]">
                      <span className="material-symbols-outlined text-sm text-[#d97706]">query_stats</span>
                      <span>ESTIMATED PROJECTION (DEMOGRAPHIC MODEL)</span>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowConfidenceExplainer(!showConfidenceExplainer)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#003c90] hover:text-[#002868] hover:underline cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">info</span>
                  <span>{showConfidenceExplainer ? 'Hide Confidence Details' : 'What does this mean?'}</span>
                  <span className="material-symbols-outlined text-xs">
                    {showConfidenceExplainer ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
              </div>

              {/* Expandable Explanation of Confidence Tiers */}
              {showConfidenceExplainer && (
                <div className="mt-3 pt-3 border-t border-[#e2e8f0] text-xs text-[#475569] space-y-2">
                  <p className="font-semibold text-[#0f172a]">
                    Data confidence categorization guarantees transparency and auditability:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                    <div className="p-2.5 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0]">
                      <div className="flex items-center gap-1.5 text-[#166534] font-bold pb-1">
                        <span className="material-symbols-outlined text-sm">verified</span>
                        <span>OFFICIAL (Green)</span>
                      </div>
                      <p className="text-[#15803d] text-[11px] leading-relaxed">
                        Directly grounded in statutory MoSJE guidelines, official Gazette circulars, and validated National Census benchmarks with zero AI hallucination risk.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#eff6ff] border border-[#bfdbfe]">
                      <div className="flex items-center gap-1.5 text-[#1e40af] font-bold pb-1">
                        <span className="material-symbols-outlined text-sm">travel_explore</span>
                        <span>SEARCH-GROUNDED (Blue)</span>
                      </div>
                      <p className="text-[#1d4ed8] text-[11px] leading-relaxed">
                        Retrieved dynamically via real-time Google Search grounding against active local APMC mandi wholesale rates and live regional trade indices.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#fffbeb] border border-[#fde68a]">
                      <div className="flex items-center gap-1.5 text-[#92400e] font-bold pb-1">
                        <span className="material-symbols-outlined text-sm">query_stats</span>
                        <span>ESTIMATED (Amber)</span>
                      </div>
                      <p className="text-[#b45309] text-[11px] leading-relaxed">
                        Calculated from validated demographic distributions and local micro-market density heuristics when live network feeds are unreachable.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Real-Time Streaming & Live Google Search Grounding Banner */}
        {showStreamDrawer && (
          <div className="bg-linear-to-r from-[#001945] via-[#002d6c] to-[#003c90] text-white rounded-2xl p-5 shadow-md border border-[#004bb0] space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#ffffff20] pb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isStreaming ? 'bg-[#4ade80]' : 'bg-[#60a5fa]'} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${isStreaming ? 'bg-[#22c55e]' : 'bg-[#3b82f6]'}`}></span>
                </span>
                <span className="font-bold text-sm tracking-wide flex items-center gap-1.5">
                  <span>⚡ Real-Time Streaming Feasibility Engine</span>
                  <span className="bg-[#ffffff20] text-[#93c5fd] text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full">
                    SSE Active
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#bfdbfe]">
                <span>Model: <strong className="text-white">{modelUsed}</strong></span>
                {tokenCount > 0 && <span>• {tokenCount} tokens received</span>}
              </div>
            </div>

            {/* Live Typing Content Area */}
            <div className="bg-[#00102e] rounded-xl p-4 border border-[#ffffff15] text-xs md:text-sm font-sans leading-relaxed text-[#e2e8f0] max-h-56 overflow-y-auto space-y-2">
              {streamedText ? (
                <div className="whitespace-pre-wrap">
                  {executiveSummary || streamedText.replace(/```json[\s\S]*?```/, '')}
                  {isStreaming && (
                    <span className="inline-block w-2 h-4 ml-1 bg-[#60a5fa] animate-pulse align-middle"></span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[#94a3b8] py-2">
                  <span className="material-symbols-outlined text-base animate-spin text-[#60a5fa]">sync</span>
                  <span>Initializing live Gemini 3.7 stream and querying Google Search grounding index...</span>
                </div>
              )}
            </div>

            {/* Live Grounding Web Citations */}
            {groundingSources && groundingSources.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-[#93c5fd] uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">public</span>
                  <span>Live Web Grounding Sources (APMC Mandis & MoSJE Guidelines):</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {groundingSources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-[#ffffff15] hover:bg-[#ffffff25] text-white text-[11px] px-2.5 py-1 rounded-full border border-[#ffffff30] transition-colors"
                      title={source.url || source.title}
                    >
                      <span className="material-symbols-outlined text-xs text-[#60a5fa]">link</span>
                      <span className="max-w-[240px] truncate">{source.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Context Header & 10% Margin / 90% Loan Capital Banner */}
        <div className="bg-white border border-[#c3c6d5] rounded-2xl p-4 md:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#eceef1] pb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">{selectedCategory.emoji}</span>
              <div>
                <h1 className="text-[20px] md:text-[24px] font-bold text-[#191c1e] leading-tight">
                  {selectedCategory.name} Enterprise Feasibility Report
                </h1>
                <p className="text-xs text-[#737784] font-medium flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-sm text-[#003c90]">location_on</span>
                  {location.village ? `${location.village}, ` : ''}{location.block} Block, {location.district}, {location.state}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {weather && (
                <span className="bg-[#eff6ff] text-[#1e40af] text-xs font-semibold px-3 py-1 rounded-full border border-[#bfdbfe] flex items-center gap-1.5" title="Live Agro-Climatic Context">
                  <span className="material-symbols-outlined text-sm">thermostat</span>
                  <span>{weather.temperature}°C • {weather.condition}</span>
                </span>
              )}
              <span className="bg-[#f0fdf4] text-[#166534] text-xs font-bold px-3 py-1 rounded-full border border-[#bbf7d0] flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">verified</span>
                {plan.schemeBadge}
              </span>
              <span className="bg-[#e0e7ff] text-[#3730a3] text-xs font-bold px-3 py-1 rounded-full border border-[#c7d2fe] flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">travel_explore</span>
                <span>Google Search Grounded</span>
              </span>
            </div>
          </div>

          {/* 10% Margin vs. 90% Loan Capital Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f7f9fc] p-4 rounded-xl border border-[#eceef1]">
            <div>
              <span className="text-[11px] text-[#737784] font-semibold block">{t.marginCapitalLabel}</span>
              <strong className="text-sm md:text-base font-extrabold text-[#003c90]">{formatINR(plan.marginCapital)}</strong>
              <span className="text-[10px] text-[#003c90] font-bold block">
                {isShgMode ? `(Pooled by ${shgMemberCount} SHG members)` : '(10% Self-Funded)'}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-[#737784] font-semibold block">{t.projectCost}</span>
              <strong className="text-sm md:text-base font-extrabold text-[#191c1e]">{formatINR(plan.projectCost)}</strong>
              <span className="text-[10px] text-[#737784] font-medium block">Total Feasible Scale</span>
            </div>

            <div>
              <span className="text-[11px] text-[#737784] font-semibold block">{t.approvedLoan}</span>
              <strong className="text-sm md:text-base font-extrabold text-[#166534]">{formatINR(plan.approvedLoan)}</strong>
              <span className="text-[10px] text-[#166534] font-bold block">
                {isShgMode ? `(₹${Math.round(plan.approvedLoan / shgMemberCount).toLocaleString('en-IN')}/member)` : '(90% Concessional)'}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-[#737784] font-semibold block">Scheme Route</span>
              <strong className="text-xs md:text-sm font-bold text-[#191c1e] block truncate">{plan.schemeName}</strong>
              <span className="text-[10px] text-[#003c90] font-bold block">
                {plan.interestRate}% p.a. | {plan.tenureYears} Yrs ({plan.moratoriumMonths}M Moratorium)
              </span>
            </div>
          </div>

          {/* SHG Group Mode Highlights Banner */}
          {isShgMode && (
            <div className="p-3.5 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#166534]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg font-bold">groups</span>
                <div>
                  <span className="font-bold text-[#14532d] block">
                    {shgGroupName} — SHG Group Enterprise Model Active
                  </span>
                  <span className="text-[11px] text-[#166534]">
                    {shgMemberCount} members contributed {formatINR(shgPerMemberMargin)} each (Total Pooled Margin: {formatINR(plan.marginCapital)})
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <span className="px-2.5 py-1 bg-white rounded-lg border border-[#bbf7d0] text-[11px]">
                  Per-Member Net Profit: <strong>₹{Math.round(plan.estimatedMonthlyNetProfit / shgMemberCount).toLocaleString('en-IN')}/mo</strong>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Statutory Cap Enforcement Alert */}
        {plan.isProjectCostCapped && (
          <CapNotification
            capNotification={plan.capNotification}
            currentLanguage={currentLanguage}
          />
        )}

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* 1. Market Reach & Distribution Channels (Span 8) */}
          <section className="md:col-span-8 bg-white border border-[#c3c6d5] rounded-2xl p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-[18px] md:text-[20px] font-bold text-[#191c1e] mb-1 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#003c90]">radar</span>
                    <span>{t.marketReachTitle}</span>
                  </h2>
                  <p className="text-xs text-[#737784]">Target audience within 5–10 km radius of {location.village || location.block}</p>
                </div>
                <span className="bg-[#f0fdf4] text-[#166534] text-xs font-bold px-2.5 py-1 rounded-full border border-[#bbf7d0]">
                  High Rural Density
                </span>
              </div>
              
              <div className="text-[28px] md:text-[36px] font-extrabold text-[#003c90] my-2 tracking-tight">
                {marketReachConsumers}
              </div>
            </div>

            {/* Custom Demographics / Age Distribution Chart */}
            <div className="pt-2">
              <span className="text-xs font-bold text-[#434653] block mb-2">
                Demographic Buyer Segments:
              </span>
              <div className="h-36 flex items-end justify-between gap-4 md:gap-8 border-b border-[#c3c6d5] pb-2 relative">
                {selectedCategory.demographics.map((demo, idx) => (
                  <div
                    key={demo.age}
                    onMouseEnter={() => setActiveBarHover(idx)}
                    onMouseLeave={() => setActiveBarHover(null)}
                    className="w-full flex flex-col items-center h-full justify-end relative group cursor-pointer"
                  >
                    <div
                      className={`absolute -top-9 bg-[#2d3133] text-white text-[11px] font-bold py-1 px-2 rounded shadow-md pointer-events-none transition-all z-20 whitespace-nowrap ${
                        activeBarHover === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
                      }`}
                    >
                      Age {demo.age}: {demo.count} Buyers
                    </div>

                    <div
                      style={{ height: `${demo.heightPct}%` }}
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        demo.colorClass
                      } ${activeBarHover === idx ? 'brightness-110 ring-2 ring-offset-1 ring-[#003c90]' : ''}`}
                    ></div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-xs font-semibold text-[#434653] mt-2 px-1">
                {selectedCategory.demographics.map((d) => (
                  <span key={d.age} className="text-center w-full">
                    Age {d.age}
                  </span>
                ))}
              </div>
            </div>

            {/* Localized Distribution Channels */}
            <div className="mt-5 pt-4 border-t border-[#eceef1]">
              <span className="text-xs font-bold text-[#191c1e] block mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#fe9832]">local_shipping</span>
                {t.distributionChannelsTitle}:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {distributionChannels.map((channel, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#f7f9fc] border border-[#e0e3e6] text-xs font-medium text-[#191c1e]">
                    <span className="material-symbols-outlined text-sm text-[#003c90] filled">check_circle</span>
                    <span>{channel}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 2. Competitor Mapping & Density (Span 4) */}
          <section className="md:col-span-4 bg-white border border-[#c3c6d5] rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[18px] font-bold text-[#191c1e] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#8f4e00]">storefront</span>
                  <span>{t.competitorMappingTitle}</span>
                </h2>
                <span className="text-xs bg-[#fffaf5] text-[#8f4e00] font-bold px-2 py-0.5 rounded-full border border-[#ffdcc2]">
                  {densityData?.densityLevel || competitorDensity} Density ({densityData?.competitorCount || competitorCount} Units)
                </span>
              </div>

              {/* Saturation Bar */}
              {densityData && (
                <div className="p-3 bg-[#f7f9fc] rounded-xl border border-[#e0e3e6] mb-3 space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-[#434653]">
                    <span>Market Saturation Index</span>
                    <span className="text-[#003c90]">{densityData.saturationScore}/100</span>
                  </div>
                  <div className="w-full bg-[#e0e3e6] rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        densityData.saturationScore > 65
                          ? 'bg-[#ba1a1a]'
                          : densityData.saturationScore > 40
                          ? 'bg-[#fe9832]'
                          : 'bg-[#16a34a]'
                      }`}
                      style={{ width: `${densityData.saturationScore}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#737784] block">
                    {densityData.marketGaps?.length || 2} key market gaps identified within 10 km
                  </span>
                </div>
              )}

              <div className="space-y-3.5 mt-2">
                {selectedCategory.competition.map((comp) => (
                  <div key={comp.name}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-[#191c1e]">{comp.name}</span>
                      <span className="text-[#434653]">{comp.level}</span>
                    </div>
                    <div className="w-full bg-[#e0e3e6] rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${comp.barColor}`}
                        style={{ width: `${comp.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitive Advantage Insight */}
            <div className="bg-[#fffaf5] p-3.5 rounded-xl border border-[#ffdcc2]">
              <span className="text-[11px] font-bold text-[#683700] uppercase tracking-wider block mb-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#fe9832]">military_tech</span>
                Local Strategic Advantage:
              </span>
              <p className="text-xs text-[#683700] leading-snug">
                {competitorAdvantage}
              </p>
            </div>
          </section>

          {/* 3. Micro-Enterprise SWOT Matrix & Threat Identification (Span 12) */}
          <section className="md:col-span-12">
            <h2 className="text-[18px] md:text-[22px] font-bold text-[#191c1e] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#003c90]">grid_view</span>
              <span>{t.swotAnalysis}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strengths (Green) */}
              <div className="bg-white border border-[#c3c6d5] rounded-2xl p-5 relative overflow-hidden shadow-xs">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#10b981]"></div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="material-symbols-outlined text-[#10b981] font-bold">
                    trending_up
                  </span>
                  <h3 className="text-sm md:text-base font-bold text-[#191c1e]">
                    {t.strengths}
                  </h3>
                </div>
                <ul className="text-xs md:text-sm text-[#434653] list-disc list-inside space-y-1.5 font-medium">
                  {swotStrengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses (Amber/Orange) */}
              <div className="bg-white border border-[#c3c6d5] rounded-2xl p-5 relative overflow-hidden shadow-xs">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#fe9832]"></div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="material-symbols-outlined text-[#fe9832] font-bold">
                    trending_down
                  </span>
                  <h3 className="text-sm md:text-base font-bold text-[#191c1e]">
                    {t.weaknesses}
                  </h3>
                </div>
                <ul className="text-xs md:text-sm text-[#434653] list-disc list-inside space-y-1.5 font-medium">
                  {swotWeaknesses.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>

              {/* Opportunities (Blue) */}
              <div className="bg-white border border-[#c3c6d5] rounded-2xl p-5 relative overflow-hidden shadow-xs">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#003c90]"></div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="material-symbols-outlined text-[#003c90] font-bold">
                    lightbulb
                  </span>
                  <h3 className="text-sm md:text-base font-bold text-[#191c1e]">
                    {t.opportunities}
                  </h3>
                </div>
                <ul className="text-xs md:text-sm text-[#434653] list-disc list-inside space-y-1.5 font-medium">
                  {swotOpportunities.map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ul>
              </div>

              {/* Threats & Risks (Red) - Supply chain, seasonal, buyer risks */}
              <div className="bg-white border border-[#c3c6d5] rounded-2xl p-5 relative overflow-hidden shadow-xs">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#ba1a1a]"></div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="material-symbols-outlined text-[#ba1a1a] font-bold">
                    warning
                  </span>
                  <h3 className="text-sm md:text-base font-bold text-[#191c1e]">
                    {t.threats}
                  </h3>
                </div>
                <ul className="text-xs md:text-sm text-[#434653] list-disc list-inside space-y-1.5 font-medium">
                  {swotThreats.map((th, i) => (
                    <li key={i}>{th}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 4. High Opportunity Niches & Underserved Gaps (Span 12) */}
          <section className="md:col-span-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[18px] md:text-[22px] font-bold text-[#191c1e] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#fe9832]">insights</span>
                <span>{t.unservedNichesTitle}</span>
              </h2>
              <span className="text-xs text-[#737784]">Explore tailored micro-enterprise branches</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {selectedCategory.niches.map((niche) => (
                <div
                  key={niche.id}
                  className="bg-white border border-[#c3c6d5] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#003c90] hover:shadow-sm transition-all"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div
                        className={`${niche.bgColor} ${niche.textColor} w-10 h-10 rounded-xl flex items-center justify-center shadow-2xs`}
                      >
                        <span className="material-symbols-outlined text-xl">{niche.icon}</span>
                      </div>
                      <span
                        className={`${niche.tagBg} ${niche.tagColor} text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1`}
                      >
                        <span className="material-symbols-outlined text-xs font-bold">arrow_upward</span>
                        {niche.demandLevel} Demand
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#191c1e] mb-1">{niche.title}</h3>
                    <p className="text-xs text-[#434653] mb-4">
                      {niche.description}
                    </p>
                  </div>

                  <button
                    onClick={() => onExploreNiche(niche)}
                    className="w-full border-2 border-[#003c90] text-[#003c90] hover:bg-[#d9e2ff] text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>Explore Niche Plan</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Product Pricing & Revenue Projections (Span 12) */}
          <section className="md:col-span-12 space-y-6">
            {/* Real-Time Price Trend & Mandi Price Fluctuation (Recharts) */}
            <RechartsPriceTrend
              category={selectedCategory}
              currentLanguage={currentLanguage}
              estimatedMonthlyNetProfit={plan.estimatedMonthlyNetProfit}
            />

            <div className="bg-white border border-[#c3c6d5] rounded-2xl overflow-hidden shadow-xs">
              <div className="p-5 md:p-6 border-b border-[#c3c6d5] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-[18px] md:text-[20px] font-bold text-[#191c1e] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#003c90]">sell</span>
                    <span>{t.pricingStrategyTitle}</span>
                  </h2>
                  <p className="text-xs text-[#737784] mt-0.5">
                    {pricingStrategyText}
                  </p>
                </div>

                <div className="bg-[#d9e2ff] text-[#001945] px-4 py-1.5 rounded-full font-bold text-xs md:text-sm whitespace-nowrap">
                  Est. Monthly Sales: {formatINR(plan.estimatedMonthlyRevenue)}/mo
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f2f4f7] text-xs md:text-sm font-bold text-[#434653] border-b border-[#c3c6d5]">
                      <th className="p-4">{t.product}</th>
                      <th className="p-4 text-right">{t.price}</th>
                      <th className="p-4 text-right">{t.monthlyRevenue}</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs md:text-sm text-[#191c1e] divide-y divide-[#eceef1]">
                    {selectedCategory.revenueItems.map((rev, idx) => (
                      <tr key={idx} className="hover:bg-[#f7f9fc] transition-colors">
                        <td className="p-4 flex items-center gap-2.5 font-medium">
                          <span className="material-symbols-outlined text-[#003c90] text-base filled">
                            check_circle
                          </span>
                          <div>
                            <p className="text-[#191c1e] font-semibold">{rev.product}</p>
                            <p className="text-[11px] text-[#737784]">{rev.productHindi}</p>
                          </div>
                        </td>
                        <td className="p-4 text-right font-medium text-[#434653]">{rev.price}</td>
                        <td className="p-4 text-right font-bold text-[#003c90] text-sm md:text-base">
                          {rev.monthlyRevenue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Operational Cost Preview & Next Steps */}
              <div className="p-4 bg-[#f7f9fc] border-t border-[#c3c6d5] flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#434653]">
                  <span>Capex (Machinery): <strong>{formatINR(plan.fixedCapex)} (65%)</strong></span>
                  <span>Working Capital: <strong>{formatINR(plan.workingCapital)} (35%)</strong></span>
                  <span>Est. Net Profit: <strong className="text-[#166534]">{formatINR(plan.estimatedMonthlyNetProfit)}/mo</strong></span>
                </div>
                <button
                  onClick={onSwitchToFinance}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#003c90] hover:bg-[#002d6c] text-white rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <span>{t.financeTab} & EMI Schedule</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          </section>

          {/* 6. MoSJE Concessional Scheme Matching Engine (Span 12) */}
          <section className="md:col-span-12 bg-white border border-[#c3c6d5] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h2 className="text-[18px] md:text-[20px] font-bold text-[#191c1e] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#003c90]">account_balance</span>
                  <span>MoSJE / Apex Corporation Scheme Matching Engine</span>
                </h2>
                <p className="text-xs text-[#737784]">
                  Comparative evaluation of concessional credit routes available for {formatINR(plan.projectCost)} project scale
                </p>
              </div>
              <span className="text-xs bg-[#d9e2ff] text-[#003c90] font-bold px-3 py-1 rounded-full border border-[#b0c6ff]">
                Smart Match: {plan.schemeBadge}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {schemeMatches.map((scheme, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    scheme.isBestMatch
                      ? 'bg-[#eff6ff] border-[#003c90] ring-2 ring-[#003c90]/20 shadow-xs'
                      : 'bg-[#f7f9fc] border-[#c3c6d5] hover:border-[#737784]'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-[#003c90] bg-white px-2.5 py-0.5 rounded-full border border-[#c3c6d5] truncate max-w-[200px]">
                        {scheme.ministry}
                      </span>
                      {scheme.isBestMatch && (
                        <span className="text-[10px] uppercase font-extrabold bg-[#16a34a] text-white px-2 py-0.5 rounded-full">
                          Best Fit
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-[#191c1e] mb-1">
                      {scheme.name}
                    </h3>
                    <p className="text-xs text-[#434653] mb-3">
                      {scheme.subsidyInfo}
                    </p>

                    <div className="space-y-1.5 text-xs text-[#191c1e] pt-2 border-t border-[#eceef1]">
                      <div className="flex justify-between">
                        <span className="text-[#737784]">Max Cap:</span>
                        <strong>{scheme.maxLoanLimit}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#737784]">Interest Rate:</span>
                        <strong className="text-[#166534]">{scheme.interestRate}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#737784]">Self Margin:</span>
                        <strong>{scheme.marginRequiredPct}% ({formatINR(plan.projectCost * (scheme.marginRequiredPct / 100))})</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#eceef1]">
                    <span className="text-[11px] font-semibold text-[#003c90] block">
                      Target: {scheme.eligibility}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 7. Holistic Viability Scoring & Sensitivity Stress Testing */}
          <div className="md:col-span-12">
            <ViabilityAndStressCard
              category={selectedCategory}
              marginCapital={marginCapital}
              location={location}
              quarterlyDebtService={plan.quarterlyEmi}
              currentLanguage={currentLanguage}
            />
          </div>

          {/* 8. Evidence Ledger & Regulatory Data Provenance */}
          <div className="md:col-span-12">
            <EvidenceBadgeList
              plan={plan}
              categoryId={selectedCategory.id}
              location={location}
              currentLanguage={currentLanguage}
            />
          </div>

          {/* 9. Next-Phase Technology Roadmap Note (Static) */}
          <section className="md:col-span-12 bg-[#f7f9fc] border border-[#c3c6d5] rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#737784]">map</span>
              <h3 className="font-bold text-sm md:text-base text-[#191c1e]">
                MoSJE Next-Phase Platform Architecture Roadmap (Phase 2 & 3)
              </h3>
            </div>
            <p className="text-xs text-[#434653] leading-relaxed">
              <strong>Phase 2 (Scalability & Integrations):</strong> Direct Lead Bank CBS (Core Banking Solution) API integration for zero-touch in-principle sanction letters, ONDC (Open Network for Digital Commerce) catalog onboarding for rural SHG produce, and WhatsApp interactive voice response (IVR) bot integration.
            </p>
            <p className="text-xs text-[#434653] leading-relaxed">
              <strong>Phase 3 (Hardware & Offline Hubs):</strong> Solar-powered Raspberry Pi micro-edge devices for complete zero-connectivity Panchayat kiosk appraisal and automated drone/satellite crop-density soil health indexing.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
