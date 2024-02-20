
export enum CostType {
  Clothes = 1,
  Trafic = 2,
  WorkTrafic = 3,
  Qiubo = 4,
  Eating = 5,
  DailyCost = 6,
  Hobbit = 7,
  Necessary = 8,
}

export const allCostType = [
  CostType.DailyCost,
  CostType.Clothes,
  CostType.Eating,
  CostType.Hobbit,
  CostType.Necessary,
  CostType.Qiubo,
  CostType.Trafic,
  CostType.WorkTrafic,
];

export function getCostTypeDesc(costType: CostType): string {
  switch (costType) {
    case CostType.Clothes:
      return '服装配饰';
    case CostType.Trafic:
      return '交通费用';
    case CostType.WorkTrafic:
      return '上班通勤';
    case CostType.Qiubo:
      return '宝宝用品';
    case CostType.Eating:
      return '炫嘴里';
    case CostType.DailyCost:
      return '日常开销';
    case CostType.Hobbit:
      return '兴趣爱好';
    case CostType.Necessary:
      return '必要开销';
  }
}

const colors = ["magenta", "volcano", "orange", "purple", "blue", "red", "gold", "lime", "green", "geek_blue"];

export function getTagColor(num: CostType): string {
  return colors[num % colors.length];

}