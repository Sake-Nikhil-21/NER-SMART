export interface NerCity {
  id: string;
  name: string;
  state: string;
  tag?: string;
  isCapital?: boolean;
}

export interface NerStateGroup {
  id: string;
  name: string;
  code: string;
  capital: string;
  cities: NerCity[];
}

export const NER_LOCATION_DATA: NerStateGroup[] = [
  {
    id: 'assam',
    name: 'Assam',
    code: 'AS',
    capital: 'Dispur / Guwahati',
    cities: [
      { id: 'guwahati', name: 'Guwahati', state: 'Assam', tag: 'Gateway & Major Transit Hub', isCapital: true },
      { id: 'dispur', name: 'Dispur', state: 'Assam', tag: 'Capital Administrative Complex', isCapital: true },
      { id: 'dibrugarh', name: 'Dibrugarh', state: 'Assam', tag: 'Upper Assam Highway Hub' },
      { id: 'silchar', name: 'Silchar', state: 'Assam', tag: 'Barak Valley Transit Gateway' },
      { id: 'jorhat', name: 'Jorhat', state: 'Assam', tag: 'Central Highway & Tea Corridor' },
      { id: 'tezpur', name: 'Tezpur', state: 'Assam', tag: 'North Bank Brahmaputra Transit' },
      { id: 'nagaon', name: 'Nagaon', state: 'Assam', tag: 'NH-27 / NH-29 Junction' },
      { id: 'bongaigaon', name: 'Bongaigaon', state: 'Assam', tag: 'Western Corridor & Rail Center' },
      { id: 'tinsukia', name: 'Tinsukia', state: 'Assam', tag: 'Easternmost Railhead' },
    ],
  },
  {
    id: 'arunachal',
    name: 'Arunachal Pradesh',
    code: 'AR',
    capital: 'Itanagar',
    cities: [
      { id: 'itanagar', name: 'Itanagar', state: 'Arunachal Pradesh', tag: 'State Capital', isCapital: true },
      { id: 'naharlagun', name: 'Naharlagun', state: 'Arunachal Pradesh', tag: 'Twin City & Railway Hub' },
      { id: 'tawang', name: 'Tawang', state: 'Arunachal Pradesh', tag: 'High Mountain Pass (Sela Pass Route)' },
      { id: 'pasighat', name: 'Pasighat', state: 'Arunachal Pradesh', tag: 'Siang Valley Gateway' },
      { id: 'ziro', name: 'Ziro', state: 'Arunachal Pradesh', tag: 'Lower Subansiri Plateau' },
      { id: 'bomdila', name: 'Bomdila', state: 'Arunachal Pradesh', tag: 'West Kameng Transit' },
      { id: 'tezu', name: 'Tezu', state: 'Arunachal Pradesh', tag: 'Lohit River Basin' },
      { id: 'along', name: 'Aalo (Along)', state: 'Arunachal Pradesh', tag: 'West Siang District' },
    ],
  },
  {
    id: 'manipur',
    name: 'Manipur',
    code: 'MN',
    capital: 'Imphal',
    cities: [
      { id: 'imphal', name: 'Imphal', state: 'Manipur', tag: 'Capital & Regional Medical Hub', isCapital: true },
      { id: 'churachandpur', name: 'Churachandpur', state: 'Manipur', tag: 'Southern Corridor Center' },
      { id: 'senapati', name: 'Senapati', state: 'Manipur', tag: 'Northern Mountain Pass (NH-2)' },
      { id: 'jiribam', name: 'Jiribam', state: 'Manipur', tag: 'NH-37 Railhead Gateway' },
      { id: 'ukhrul', name: 'Ukhrul', state: 'Manipur', tag: 'Eastern Hill Corridor' },
      { id: 'thoubal', name: 'Thoubal', state: 'Manipur', tag: 'National Highway Highway Node' },
      { id: 'kangpokpi', name: 'Kangpokpi', state: 'Manipur', tag: 'NH-2 Ghat Stretch' },
      { id: 'rims-hospital', name: 'RIMS Trauma Hospital, Imphal', state: 'Manipur', tag: '24x7 Emergency Medical Center' },
    ],
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    code: 'ML',
    capital: 'Shillong',
    cities: [
      { id: 'shillong', name: 'Shillong', state: 'Meghalaya', tag: 'State Capital & Hill Gateway', isCapital: true },
      { id: 'tura', name: 'Tura', state: 'Meghalaya', tag: 'Garo Hills Administrative Center' },
      { id: 'cherrapunji', name: 'Cherrapunji (Sohra)', state: 'Meghalaya', tag: 'Monsoon High Precipitation Belt' },
      { id: 'jowai', name: 'Jowai', state: 'Meghalaya', tag: 'Jaintia Hills Transit Route' },
      { id: 'nongpoh', name: 'Nongpoh', state: 'Meghalaya', tag: 'Guwahati-Shillong Expressway Node' },
      { id: 'dawki', name: 'Dawki', state: 'Meghalaya', tag: 'Southern Border Crossing' },
      { id: 'williamnagar', name: 'Williamnagar', state: 'Meghalaya', tag: 'East Garo Hills Hub' },
    ],
  },
  {
    id: 'mizoram',
    name: 'Mizoram',
    code: 'MZ',
    capital: 'Aizawl',
    cities: [
      { id: 'aizawl', name: 'Aizawl', state: 'Mizoram', tag: 'State Capital & Ridge Highway', isCapital: true },
      { id: 'lunglei', name: 'Lunglei', state: 'Mizoram', tag: 'South Mizoram Transit Hub' },
      { id: 'champhai', name: 'Champhai', state: 'Mizoram', tag: 'Eastern Border Trade Node' },
      { id: 'kolasib', name: 'Kolasib', state: 'Mizoram', tag: 'NH-54 Gateway into Assam' },
      { id: 'serchhip', name: 'Serchhip', state: 'Mizoram', tag: 'Central Ridge Node' },
      { id: 'saitual', name: 'Saitual', state: 'Mizoram', tag: 'Northeastern Transit Point' },
    ],
  },
  {
    id: 'nagaland',
    name: 'Nagaland',
    code: 'NL',
    capital: 'Kohima',
    cities: [
      { id: 'kohima', name: 'Kohima', state: 'Nagaland', tag: 'State Capital & Mountain Highway', isCapital: true },
      { id: 'dimapur', name: 'Dimapur', state: 'Nagaland', tag: 'Main Railhead & Commercial Hub' },
      { id: 'mokokchung', name: 'Mokokchung', state: 'Nagaland', tag: 'Central Cultural & Transit Hub' },
      { id: 'mon', name: 'Mon', state: 'Nagaland', tag: 'Northern Border Hill District' },
      { id: 'wokha', name: 'Wokha', state: 'Nagaland', tag: 'NH-2 High Gradient Ghats' },
      { id: 'tuensang', name: 'Tuensang', state: 'Nagaland', tag: 'Eastern Border District' },
      { id: 'phek', name: 'Phek', state: 'Nagaland', tag: 'Southern Mountain Zone' },
      { id: 'chumukedima', name: 'Chumukedima', state: 'Nagaland', tag: 'Transit Gateway & Checkpost' },
    ],
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
    code: 'SK',
    capital: 'Gangtok',
    cities: [
      { id: 'gangtok', name: 'Gangtok', state: 'Sikkim', tag: 'State Capital & Mountain Hub', isCapital: true },
      { id: 'namchi', name: 'Namchi', state: 'Sikkim', tag: 'South Sikkim Commercial Hub' },
      { id: 'pelling', name: 'Pelling', state: 'Sikkim', tag: 'West Sikkim Tourism & Ridge Node' },
      { id: 'rangpo', name: 'Rangpo', state: 'Sikkim', tag: 'NH-10 Gateway into Bengal' },
      { id: 'mangan', name: 'Mangan', state: 'Sikkim', tag: 'North Sikkim Disaster-Sensitive Pass' },
      { id: 'singtam', name: 'Singtam', state: 'Sikkim', tag: 'Teesta River Basin Junction' },
      { id: 'gyalshing', name: 'Gyalshing', state: 'Sikkim', tag: 'Western Ridge Center' },
    ],
  },
  {
    id: 'tripura',
    name: 'Tripura',
    code: 'TR',
    capital: 'Agartala',
    cities: [
      { id: 'agartala', name: 'Agartala', state: 'Tripura', tag: 'State Capital & Transit Airport Hub', isCapital: true },
      { id: 'dharmanagar', name: 'Dharmanagar', state: 'Tripura', tag: 'North Tripura Rail Gateway' },
      { id: 'udaipur', name: 'Udaipur', state: 'Tripura', tag: 'South Tripura Highway Center' },
      { id: 'kailashahar', name: 'Kailashahar', state: 'Tripura', tag: 'Unakoti Valley Node' },
      { id: 'ambassa', name: 'Ambassa', state: 'Tripura', tag: 'Dhalai District Central Hub' },
      { id: 'belonia', name: 'Belonia', state: 'Tripura', tag: 'Southern Border Crossing' },
      { id: 'teliamura', name: 'Teliamura', state: 'Tripura', tag: 'NH-8 Highway Stop' },
    ],
  },
];
