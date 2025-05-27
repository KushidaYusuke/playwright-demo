import type { RequestHandler } from './$types';
import prisma from '$lib/prisma';

//カウンターをリセットするためのハンドラー
export const PUT: RequestHandler = async () => {
    // カウンターの値を0にリセット
    await prisma.counter.upsert({
        where: { id: 1 },
        update: { count: 0 },
        create: { id: 1, count: 0 }
    });

    // リセット後のカウンターの値を返す
    return new Response(JSON.stringify({ count: 0 }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
// PUTリクエストを受け付け、カウンターの値を0にリセットする