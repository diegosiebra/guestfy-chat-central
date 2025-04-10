
// Mock service for Stay.net API
// In a real implementation, this would make actual API calls to Stay.net

export type Listing = {
  id: string;
  name: string;
  propertyType: string;
  address: string;
  city: string;
  country: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  pricePerNight: number;
  cleaningFee: number;
  currency: string;
};

export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePicture?: string;
  whatsappId?: string;
};

export type ReservationStatus = 
  | 'confirmed'
  | 'pending'
  | 'cancelled'
  | 'completed'
  | 'no-show';

export type Reservation = {
  id: string;
  listingId: string;
  listing: Listing;
  clientId: string;
  client: Client;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  totalPrice: number;
  currency: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  promoCode?: string;
};

// Mock data generator
const generateMockReservations = (count: number): Reservation[] => {
  const listings: Listing[] = [
    {
      id: 'listing-1',
      name: 'Ocean View Condo',
      propertyType: 'Apartment',
      address: '123 Beachfront Ave',
      city: 'Miami',
      country: 'USA',
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      pricePerNight: 150,
      cleaningFee: 50,
      currency: 'USD'
    },
    {
      id: 'listing-2',
      name: 'Mountain Cabin Retreat',
      propertyType: 'Cabin',
      address: '456 Mountain Rd',
      city: 'Aspen',
      country: 'USA',
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      pricePerNight: 200,
      cleaningFee: 75,
      currency: 'USD'
    },
    {
      id: 'listing-3',
      name: 'Downtown Loft',
      propertyType: 'Loft',
      address: '789 Urban St',
      city: 'New York',
      country: 'USA',
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      pricePerNight: 175,
      cleaningFee: 60,
      currency: 'USD'
    }
  ];

  const clients: Client[] = [
    {
      id: 'client-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      whatsappId: 'whatsapp-1'
    },
    {
      id: 'client-2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+0987654321',
      whatsappId: 'whatsapp-2'
    },
    {
      id: 'client-3',
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@example.com',
      phone: '+1122334455',
      whatsappId: 'whatsapp-3'
    },
    {
      id: 'client-4',
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.williams@example.com',
      phone: '+5566778899',
      whatsappId: 'whatsapp-4'
    }
  ];

  const statuses: ReservationStatus[] = [
    'confirmed',
    'pending',
    'cancelled',
    'completed',
    'no-show'
  ];

  const reservations: Reservation[] = [];

  for (let i = 0; i < count; i++) {
    const listingIndex = i % listings.length;
    const clientIndex = i % clients.length;
    const statusIndex = i % statuses.length;

    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() + i * 2);
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + 3);

    reservations.push({
      id: `reservation-${i + 1}`,
      listingId: listings[listingIndex].id,
      listing: listings[listingIndex],
      clientId: clients[clientIndex].id,
      client: clients[clientIndex],
      checkInDate: checkInDate.toISOString().split('T')[0],
      checkOutDate: checkOutDate.toISOString().split('T')[0],
      guestCount: Math.floor(Math.random() * 3) + 1,
      totalPrice: listings[listingIndex].pricePerNight * 3 + listings[listingIndex].cleaningFee,
      currency: listings[listingIndex].currency,
      status: statuses[statusIndex],
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      updatedAt: new Date().toISOString(),
      notes: i % 3 === 0 ? 'Guest requested early check-in' : undefined,
      promoCode: i % 5 === 0 ? 'SUMMER10' : undefined
    });
  }

  return reservations;
};

// Mock API methods
export const fetchReservations = async (): Promise<Reservation[]> => {
  // Simulate API call with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockReservations(12));
    }, 500);
  });
};

export const fetchReservationById = async (id: string): Promise<Reservation | null> => {
  const reservations = await fetchReservations();
  return reservations.find(reservation => reservation.id === id) || null;
};

export const fetchClients = async (): Promise<Client[]> => {
  const reservations = await fetchReservations();
  const uniqueClients = new Map<string, Client>();
  
  reservations.forEach(reservation => {
    uniqueClients.set(reservation.client.id, reservation.client);
  });
  
  return Array.from(uniqueClients.values());
};
