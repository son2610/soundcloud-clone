import type { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, response: NextResponse) {
    //stack overflow: nextjs 13 query string parameters
    const filename = request.nextUrl.searchParams.get("audio");
    // console.log("check filename: ", filename);
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${filename}`
    );
}
