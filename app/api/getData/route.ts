import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const data = await request.json();
    const isbn = data?.isbn ?? null;
    console.log("Scanned ISBN:", isbn);



    return NextResponse.json({
        title: "Kroniki Diuny 4",
        author: "Frank Herbert",
        coverUrl: "https://www.elibri.com.pl/attachments/e8c53198f80f900be76f/cover/original.jpg"
    });
}
