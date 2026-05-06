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
