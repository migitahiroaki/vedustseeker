import { createPublicClient, fallback, http, PublicClient } from "viem";
import { mainnet } from "viem/chains";
import vedustAbi from "@/abi/vedust";
import { LockedData } from "@/types/contract";

const VE_DUST_ADDRESS = "0xBB4738D05AD1b3Da57a4881baE62Ce9bb1eEeD6C";
const ARCHEMY_RPC_URL = "https://rpc1.monad.xyz/";
const DRPC_RPC_URL = "https://monad-mainnet.drpc.org/";

export class MonadChain {
  private client: PublicClient;

  constructor() {
    this.client = createPublicClient({
      chain: mainnet,
      transport: fallback([
        http(ARCHEMY_RPC_URL, {
          timeout: 1000,
        }),
        http(DRPC_RPC_URL, {
          timeout: 1000,
        }),
      ]),
    });
  }

  public async fetchVeDustLockByIds(
    tokenIds: number[],
  ): Promise<Record<number, LockedData>> {
    const contracts = tokenIds.map((id) => ({
      address: VE_DUST_ADDRESS as `0x${string}`,
      abi: vedustAbi,
      functionName: "locked",
      args: [id],
    }));

    const multicallResults = await this.client.multicall({
      contracts,
      allowFailure: true,
    });

    // reduceを使って、配列を1つのオブジェクトに集約する
    return multicallResults.reduce(
      (acc, res, index) => {
        if (res.status === "success") {
          const id = tokenIds[index];
          acc[id] = res.result as LockedData;
        }
        return acc;
      },
      {} as Record<number, LockedData>,
    );
  }
}
