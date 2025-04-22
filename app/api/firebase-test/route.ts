import { NextResponse } from "next/server";
import { initFirebase } from "@/lib/firebase-admin";
import { getApps } from "firebase-admin/app";

// This endpoint is for debugging Firebase initialization only
export async function GET() {
  try {
    // Test environment variables
    const envVars = {
      project_id: process.env.FIREBASE_PROJECT_ID ? "✓ Set" : "✗ Missing",
      client_email: process.env.FIREBASE_CLIENT_EMAIL ? "✓ Set" : "✗ Missing",
      private_key: process.env.FIREBASE_PRIVATE_KEY ? "✓ Set" : "✗ Missing",
      private_key_info: process.env.FIREBASE_PRIVATE_KEY ? {
        length: process.env.FIREBASE_PRIVATE_KEY.length,
        starts_with_quotes: process.env.FIREBASE_PRIVATE_KEY.startsWith('"'),
        ends_with_quotes: process.env.FIREBASE_PRIVATE_KEY.endsWith('"'),
        contains_begin_key: process.env.FIREBASE_PRIVATE_KEY.includes("BEGIN PRIVATE KEY"),
        contains_end_key: process.env.FIREBASE_PRIVATE_KEY.includes("END PRIVATE KEY"),
        contains_escaped_newlines: process.env.FIREBASE_PRIVATE_KEY.includes("\\n"),
      } : "N/A"
    };
    
    // Attempt to initialize Firebase
    console.log("Testing Firebase initialization...");
    const app = initFirebase();
    
    // Check if any apps are initialized
    const appsInitialized = getApps().length > 0;
    
    // Return diagnostic info
    return NextResponse.json({
      environment: process.env.NODE_ENV,
      vercel_environment: process.env.VERCEL_ENV || "Not Vercel",
      timestamp: new Date().toISOString(),
      environment_variables: envVars,
      firebase_apps_initialized: appsInitialized,
      firebase_init_result: app ? "Success" : "Failed",
    });
  } catch (error) {
    console.error("Firebase test error:", error);
    return NextResponse.json({
      error: "Firebase test failed",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : null,
    }, { status: 500 });
  }
} 