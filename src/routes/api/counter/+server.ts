import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    const { count } = await request.json();
    await prisma.counter.upsert({
        where: { id: 1 },
        update: { count },
        create: { id: 1, count }
    });
    return json({ count });
};

