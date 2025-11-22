import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const mode = new URL(request.url).searchParams.get("mode") as "owned" | "wanted" | null;
    const limitParam = new URL(request.url).searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : 25;
    const skipParam = new URL(request.url).searchParams.get("skip");
    const skip = skipParam ? parseInt(skipParam) : 0;

    const books = await prisma.books.findMany({
        where: mode ? { is_owned: mode === "owned" } : {},
        orderBy: { title: "asc" },
        take: limit,
        skip: skip,
        select: {
            ISBN: true,
            title: true,
            authors: true,
            cover: true,
            page_count: true,
            price: true,
        }
    });

    return NextResponse.json({
        ok: true,
        books: books.map(book => ({
            ...book,
            authors: JSON.parse(book.authors)
        })),
    });
}
