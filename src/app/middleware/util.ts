import { getAuth } from '@clerk/express'
import User from '../model/user.model'

// Extend the Request type to include a 'user' property
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

// Use `getAuth()` to protect a route based on authorization status
import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';

export async function middleware(req: ExpressRequest, next: NextFunction): Promise<void | Response> {
    try {
        const { userId } = getAuth(req);
        console.log("middleware userId:", userId);
        // console.log(userId);

        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            return Response.json({ error: 'User not found in MongoDB' });
        }

        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        console.error('Error fetching user:', error);
        Response.json({ 'error': 'Server error' });
    }
}

export const config = {
    matcher: '/api/test/:path*', // Apply middleware to all user-related API routes
}
