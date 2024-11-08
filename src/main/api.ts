import { initTRPC } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { EventEmitter } from 'events';
import { getGamePath } from 'steam-game-path';
import superjson from 'superjson';
import z from 'zod';
import { gameBananaApi } from './gamebanana/api';

const ee = new EventEmitter();

const t = initTRPC.create({ isServer: true, transformer: superjson });

export const router = t.router({
  greeting: t.procedure.input(z.object({ name: z.string() })).query((req) => {
    const { input } = req;

    ee.emit('greeting', `Greeted ${input.name}`);
    return {
      text: `Hello ${input.name}` as const,
    };
  }),
  subscription: t.procedure.subscription(() => {
    return observable((emit) => {
      function onGreet(text: string) {
        emit.next({ text });
      }

      ee.on('greeting', onGreet);

      return () => {
        ee.off('greeting', onGreet);
      };
    });
  }),
  steam: t.procedure.query(() => {
    const paths = getGamePath(1422450);
    return {
      paths
    };
  }),
  mods: t.procedure.query(async () => {
    return await fetchDeadlockMods();
  }),
  infiniteMods: t.procedure.input(
    z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.number().optional(),
    }),
  )
  .query(async (opts) => {
    const { input } = opts;
    const limit = input.limit ?? 50;
    return await fetchPaginatedMods(limit, input.cursor);
  })
});

export type AppRouter = typeof router;

async function fetchDeadlockMods() {
  try {
    const DEADLOCK_GAME_ID = 20948
    const mods = await gameBananaApi.getModList(DEADLOCK_GAME_ID)

    return mods._aRecords.map((mod) => {
      return {
        name: mod._sName,
        author: mod._aSubmitter._sName,
        likes: mod._nLikeCount,
        downloads: mod._nViewCount,
        category: mod._aRootCategory._sName
      }
    })

  } catch (error) {
    console.error('Failed to fetch mods:', error)
    return [];
  }
}

async function fetchPaginatedMods(limit: number, cursor?: number) {
  try {
    const DEADLOCK_GAME_ID = 20948;
    const mods = await gameBananaApi.getModList(DEADLOCK_GAME_ID);
    
    const allMods = mods._aRecords.map((mod) => {

      return {
        id: mod._idRow,
        name: mod._sName,
        author: mod._aSubmitter._sName,
        likes: mod._nLikeCount,
        views: mod._nViewCount,
        category: mod._aRootCategory._sName,
        previewImage: mod._aPreviewMedia._aImages[0]?._sBaseUrl + '/' + mod._aPreviewMedia._aImages[0]?._sFile530
      };
    });

    // Handle pagination
    const startIndex = cursor ? allMods.findIndex(mod => mod.id === cursor) + 1 : 0;
    const items = allMods.slice(startIndex, startIndex + limit + 1);
    
    let nextCursor: number | undefined = undefined;
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem!.id;
    }

    return {
      items,
      nextCursor,
    };
  } catch (error) {
    console.error('Failed to fetch paginated mods:', error);
    return { items: [], nextCursor: undefined };
  }
}