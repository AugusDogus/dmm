import { t } from 'src/main/api';
import { getGamePath } from 'steam-game-path';

export const statusQuery = t.procedure.query(() => {
  
    // Get the game's path
    const paths = getGamePath(1422450);

  }); 