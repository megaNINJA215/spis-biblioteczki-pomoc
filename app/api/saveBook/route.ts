import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const data = await request.json();
    const { ISBN, title, authors, coverLink, originalTitle, volumeNumber, mode } = data;
    console.log(`Saving book [${mode}]:`, {
        ISBN,
        title,
        authors,
        coverLink,
        originalTitle,
        volumeNumber,
        mode
    });

    return NextResponse.json({
        ok: true
    });
}
