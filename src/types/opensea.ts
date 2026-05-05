import { EventAsset, ListingEvent, Trait } from "@opensea/sdk/viem";

export interface NftAssets extends EventAsset {
  traits: Trait[] | null;
}

export interface NftListingEvent extends ListingEvent {
  asset: NftAssets;
}
