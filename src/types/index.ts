export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
}

export interface Appointment {
  id: string;
  userId: string;
  serviceId: string;
  date: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}

export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  appointments?: string[]; // Array of appointment IDs
} 