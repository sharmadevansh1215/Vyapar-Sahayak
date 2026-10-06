import React, { useState, useRef } from 'react';
import { Language, UserProfile, BusinessCategory, LocationState } from '../types';
import { useI18n } from '../context/I18nContext';
import { calculateProfileCompletion, compressAndCropToSquare } from '../utils/profileUtils';
import { categories } from '../data/categories';

interface BusinessProfileViewProps {
  currentLanguage: Language;
  userProfile?: UserProfile | null;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  selectedCategory: BusinessCategory;
  onCategoryChange?: (cat: BusinessCategory) => void;
  location: LocationState;
  onLocationChange: (loc: LocationState) => void;
  marginCapital: number;
  onMarginCapitalChange: (val: number) => void;
  onOpenBankLocator: () => void;
  onOpenDocUpload: () => void;
  onRestartOnboarding: () => void;
}

export const BusinessProfileView: React.FC<BusinessProfileViewProps> = ({
  currentLanguage,
  userProfile,
  onUpdateProfile,
  selectedCategory,
  onCategoryChange,
  location,
  onLocationChange,
  marginCapital,
  onMarginCapitalChange,
  onOpenBankLocator,
  onOpenDocUpload,
  onRestartOnboarding,
}) => {
  const { t, getLocalizedUserName } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [editName, setEditName] = useState<string>(userProfile?.name || '');
  const [editEmail, setEditEmail] = useState<string>(userProfile?.email || '');
  const [editPhone, setEditPhone] = useState<string>(userProfile?.phone || '');
  const [editState, setEditState] = useState<string>(userProfile?.state || location.state || 'Uttar Pradesh');
  const [editDistrict, setEditDistrict] = useState<string>(userProfile?.district || location.district || 'Varanasi');
  const [editBlock, setEditBlock] = useState<string>(userProfile?.block || location.block || 'Cholapur');
  const [editVillage, setEditVillage] = useState<string>(userProfile?.village || location.village || 'Chiragpur Village');
  const [editCategory, setEditCategory] = useState<string>(userProfile?.businessType || selectedCategory.id);
  const [editMargin, setEditMargin] = useState<number>(marginCapital || 50000);
  const [editVerification, setEditVerification] = useState<'DEMO_VERIFIED' | 'VERIFIED' | 'PENDING' | 'NOT_VERIFIED'>(
    ((userProfile?.verificationStatus?.toUpperCase() as any) || 'DEMO_VERIFIED')
  );

  // Field validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);

  // Profile completion calculation
  const completion = calculateProfileCompletion(userProfile);

  // Handle Photo Upload with square cropping & compression
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (must be under 8MB before compression)
    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('Photo file size should be less than 8MB.');
      return;
    }

    try {
      setIsUploadingPhoto(true);
      setErrorMessage(null);
      const compressedDataUrl = await compressAndCropToSquare(file, 256, 0.85);
      onUpdateProfile({ profilePhoto: compressedDataUrl });
      setSuccessMessage('Profile photo updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to process photo. Please select another image.');
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = () => {
    onUpdateProfile({ profilePhoto: undefined });
    setSuccessMessage('Profile photo removed.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Form Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!editName.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!editPhone.trim()) {
      newErrors.phone = 'Mobile number is required.';
    } else if (!/^[6-9]\d{9}$/.test(editPhone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }

    if (editEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!editVillage.trim()) {
      newErrors.village = 'Village name is required.';
    }

    if (!editDistrict.trim()) {
      newErrors.district = 'District is required.';
    }

    if (isNaN(editMargin) || editMargin < 0) {
      newErrors.margin = 'Margin capital cannot be negative.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // 1. Update user profile state & localStorage
    onUpdateProfile({
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      state: editState.trim(),
      district: editDistrict.trim(),
      block: editBlock.trim(),
      village: editVillage.trim(),
      businessType: editCategory,
      marginCapital: editMargin,
      verificationStatus: editVerification,
    });

    // 2. Update Location state across app
    onLocationChange({
      ...location,
      state: editState.trim(),
      district: editDistrict.trim(),
      block: editBlock.trim(),
      village: editVillage.trim(),
    });

    // 3. Update Margin Capital across app
    onMarginCapitalChange(editMargin);

    // 4. Update Category across app if changed
    if (onCategoryChange) {
      const matchCat = categories.find((c) => c.id === editCategory);
      if (matchCat) {
        onCategoryChange(matchCat);
      }
    }

    setIsEditing(false);
    setSuccessMessage(t('profileUpdateSuccess', 'Profile details successfully updated.'));
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const loanAmount = marginCapital * 9;
  const projectCost = marginCapital * 10;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto w-full space-y-6">
      {/* Top Banner Alert Feedback */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-[#eaf8f0] border border-[#bbf7d0] text-[#107c41] flex items-center justify-between text-xs font-bold shadow-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">check_circle</span>
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-[#107c41] hover:text-[#0e6937] p-1"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-[#fee2e2] border border-[#fca5a5] text-[#b91c1c] flex items-center justify-between text-xs font-bold shadow-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">error</span>
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-[#b91c1c] hover:text-[#991b1b] p-1"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#cbd5e1] shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4.5">
            {/* Profile Photo with Upload Trigger */}
            <div className="relative group shrink-0">
              {userProfile?.profilePhoto ? (
                <img
                  src={userProfile.profilePhoto}
                  alt={getLocalizedUserName(userProfile.name)}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#0a3663] shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#0a3663] text-white flex items-center justify-center font-black text-3xl shadow-sm">
                  {getLocalizedUserName(userProfile?.name).charAt(0).toUpperCase()}
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
                id="profile-photo-upload"
              />

              {/* Upload Overlay Button */}
              <label
                htmlFor="profile-photo-upload"
                className="absolute inset-0 bg-black/40 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold"
                title="Change Photo"
              >
                <span className="material-symbols-outlined text-xl">photo_camera</span>
                <span>{isUploadingPhoto ? 'Saving...' : 'Change'}</span>
              </label>
            </div>

            {/* Name, Contact & Status */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight leading-normal">
                  {getLocalizedUserName(userProfile?.name)}
                </h1>

                {/* Verification Status Badge */}
                {((userProfile?.verificationStatus?.toUpperCase() === 'VERIFIED')) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#eaf8f0] text-[#107c41] text-xs font-bold border border-[#bbf7d0]">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    <span>Verified Applicant</span>
                  </span>
                )}

                {(!userProfile?.verificationStatus || userProfile?.verificationStatus?.toUpperCase() === 'DEMO_VERIFIED') && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#eff6ff] text-[#2563eb] text-xs font-bold border border-[#bfdbfe]">
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                    <span>Demo Verified</span>
                  </span>
                )}

                {(userProfile?.verificationStatus?.toUpperCase() === 'PENDING') && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309] text-xs font-bold border border-[#fde68a]">
                    <span className="material-symbols-outlined text-sm">hourglass_top</span>
                    <span>Verification Pending</span>
                  </span>
                )}

                {(userProfile?.verificationStatus?.toUpperCase() === 'NOT_VERIFIED') && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f1f5f9] text-[#64748b] text-xs font-bold border border-[#cbd5e1]">
                    <span className="material-symbols-outlined text-sm">gpp_maybe</span>
                    <span>Not Verified</span>
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#64748b] mt-1 font-medium">
                +91 {userProfile?.phone || '9876543210'}
                {userProfile?.email && <span> • {userProfile.email}</span>}
              </p>

              <p className="text-xs text-[#475569] mt-0.5">
                📍 {location.village}, {location.block}, {location.district}, {location.state}
              </p>

              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md bg-[#e8f3ff] text-[#0a3663] text-xs font-bold border border-[#c3d5e8]">
                  MoSJE Concessional Credit Beneficiary
                </span>
                {userProfile?.isShg && (
                  <span className="px-2.5 py-0.5 rounded-md bg-[#fef3c7] text-[#92400e] text-xs font-bold border border-[#fde68a]">
                    SHG: {userProfile.shgGroupName || 'Gramodaya Mahila SHG'}
                  </span>
                )}

                {/* Photo quick actions */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-semibold text-[#0a3663] hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">add_a_photo</span>
                  <span>{userProfile?.profilePhoto ? 'Change Photo' : 'Add Photo'}</span>
                </button>

                {userProfile?.profilePhoto && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="text-[11px] font-semibold text-[#dc2626] hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">delete</span>
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full sm:w-auto self-start sm:self-center">
            <button
              onClick={() => {
                if (!isEditing) {
                  // Reset form fields to current values
                  setEditName(userProfile?.name || '');
                  setEditEmail(userProfile?.email || '');
                  setEditPhone(userProfile?.phone || '');
                  setEditState(userProfile?.state || location.state || 'Uttar Pradesh');
                  setEditDistrict(userProfile?.district || location.district || 'Varanasi');
                  setEditBlock(userProfile?.block || location.block || 'Cholapur');
                  setEditVillage(userProfile?.village || location.village || 'Chiragpur Village');
                  setEditCategory(userProfile?.businessType || selectedCategory.id);
                  setEditMargin(marginCapital || 50000);
                  setEditVerification(((userProfile?.verificationStatus?.toUpperCase() as any) || 'DEMO_VERIFIED'));
                  setErrors({});
                }
                setIsEditing(!isEditing);
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#0a3663] hover:bg-[#082a4d] text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-base">
                {isEditing ? 'close' : 'edit'}
              </span>
              <span>{isEditing ? t('commonCancel', 'Cancel') : t('commonEdit', 'Edit Profile')}</span>
            </button>

            <button
              onClick={onRestartOnboarding}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white hover:bg-[#fee2e2] text-[#dc2626] font-bold text-xs sm:text-sm border border-[#cbd5e1] flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              <span>{t('navLogout', 'Switch Account')}</span>
            </button>
          </div>
        </div>

        {/* Profile Completion Indicator */}
        <div className="mt-6 pt-5 border-t border-[#e2e8f0]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0f172a]">
                {t('profileCompletion', 'Profile Completion')}:
              </span>
              <span
                className={`text-xs font-black ${
                  completion.percentage >= 80
                    ? 'text-[#107c41]'
                    : completion.percentage >= 50
                    ? 'text-[#d97706]'
                    : 'text-[#dc2626]'
                }`}
              >
                {completion.percentage}%
              </span>
            </div>
            <span className="text-[11px] text-[#64748b]">
              {completion.percentage === 100
                ? 'All fields verified & complete'
                : `${completion.missingFields.length} recommended action(s) remaining`}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#e2e8f0] h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                completion.percentage >= 80
                  ? 'bg-[#107c41]'
                  : completion.percentage >= 50
                  ? 'bg-[#f59e0b]'
                  : 'bg-[#dc2626]'
              }`}
              style={{ width: `${completion.percentage}%` }}
            />
          </div>

          {/* Missing fields checklist */}
          {completion.missingFields.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {completion.missingFields.map((field) => (
                <button
                  key={field}
                  onClick={() => {
                    if (field.includes('Photo')) fileInputRef.current?.click();
                    else if (field.includes('Bank')) onOpenBankLocator();
                    else if (field.includes('Documents')) onOpenDocUpload();
                    else setIsEditing(true);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f8fafc] hover:bg-[#eef4fb] text-[#475569] hover:text-[#0a3663] text-[11px] font-semibold border border-[#cbd5e1] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs text-[#d97706]">add_circle</span>
                  <span>{field}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Inline Edit Form */}
        {isEditing && (
          <form onSubmit={handleSave} className="mt-6 pt-5 border-t border-[#e2e8f0] space-y-4 animate-fade-in-down">
            <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
              <h3 className="font-black text-sm text-[#0a3663] flex items-center gap-2">
                <span className="material-symbols-outlined text-base">manage_accounts</span>
                <span>{t('profileSubtitle', 'Edit Entrepreneur Profile & Business Settings')}</span>
              </h3>
              <span className="text-[11px] text-[#64748b]">Changes persist in localStorage</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  Full Name / पूरा नाम *
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0a3663]/30 ${
                    errors.name ? 'border-[#dc2626] bg-[#fef2f2]' : 'border-[#cbd5e1] bg-white'
                  }`}
                  placeholder="e.g. Rameshwar Sharma"
                />
                {errors.name && <p className="text-[10px] text-[#dc2626] mt-0.5">{errors.name}</p>}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  Mobile Number / मोबाइल नंबर *
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, ''))}
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0a3663]/30 ${
                    errors.phone ? 'border-[#dc2626] bg-[#fef2f2]' : 'border-[#cbd5e1] bg-white'
                  }`}
                  placeholder="10-digit mobile"
                />
                {errors.phone && <p className="text-[10px] text-[#dc2626] mt-0.5">{errors.phone}</p>}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  Email Address / ईमेल (वैकल्पिक)
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0a3663]/30 ${
                    errors.email ? 'border-[#dc2626] bg-[#fef2f2]' : 'border-[#cbd5e1] bg-white'
                  }`}
                  placeholder="name@example.com"
                />
                {errors.email && <p className="text-[10px] text-[#dc2626] mt-0.5">{errors.email}</p>}
              </div>

              {/* Village */}
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  Village / ग्राम *
                </label>
                <input
                  type="text"
                  value={editVillage}
                  onChange={(e) => setEditVillage(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0a3663]/30 ${
                    errors.village ? 'border-[#dc2626] bg-[#fef2f2]' : 'border-[#cbd5e1] bg-white'
                  }`}
                  placeholder="e.g. Chiragpur Village"
                />
                {errors.village && <p className="text-[10px] text-[#dc2626] mt-0.5">{errors.village}</p>}
              </div>

              {/* Block */}
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  Block / ब्लॉक-तहसील *
                </label>
                <input
                  type="text"
                  value={editBlock}
                  onChange={(e) => setEditBlock(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] text-xs font-semibold"
                  placeholder="e.g. Cholapur"
                />
              </div>

              {/* District */}
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  District / ज़िला *
                </label>
                <input
                  type="text"
                  value={editDistrict}
                  onChange={(e) => setEditDistrict(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold ${
                    errors.district ? 'border-[#dc2626]' : 'border-[#cbd5e1]'
                  }`}
                  placeholder="e.g. Varanasi"
                />
                {errors.district && <p className="text-[10px] text-[#dc2626] mt-0.5">{errors.district}</p>}
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  State / राज्य
                </label>
                <input
                  type="text"
                  value={editState}
                  onChange={(e) => setEditState(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] text-xs font-semibold"
                  placeholder="e.g. Uttar Pradesh"
                />
              </div>

              {/* Business Sector / Category */}
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  Target Enterprise / लक्षित उद्यम
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] text-xs font-semibold bg-white cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.emoji} {currentLanguage === 'hi' ? cat.nameHindi : cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Available Margin Money */}
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  Margin Capital (10% Self-Contribution) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-[#64748b]">₹</span>
                  <input
                    type="number"
                    min={0}
                    step={5000}
                    value={editMargin}
                    onChange={(e) => setEditMargin(Number(e.target.value))}
                    className={`w-full pl-7 pr-3 py-2 rounded-xl border text-xs font-semibold ${
                      errors.margin ? 'border-[#dc2626]' : 'border-[#cbd5e1]'
                    }`}
                  />
                </div>
                {errors.margin && <p className="text-[10px] text-[#dc2626] mt-0.5">{errors.margin}</p>}
                <p className="text-[10px] text-[#64748b] mt-0.5">
                  Unlocks 90% loan: ₹{(editMargin * 9).toLocaleString('en-IN')}
                </p>
              </div>

              {/* Verification Status Selector */}
              <div>
                <label className="block text-xs font-bold text-[#475569] mb-1">
                  Verification Status
                </label>
                <select
                  value={editVerification}
                  onChange={(e) => setEditVerification(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-[#cbd5e1] text-xs font-semibold bg-white cursor-pointer"
                >
                  <option value="DEMO_VERIFIED">Demo Verified (Recommended)</option>
                  <option value="VERIFIED">Verified Applicant</option>
                  <option value="PENDING">Verification Pending</option>
                  <option value="NOT_VERIFIED">Not Verified</option>
                </select>
              </div>
            </div>

            {/* Financial Change Notice */}
            {editMargin !== marginCapital && (
              <div className="p-3 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-[11px] text-[#92400e] flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-[#d97706]">info</span>
                <span>
                  Modifying margin money from ₹{marginCapital.toLocaleString('en-IN')} to ₹
                  {editMargin.toLocaleString('en-IN')} will update the approved loan calculation across all financial modules.
                </span>
              </div>
            )}

            {/* Form Action Controls */}
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-[#cbd5e1] text-xs font-bold text-[#475569] hover:bg-[#f1f5f9] cursor-pointer"
              >
                {t('commonCancel', 'Cancel')}
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-[#107c41] hover:bg-[#0e6937] text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
              >
                {t('commonSave', 'Save Changes')}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Enterprise & Financial Allocation Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#cbd5e1] shadow-xs">
          <h2 className="font-black text-sm text-[#0f172a] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0a3663]">store</span>
            <span>Enterprise & Financial Model</span>
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc]">
              <span className="text-[#64748b]">Active Enterprise:</span>
              <span className="font-bold text-[#0f172a] flex items-center gap-1.5">
                <span>{selectedCategory.emoji}</span>
                <span>{currentLanguage === 'hi' ? selectedCategory.nameHindi : selectedCategory.name}</span>
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc]">
              <span className="text-[#64748b]">10% Self-Margin:</span>
              <span className="font-bold text-[#107c41]">₹{marginCapital.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc]">
              <span className="text-[#64748b]">90% Concessional Loan:</span>
              <span className="font-bold text-[#0a3663]">₹{loanAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc]">
              <span className="text-[#64748b]">Total Project Cost:</span>
              <span className="font-black text-[#0f172a]">₹{projectCost.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc]">
              <span className="text-[#64748b]">MoSJE Concessional Rate:</span>
              <span className="font-bold text-[#d97706]">6.50% p.a. (Subsidized)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc]">
              <span className="text-[#64748b]">Moratorium Period:</span>
              <span className="font-bold text-[#0f172a]">3 Months (Zero EMI)</span>
            </div>
          </div>
        </div>

        {/* KYC & Verified Documents */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#cbd5e1] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-sm text-[#0f172a] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#107c41]">verified_user</span>
                <span>KYC & MoSJE Documentation</span>
              </h2>
              <button
                onClick={onOpenDocUpload}
                className="text-xs font-bold text-[#0a3663] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">upload_file</span>
                <span>Upload</span>
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#eaf8f0] border border-[#bbf7d0]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#107c41] text-base">check_circle</span>
                  <span className="font-bold text-[#0f172a]">Aadhaar Card (UIDAI Verified)</span>
                </div>
                <span className="text-[10px] font-bold text-[#107c41]">Verified</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#eaf8f0] border border-[#bbf7d0]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#107c41] text-base">check_circle</span>
                  <span className="font-bold text-[#0f172a]">Eligibility / Category Certificate</span>
                </div>
                <span className="text-[10px] font-bold text-[#107c41]">6.5% Subsidized</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#eff6ff] border border-[#bfdbfe]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#2563eb] text-base">task_alt</span>
                  <span className="font-bold text-[#0f172a]">Gram Panchayat Residence Proof</span>
                </div>
                <span className="text-[10px] font-bold text-[#2563eb]">Approved</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#64748b] text-base">account_balance</span>
                  <span className="font-semibold text-[#475569]">Bank Passbook & E-Mandate</span>
                </div>
                <button
                  onClick={onOpenBankLocator}
                  className="text-[10px] font-bold text-[#0a3663] hover:underline cursor-pointer"
                >
                  Link Branch
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
            <span className="text-[11px] text-[#64748b]">Authorized Lead Bank Routing</span>
            <button
              onClick={onOpenBankLocator}
              className="text-xs font-bold text-[#0a3663] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">near_me</span>
              <span>Find District RRB</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
