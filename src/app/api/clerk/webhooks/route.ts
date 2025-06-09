import { Webhook } from "svix";
import { NextRequest, NextResponse } from "next/server";
import User from "@/app/model/user.model";
import mongoDB_Connection from "@/app/model/db";

export async function POST(req: NextRequest) {
    try {
        // Connect to MongoDB
        await mongoDB_Connection();

        const SIGNING_SECRET = process.env.SIGNING_SECRET;

        if (!SIGNING_SECRET) {
            console.error('Error: SIGNING_SECRET is not defined in .env');
            return NextResponse.json({
                success: false,
                message: 'Error: Please add SIGNING_SECRET from Clerk Dashboard to .env'
            }, { status: 500 });
        }

        // Get the headers
        const svix_id = req.headers.get('svix-id');
        const svix_timestamp = req.headers.get('svix-timestamp');
        const svix_signature = req.headers.get('svix-signature');

        // Check if headers exist
        if (!svix_id || !svix_timestamp || !svix_signature) {
            return NextResponse.json({
                success: false,
                message: 'Error: Missing svix headers',
            }, { status: 400 });
        }

        // Get the body as text first, then convert to buffer
        const body = await req.text();
        const bodyBuffer = Buffer.from(body, 'utf8');

        console.log('Webhook headers received:', {
            svix_id,
            svix_timestamp,
            svix_signature
        });

        // Create new Webhook instance and verify
        const wh = new Webhook(SIGNING_SECRET);

        let evt: any;
        try {
            evt = wh.verify(bodyBuffer, {
                'svix-id': svix_id,
                'svix-timestamp': svix_timestamp,
                'svix-signature': svix_signature,
            });
        } catch (err) {
            console.error('Webhook verification failed:', err);
            return NextResponse.json({
                success: false,
                message: 'Webhook verification failed',
            }, { status: 400 });
        }

        const { id } = evt.data;
        const eventType = evt.type;

        console.log('Event type:', eventType);
        console.log('User ID:', id);

        // Handle user creation
        if (eventType === 'user.created') {
            console.log('Processing user.created event');

            const userData = evt.data;
            const email = userData.email_addresses?.[0]?.email_address;
            const username = userData.username || userData.first_name || id;

            if (!email) {
                console.error('No email found in user data');
                return NextResponse.json({
                    success: false,
                    message: 'No email found in user data',
                }, { status: 400 });
            }

            try {
                // Check if user already exists
                const existingUser = await User.findOne({ clerkId: id });

                if (existingUser) {
                    console.log('User already exists in MongoDB');
                    return NextResponse.json({
                        success: true,
                        message: 'User already exists in MongoDB',
                    });
                }

                // Create new user
                const newUser = new User({
                    clerkId: id,
                    username: username,
                    email: email,
                    firstName: userData.first_name || '',
                    lastName: userData.last_name || '',
                    profileImageUrl: userData.profile_image_url || '',
                });

                await newUser.save();
                console.log('User successfully saved to MongoDB:', id);

                return NextResponse.json({
                    success: true,
                    message: 'User created successfully',
                });

            } catch (error) {
                console.error('Error saving user to MongoDB:', error);
                return NextResponse.json({
                    success: false,
                    message: 'Error saving user to database',
                }, { status: 500 });
            }
        }

        // Handle user deletion
        if (eventType === 'user.deleted') {
            console.log('Processing user.deleted event');

            try {
                const deletedUser = await User.findOneAndDelete({ clerkId: id });

                if (deletedUser) {
                    console.log('User successfully deleted from MongoDB:', id);
                } else {
                    console.log('User not found in MongoDB:', id);
                }

                return NextResponse.json({
                    success: true,
                    message: 'User deletion processed',
                });

            } catch (error) {
                console.error('Error deleting user from MongoDB:', error);
                return NextResponse.json({
                    success: false,
                    message: 'Error deleting user from database',
                }, { status: 500 });
            }
        }

        // Handle user updates
        if (eventType === 'user.updated') {
            console.log('Processing user.updated event');

            const userData = evt.data;
            const email = userData.email_addresses?.[0]?.email_address;
            const username = userData.username || userData.first_name || id;

            try {
                const updatedUser = await User.findOneAndUpdate(
                    { clerkId: id },
                    {
                        username: username,
                        email: email,
                        firstName: userData.first_name || '',
                        lastName: userData.last_name || '',
                        profileImageUrl: userData.profile_image_url || '',
                    },
                    { new: true }
                );

                if (updatedUser) {
                    console.log('User successfully updated in MongoDB:', id);
                } else {
                    console.log('User not found for update:', id);
                }

                return NextResponse.json({
                    success: true,
                    message: 'User update processed',
                });

            } catch (error) {
                console.error('Error updating user in MongoDB:', error);
                return NextResponse.json({
                    success: false,
                    message: 'Error updating user in database',
                }, { status: 500 });
            }
        }

        // Handle other event types
        console.log(`Unhandled event type: ${eventType}`);
        return NextResponse.json({
            success: true,
            message: `Event type ${eventType} received but not processed`,
        });

    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({
            success: false,
            message: 'Internal server error',
        }, { status: 500 });
    }
}