export interface CompanyProfile {
  companyName: string;
  industry: string;
  yearsInBusiness: number;
  financialStatus: "黒字（安定）" | "創業期・スタートアップ" | "赤字・債務超過" | "損益トントン";
  cashPosition: "潤沢（手元資金に余裕あり）" | "通常（キャッシュ維持したい）" | "逼迫（手元資金を減らしたくない）";
  location: string;
}

export interface EquipmentDetails {
  type: "IT機器（PC・サーバー等）" | "工作機械・製造設備" | "商用車両（トラック・営業車等）" | "店舗内装・厨房機器" | "オフィス什器・コピー機" | "その他（医療機器等）";
  name: string;
  cost: number;
  usefulLife: number; // in years
  purpose: string;
  isObsolescenceFast: boolean;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface CalculationResults {
  leaseTermYears: number;
  leaseRateFactor: number; // Monthly lease rate e.g., 1.85%
  monthlyLeaseFee: number;
  totalLeasePaid: number;
  totalLoanPaid: number;
  totalCashPaid: number;
  taxSavingsLease: number;
  taxSavingsLoan: number;
  taxSavingsCash: number;
  netCostLease: number;
  netCostLoan: number;
  netCostCash: number;
}
