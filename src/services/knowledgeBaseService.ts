
// Mock service for Knowledge Base Management
// In a real implementation, this would connect to a database

export type KnowledgeListItem = {
  id: string;
  value: string;
};

export type KnowledgeList = {
  id: string;
  name: string;
  description: string;
  items: KnowledgeListItem[];
  createdAt: string;
  updatedAt: string;
};

export type CompanyInfoSection = {
  id: string;
  title: string;
  content: string;
  category: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

// Mock data
let mockKnowledgeLists: KnowledgeList[] = [
  {
    id: 'list-1',
    name: 'Amenities',
    description: 'List of amenities available in our properties',
    items: [
      { id: 'item-1-1', value: 'Free WiFi' },
      { id: 'item-1-2', value: 'Air conditioning' },
      { id: 'item-1-3', value: 'Kitchen' },
      { id: 'item-1-4', value: 'Washer & dryer' },
      { id: 'item-1-5', value: 'Dedicated workspace' }
    ],
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'list-2',
    name: 'House Rules',
    description: 'Rules that guests must follow',
    items: [
      { id: 'item-2-1', value: 'No smoking' },
      { id: 'item-2-2', value: 'No parties or events' },
      { id: 'item-2-3', value: 'No pets' },
      { id: 'item-2-4', value: 'Check-out by 11:00 AM' }
    ],
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'list-3',
    name: 'Local Attractions',
    description: 'Popular attractions near our properties',
    items: [
      { id: 'item-3-1', value: 'Central Park' },
      { id: 'item-3-2', value: 'Metropolitan Museum of Art' },
      { id: 'item-3-3', value: 'Empire State Building' },
      { id: 'item-3-4', value: 'Times Square' },
      { id: 'item-3-5', value: 'Broadway Theatre District' }
    ],
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

let mockCompanyInfo: CompanyInfoSection[] = [
  {
    id: 'info-1',
    title: 'Check-in Instructions',
    content: 'Check-in time is at 3:00 PM. Early check-in may be available if requested in advance. Please use the keypad at the main entrance with the code provided in your confirmation email. If you have any issues, contact our 24/7 support line.',
    category: 'Arrival',
    order: 1,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'info-2',
    title: 'Check-out Instructions',
    content: 'Check-out time is 11:00 AM. Late check-out may be available upon request for an additional fee. Please ensure all dishes are washed and trash is placed in the designated bins. Leave the keys on the kitchen counter before departing.',
    category: 'Departure',
    order: 2,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'info-3',
    title: 'Cancellation Policy',
    content: 'Free cancellation up to 48 hours before check-in. Cancellations made within 48 hours of check-in will be charged 50% of the total reservation amount. No-shows will be charged the full amount.',
    category: 'Policies',
    order: 3,
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'info-4',
    title: 'Parking Information',
    content: 'Free on-site parking is available for all guests. Please park in the designated spots marked with your unit number. Street parking is also available but may require a permit depending on the day of the week.',
    category: 'Facilities',
    order: 4,
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'info-5',
    title: 'WiFi Access',
    content: 'WiFi is available throughout the property. Network name: GuestfyWiFi, Password: StayConnected2023',
    category: 'Facilities',
    order: 5,
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

// API methods for Knowledge Lists
export const fetchKnowledgeLists = async (): Promise<KnowledgeList[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockKnowledgeLists]);
    }, 300);
  });
};

export const fetchKnowledgeListById = async (id: string): Promise<KnowledgeList | null> => {
  const list = mockKnowledgeLists.find(list => list.id === id);
  return list ? { ...list } : null;
};

export const createKnowledgeList = async (list: Omit<KnowledgeList, 'id' | 'createdAt' | 'updatedAt'>): Promise<KnowledgeList> => {
  const newList: KnowledgeList = {
    ...list,
    id: `list-${mockKnowledgeLists.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockKnowledgeLists.push(newList);
  return { ...newList };
};

export const updateKnowledgeList = async (id: string, updates: Partial<Omit<KnowledgeList, 'id' | 'createdAt' | 'updatedAt'>>): Promise<KnowledgeList | null> => {
  const index = mockKnowledgeLists.findIndex(list => list.id === id);
  
  if (index === -1) {
    return null;
  }
  
  mockKnowledgeLists[index] = {
    ...mockKnowledgeLists[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  return { ...mockKnowledgeLists[index] };
};

export const deleteKnowledgeList = async (id: string): Promise<boolean> => {
  const initialLength = mockKnowledgeLists.length;
  mockKnowledgeLists = mockKnowledgeLists.filter(list => list.id !== id);
  return mockKnowledgeLists.length < initialLength;
};

// API methods for Knowledge List Items
export const addKnowledgeListItem = async (listId: string, value: string): Promise<KnowledgeListItem | null> => {
  const list = mockKnowledgeLists.find(list => list.id === listId);
  
  if (!list) {
    return null;
  }
  
  const newItem: KnowledgeListItem = {
    id: `item-${listId}-${list.items.length + 1}`,
    value
  };
  
  list.items.push(newItem);
  list.updatedAt = new Date().toISOString();
  
  return { ...newItem };
};

export const updateKnowledgeListItem = async (listId: string, itemId: string, value: string): Promise<KnowledgeListItem | null> => {
  const list = mockKnowledgeLists.find(list => list.id === listId);
  
  if (!list) {
    return null;
  }
  
  const itemIndex = list.items.findIndex(item => item.id === itemId);
  
  if (itemIndex === -1) {
    return null;
  }
  
  list.items[itemIndex] = {
    ...list.items[itemIndex],
    value
  };
  
  list.updatedAt = new Date().toISOString();
  
  return { ...list.items[itemIndex] };
};

export const deleteKnowledgeListItem = async (listId: string, itemId: string): Promise<boolean> => {
  const list = mockKnowledgeLists.find(list => list.id === listId);
  
  if (!list) {
    return false;
  }
  
  const initialLength = list.items.length;
  list.items = list.items.filter(item => item.id !== itemId);
  list.updatedAt = new Date().toISOString();
  
  return list.items.length < initialLength;
};

// API methods for Company Info
export const fetchCompanyInfo = async (): Promise<CompanyInfoSection[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockCompanyInfo]);
    }, 300);
  });
};

export const fetchCompanyInfoById = async (id: string): Promise<CompanyInfoSection | null> => {
  const info = mockCompanyInfo.find(info => info.id === id);
  return info ? { ...info } : null;
};

export const fetchCompanyInfoByCategory = async (category: string): Promise<CompanyInfoSection[]> => {
  const infos = mockCompanyInfo.filter(info => info.category === category);
  return [...infos];
};

export const createCompanyInfo = async (info: Omit<CompanyInfoSection, 'id' | 'createdAt' | 'updatedAt'>): Promise<CompanyInfoSection> => {
  const newInfo: CompanyInfoSection = {
    ...info,
    id: `info-${mockCompanyInfo.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockCompanyInfo.push(newInfo);
  return { ...newInfo };
};

export const updateCompanyInfo = async (id: string, updates: Partial<Omit<CompanyInfoSection, 'id' | 'createdAt' | 'updatedAt'>>): Promise<CompanyInfoSection | null> => {
  const index = mockCompanyInfo.findIndex(info => info.id === id);
  
  if (index === -1) {
    return null;
  }
  
  mockCompanyInfo[index] = {
    ...mockCompanyInfo[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  return { ...mockCompanyInfo[index] };
};

export const deleteCompanyInfo = async (id: string): Promise<boolean> => {
  const initialLength = mockCompanyInfo.length;
  mockCompanyInfo = mockCompanyInfo.filter(info => info.id !== id);
  return mockCompanyInfo.length < initialLength;
};
