"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useTheme } from "@/app/context/ThemeProvider";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  ArrowLeft,
  Minus,
  Plus,
  CreditCard,
  Tag,
  X,
  Check,
  Contact,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import PaymentComponent from "@/app/components/PaymentComponent";

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

interface Coupon {
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minAmount?: number;
  maxDiscount?: number;
  expiryDate: string;
  isActive: boolean;
}

interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  keepUpdated: boolean;
  agreeTerms: boolean;
}

// Sample coupons data
const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: "SAVE20",
    description: "Get 20% off on all events",
    discountType: "percentage",
    discountValue: 20,
    maxDiscount: 500,
    expiryDate: "2026-12-31",
    isActive: true,
  },
  {
    code: "FIRST100",
    description: "₹100 off on your first booking",
    discountType: "fixed",
    discountValue: 100,
    minAmount: 200,
    expiryDate: "2024-12-31",
    isActive: true,
  },
  {
    code: "FANLINK50",
    description: "₹50 off on any event",
    discountType: "fixed",
    discountValue: 50,
    minAmount: 150,
    expiryDate: "2024-12-31",
    isActive: true,
  },
  {
    code: "WELCOME15",
    description: "15% off for new users",
    discountType: "percentage",
    discountValue: 15,
    maxDiscount: 300,
    minAmount: 100,
    expiryDate: "2024-12-31",
    isActive: true,
  },
  {
    code: "STUDENT10",
    description: "Student discount - 10% off",
    discountType: "percentage",
    discountValue: 10,
    maxDiscount: 200,
    minAmount: 50,
    expiryDate: "2024-12-31",
    isActive: true,
  },
];

function CheckoutPage() {
  const { currentUser } = useAuth() as any;
  const params = useParams();
  const eventId = params.eventId as string;

  // State management
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.primaryEmailAddress?.emailAddress || "",
    phone: "",
    keepUpdated: false,
    agreeTerms: false,
  });

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Simulate loading delay
  useEffect(() => {

    const delay = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
    };

    delay();
  }, []);

  // Update handleContactInfoChange to clear errors
  const handleContactInfoChange = (
    field: keyof ContactInfo,
    value: string | boolean,
  ) => {
    setContactInfo((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear specific field error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Check if form is valid for payment
  const isFormValid = () => {
    return (
      contactInfo.firstName.trim() &&
      contactInfo.email.trim() &&
      /\S+@\S+\.\S+/.test(contactInfo.email) &&
      contactInfo.agreeTerms
    );
  };

  // Fetch event details and pre-fill contact info
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (eventId) {
        try {
          const response = await axios.get(`/api/event/get/${eventId}`);
          setEvent(response.data.data);

          // Pre-fill contact info if user is logged in
          if (currentUser) {
            setContactInfo((prev) => ({
              ...prev,
              firstName: currentUser.firstName || "",
              lastName: currentUser.lastName || "",
              email: currentUser?.primaryEmailAddress?.emailAddress || "",
              phone: currentUser.contactNumber || "",
            }));
          }
        } catch (error) {
          console.error("Error fetching event details:", error);
          toast.error("Failed to load event details");
        }
      }
      setLoading(false);
    };

    fetchEventDetails();
  }, [eventId, currentUser]);

  // Handle ticket quantity changes
  const handleQuantityChange = (increment: boolean) => {
    if (increment && ticketQuantity < 10) {
      setTicketQuantity((prev) => prev + 1);
    } else if (!increment && ticketQuantity > 1) {
      setTicketQuantity((prev) => prev - 1);
    }
  };

  // Calculate discount amount
  const calculateDiscount = (coupon: Coupon, originalPrice: number): number => {
    if (!coupon) return 0;

    let discount = 0;

    if (coupon.discountType === "percentage") {
      discount = (originalPrice * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    // Ensure discount doesn't exceed the original price
    return Math.min(discount, originalPrice);
  };

  // Validate and apply coupon
  const applyCoupon = () => {
    setCouponError("");

    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    const coupon = AVAILABLE_COUPONS.find(
      (c) => c.code.toLowerCase() === couponCode.toLowerCase() && c.isActive,
    );

    if (!coupon) {
      setCouponError("Invalid coupon code");
      return;
    }

    // Check expiry date
    if (new Date(coupon.expiryDate) < new Date()) {
      setCouponError("This coupon has expired");
      return;
    }

    const subtotalAmount = (event?.price || 0) * ticketQuantity;

    // Check minimum amount
    if (coupon.minAmount && subtotalAmount < coupon.minAmount) {
      setCouponError(`Minimum order amount should be ₹${coupon.minAmount}`);
      return;
    }

    setAppliedCoupon(coupon);
    setShowCouponInput(false);
    setCouponCode("");
    toast.success(`Coupon "${coupon.code}" applied successfully!`);
  };

  // Remove applied coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    toast.info("Coupon removed");
  };

  // Calculate totals
  const subtotal = (event?.price || 0) * ticketQuantity;
  const couponDiscount = appliedCoupon
    ? calculateDiscount(appliedCoupon, subtotal)
    : 0;
  const total = subtotal - couponDiscount;

  if (loading) {
    return (
      <div
        className={`min-h-screen bg-gray-50 dark:bg-gradient-to-br from-green-950 to-[#000000]`}
      >
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-80 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div
        className={`min-h-screen bg-gray-50 dark:bg-gradient-to-br from-green-950 to-[#000000] flex items-center justify-center`}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Event Not Found
          </h1>
          <Link
            href="/dashboard"
            className="text-green-600 dark:text-green-400 hover:underline"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gradient-to-br from-green-950 to-[#000000]`}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/event/${eventId}`}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Purchase Ticket
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {format(new Date(Date.now()), "MMMM dd, yyyy")}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Info */}
            <div className="bg-white dark:bg-[#050a05aa] border-2 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {event.eventName}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">
                      DATE AND TIME
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {format(new Date(event.eventDate), "EEEE, MMMM dd")}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {event.eventTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">PLACE</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {event.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Ticket Selection */}
            <div className="bg-white dark:bg-[#050a05aa] border-2 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Ticket size={20} /> Ticket
              </h3>

              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    ₹{event.price} / Ticket
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(false)}
                    disabled={ticketQuantity <= 1}
                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="font-semibold text-gray-900 dark:text-white min-w-[2rem] text-center">
                    {ticketQuantity}
                  </span>

                  <button
                    onClick={() => handleQuantityChange(true)}
                    disabled={ticketQuantity >= 10}
                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-[#050a05aa] border-2 rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex gap-2 items-center">
                  <Contact size={20} /> Contact information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First name{" "}
                    <span className="text-xs text-red-400 text-2xl">*</span>
                  </label>
                  <input
                    type="text"
                    value={contactInfo.firstName}
                    onChange={(e) =>
                      handleContactInfoChange("firstName", e.target.value)
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Amanda"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last name{" "}
                    <span className="text-xs text-slate-500 text-2xl">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={contactInfo.lastName}
                    onChange={(e) =>
                      handleContactInfoChange("lastName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email{" "}
                    <span className="text-xs text-red-400 text-2xl">*</span>
                  </label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    required
                    onChange={(e) =>
                      handleContactInfoChange("email", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Amanda@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone number{" "}
                    <span className="text-xs text-gray-500">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) =>
                      handleContactInfoChange("phone", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="(724) 651-7073"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={contactInfo.keepUpdated}
                    onChange={(e) =>
                      handleContactInfoChange("keepUpdated", e.target.checked)
                    }
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Keep me updated on this event
                  </span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={contactInfo.agreeTerms}
                    onChange={(e) =>
                      handleContactInfoChange("agreeTerms", e.target.checked)
                    }
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    I agree with the Terms of Use & Privacy Policy <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="bg-white dark:bg-[#050a05aa] border-2 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Promo Code
                </h3>
                {!showCouponInput && !appliedCoupon && (
                  <button
                    onClick={() => setShowCouponInput(true)}
                    className="text-green-600 dark:text-green-400 hover:underline text-sm cursor-pointer"
                  >
                    Add coupon
                  </button>
                )}
              </div>

              {appliedCoupon ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-800 dark:text-green-200">
                          {appliedCoupon.code}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-300">
                          {appliedCoupon.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : showCouponInput ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      onKeyPress={(e) => e.key === "Enter" && applyCoupon()}
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-4 py-2 dark:bg-green-400 dark:hover:bg-green-50 text-black rounded-md border-black border-[1.5px] bg-green-200 hover:bg-slate-200 hover:border-slate-500 transition-all duration-150 cursor-pointer"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => {
                        setShowCouponInput(false);
                        setCouponCode("");
                        setCouponError("");
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {couponError}
                    </p>
                  )}

                  {/* Available Coupons */}
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Available coupons:
                    </p>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {AVAILABLE_COUPONS.filter((c) => c.isActive).map(
                        (coupon) => (
                          <div
                            key={coupon.code}
                            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => {
                              setCouponCode(coupon.code);
                              applyCoupon();
                            }}
                          >
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white text-sm">
                                {coupon.code}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {coupon.description}
                              </p>
                            </div>
                            <span className="text-xs text-green-600 dark:text-green-400">
                              {coupon.discountType === "percentage"
                                ? `${coupon.discountValue}% OFF`
                                : `₹${coupon.discountValue} OFF`}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Have a promo code? Click "Add coupon" to apply it.
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#050a05aa] border-2 rounded-lg p-6 shadow-lg sticky top-30">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Summary
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {ticketQuantity}x
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ₹{event.price} / Ticket
                  </span>
                </div>

                <hr className="border-gray-200 dark:border-gray-700" />

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Subtotal
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    ₹{subtotal}
                  </span>
                </div>

                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Coupon ({appliedCoupon.code})
                    </span>
                    <span className="text-green-600 dark:text-green-400">
                      -₹{couponDiscount.toFixed(0)}
                    </span>
                  </div>
                )}

                <hr className="border-gray-200 dark:border-gray-700" />

                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-gray-900 dark:text-white">
                    ₹{total.toFixed(0)}
                  </span>
                </div>

                {appliedCoupon && couponDiscount > 0 && (
                  <div className="text-sm text-green-600 dark:text-green-400">
                    You saved ₹{couponDiscount.toFixed(0)}!
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment method
                  </p>
                  <div className="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <CreditCard className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      Razorpay
                    </span>
                    <span className="text-xs text-gray-500 ml-auto">
                      •••• 5087
                    </span>
                  </div>
                </div>

                {/* Conditional PaymentComponent */}
                <PaymentComponent
                  eventData={{
                    ...event,
                    price: total, // Pass the final price after discount
                  }}
                  appliedCoupon={appliedCoupon}
                  originalPrice={subtotal}
                  discountAmount={couponDiscount}
                  contactInfo={contactInfo}
                  ticketQuantity={ticketQuantity}
                  formValid={isFormValid()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
