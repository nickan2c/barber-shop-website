import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Appointment } from '@/types';

export async function createBooking(bookingData: {
  userId: string;
  serviceId: string;
  date: Date;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}): Promise<string> {
  try {
    const appointment: Omit<Appointment, 'id'> = {
      userId: bookingData.userId,
      serviceId: bookingData.serviceId,
      date: bookingData.date,
      status: 'pending',
      customerName: bookingData.customerName,
      customerEmail: bookingData.customerEmail,
      customerPhone: bookingData.customerPhone,
    };

    const docRef = await addDoc(collection(db, 'appointments'), appointment);
    return docRef.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

export async function checkTimeSlotAvailability(date: Date): Promise<boolean> {
  try {
    // Get the start and end of the selected date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Query appointments for the selected date
    const appointmentsRef = collection(db, 'appointments');
    const q = query(
      appointmentsRef,
      where('date', '>=', startOfDay),
      where('date', '<=', endOfDay),
      where('status', '==', 'confirmed')
    );

    const querySnapshot = await getDocs(q);
    const bookedTimes = querySnapshot.docs.map((doc) => doc.data().date.toDate().getHours());

    // Check if the time slot is available (assuming 1 booking per hour)
    const requestedHour = date.getHours();
    return !bookedTimes.includes(requestedHour);
  } catch (error) {
    console.error('Error checking time slot availability:', error);
    throw error;
  }
}

export async function getAvailableTimeSlots(date: Date): Promise<Date[]> {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all confirmed appointments for the day
    const appointmentsRef = collection(db, 'appointments');
    const q = query(
      appointmentsRef,
      where('date', '>=', startOfDay),
      where('date', '<=', endOfDay),
      where('status', '==', 'confirmed')
    );

    const querySnapshot = await getDocs(q);
    const bookedTimes = querySnapshot.docs.map((doc) => doc.data().date.toDate().getHours());

    // Generate available time slots (9 AM to 7 PM)
    const availableSlots: Date[] = [];
    for (let hour = 9; hour < 19; hour++) {
      if (!bookedTimes.includes(hour)) {
        const slot = new Date(date);
        slot.setHours(hour, 0, 0, 0);
        availableSlots.push(slot);
      }
    }

    return availableSlots;
  } catch (error) {
    console.error('Error getting available time slots:', error);
    throw error;
  }
} 