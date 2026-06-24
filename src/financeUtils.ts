import { CalculationResults } from "./types";

/**
 * Japanese market representative Lease Rate Factors (リース料率)
 * Represents the monthly lease payment as a percentage of equipment cost.
 * Usually includes interest, property tax (固定資産税), and casualty insurance (動産総合保険).
 */
export const LEASE_RATE_FACTORS: Record<number, number> = {
  2: 4.45,  // 2 years (24 months)
  3: 3.05,  // 3 years (36 months)
  4: 2.35,  // 4 years (48 months)
  5: 1.92,  // 5 years (60 months)
  6: 1.63,  // 6 years (72 months)
  7: 1.43,  // 7 years (84 months)
};

/**
 * Calculates financial comparison between Lease, Loan, and Cash Purchase
 */
export function calculateComparison(
  cost: number,
  termYears: number,
  annualInterestRate: number = 2.0, // typical Japanese SME loan rate (1.5% - 2.5%)
  taxRate: number = 30 // typical Japanese SME collective corporate tax rate (~30% to 34%)
): CalculationResults {
  const months = termYears * 12;
  
  // 1. Lease calculations
  const leaseRateFactor = LEASE_RATE_FACTORS[termYears] || (1.1 + (0.012 * termYears)) / (termYears * 12) * 100;
  const monthlyLeaseFee = Math.round(cost * (leaseRateFactor / 100));
  const totalLeasePaid = monthlyLeaseFee * months;
  
  // SME Lease Tax Shield: Lease payments are fully expensed (賃貸借処理 / オフバランス)
  const taxSavingsLease = Math.round(totalLeasePaid * (taxRate / 100));
  const netCostLease = totalLeasePaid - taxSavingsLease;

  // 2. Bank Loan / Installment calculations (元利均等返済)
  const monthlyRate = (annualInterestRate / 100) / 12;
  let monthlyLoanPayment = 0;
  if (monthlyRate > 0) {
    monthlyLoanPayment = Math.round(
      (cost * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
      (Math.pow(1 + monthlyRate, months) - 1)
    );
  } else {
    monthlyLoanPayment = Math.round(cost / months);
  }
  const totalLoanPaid = monthlyLoanPayment * months;
  
  // Property Tax (固定資産税) & Insurance (動産総合保険) paid by owner
  // In Japan, typical property tax is 1.4% of depreciated balance value, and insurance is ~0.3%
  // Let's estimate property tax + insurance over the term as approx. 1.0% of cost per year on average
  const propertyTaxAndInsuranceLoan = Math.round(cost * 0.01 * termYears);
  
  // Tax savings for Loan: Interest + Depreciation are tax-deductible
  const interestExpense = totalLoanPaid - cost;
  // Depreciated asset cost (fully expensed eventually) + Interest
  const taxSavingsLoan = Math.round((cost + interestExpense) * (taxRate / 100));
  const netCostLoan = totalLoanPaid + propertyTaxAndInsuranceLoan - taxSavingsLoan;

  // 3. Cash Purchase calculations
  const totalCashPaid = cost;
  const propertyTaxAndInsuranceCash = Math.round(cost * 0.01 * termYears);
  // Tax savings for Cash: Full Depreciation is tax-deductible
  const taxSavingsCash = Math.round(cost * (taxRate / 100));
  const netCostCash = totalCashPaid + propertyTaxAndInsuranceCash - taxSavingsCash;

  return {
    leaseTermYears: termYears,
    leaseRateFactor,
    monthlyLeaseFee,
    totalLeasePaid,
    totalLoanPaid,
    totalCashPaid,
    taxSavingsLease,
    taxSavingsLoan,
    taxSavingsCash,
    netCostLease,
    netCostLoan,
    netCostCash,
  };
}

/**
 * Formats native currency to Yen scale
 */
export function formatYen(amount: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(amount);
}
