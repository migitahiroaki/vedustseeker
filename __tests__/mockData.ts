import {
  GetListingsResponse,
  ListNFTsResponse,
  OrderStatus,
  OrderType,
  TraitDisplayType,
} from "@opensea/sdk/viem";

// 1001, 1002
export const MOCK_GET_LISTINGS_RESPONSE: GetListingsResponse = {
  listings: [
    {
      order_hash:
        "0x495600c76f72f9bc7fe00d0a29822b6268963fb1b1afbcd986f1181faa070027",
      chain: "monad",
      protocol_data: {
        parameters: {
          offerer: "0x368cef56c89222e8d1040e9e14b2bf924b94a6b2",
          offer: [
            {
              itemType: 2,
              token: "0xbb4738d05ad1b3da57a4881bae62ce9bb1eeed6c",
              identifierOrCriteria: "1001",
              startAmount: "1",
              endAmount: "1",
            },
          ],
          consideration: [
            {
              itemType: 0,
              token: "0x0000000000000000000000000000000000000000",
              identifierOrCriteria: "0",
              startAmount: "137060000000000000000",
              endAmount: "137060000000000000000",
              recipient: "0x368cef56c89222e8d1040e9e14b2bf924b94a6b2",
            },
            {
              itemType: 0,
              token: "0x0000000000000000000000000000000000000000",
              identifierOrCriteria: "0",
              startAmount: "1540000000000000000",
              endAmount: "1540000000000000000",
              recipient: "0x0000a26b00c1f0df003000390027140000faa719",
            },
            {
              itemType: 0,
              token: "0x0000000000000000000000000000000000000000",
              identifierOrCriteria: "0",
              startAmount: "15400000000000000000",
              endAmount: "15400000000000000000",
              recipient: "0x000012a6ec4bb0f2fcff0440b7d80ad605700069",
            },
          ],
          startTime: "1777065373",
          endTime: "1784841373",
          orderType: 2,
          zone: "0x000056f7000000ece9003ca63978907a00ffd100",
          zoneHash:
            "0x0000000000000000000000000000000000000000000000000000000000000000",
          salt: "0x3d958fe20000000000000000000000000000000000000000d5839f9c590c1f73",
          conduitKey:
            "0x61159fefdfada89302ed55f8b9e89e2d67d8258712b3a3f89aa88525877f1d5e",
          totalOriginalConsiderationItems: 3,
          counter: "0",
        },
        signature: "dummy",
      },
      protocol_address: "0x0000000000000068f116a894984e2db1123eb395",
      remaining_quantity: 1,
      price: {
        current: {
          currency: "MON",
          decimals: 18,
          value: "154000000000000000000",
        },
      },
      type: OrderType.BASIC,
      status: OrderStatus.ACTIVE,
    },
    {
      order_hash:
        "0x82e197d3932b16dd27fe37dbbfe95daa7ab754f3c644e9194993b80935dfa2fa",
      chain: "monad",
      protocol_data: {
        parameters: {
          offerer: "0xc52930c66d9cf8a3a3cf26922f6cbd15953eaf33",
          offer: [
            {
              itemType: 2,
              token: "0xbb4738d05ad1b3da57a4881bae62ce9bb1eeed6c",
              identifierOrCriteria: "1002",
              startAmount: "1",
              endAmount: "1",
            },
          ],
          consideration: [
            {
              itemType: 0,
              token: "0x0000000000000000000000000000000000000000",
              identifierOrCriteria: "0",
              startAmount: "137950000000000000000",
              endAmount: "137950000000000000000",
              recipient: "0xc52930c66d9cf8a3a3cf26922f6cbd15953eaf33",
            },
            {
              itemType: 0,
              token: "0x0000000000000000000000000000000000000000",
              identifierOrCriteria: "0",
              startAmount: "1550000000000000000",
              endAmount: "1550000000000000000",
              recipient: "0x0000a26b00c1f0df003000390027140000faa719",
            },
            {
              itemType: 0,
              token: "0x0000000000000000000000000000000000000000",
              identifierOrCriteria: "0",
              startAmount: "15500000000000000000",
              endAmount: "15500000000000000000",
              recipient: "0x000012a6ec4bb0f2fcff0440b7d80ad605700069",
            },
          ],
          startTime: "1776962953",
          endTime: "1779554953",
          orderType: 2,
          zone: "0x000056f7000000ece9003ca63978907a00ffd100",
          zoneHash:
            "0x0000000000000000000000000000000000000000000000000000000000000000",
          salt: "0x3d958fe2000000000000000000000000000000000000000022e592217be2b497",
          conduitKey:
            "0x61159fefdfada89302ed55f8b9e89e2d67d8258712b3a3f89aa88525877f1d5e",
          totalOriginalConsiderationItems: 3,
          counter: "0",
        },
        signature: "dummy",
      },
      protocol_address: "0x0000000000000068f116a894984e2db1123eb395",
      remaining_quantity: 1,
      price: {
        current: {
          currency: "MON",
          decimals: 18,
          value: "155000000000000000000",
        },
      },
      type: OrderType.BASIC,
      status: OrderStatus.ACTIVE,
    },
  ],
  next: "WzE1NS4wLCIyMDI2LTA0LTIzVDE2OjQ5OjE3LjcyMVoiLCJhMjM0YzljNTYwYjEzZjUzODM0ZjA2OGNjMmMwZmY5MCJd",
};

// 1001, 1002
export const MOCK_LIST_NFTS_RESPONSE: ListNFTsResponse = {
  nfts: [
    {
      identifier: "1001",
      collection: "voting-escrow-dust",
      contract: "0xbb4738d05ad1b3da57a4881bae62ce9bb1eeed6c",
      token_standard: "erc721",
      name: "Needles Northwick #13888",
      description: "Vote-escrowed DUST",
      image_url:
        "https://i2c.seadn.io/monad/0xbb4738d05ad1b3da57a4881bae62ce9bb1eeed6c/d6471fe87493d557b17b40cfae3c14/bbd6471fe87493d557b17b40cfae3c14.avif",
      metadata_url: "https://app.neverland.money/api/vedust/13888",
      opensea_url:
        "https://opensea.io/assets/monad/0xbb4738d05ad1b3da57a4881bae62ce9bb1eeed6c/13888",
      updated_at: "2026-04-25T03:29:39.586653",
      is_disabled: false,
      is_nsfw: false,
      traits: [
        {
          trait_type: "Tier",
          display_type: TraitDisplayType.NONE,
          max_value: "",
          value: "Sapphire",
        },
        {
          trait_type: "Level",
          display_type: TraitDisplayType.NONE,
          max_value: "",
          value: "Common",
        },
        {
          trait_type: "Archetype",
          display_type: TraitDisplayType.NONE,
          max_value: "",
          value: "Pirate",
        },
        {
          trait_type: "Character",
          display_type: TraitDisplayType.NONE,
          max_value: "",
          value: "Needles Northwick",
        },
        {
          trait_type: "Lock Type",
          display_type: TraitDisplayType.NONE,
          max_value: "",
          value: "Time-Lock",
        },
        {
          trait_type: "Unlock Date",
          display_type: TraitDisplayType.NONE,
          max_value: "",
          value: "May 28, 2026",
        },
        {
          trait_type: "Days Remaining",
          display_type: TraitDisplayType.NONE,
          max_value: "",
          value: "32",
        },
        {
          trait_type: "Treasury (DUST)",
          display_type: TraitDisplayType.NUMBER,
          max_value: "",
          value: "43.9",
        },
      ],
      owners: [],
      creator: "dummy",
      rarity: null,
    },
    {
      identifier: "1002",
      collection: "voting-escrow-dust",
      contract: "0xbb4738d05ad1b3da57a4881bae62ce9bb1eeed6c",
      token_standard: "erc721",
      name: "Mad Barrel Billy #13887",
      description: "Vote-escrowed DUST",
      image_url:
        "https://i2c.seadn.io/monad/0xbb4738d05ad1b3da57a4881bae62ce9bb1eeed6c/1951bffc471fd62412fb4dc916efad/d41951bffc471fd62412fb4dc916efad.avif",
      metadata_url: "https://app.neverland.money/api/vedust/13887",
      opensea_url:
        "https://opensea.io/assets/monad/0xbb4738d05ad1b3da57a4881bae62ce9bb1eeed6c/13887",
      updated_at: "2026-04-25T03:29:39.586670",
      is_disabled: false,
      is_nsfw: false,
      traits: [
        {
          trait_type: "Tier",
          display_type: TraitDisplayType.NONE,
          max_value: "",
          value: "Sapphire",
        },
        {
          trait_type: "Level",
          display_type: TraitDisplayType.NONE,
          max_value: "",
          value: "Fine",
        },
        {
          trait_type: "Archetype",
          display_type: TraitDisplayType.NONE,
          max_value: "",
          value: "Pirate",
        },
        {
          trait_type: "Character",
          display_type: TraitDisplayType.NONE,
          max_value: "",
          value: "Mad Barrel Billy",
        },
        {
          trait_type: "Lock Type",
          display_type: TraitDisplayType.NONE,
          max_value: "",
          value: "Time-Lock",
        },
        {
          trait_type: "Unlock Date",
          display_type: TraitDisplayType.NONE,
          max_value: "",
          value: "May 28, 2026",
        },
        {
          trait_type: "Days Remaining",
          display_type: TraitDisplayType.NONE,
          max_value: "",
          value: "32",
        },
        {
          trait_type: "Treasury (DUST)",
          display_type: TraitDisplayType.NUMBER,
          max_value: "",
          value: "1612.38",
        },
      ],
      owners: [],
      creator: "dummy",
      rarity: null,
    },
  ],
  next: "dummyNextToken",
};
