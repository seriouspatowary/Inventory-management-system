import { MongoClient } from "mongodb";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request) => {
    try {
        // Parse the request body JSON
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return new Response("Username and Password are required", { status: 401 });
        }

        // Get MongoDB URI from environment variable
        const uri = process.env.NEXT_DB_URI;

        // Create MongoClient instance
        const client = new MongoClient(uri);

        // Connect to MongoDB
        await client.connect();

        // Access the database and collection
        const database = client.db('stock');
        const usersCollection = database.collection('users');

        // Find the user by username
        const user = await usersCollection.findOne({ username });

        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        // Verify the password using bcryptjs
        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return new Response("Invalid password", { status: 401 });
        }

        // Generate JWT token for authentication
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const response = NextResponse.json({ message: "Login successfull"},{ status: 200, headers: { "Content-Type": "application/json" } });
        
        response.cookies.set("token", token, { httpOnly: true });
        

        // Close the MongoDB client connection
        await client.close();
    

        // Return the JWT token in the response as a JSON object
        // return new Response(JSON.stringify({ token }), { status: 200, headers: { "Content-Type": "application/json" } });
        return response;
    } catch (error) {
        console.error("Error:", error);
        return new Response("An error occurred while logging in", { status: 500 });
    }
};