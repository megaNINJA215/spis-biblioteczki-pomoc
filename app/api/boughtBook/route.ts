import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    const data: {
        ISBN: string,
    } = await request.json();

    await prisma.books.update({
        where: { ISBN: data.ISBN },
        data: {
            is_owned: true,
        }
    });

    return NextResponse.json({
        ok: true
    });
}
