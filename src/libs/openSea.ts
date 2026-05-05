import { createPublicClient, http } from "viem";

import { monad } from "viem/chains";

import {
  OpenSeaSDK,
  Chain,
  Listing,
  GetNFTMetadataResponse,
} from "@opensea/sdk/viem";
import { AppEnv } from "@/libs/appEnv";

const COLLECTION_SLUG = "voting-escrow-dust";
const MONAD_MAINNET = Chain.Monad;
const NFT_CONTRACT_ADDRESS = "0xbb4738d05ad1b3da57a4881bae62ce9bb1eeed6c";

export class OpenSea {
  private sdk: OpenSeaSDK;

  constructor(appEnv: AppEnv) {
    const publicClient = createPublicClient({
      chain: monad,
      transport: http(),
    });

    this.sdk = new OpenSeaSDK(
      { publicClient },
      { chain: MONAD_MAINNET, apiKey: appEnv.openSeaApiKey },
    );
  }

  // 一括取得
  public async fetchNftsByIds(
    ids: string[],
  ): Promise<Record<string, GetNFTMetadataResponse>> {
    const limitedIds = ids.slice(0, 10);

    const responses = await Promise.all(
      limitedIds.map((id) => this.getNftById(id)),
    );

    // まとめて Record に変換
    return responses.reduce(
      (acc, res, index) => {
        acc[limitedIds[index]] = res;
        return acc;
      },
      {} as Record<string, GetNFTMetadataResponse>,
    );
  }
  // 単体取得
  public async getNftById(id: string): Promise<GetNFTMetadataResponse> {
    return this.sdk.api.getNFTMetadata(NFT_CONTRACT_ADDRESS, id);
  }

  public async fetchAllListing(): Promise<Listing[]> {
    return this.fetchAllListingsRecursive();
  }

  private async fetchAllListingsRecursive(
    acc: Listing[] = [],
    cursor?: string,
  ): Promise<Listing[]> {
    const glr = await this.sdk.api.getAllListings(
      COLLECTION_SLUG,
      200,
      cursor,
      false,
    );

    const nextToken = glr.next;
    const mergedAcc = [...acc, ...glr.listings];

    if (!nextToken) return mergedAcc;

    return this.fetchAllListingsRecursive(mergedAcc, nextToken);
  }
}
