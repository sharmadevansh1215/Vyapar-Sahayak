import { UserProfile } from '../types';

export interface ProfileCompletionResult {
  percentage: number;
  missingFields: string[];
  completedFields: string[];
}

/**
 * Calculates dynamic profile completion percentage and identifies exact missing items.
 * Strictly calculates from actual populated data; never hardcodes 100%.
 */
export function calculateProfileCompletion(profile?: UserProfile | null): ProfileCompletionResult {
  if (!profile) {
    return {
      percentage: 0,
      missingFields: [
        'Full Name',
        'Profile Photo',
        'Mobile Number',
        'State & District',
        'Block & Village',
        'Business Details',
        'Margin Capital',
        'Identity / Documents',
      ],
      completedFields: [],
    };
  }

  const items: { label: string; isComplete: boolean; weight: number }[] = [
    {
      label: 'Full Name',
      isComplete: Boolean(profile.name && profile.name.trim().length > 2),
      weight: 15,
    },
    {
      label: 'Mobile Number',
      isComplete: Boolean(profile.phone && profile.phone.replace(/\D/g, '').length >= 10),
      weight: 15,
    },
    {
      label: 'Location (State & District)',
      isComplete: Boolean(profile.state && profile.district),
      weight: 15,
    },
    {
      label: 'Village / Block',
      isComplete: Boolean(profile.block && profile.village),
      weight: 10,
    },
    {
      label: 'Target Business Category',
      isComplete: Boolean(profile.businessType && profile.businessType.trim().length > 0),
      weight: 15,
    },
    {
      label: 'Margin Capital (10% Share)',
      isComplete: Boolean(profile.marginCapital && profile.marginCapital > 0),
      weight: 10,
    },
    {
      label: 'Profile Photo',
      isComplete: Boolean(profile.profilePhoto && profile.profilePhoto.trim().length > 0),
      weight: 10,
    },
    {
      label: 'Email or Beneficiary Records',
      isComplete: Boolean(profile.email || profile.beneficiaryDetails?.aadhaarLinked),
      weight: 10,
    },
  ];

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const earnedWeight = items.reduce((sum, item) => sum + (item.isComplete ? item.weight : 0), 0);
  const percentage = Math.round((earnedWeight / totalWeight) * 100);

  const missingFields = items.filter((i) => !i.isComplete).map((i) => i.label);
  const completedFields = items.filter((i) => i.isComplete).map((i) => i.label);

  return {
    percentage,
    missingFields,
    completedFields,
  };
}

/**
 * Compresses an uploaded image file into a square (e.g. 256x256) data URL to prevent local storage bloat
 */
export async function compressAndCropToSquare(file: File, size = 256, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      reject(new Error('Only JPG, JPEG, PNG, and WEBP formats are supported'));
      return;
    }

    // Validate size (max 8MB before compression)
    if (file.size > 8 * 1024 * 1024) {
      reject(new Error('File size exceeds 8MB limit. Please select a smaller file.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        // Center crop math
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;

        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

        // Quality compression
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
