import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function GET() {
    const owned_books = (await prisma.books.aggregate({
        where: { is_owned: true },
        _count: {
            _all: true
        },
    }))._count._all;
    const wanted_books = (await prisma.books.aggregate({
        where: { is_owned: false },
        _count: {
            _all: true
        },
    }))._count._all;

    return NextResponse.json({
        ok: true,
        owned_books,
        wanted_books
    });
}
