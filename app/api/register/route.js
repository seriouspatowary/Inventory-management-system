import { MongoClient } from "mongodb";
import User from "@/models/user";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request) => {
    try {
        // Parse the request body JSON
        const body = await request.json();
        const { name, username, password } = body;

        if (!name || !username || !password) {
            return new Response("Name, Username, and Password are required", { status: 401 });
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

        // Check if username already exists
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return new Response("Username already exists", { status: 400 });
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(12);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create user object
        const newUser = {
            name,
            username,
            password: hashedPassword,
        };

        // Insert user into collection
        await usersCollection.insertOne(newUser);

        // Close the MongoDB client connection
        await client.close();

        return new Response("User created successfully", { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return new Response("An error occurred while creating the user", { status: 500 });
    }
};
