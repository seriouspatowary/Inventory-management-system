import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        // Check if the authentication token is present in the request cookies
        const token = request.cookies.get('token');
        
        
        

        if (!token) {
            // If the token is not present, the user is not logged in
            return NextResponse.json({
                isLoggedIn: false,
                message: 'User not logged in',
            });
        }

        try {
            // Validate the token
            const decodedToken = jwt.verify(token.value, process.env.JWT_SECRET);

            // If the token is valid, the user is logged in
            return NextResponse.json({
                isLoggedIn: true,
                username: decodedToken.username, // Optionally include additional user info
            });
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                // If the token is expired, return a specific error message
                return NextResponse.json({
                    isLoggedIn: false,
                    message: 'Token expired',
                });
            } else {
                // If the token is invalid for any other reason, return a generic error message
                return NextResponse.json({
                    isLoggedIn: false,
                    message: 'Invalid token',
                });
            }
        }
    } catch (error) {
        console.error('Error:', error);
        // If an unexpected error occurs, return a generic error message
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
