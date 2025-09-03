export interface EventData {
  _id: string;
  eventId: string;
  eventName: string;
  eventDate: Date;
  eventTime: string;
  location: string;
  price: number;
  imageURL: string;
  organizerId: string;
  organizerName: string;
  organizerEmail: string;
  organizerContact: string;
  seats: number;
  bookedSeats: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface UserData {
  id: string;
  firstName: string;
  fullName: string;
  email: string;
  lastName: string;
  contactNumber?: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  _id: string;
}

export interface TicketData {
  _id: string;
  ticketId: string;
  eventId: string;
  userId: string;
  seatNumber?: string | null;
  price: number;
  name: string;
  email: string;
  phone: string;
  status: "booked" | "cancelled" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

export interface CurrentUser {
  id: string;
  firstName: string;
  fullName: string;
  email: string;
  lastName: string;
  contactNumber?: string;
}

export interface ErrorResponse {
  response: {
    data: {
      message: string;
    };
  };
}

export interface EventData {
  _id: string;
  eventId: string;
  eventName: string;
  eventDate: Date;
  eventTime: string;
  location: string;
  price: number;
  imageURL: string;
  description: string;
  seats: number;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minAmount?: number;
  maxDiscount?: number;
  expiryDate: string;
  isActive: boolean;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  keepUpdated: boolean;
  agreeTerms: boolean;
}
