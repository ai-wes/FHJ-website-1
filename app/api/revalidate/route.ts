import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

// This is a secret token that should be stored in your environment variables
const REVALIDATE_TOKEN = process.env.REVALIDATE_TOKEN;

export async function POST(request: NextRequest) {
  const token = request.headers.get("x-revalidate-token");

  if (token !== REVALIDATE_TOKEN) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const tag = request.nextUrl.searchParams.get("tag");

  if (!tag) {
    return NextResponse.json({ message: "Tag is required" }, { status: 400 });
  }

  try {
    revalidateTag(tag);
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { message: "Error revalidating", error: (error as Error).message },
      { status: 500 }
    );
  }
}
