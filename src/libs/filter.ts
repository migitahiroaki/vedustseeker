import { Condition, ConditionSchema } from "@/types/condition";
import { NftView } from "@/types/nft";

export class Filter {
  private readonly condition: Condition;
  constructor(condition: Condition) {
    this.condition = ConditionSchema.parse(condition);
  }

  public applied(data: Record<string, NftView>): Record<string, NftView> {
    const filteredEntries = Object.entries(data).filter(([_id, view]) => {
      // 割引率(LessThan)が設定されている場合、しきい値未満のもののみにフィルタ
      if (this.condition.deviationLT != void 0) {
        if (view.deviation > this.condition.deviationLT) {
          return false;
        }
      }
      // DUST単価(LessThan)
      if (this.condition.dustUnitPriceLT != void 0) {
        if (view.dustUnitPrice > this.condition.dustUnitPriceLT) {
          return false;
        }
      }

      // TODO: 他に条件が増える場合はここに追記

      // 条件をすべてクリアしたものを残す
      return true;
    });
    return Object.fromEntries(filteredEntries);
  }
}
