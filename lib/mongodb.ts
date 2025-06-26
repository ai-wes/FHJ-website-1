import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

if (!MONGODB_DB) {
  throw new Error(
    "Please define the MONGODB_DB environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI!);

  await client.connect();
  const db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Define a basic structure for your articles for clarity
// You'll store documents matching this structure in your MongoDB 'articles' collection.
export interface Article {
  _id?: string; // MongoDB ObjectId as string
  slug: string;
  title: string;
  date: string; // Store as ISO date string for proper sorting, e.g., "2023-05-15T00:00:00.000Z"
  excerpt: string;
  content: string; // Full article content, could be Markdown or HTML
  cover_image?: string; // Primary image field used by API
  image?: string; // Legacy field, kept for compatibility
  category?: string;
  author?: string;
  audio_url?: string;
  reading_time?: string;
}
