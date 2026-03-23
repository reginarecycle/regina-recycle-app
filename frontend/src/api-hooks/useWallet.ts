import { useGetOne } from "@/lib/queryHelpers";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CustomerWallet {
  userId:                string;
  walletId:              string;
  balance:               number;
  monthlyEarnings:       number;
  yearlyEarnings:        number;
  pendingEarningsAmount: number;
  earningsChangeAmount:  number;
}

export interface WalletBalance {
  walletId: string;
  balance:  number;
  currency: string;
}

export interface WalletStats {
  totalCredits:      number;
  totalDebits:       number;
  totalTransactions: number;
}

// ─── Query keys ───────────────────────────────────────────────────────────────

export const walletKeys = {
  customer: () => ["wallet", "customer"]  as const,
  balance:  () => ["wallet", "balance"]   as const,
  stats:    () => ["wallet", "stats"]     as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useCustomerWallet = () =>
  useGetOne<CustomerWallet>(walletKeys.customer(), "/wallet/customer");

export const useWalletBalance = () =>
  useGetOne<WalletBalance>(walletKeys.balance(), "/wallet/balance");

export const useWalletStats = () =>
  useGetOne<WalletStats>(walletKeys.stats(), "/wallet/stats");
