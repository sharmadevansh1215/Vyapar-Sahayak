/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Language,
  TabType,
  BusinessCategory,
  LocationState,
  NicheOpportunity,
  UserProfile,
} from './types';
import { categories } from './data/categories';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { OnboardingFlow } from './components/OnboardingFlow';
import { DashboardView } from './components/DashboardView';
import { SchemeCalculatorView } from './components/SchemeCalculatorView';
import { BusinessProfileView } from './components/BusinessProfileView';
import { SettingsView } from './components/SettingsView';
import { CategorySelection } from './components/CategorySelection';
import { SetupWizard } from './components/SetupWizard';
import { FeasibilityReport } from './components/FeasibilityReport';
import { FinancialRoadmap } from './components/FinancialRoadmap';
import { BankLocatorModal } from './components/BankLocatorModal';
import { DocumentUploadModal } from './components/DocumentUploadModal';
import { PdfReportModal } from './components/PdfReportModal';
import { WhatsAppShareModal } from './components/WhatsAppShareModal';
import { NicheExploreModal } from './components/NicheExploreModal';
import { GalleryView } from './components/GalleryView';
import { GeminiChatDrawer } from './components/GeminiChatDrawer';
import { CategoryComparisonModal } from './components/CategoryComparisonModal';
import { QuickStartGuideModal } from './components/QuickStartGuideModal';
import { useI18n } from './context/I18nContext';

export default function App() {
  // Core Application Language from I18n Context
  const { language: currentLanguage, setLanguage: setCurrentLanguage } = useI18n();

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('vyapar_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: 'Rameshwar Sharma',
      phone: '9876543210',
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      block: 'Cholapur',
      village: 'Chiragpur Village',
      businessType: 'dairy',
      marginCapital: 50000,
      isShg: true,
      shgGroupName: 'Gramodaya Mahila SHG',
      isVerified: true,
    };
  });

  // Onboarding flow control: true = entered dashboard, false = step-by-step onboarding
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('vyapar_onboarding_done') === 'true';
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory>(() => {
    try {
      const savedId = localStorage.getItem('vyapar_cat_id') || localStorage.getItem('mosje_cat_id');
      const found = categories.find((c) => c.id === savedId);
      return found || categories[0];
    } catch {
      return categories[0];
    }
  });

  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>(
    () => categories[0].subcategories[0]?.id || 'milk_prod'
  );

  const [location, setLocation] = useState<LocationState>(() => {
    try {
      const savedLoc = localStorage.getItem('vyapar_location') || localStorage.getItem('mosje_location');
      if (savedLoc) return JSON.parse(savedLoc);
    } catch {}
    return {
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      block: 'Cholapur',
      village: 'Chiragpur Village',
    };
  });

  const [marginCapital, setMarginCapital] = useState<number>(() => {
    try {
      const savedMargin = localStorage.getItem('vyapar_margin') || localStorage.getItem('mosje_margin');
      if (savedMargin) return Number(savedMargin) || 50000;
    } catch {}
    return 50000;
  });

  // SHG / Group Enterprise State
  const [isShgMode, setIsShgMode] = useState<boolean>(true);
  const [shgMemberCount, setShgMemberCount] = useState<number>(10);
  const [shgPerMemberMargin, setShgPerMemberMargin] = useState<number>(5000);
  const [shgGroupName, setShgGroupName] = useState<string>('Gramodaya Mahila SHG');

  // Sync to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('vyapar_lang', currentLanguage);
      localStorage.setItem('vyapar_cat_id', selectedCategory.id);
      localStorage.setItem('vyapar_location', JSON.stringify(location));
      localStorage.setItem('vyapar_margin', marginCapital.toString());
      if (userProfile) {
        localStorage.setItem('vyapar_user_profile', JSON.stringify(userProfile));
      }
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [currentLanguage, selectedCategory.id, location, marginCapital, userProfile]);

  // Modals state
  const [isBankLocatorOpen, setIsBankLocatorOpen] = useState<boolean>(false);
  const [isDocUploadOpen, setIsDocUploadOpen] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState<boolean>(false);
  const [isGeminiChatOpen, setIsGeminiChatOpen] = useState<boolean>(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState<boolean>(false);
  const [isQuickStartGuideOpen, setIsQuickStartGuideOpen] = useState<boolean>(false);
  const [selectedNiche, setSelectedNiche] = useState<NicheOpportunity | null>(null);

  // Register global toggle for chat
  React.useEffect(() => {
    (window as any).__toggleGeminiChat = () => {
      setIsGeminiChatOpen((prev) => !prev);
    };
    return () => {
      delete (window as any).__toggleGeminiChat;
    };
  }, []);

  // Offline/low-resource mode check
  const [isLowResourceMode, setIsLowResourceMode] = useState<boolean>(false);
  const [showLowResourceBanner, setShowLowResourceBanner] = useState<boolean>(true);

  React.useEffect(() => {
    fetch('/api/system-status')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.hasGeminiKey) {
          setIsLowResourceMode(true);
        }
      })
      .catch(() => {
        setIsLowResourceMode(true);
      });
  }, []);

  // Voice Readout state
  const [isReadingAudio, setIsReadingAudio] = useState<boolean>(false);

  // Audio Guidance using SpeechSynthesis
  const handleVoiceReadout = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isReadingAudio) {
      window.speechSynthesis.cancel();
      setIsReadingAudio(false);
      return;
    }

    let speechText = '';
    if (activeTab === 'dashboard') {
      speechText = currentLanguage === 'hi'
        ? `व्यापार सहायक डैशबोर्ड में आपका स्वागत है। आपका चयनित उद्यम ${selectedCategory.nameHindi} है। आपका 10 प्रतिशत मार्जिन निवेश ₹${marginCapital.toLocaleString('en-IN')} है, जिसपर MoSJE द्वारा 90 प्रतिशत रियायती ऋण ₹${(marginCapital * 9).toLocaleString('en-IN')} स्वीकृत किया जा सकता है।`
        : `Welcome to Vyapar Sahayak. Active enterprise is ${selectedCategory.name} in ${location.district}. Your 10% self-margin of ₹${marginCapital.toLocaleString('en-IN')} unlocks a 90% concessional loan of ₹${(marginCapital * 9).toLocaleString('en-IN')}.`;
    } else if (activeTab === 'calculator') {
      speechText = currentLanguage === 'hi'
        ? `ऋण कैलकुलेटर में 6.5 प्रतिशत रियायती ब्याज दर पर तिमाही किस्त की गणना उपलब्ध है। 3 महीने का प्रारंभिक मोराटोरियम मिलेगा।`
        : `Scheme calculator shows 6.5% subsidized interest with 3-month moratorium and quarterly EMI schedule.`;
    } else if (activeTab === 'reports') {
      speechText = currentLanguage === 'hi'
        ? `10 किलोमीटर के दायरे में लगभग 8,450 संभावित ग्राहक हैं। ${selectedCategory.nameHindi} में स्थानीय मांग बहुत अधिक है।`
        : `Within 10 kilometers there are approximately 8450 customers with high local demand.`;
    } else if (activeTab === 'profile') {
      speechText = currentLanguage === 'hi'
        ? `उद्यमी प्रोफाइल: ${userProfile?.name || 'रामेश्वर शर्मा'}, गाँव ${location.village}, ज़िला ${location.district}। आधार एवं जाति प्रमाण पत्र सत्यापित हैं।`
        : `Entrepreneur profile for ${userProfile?.name || 'Rameshwar Sharma'} in ${location.district}. KYC documents are verified.`;
    } else {
      speechText = currentLanguage === 'hi'
        ? 'व्यापार सहायक: अपनी भाषा, ऑडियो गाइड और सेटिंग्स यहाँ प्रबंधित करें।'
        : 'Vyapar Sahayak: Configure language, audio assistance, and application settings here.';
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsReadingAudio(false);
    utterance.onerror = () => setIsReadingAudio(false);

    setIsReadingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // Onboarding completion handler
  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setOnboardingCompleted(true);
    try {
      localStorage.setItem('vyapar_user_profile', JSON.stringify(profile));
      localStorage.setItem('vyapar_onboarding_done', 'true');
    } catch {}

    // Update location and financial parameters
    setLocation({
      state: profile.state,
      district: profile.district,
      block: profile.block,
      village: profile.village,
    });
    setMarginCapital(profile.marginCapital);
    if (profile.isShg) {
      setIsShgMode(true);
      if (profile.shgGroupName) setShgGroupName(profile.shgGroupName);
    }

    // Match business category
    const matchingCat = categories.find((c) => c.id === profile.businessType) || categories[0];
    setSelectedCategory(matchingCat);
    setActiveTab('dashboard');
  };

  // Switch account / restart onboarding
  const handleRestartOnboarding = () => {
    try {
      localStorage.removeItem('vyapar_onboarding_done');
    } catch {}
    setOnboardingCompleted(false);
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const next = prev ? { ...prev, ...updated } : ({ name: 'Rameshwar', ...updated } as UserProfile);
      try {
        localStorage.setItem('vyapar_user_profile', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // IF ONBOARDING IS NOT COMPLETED, SHOW ONBOARDING FLOW
  if (!onboardingCompleted) {
    return (
      <OnboardingFlow
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onComplete={handleOnboardingComplete}
        initialProfile={userProfile || undefined}
      />
    );
  }

  // MAIN APPLICATION INTERFACE (With Responsive Sidebar + Header + BottomNav)
  return (
    <div className="min-h-screen flex bg-[#f7f9fc] text-[#0f172a]">
      {/* Desktop Sidebar (visible on md:) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentLanguage={currentLanguage}
        userProfile={userProfile}
        onLogout={handleRestartOnboarding}
        onOpenQuickStart={() => setIsQuickStartGuideOpen(true)}
        onToggleGeminiChat={() => setIsGeminiChatOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Streamlined Header (Clean branding, voice guide, language selector) */}
        <Header
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onVoiceReadout={handleVoiceReadout}
          isReading={isReadingAudio}
          userProfile={userProfile}
          onToggleGeminiChat={() => setIsGeminiChatOpen(true)}
        />

        {/* Offline / Low-Resource Fallback Notification Banner */}
        {isLowResourceMode && showLowResourceBanner && (
          <div
            id="offline-mode-banner"
            className="bg-[#fffbeb] border-b border-[#fde68a] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#92400e] z-20 transition-all shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#d97706] text-base">cloud_off</span>
              <span>
                <strong>Operating in Offline/Low-Resource Mode:</strong> Using validated demographic heuristics and statutory MoSJE formulas. AI-generated real-time market data is simulated.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#fef3c7] text-[#78350f] px-2 py-0.5 rounded border border-[#fcd34d]">
                Deterministic Mode Active
              </span>
              <button
                type="button"
                onClick={() => setShowLowResourceBanner(false)}
                className="text-[#92400e] hover:text-[#451a03] p-1 rounded transition-colors cursor-pointer"
                aria-label="Dismiss offline banner"
                title="Dismiss"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Main Body Content */}
        <main className="flex-1 pb-20 md:pb-8 overflow-y-auto">
          {/* 1. Dashboard / Home Tab */}
          {activeTab === 'dashboard' && (
            <DashboardView
              currentLanguage={currentLanguage}
              userProfile={userProfile}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              location={location}
              marginCapital={marginCapital}
              onOpenReports={() => setActiveTab('reports')}
              onOpenCalculator={() => setActiveTab('calculator')}
              onOpenBankLocator={() => setIsBankLocatorOpen(true)}
              onOpenPdfModal={() => setIsPdfModalOpen(true)}
              onOpenGeminiChat={() => setIsGeminiChatOpen(true)}
              onOpenProfile={() => setActiveTab('profile')}
              onOpenDocUpload={() => setIsDocUploadOpen(true)}
            />
          )}

          {/* 2. Scheme Calculator Tab */}
          {activeTab === 'calculator' && (
            <SchemeCalculatorView
              currentLanguage={currentLanguage}
              selectedCategory={selectedCategory}
              marginCapital={marginCapital}
              onMarginCapitalChange={setMarginCapital}
              location={location}
              onOpenBankLocator={() => setIsBankLocatorOpen(true)}
              onOpenPdfModal={() => setIsPdfModalOpen(true)}
              onOpenDocUpload={() => setIsDocUploadOpen(true)}
            />
          )}

          {/* 3. Business Profile Tab */}
          {activeTab === 'profile' && (
            <BusinessProfileView
              currentLanguage={currentLanguage}
              userProfile={userProfile}
              onUpdateProfile={handleUpdateProfile}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              location={location}
              onLocationChange={setLocation}
              marginCapital={marginCapital}
              onMarginCapitalChange={setMarginCapital}
              onOpenBankLocator={() => setIsBankLocatorOpen(true)}
              onOpenDocUpload={() => setIsDocUploadOpen(true)}
              onRestartOnboarding={handleRestartOnboarding}
            />
          )}

          {/* 4. Settings & Misc Tab */}
          {activeTab === 'settings' && (
            <SettingsView
              currentLanguage={currentLanguage}
              onLanguageChange={setCurrentLanguage}
              onOpenQuickStart={() => setIsQuickStartGuideOpen(true)}
              onRestartOnboarding={handleRestartOnboarding}
              userProfile={userProfile}
            />
          )}

          {/* Feasibility Report Screen */}
          {activeTab === 'reports' && (
            <FeasibilityReport
              currentLanguage={currentLanguage}
              selectedCategory={selectedCategory}
              location={location}
              marginCapital={marginCapital}
              isShgMode={isShgMode}
              shgMemberCount={shgMemberCount}
              shgPerMemberMargin={shgPerMemberMargin}
              shgGroupName={shgGroupName}
              onSwitchToFinance={() => setActiveTab('calculator')}
              onOpenPdfModal={() => setIsPdfModalOpen(true)}
              onOpenWhatsAppShare={() => setIsWhatsAppModalOpen(true)}
              onExploreNiche={(niche) => setSelectedNiche(niche)}
              onOpenComparisonModal={() => setIsComparisonModalOpen(true)}
            />
          )}

          {/* Grants & Financial Roadmap Screen */}
          {activeTab === 'grants' && (
            <FinancialRoadmap
              currentLanguage={currentLanguage}
              selectedCategory={selectedCategory}
              marginCapital={marginCapital}
              isShgMode={isShgMode}
              shgMemberCount={shgMemberCount}
              shgPerMemberMargin={shgPerMemberMargin}
              shgGroupName={shgGroupName}
              onBackToDashboard={() => setActiveTab('dashboard')}
              onOpenBankLocator={() => setIsBankLocatorOpen(true)}
              onOpenDocUpload={() => setIsDocUploadOpen(true)}
              onDownloadBrochure={() => setIsPdfModalOpen(true)}
            />
          )}

          {/* Category Selection Screen */}
          {activeTab === 'category' && (
            <CategorySelection
              currentLanguage={currentLanguage}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedSubcategoryId={selectedSubcategoryId}
              onSelectSubcategory={setSelectedSubcategoryId}
              onProceedToWizard={() => setActiveTab('wizard')}
              onDirectReport={() => setActiveTab('reports')}
            />
          )}

          {/* Setup Wizard Screen */}
          {activeTab === 'wizard' && (
            <SetupWizard
              currentLanguage={currentLanguage}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              location={location}
              onLocationChange={setLocation}
              marginCapital={marginCapital}
              onMarginCapitalChange={setMarginCapital}
              isShgMode={isShgMode}
              onShgModeChange={setIsShgMode}
              shgMemberCount={shgMemberCount}
              onShgMemberCountChange={setShgMemberCount}
              shgPerMemberMargin={shgPerMemberMargin}
              onShgPerMemberMarginChange={setShgPerMemberMargin}
              shgGroupName={shgGroupName}
              onShgGroupNameChange={setShgGroupName}
              onBack={() => setActiveTab('dashboard')}
              onComplete={() => {
                confetti({
                  particleCount: 60,
                  spread: 70,
                  origin: { y: 0.6 },
                });
                setActiveTab('reports');
              }}
            />
          )}

          {/* Gallery View */}
          {activeTab === 'gallery' && (
            <GalleryView
              currentLanguage={currentLanguage}
              selectedCategory={selectedCategory}
            />
          )}
        </main>

        {/* Floating Quick Start / Help Trigger (mobile & desktop) */}
        <button
          onClick={() => setIsQuickStartGuideOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-4 z-40 bg-[#0a3663] hover:bg-[#082a4d] text-white p-3 rounded-full shadow-lg border-2 border-white flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
          title="Quick Start & User Guide"
          aria-label="Quick Start Guide"
        >
          <span className="material-symbols-outlined text-xl">help</span>
        </button>

        {/* Mobile Bottom Navigation (docked on mobile) */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currentLanguage={currentLanguage}
        />
      </div>

      {/* Modals & Dialog Overlays */}
      <QuickStartGuideModal
        isOpen={isQuickStartGuideOpen}
        onClose={() => setIsQuickStartGuideOpen(false)}
        currentLanguage={currentLanguage}
      />

      <CategoryComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setIsComparisonModalOpen(false);
          setActiveTab('reports');
        }}
        currentLanguage={currentLanguage}
        marginCapital={marginCapital}
      />

      <GeminiChatDrawer
        isOpen={isGeminiChatOpen}
        onClose={() => setIsGeminiChatOpen(false)}
        currentLanguage={currentLanguage}
        selectedCategory={selectedCategory}
        location={location}
        marginCapital={marginCapital}
      />

      <BankLocatorModal
        isOpen={isBankLocatorOpen}
        onClose={() => setIsBankLocatorOpen(false)}
        currentLanguage={currentLanguage}
      />

      <DocumentUploadModal
        isOpen={isDocUploadOpen}
        onClose={() => setIsDocUploadOpen(false)}
        currentLanguage={currentLanguage}
        userProfile={userProfile}
        onUploadSuccess={() => {
          // Handled inside modal
        }}
      />

      <PdfReportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        currentLanguage={currentLanguage}
        selectedCategory={selectedCategory}
        location={location}
        marginCapital={marginCapital}
        isShgMode={isShgMode}
        shgMemberCount={shgMemberCount}
        shgPerMemberMargin={shgPerMemberMargin}
      />

      <WhatsAppShareModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        selectedCategory={selectedCategory}
        location={location}
        marginCapital={marginCapital}
      />

      <NicheExploreModal
        niche={selectedNiche}
        onClose={() => setSelectedNiche(null)}
        currentLanguage={currentLanguage}
        onApplyForNiche={() => {
          setSelectedNiche(null);
          setActiveTab('reports');
        }}
      />
    </div>
  );
}
