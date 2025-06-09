import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_SECRET as string,
})

export async function POST(req: Request) {
    try {
        const { amount } = await req.json();

        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return Response.json({ error: "Invalid amount" }, { status: 400 });
        }

        const order = await razorpay.orders.create({
            amount, // Convert to paise
            currency: "INR",
            receipt: `receipt_${new Date().getTime()}`,
        })

        if (!order) return Response.json({ error: "Some error occurred" }, { status: 500 });

        return Response.json(order);

    } catch (error) {
        console.error("Error in Razorpay payment route:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}