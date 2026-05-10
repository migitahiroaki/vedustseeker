import {
  CoingeckoPriceResponse,
  CoingeckoPriceResponseSchema,
} from "../types/coingecko";
import { AppEnv } from "./appEnv";

export class Coingecko {
  private readonly cgApiKeyQuery: string;

  constructor(appEnv: AppEnv) {
    this.cgApiKeyQuery = appEnv.coingeckoQuery;
  }
  /**
   * Monadの価格をCoingeckoから取得する
   * @returns USD建て価格
   */
  public async getMonPriceInUsd() {
    return await this.getPriceByTokenName("monad");
  }
  public async getDustPriceInUsd() {
    return await this.getPriceByTokenName("pixie-dust");
  }

  private async getPriceByTokenName(tokenName: string) {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenName}&vs_currencies=usd${this.cgApiKeyQuery}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`CoginGeckoAPI実行失敗[${res.status}]`);
    }
    const parsed: CoingeckoPriceResponse = CoingeckoPriceResponseSchema.parse(
      await res.json(),
    );
    return parsed[tokenName].usd;
  }
}
