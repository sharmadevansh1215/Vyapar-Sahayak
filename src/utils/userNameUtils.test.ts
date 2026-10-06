import { describe, it, expect } from 'vitest';
import { getLocalizedUserName } from './userNameUtils';

describe('getLocalizedUserName', () => {
  it('localizes default Rameshwar Sharma across languages', () => {
    expect(getLocalizedUserName('Rameshwar Sharma', 'en')).toBe('Rameshwar Sharma');
    expect(getLocalizedUserName('Rameshwar Sharma', 'hi')).toBe('रामेश्वर शर्मा');
    expect(getLocalizedUserName('Rameshwar Sharma', 'mr')).toBe('रामेश्वर शर्मा');
    expect(getLocalizedUserName('Rameshwar Sharma', 'ta')).toBe('ராமேஸ்வர சர்மா');
    expect(getLocalizedUserName('Rameshwar Sharma', 'te')).toBe('రామేశ్వర్ శర్మ');
    expect(getLocalizedUserName('Rameshwar Sharma', 'kn')).toBe('ರಾಮೇಶ್ವರ ಶರ್ಮಾ');
    expect(getLocalizedUserName('Rameshwar Sharma', 'bn')).toBe('রামেশ্বর শর্মা');
    expect(getLocalizedUserName('Rameshwar Sharma', 'gu')).toBe('રામેશ્વર શર્મા');
    expect(getLocalizedUserName('Rameshwar Sharma', 'or')).toBe('ରାମେଶ୍ୱର ଶର୍ମା');
    expect(getLocalizedUserName('Rameshwar Sharma', 'as')).toBe('ৰামেশ্বৰ শৰ্মা');
    expect(getLocalizedUserName('Rameshwar Sharma', 'sat')).toBe('ᱨᱟᱢᱮᱥᱣᱚᱨ ᱥᱚᱨᱢᱟ');
    expect(getLocalizedUserName('Rameshwar Sharma', 'bhb')).toBe('रामेश्वर शर्मा');
    expect(getLocalizedUserName('Rameshwar Sharma', 'gon')).toBe('रामेश्वर शर्मा');
    expect(getLocalizedUserName('Rameshwar Sharma', 'brx')).toBe('रामेश्वर शर्मा');
  });

  it('handles null or empty names by falling back to localized Rameshwar Sharma', () => {
    expect(getLocalizedUserName(null, 'hi')).toBe('रामेश्वर शर्मा');
    expect(getLocalizedUserName('', 'hi')).toBe('रामेश्वर शर्मा');
    expect(getLocalizedUserName(undefined, 'en')).toBe('Rameshwar Sharma');
    expect(getLocalizedUserName(undefined, 'ta')).toBe('ராமேஸ்வர சர்மா');
  });

  it('handles other common names in compound matching', () => {
    expect(getLocalizedUserName('Sunita Devi', 'hi')).toBe('सुनीता देवी');
    expect(getLocalizedUserName('Sunita Devi', 'ta')).toBe('சுனிதா தேவி');
    expect(getLocalizedUserName('Rajesh Kumar', 'te')).toBe('రాజేష్ కుమార్');
  });

  it('handles names already written in Devanagari', () => {
    expect(getLocalizedUserName('रामेश्वर शर्मा', 'en')).toBe('Rameshwar Sharma');
    expect(getLocalizedUserName('रामेश्वर शर्मा', 'hi')).toBe('रामेश्वर शर्मा');
    expect(getLocalizedUserName('रामेश्वर शर्मा', 'ta')).toBe('ராமேஸ்வர சர்மா');
  });
});
