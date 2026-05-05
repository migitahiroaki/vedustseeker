import {
  CoingeckoPriceResponse,
  CoingeckoPriceResponseSchema,
} from "../types/coingecko";

export class Coingecko {
  /**
   * Monadの価格をCoingeckoから取得する
   * @returns USD建て価格
   */
  public static async getMonPriceInUsd() {
    return await Coingecko.getPriceByTokenName("monad");
  }
  public static async getDustPriceInUsd() {
    return await Coingecko.getPriceByTokenName("pixie-dust");
  }

  private static async getPriceByTokenName(tokenName: string) {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenName}&vs_currencies=usd`;
    const res = await fetch(url);
    const parsed: CoingeckoPriceResponse = CoingeckoPriceResponseSchema.parse(
      await res.json(),
    );
    return parsed[tokenName].usd;
  }
}
