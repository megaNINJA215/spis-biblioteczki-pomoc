import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function GET() {
    const owned_books = (await prisma.books.count({
        where: { is_owned: true },
    }));
    const wanted_books = (await prisma.books.count({
        where: { is_owned: false },
    }));

    return NextResponse.json({
        ok: true,
        owned_books,
        wanted_books
    });
}
