import { Abi } from "viem";

const vedustAbi: Abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "locked",
    outputs: [
      {
        components: [
          {
            internalType: "int256",
            name: "amount",
            type: "int256",
          },
          {
            internalType: "uint256",
            name: "effectiveStart",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "end",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isPermanent",
            type: "bool",
          },
        ],
        internalType: "struct IDustLock.LockedBalance",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export default vedustAbi;
