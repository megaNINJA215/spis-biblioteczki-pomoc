import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    const data: {
        ISBN: string,
        title: string,
        authors: string[],
        coverLink: string | null,
        pageCount: number | null,
        originalTitle: string | null,
        volumeNumber: number | null,
        mode: "owned" | "wanted"
    } = await request.json();
    console.log(`Saving book:`, data);


    await prisma.Books.create({
        data: {
            ISBN: data.ISBN,
            cover: data.coverLink,
            title: data.title,
            original_title: data.originalTitle,
            volume: Number(data.volumeNumber),
            authors: JSON.stringify(data.authors),
            page_count: data.pageCount,
            is_owned: data.mode === "owned",
        }
    });

    return NextResponse.json({
        ok: true
    });
}
