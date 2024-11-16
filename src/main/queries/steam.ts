import { getGamePath } from 'steam-game-path';
import { t } from '../trpc';

export const steamQuery = t.procedure.query(() => {
  const paths = getGamePath(1422450);
  return [paths?.game?.path].filter(Boolean) as string[]
}); 