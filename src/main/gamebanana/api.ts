import { ModListResponse, ModListResponseSchema } from './types'

export class GameBananaAPI {
  private baseUrl = 'https://gamebanana.com/apiv11'

  async getModList(gameId: number, page: number = 1, perPage: number = 15): Promise<ModListResponse> {
    const url = new URL(`${this.baseUrl}/Mod/Index`)
    url.searchParams.set('_nPage', page.toString())
    url.searchParams.set('_nPerpage', perPage.toString())
    url.searchParams.set('_aFilters[Generic_Game]', gameId.toString())

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch mods: ${response.statusText}`)
    }

    const data = await response.json()
    return ModListResponseSchema.parse(data)
  }
}

// Create a singleton instance
export const gameBananaApi = new GameBananaAPI() 