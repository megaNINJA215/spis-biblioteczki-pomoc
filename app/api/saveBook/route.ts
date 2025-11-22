import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    const data: {
        ISBN: string,
        title: string,
        authors: string[],
        coverLink: string | null,
        pageCount: number | null,
        price: number | null,
        mode: "owned" | "wanted"
    } = await request.json();

    const existingBook = await prisma.books.findFirst({
        where: { ISBN: data.ISBN }
    });

    if (existingBook) {
        return NextResponse.json({
            ok: false,
            message: `Książka o podanym ISBN już istnieje w bazie w kategorii ${existingBook.is_owned ? "posiadane" : "do kupienia"}.`
        });
    }

    await prisma.books.create({
        data: {
            ISBN: data.ISBN,
            cover: data.coverLink,
            title: data.title,
            authors: JSON.stringify(data.authors),
            page_count: data.pageCount,
            is_owned: data.mode === "owned",
            price: data.price,
        }
    });

    return NextResponse.json({
        ok: true
    });
}
