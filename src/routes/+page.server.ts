import type { PageServerLoad } from './$types';
import prisma from "$lib/prisma";

export const load: PageServerLoad = async () => {
  const count = await prisma.counter.findFirst({
    orderBy: {
      id: 'asc'
    }
  });

  return { count };
};