import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { MemeTicker } from "@/lib/types";

interface RawMemeTrending {
  name: string;
  link: string;
  image_url: string;
}

export async function GET() {
  try {
    // Get path to trending_memes.json in root directory
    const filePath = path.join(process.cwd(), 'trending_memes.json');
    
    // Read file
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const rawMemes: RawMemeTrending[] = JSON.parse(fileContents);
    
    console.log('Loaded trending_memes.json:', JSON.stringify(rawMemes).substring(0, 200) + '...');
    
    if (!Array.isArray(rawMemes) || rawMemes.length === 0) {
      console.error('trending_memes.json contains no valid data');
      return NextResponse.json([
        {
          id: "placeholder-1",
          ticker: "PLACE",
          title: "Placeholder (No trending memes)",
          imageUrl: "/placeholder.svg",
          price: 50,
          percentChange: 5,
          volume: 5000,
          timestamp: Date.now(),
          link: ""
        }
      ]);
    }
    
    // Transform the data to match the MemeTicker interface
    const memes: MemeTicker[] = rawMemes.map((meme, index) => {
      // Generate a ticker from the name (first 5 chars, uppercase)
      let ticker = 'MEME';
      
      if (meme.name) {
        // Take first word and use first 5 chars
        const firstWord = meme.name.split(' ')[0];
        ticker = firstWord.slice(0, 5).toUpperCase().replace(/\s+/g, '_');
      }
      
      // Ensure image_url exists and use placeholder if not
      const imageUrl = meme.image_url && meme.image_url.startsWith('http') 
        ? meme.image_url 
        : '/placeholder.svg';
      
      return {
        id: `trending-${index}`,
        ticker: ticker,
        title: meme.name || `Trending Meme ${index + 1}`,
        imageUrl: imageUrl, // Map snake_case to camelCase and ensure valid URL
        price: Math.floor(Math.random() * 1000), // Random lulz score
        percentChange: Math.floor(Math.random() * 40) - 20, // Random percent change
        volume: Math.floor(Math.random() * 100000), // Random volume
        timestamp: Date.now(),
        link: meme.link || ""
      };
    });
    
    console.log(`Transformed ${memes.length} memes, first meme:`, 
      JSON.stringify(memes[0]).substring(0, 200) + '...');
    
    return NextResponse.json(memes);
  } catch (error) {
    console.error("Error loading trending memes:", error);
    return NextResponse.json(
      [{ 
        id: "error-meme",
        ticker: "ERROR",
        title: "Error loading trending memes",
        imageUrl: "/placeholder.svg", 
        price: 0.01,
        percentChange: -99.9,
        volume: 1,
        timestamp: Date.now(),
        link: ""
      }],
      { status: 200 } // Return 200 to display the error meme
    );
  }
} 