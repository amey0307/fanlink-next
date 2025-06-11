'use client'
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Lock, LucideLock, LucideLockOpen } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

// Add Razorpay type to window
declare global {
    interface Window {
        Razorpay: any;
    }
}

interface CurrentUser {
    id: string;
    firstName: string;
    fullName: string;
    email: string;
    lastName: string;
    contactNumber?: string;
}

interface AuthContextType {
    currentUser: CurrentUser | any;
    signIn: (user: CurrentUser | any) => Promise<CurrentUser> | any;
}

function PaymentComponent({
    eventData,
    appliedCoupon = null,
    originalPrice = 0,
    discountAmount = 0,
    contactInfo,
    ticketQuantity = 1,
    formValid
}: {
    eventData: { eventId: string, price: number, _id: string },
    appliedCoupon?: any,
    originalPrice?: number,
    discountAmount?: number,
    contactInfo?: any,
    ticketQuantity?: number,
    formValid?: boolean | any
}) {
    const { currentUser }: AuthContextType = useAuth();
    const { openSignIn } = useClerk();

    const registerEvent = async () => {
        try {
            await fetch("/api/user/book-event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    eventId: eventData.eventId,
                    userId: currentUser?.id,
                    appliedCoupon: appliedCoupon,
                    contactInfo: contactInfo,
                    quantity: ticketQuantity,
                }),
            });
        } catch (err) {
            const errorMessage = (err instanceof Error && err.message) ? err.message : "An unknown error occurred";
            throw new Error(errorMessage);
        }
        toast.success("Event booked successfully");
    };

    // Function to load the Razorpay script dynamically
    function loadScript(src: string) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    async function displayRazorpay() {
        if (!formValid) {
            toast.error('Please Fill all the required fields');
            return;
        }
        if (!currentUser?.id) {
            toast.error("Please login to book event", { id: "login-required" });
            return;
        }

        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js",
        );

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        const result = await axios({
            method: "POST",
            url: "/api/user/pay",
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                amount: Number(Math.floor(eventData.price * 100)) || 200, // Use final price after discount
                currency: "INR",
            },
        });

        if (!result) {
            alert("Server error. Are you online?");
            return;
        }

        const { amount, id: order_id, currency } = result.data;

        const options = {
            key: "rzp_test_arBDX7CvZR2UsM",
            amount: amount,
            currency: currency,
            name: currentUser.firstName,
            description: `Event Ticket${appliedCoupon ? ` (Coupon: ${appliedCoupon.code})` : ''}`,
            order_id: order_id,
            prefill: {
                name: currentUser.fullName,
                email: currentUser.email,
                contact: currentUser.contactNumber || "9999999999",
            },
            notes: {
                address: "FanLink Corporate Office",
                couponCode: appliedCoupon?.code || "None",
                discountApplied: discountAmount.toString(),
                originalAmount: originalPrice.toString(),
            },
            handler: async function (response: any) {
                try {
                    await registerEvent();
                    window.location.href = `/successPage?eventId=${eventData._id}&amount=${eventData.price}&transactionId=${response.razorpay_payment_id}&coupon=${appliedCoupon?.code || ''}&discount=${discountAmount}`;
                } catch (err) {
                    const errorMessage = (err instanceof Error && err.message) ? err.message : "Payment failed. Please try again.";
                    toast.error(errorMessage);
                }
            },
            theme: {
                color: "#052e16",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }

    const handleSignIn = (eventId: string) => {
        openSignIn({
            afterSignInUrl: `/event/${eventId}`, // Redirect here after sign-in
            afterSignUpUrl: `/event/${eventId}`, // Redirect here after sign-up
        });
    };

    return (
        <div className="App">
            <header className="App-header">

                <button
                    className=" App-link w-[18rem] mx-auto dark:bg-green-400 dark:hover:bg-green-50 p-2 rounded-sm text-black border-black border-[1.5px] bg-green-200 hover:bg-slate-200 hover:border-slate-500 transition-all duration-150 cursor-pointer disabled:cursor-not-allowed disabled:dark:bg-slate-200"
                    onClick={displayRazorpay} disabled={!formValid}
                >
                    {
                        currentUser?.id ? (
                            <span className="flex mx-auto items-center justify-center gap-2" >
                                {
                                    !formValid ?
                                        <LucideLock className="w-5 h-5" /> :
                                        <LucideLockOpen className="w-5 h-5" />
                                }

                                Checkout
                            </span>
                        ) : (
                            <div className="flex items-center justify-center gap-2" onClick={() => {
                                handleSignIn(eventData?._id);
                            }}>
                                <Lock className="w-5 h-5" />
                                Login to Buy
                            </div>
                        )
                    }
                </button>


            </header>
        </div>
    );
}

export default PaymentComponent;
