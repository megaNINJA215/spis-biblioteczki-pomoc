import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const isbn = data?.isbn ?? null;
        console.log("Scanned ISBN:", isbn);
        return NextResponse.json({ ok: true, isbn });
    } catch (e) {
        console.error("/api/isbn error:", e);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
