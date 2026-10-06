import { districtCoordinates, stateCentroids } from '../data/locations';

export interface PincodeResolution {
  success: boolean;
  pincode: string;
  district?: string;
  state?: string;
  block?: string;
  village?: string;
  lat?: number;
  lng?: number;
  message?: string;
  locationPrecision?: 'district-precise' | 'state-level-approximate';
  notice?: string;
}

export async function lookupPincode(pincode: string): Promise<PincodeResolution> {
  const cleanPin = pincode.trim().replace(/\D/g, '');
  if (cleanPin.length !== 6) {
    return {
      success: false,
      pincode: cleanPin,
      message: 'PIN code must be exactly 6 digits.',
    };
  }

  try {
    // 1. Primary resolution: India Post public API
    const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
    if (!res.ok) {
      throw new Error(`Postal API error status: ${res.status}`);
    }
    const data = await res.json();
    if (!data || !data[0] || data[0].Status !== 'Success' || !data[0].PostOffice || data[0].PostOffice.length === 0) {
      return {
        success: false,
        pincode: cleanPin,
        message: data?.[0]?.Message || `Invalid PIN code (${cleanPin}) or no post office records found. Please select location manually.`,
      };
    }

    const po = data[0].PostOffice[0];
    const district = (po.District || po.Division || '').trim();
    const state = (po.State || '').trim();
    const rawBlock = po.Block !== 'NA' && po.Block ? po.Block : po.Taluk || po.Name;
    const block = rawBlock ? rawBlock.trim() : '';
    const village = po.Name ? `${po.Name} Village` : '';

    // 2. Secondary resolution: Exact or fuzzy match in districtCoordinates
    let matchedCoords = districtCoordinates[district];
    if (!matchedCoords) {
      const lowerDist = district.toLowerCase();
      const foundKey = Object.keys(districtCoordinates).find(
        (k) => k.toLowerCase() === lowerDist || lowerDist.includes(k.toLowerCase()) || k.toLowerCase().includes(lowerDist)
      );
      if (foundKey) {
        matchedCoords = districtCoordinates[foundKey];
      }
    }

    if (matchedCoords) {
      return {
        success: true,
        pincode: cleanPin,
        district,
        state,
        block,
        village,
        lat: matchedCoords.lat,
        lng: matchedCoords.lng,
        locationPrecision: 'district-precise',
      };
    }

    // 3. Tertiary resolution: State-level centroid fallback with explicit notice
    const stateCoords = stateCentroids[state] || { lat: 20.5937, lng: 78.9629 };
    return {
      success: true,
      pincode: cleanPin,
      district,
      state,
      block,
      village,
      lat: stateCoords.lat,
      lng: stateCoords.lng,
      locationPrecision: 'state-level-approximate',
      notice: 'District approximated from state center — enter village manually for better accuracy.',
    };
  } catch (error) {
    console.warn('Pincode lookup error:', error);
    return {
      success: false,
      pincode: cleanPin,
      message: 'Could not fetch PIN details from India Post network. Please select your state and district manually.',
    };
  }
}
