export interface StateOption {
  name: string;
  districts: {
    name: string;
    blocks: string[];
  }[];
}

export const locationData: StateOption[] = [
  {
    name: 'Uttar Pradesh',
    districts: [
      {
        name: 'Varanasi',
        blocks: ['Cholapur', 'Pindra', 'Harahua', 'Kashi Vidyapeeth', 'Baragaon', 'Araziline', 'Sewapuri', 'Chiraigaon'],
      },
      {
        name: 'Prayagraj',
        blocks: ['Phulpur', 'Koraon', 'Handia', 'Karchhana', 'Soraon', 'Holagarh', 'Mauaima', 'Bahria'],
      },
      {
        name: 'Gorakhpur',
        blocks: ['Pipraich', 'Bhathat', 'Bansgaon', 'Sahjanwa', 'Chargawan', 'Khajni', 'Campierganj'],
      },
      {
        name: 'Lucknow',
        blocks: ['Bakshi Ka Talab', 'Malihabad', 'Mohanlalganj', 'Sarojini Nagar', 'Gosainganj', 'Kakori'],
      },
      {
        name: 'Ayodhya',
        blocks: ['Maya Bazar', 'Masodha', 'Sohawal', 'Milkipur', 'Pura Bazar', 'Bikapur', 'Rudauli'],
      },
    ],
  },
  {
    name: 'Madhya Pradesh',
    districts: [
      {
        name: 'Indore',
        blocks: ['Sanwer', 'Depalpur', 'Mhow', 'Indore Rural'],
      },
      {
        name: 'Bhopal',
        blocks: ['Phanda', 'Berasia'],
      },
      {
        name: 'Jabalpur',
        blocks: ['Patan', 'Sihora', 'Panagar', 'Shahpura', 'Kundam'],
      },
      {
        name: 'Ujjain',
        blocks: ['Mahidpur', 'Tarana', 'Ghatiya', 'Badnagar', 'Khachrod'],
      },
    ],
  },
  {
    name: 'Bihar',
    districts: [
      {
        name: 'Patna',
        blocks: ['Danapur', 'Phulwari Sharif', 'Bikram', 'Bihta', 'Fatuha', 'Bakhtiarpur', 'Paliganj'],
      },
      {
        name: 'Muzaffarpur',
        blocks: ['Kanti', 'Motipur', 'Paroo', 'Sahebganj', 'Musahari', 'Minapur', 'Bochaha'],
      },
      {
        name: 'Gaya',
        blocks: ['Bodh Gaya', 'Manpur', 'Tekari', 'Sherghati', 'Wazirganj', 'Dobhi'],
      },
    ],
  },
  {
    name: 'Maharashtra',
    districts: [
      {
        name: 'Pune',
        blocks: ['Haveli', 'Baramati', 'Khed', 'Shirur', 'Junner', 'Daund', 'Purandar'],
      },
      {
        name: 'Nagpur',
        blocks: ['Katol', 'Saoner', 'Umred', 'Ramtek', 'Hingna', 'Kamptee', 'Narkhed'],
      },
      {
        name: 'Nashik',
        blocks: ['Niphad', 'Dindori', 'Sinnar', 'Yeola', 'Malegaon', 'Baglan'],
      },
    ],
  },
  {
    name: 'Rajasthan',
    districts: [
      {
        name: 'Jaipur',
        blocks: ['Amber', 'Bassi', 'Chaksu', 'Chomu', 'Jamwa Ramgarh', 'Kotputli', 'Phagi', 'Sanganer'],
      },
      {
        name: 'Jodhpur',
        blocks: ['Bilara', 'Bhopalgarh', 'Luni', 'Mandore', 'Osian', 'Phalodi', 'Shergarh'],
      },
      {
        name: 'Alwar',
        blocks: ['Alwar', 'Ramgarh', 'Rajgarh', 'Thanagazi', 'Umren', 'Lachhmangarh', 'Kathumar', 'Reni'],
      },
      {
        name: 'Khairthal-Tijara',
        blocks: ['Tijara', 'Kishangarh Bas', 'Kotkasim', 'Mundawar', 'Khairthal'],
      },
      {
        name: 'Bharatpur',
        blocks: ['Bharatpur', 'Kumher', 'Deeg', 'Nadbai', 'Weer', 'Bayana', 'Kaman', 'Rupbas'],
      },
      {
        name: 'Kota',
        blocks: ['Ladpura', 'Sangod', 'Itawa', 'Sultanpur', 'Khairabad'],
      },
      {
        name: 'Udaipur',
        blocks: ['Girwa', 'Badgaon', 'Mavli', 'Vallabhnagar', 'Salumber', 'Sarada', 'Kherwara', 'Jhadol'],
      },
      {
        name: 'Bikaner',
        blocks: ['Bikaner', 'Nokha', 'Lunkaransar', 'Kolayat', 'Dungargarh', 'Khajuwala'],
      },
      {
        name: 'Sikar',
        blocks: ['Sikar', 'Dhod', 'Piprali', 'Danta Ramgarh', 'Khandela', 'Neem Ka Thana', 'Fatehpur', 'Laxmangarh'],
      },
      {
        name: 'Ajmer',
        blocks: ['Srinagar', 'Pisangan', 'Jawaja', 'Masuda', 'Kekri', 'Bhinai', 'Silora', 'Arai'],
      },
    ],
  },
  {
    name: 'Punjab',
    districts: [
      {
        name: 'Ludhiana',
        blocks: ['Dehlon', 'Doraha', 'Jagraon', 'Khanna', 'Machhiwara', 'Pakhowal', 'Raikot', 'Samrala'],
      },
      {
        name: 'Amritsar',
        blocks: ['Ajnala', 'Attari', 'Chogawan', 'Harsha Chhina', 'Jandiala', 'Majitha', 'Rayya', 'Verka'],
      },
    ],
  },
  {
    name: 'Tamil Nadu',
    districts: [
      {
        name: 'Madurai',
        blocks: ['Melur', 'Alanganallur', 'Vadipatti', 'Usilampatti', 'Thiruparankundram', 'Kottampatti', 'Sedapatti'],
      },
      {
        name: 'Coimbatore',
        blocks: ['Pollachi', 'Sulur', 'Annur', 'Mettupalayam', 'Karamadai', 'Kinathukadavu', 'Perur'],
      },
    ],
  },
  {
    name: 'Karnataka',
    districts: [
      {
        name: 'Bengaluru Rural',
        blocks: ['Devanahalli', 'Doddaballapura', 'Hosakote', 'Nelamangala'],
      },
      {
        name: 'Mysuru',
        blocks: ['Nanjangud', 'Hunsur', 'T. Narasipura', 'Piriyapatna', 'K.R. Nagar', 'H.D. Kote'],
      },
    ],
  },
  {
    name: 'Telangana',
    districts: [
      {
        name: 'Rangareddy',
        blocks: ['Shamshabad', 'Ibrahimpatnam', 'Chevella', 'Maheshwaram', 'Shadnagar', 'Rajendranagar'],
      },
      {
        name: 'Warangal Rural',
        blocks: ['Parkal', 'Narsampet', 'Wardhannapet', 'Rayaparthy', 'Duggondi', 'Geesugonda'],
      },
    ],
  },
];

export const stateCentroids: Record<string, { lat: number; lng: number }> = {
  'Uttar Pradesh': { lat: 26.8467, lng: 80.9462 },
  'Rajasthan': { lat: 26.9124, lng: 75.7873 },
  'Madhya Pradesh': { lat: 23.2599, lng: 77.4126 },
  'Bihar': { lat: 25.5941, lng: 85.1376 },
  'Maharashtra': { lat: 19.7515, lng: 75.7139 },
  'Gujarat': { lat: 22.2587, lng: 71.1924 },
  'Punjab': { lat: 31.1471, lng: 75.3412 },
  'Haryana': { lat: 29.0588, lng: 76.0856 },
  'Tamil Nadu': { lat: 11.1271, lng: 78.6569 },
  'Karnataka': { lat: 15.3173, lng: 75.7139 },
  'Telangana': { lat: 18.1124, lng: 79.0193 },
  'Andhra Pradesh': { lat: 15.9129, lng: 79.7400 },
  'West Bengal': { lat: 22.9868, lng: 87.8550 },
  'Odisha': { lat: 20.9517, lng: 85.0985 },
  'Assam': { lat: 26.2006, lng: 92.9376 },
  'Kerala': { lat: 10.8505, lng: 76.2711 },
  'Jharkhand': { lat: 23.6102, lng: 85.2799 },
  'Chhattisgarh': { lat: 21.2787, lng: 81.8661 },
  'Himachal Pradesh': { lat: 31.1048, lng: 77.1734 },
  'Uttarakhand': { lat: 30.0668, lng: 79.0193 },
  'Delhi': { lat: 28.7041, lng: 77.1025 },
};

export const districtCoordinates: Record<string, { lat: number; lng: number }> = {
  // Uttar Pradesh
  'Varanasi': { lat: 25.3176, lng: 82.9739 },
  'Prayagraj': { lat: 25.4358, lng: 81.8463 },
  'Gorakhpur': { lat: 26.7606, lng: 83.3732 },
  'Lucknow': { lat: 26.8467, lng: 80.9462 },
  'Ayodhya': { lat: 26.7922, lng: 82.1998 },
  'Kanpur': { lat: 26.4499, lng: 80.3319 },
  'Agra': { lat: 27.1767, lng: 78.0081 },
  'Aligarh': { lat: 27.8974, lng: 78.0880 },
  'Bareilly': { lat: 28.3670, lng: 79.4304 },
  'Meerut': { lat: 28.9845, lng: 77.7064 },
  'Ghaziabad': { lat: 28.6692, lng: 77.4538 },
  'Jhansi': { lat: 25.4484, lng: 78.5685 },
  'Moradabad': { lat: 28.8386, lng: 78.7733 },
  'Saharanpur': { lat: 29.9671, lng: 77.5510 },

  // Rajasthan
  'Jaipur': { lat: 26.9124, lng: 75.7873 },
  'Jodhpur': { lat: 26.2389, lng: 73.0243 },
  'Alwar': { lat: 27.5530, lng: 76.6346 },
  'Khairthal-Tijara': { lat: 27.9333, lng: 76.8333 },
  'Khairthal': { lat: 27.9333, lng: 76.8333 },
  'Bharatpur': { lat: 27.2152, lng: 77.5030 },
  'Kota': { lat: 25.2138, lng: 75.8648 },
  'Udaipur': { lat: 24.5854, lng: 73.7125 },
  'Bikaner': { lat: 28.0229, lng: 73.3119 },
  'Sikar': { lat: 27.6094, lng: 75.1399 },
  'Ajmer': { lat: 26.4499, lng: 74.6399 },
  'Bhilwara': { lat: 25.3407, lng: 74.6313 },
  'Chittorgarh': { lat: 24.8887, lng: 74.6269 },
  'Pali': { lat: 25.7711, lng: 73.3234 },
  'Sri Ganganagar': { lat: 29.9038, lng: 73.8772 },

  // Madhya Pradesh
  'Indore': { lat: 22.7196, lng: 75.8577 },
  'Bhopal': { lat: 23.2599, lng: 77.4126 },
  'Jabalpur': { lat: 23.1815, lng: 79.9864 },
  'Ujjain': { lat: 23.1765, lng: 75.7885 },
  'Gwalior': { lat: 26.2183, lng: 78.1828 },
  'Sagar': { lat: 23.8388, lng: 78.7378 },
  'Rewa': { lat: 24.5362, lng: 81.3037 },
  'Satna': { lat: 24.6005, lng: 80.8322 },

  // Bihar
  'Patna': { lat: 25.5941, lng: 85.1376 },
  'Muzaffarpur': { lat: 26.1209, lng: 85.3647 },
  'Gaya': { lat: 24.7914, lng: 85.0002 },
  'Bhagalpur': { lat: 25.2425, lng: 86.9842 },
  'Darbhanga': { lat: 26.1542, lng: 85.8918 },
  'Purnia': { lat: 25.7771, lng: 87.4753 },
  'Rohtas': { lat: 24.9546, lng: 84.0152 },

  // Maharashtra
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Nagpur': { lat: 21.1458, lng: 79.0882 },
  'Nashik': { lat: 19.9975, lng: 73.7898 },
  'Aurangabad': { lat: 19.8762, lng: 75.3433 },
  'Chhatrapati Sambhajinagar': { lat: 19.8762, lng: 75.3433 },
  'Solapur': { lat: 17.6599, lng: 75.9064 },
  'Kolhapur': { lat: 16.7050, lng: 74.2433 },
  'Amravati': { lat: 20.9374, lng: 77.7796 },
  'Thane': { lat: 19.2183, lng: 72.9781 },

  // Punjab & Haryana
  'Ludhiana': { lat: 30.9010, lng: 75.8573 },
  'Amritsar': { lat: 31.6340, lng: 74.8723 },
  'Jalandhar': { lat: 31.3260, lng: 75.5762 },
  'Patiala': { lat: 30.3398, lng: 76.3869 },
  'Hisar': { lat: 29.1492, lng: 75.7217 },
  'Rohtak': { lat: 28.8955, lng: 76.6066 },
  'Karnal': { lat: 29.6857, lng: 76.9905 },

  // Tamil Nadu
  'Madurai': { lat: 9.9252, lng: 78.1198 },
  'Coimbatore': { lat: 11.0168, lng: 76.9558 },
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Tiruchirappalli': { lat: 10.7905, lng: 78.7047 },
  'Salem': { lat: 11.6643, lng: 78.1460 },
  'Tirunelveli': { lat: 8.7139, lng: 77.7567 },

  // Karnataka
  'Bengaluru Rural': { lat: 13.2847, lng: 77.5332 },
  'Bengaluru': { lat: 12.9716, lng: 77.5946 },
  'Mysuru': { lat: 12.2958, lng: 76.6394 },
  'Belagavi': { lat: 15.8497, lng: 74.4977 },
  'Hubballi-Dharwad': { lat: 15.3647, lng: 75.1240 },
  'Kalaburagi': { lat: 17.3297, lng: 76.8343 },

  // Telangana & Andhra Pradesh
  'Rangareddy': { lat: 17.2403, lng: 78.4294 },
  'Warangal Rural': { lat: 17.9689, lng: 79.5941 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  'Nizamabad': { lat: 18.6725, lng: 78.0941 },
  'Karimnagar': { lat: 18.4386, lng: 79.1288 },
  'Visakhapatnam': { lat: 17.6868, lng: 83.2185 },
  'Vijayawada': { lat: 16.5062, lng: 80.6480 },
  'Guntur': { lat: 16.3067, lng: 80.4365 },

  // Gujarat
  'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'Surat': { lat: 21.1702, lng: 72.8311 },
  'Vadodara': { lat: 22.3072, lng: 73.1812 },
  'Rajkot': { lat: 22.3039, lng: 70.8022 },

  // West Bengal, Odisha, Assam
  'Kolkata': { lat: 22.5726, lng: 88.3639 },
  'Burdwan': { lat: 23.2324, lng: 87.8615 },
  'Bhubaneswar': { lat: 20.2961, lng: 85.8245 },
  'Cuttack': { lat: 20.4625, lng: 85.8828 },
  'Guwahati': { lat: 26.1445, lng: 91.7362 },
  'Ranchi': { lat: 23.3441, lng: 85.3096 },
  'Raipur': { lat: 21.2514, lng: 81.6296 },
};

export const nearbyBanks = [
  {
    name: 'State Bank of India (SBI) - Cholapur Branch',
    nameHindi: 'भारतीय स्टेट बैंक (SBI) - चोलापुर शाखा',
    ifsc: 'SBIN0002538',
    distance: '1.8 km',
    address: 'Main Market Road, Near Block Development Office, Cholapur, Varanasi',
    phone: '+91 542 268 7211',
    rating: '4.7',
    schemesOffered: ['MoSJE Micro Finance', 'PMEGP', 'Mudra Shishu & Kishor', 'Kisan Credit Card (KCC)'],
    managerName: 'Rajesh Kumar Verma',
    workingHours: '10:00 AM - 4:00 PM (Mon-Sat)',
  },
  {
    name: 'Baroda UP Gramin Bank - Chiragpur Service Outlet',
    nameHindi: 'बड़ौदा यूपी ग्रामीण बैंक - चिरागपुर सेवा केंद्र',
    ifsc: 'BUPB0001092',
    distance: '0.6 km',
    address: 'Panchayat Bhavan Campus, Chiragpur Village, Varanasi',
    phone: '+91 542 268 8900',
    rating: '4.8',
    schemesOffered: ['MoSJE Direct Benefit Loans', 'SHG Bank Linkage', 'Mudra Loan', 'Dairy Entrepreneurship Dev Scheme'],
    managerName: 'Sunita Devi (Business Correspondent)',
    workingHours: '9:30 AM - 5:30 PM (Mon-Sat)',
  },
  {
    name: 'Punjab National Bank (PNB) - Pindra Agricultural Branch',
    nameHindi: 'पंजाब नेशनल बैंक (PNB) - पिंडरा कृषि शाखा',
    ifsc: 'PUNB0192800',
    distance: '4.2 km',
    address: 'Near Tehsil Campus, Pindra, Varanasi',
    phone: '+91 542 262 3144',
    rating: '4.5',
    schemesOffered: ['MoSJE Subsidized Term Loan', 'Stand-Up India', 'PM Formalisation of Micro food processing Enterprises (PMFME)'],
    managerName: 'Amitabh Sen',
    workingHours: '10:00 AM - 4:00 PM (Mon-Sat)',
  },
  {
    name: 'Union Bank of India - Kashi Rural Hub',
    nameHindi: 'यूनियन बैंक ऑफ इंडिया - काशी ग्रामीण हब',
    ifsc: 'UBIN0541123',
    distance: '5.1 km',
    address: 'GT Road, Babatpur Crossing, Varanasi',
    phone: '+91 542 262 5590',
    rating: '4.6',
    schemesOffered: ['MoSJE Entrepreneurship', 'Agriculture Infrastructure Fund (AIF)', 'PMEGP'],
    managerName: 'Vikas Mishra',
    workingHours: '10:00 AM - 4:00 PM (Mon-Sat)',
  },
];
