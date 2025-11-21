import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const data = await request.json();
    const { ISBN, title, author, coverUrl, mode } = data;
    console.log(`Saving book [${mode}]:`, { ISBN, title, author, coverUrl });

    return NextResponse.json({
        ok: true
    });
}
