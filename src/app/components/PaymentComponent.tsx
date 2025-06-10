import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

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

function PaymentComponent({ eventData }: { eventData: { eventId: string, price: number } }) {
    const { currentUser, signIn }: AuthContextType = useAuth();

    const registerEvent = async () => {
        console.log("register user", currentUser);

        try {
            await fetch("/api/user/book-event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    eventId: eventData.eventId,
                    userId: currentUser?.id,
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
        if (!currentUser) {
            toast.error("Please login to book event");
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
                amount: Number(Math.floor(eventData?.price * 100)) | 200, // Amount in paise
                currency: "INR",
            },
        });

        if (!result) {
            alert("Server error. Are you online?");
            return;
        }

        // console.log("result : ", result.data);

        const { amount, id: order_id, currency } = result.data;

        const options = {
            key: "rzp_test_arBDX7CvZR2UsM", // Enter the Key ID generated from the Dashboard
            amount: amount,
            currency: currency,
            name: currentUser.firstName,
            description: "Test Transaction",
            order_id: order_id,
            prefill: {
                name: currentUser.fullName,
                email: currentUser.email,
                contact: currentUser.contactNumber || "9999999999",
            },
            notes: {
                address: "Soumya Dey Corporate Office",
            },
            handler: async function () {
                try {
                    await registerEvent();
                    window.location.href = "/successPage";
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

    return (
        <div className="App">
            <header className="App-header">
                <button
                    className=" App-link w-[18rem] mx-auto dark:bg-green-400 dark:hover:bg-green-50 p-2 rounded-sm text-black border-black border-[1.5px] bg-green-200 hover:bg-slate-200 hover:border-slate-500 transition-all duration-150 cursor-pointer"
                    onClick={displayRazorpay}
                >
                    Purchase Ticket
                </button>
            </header>
        </div>
    );
}

export default PaymentComponent;
