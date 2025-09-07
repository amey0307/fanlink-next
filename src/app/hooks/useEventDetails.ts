import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

interface EventData {
  _id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  location: string;
  price: number;
  imageURL: string;
  description: string;
  seats: number;
}

interface BookingData {
  _id: string;
  ticketId: string;
  eventId: string;
  userId: string;
  seatNumber: string;
  price: number;
  name: string;
  email: string;
  phone: string;
  status: 'booked' | 'cancelled' | 'used';
  createdAt: string;
  updatedAt: string;
  paymentId: string;
  length: number;
}

interface UseEventDetailsResult {
  event: EventData | null;
  booking: BookingData[] | null;
  loading: boolean;
  error: string | null;
  fetchEventDetails: (eventId: string, userId: string) => Promise<void>;
}

export function useEventDetails(): UseEventDetailsResult {
  const [event, setEvent] = useState<EventData | null>(null);
  const [booking, setBooking] = useState<BookingData[] | null>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEventDetails = useCallback(async (eventId: string, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/event/get/${eventId}`);
      const bookingData: any = await axios.get(`/api/ticket/getBooked?userId=${userId}&eventId=${eventId}`);
      setEvent(response.data.data);
      setBooking(bookingData.data.data);
    } catch (err: any) {
      setError('Failed to load event details');
      toast.error('Failed to load event details');
    } finally {
      setLoading(false);
    }
  }, []);

  return { event, booking, loading, error, fetchEventDetails };
}
