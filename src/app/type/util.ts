export interface EventData {
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
  _id: string;
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

export interface ErrorResponse {
  response: {
    data: {
      message: string;
    };
  };
}
