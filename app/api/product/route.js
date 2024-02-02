import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";




export async function GET(request){

 
// Replace the uri string with your connection string.
const uri = 'mongodb+srv://Foodapp23:yRuaTaUny6m1SY6Z@cluster0.zlqfgvh.mongodb.net/stock?retryWrites=true&w=majority';

const client = new MongoClient(uri);


  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');

    
    const query = { };
    const products = await inventory.find(query).toArray();

    return  NextResponse.json({success:true, products})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}





export async function POST(request){

 
    let body = await request.json()
    const uri = process.env.NEXT_DB_URI;
    
    const client = new MongoClient(uri);
    
    
      try {
        const database = client.db('stock');
        const inventory = database.collection('inventory');
        const product = await inventory.insertOne(body);
    
        return  NextResponse.json({product, ok:true})
      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
      }
    }
    
    
