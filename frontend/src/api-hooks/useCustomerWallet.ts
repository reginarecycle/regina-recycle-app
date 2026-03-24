import { useGetOne, useCreate } from "@/lib/queryHelpers";

// ── Re-export shared types from useWallet so you don't duplicate them ─────────
// useGetWalletTransactions already lives in useWallet.ts — import it from there

export type {
  TxType,
  TxStatus,
  WalletTransaction,
  PaginatedTransactions,
  TransactionQuery,
} from "./useWallet";

// ── Customer-specific types ───────────────────────────────────────────────────

export interface CustomerWallet {
  userId: string;
  walletId: string;
  balance: number;
  monthlyEarnings: number;
  yearlyEarnings: number;
  pendingEarningsAmount: number;
  earningsChangeAmount: number;
}

export interface CustomerWithdrawPayload {
  interacEmail: string;
  securityQuestion: string;
  securityAnswer: string;
  amount: number;
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

// Same pattern as: useGetOne<CollectorWallet>(["wallet", "collector"], "/wallet/collector")
export const useGetCustomerWallet = () =>
  useGetOne<CustomerWallet>(["wallet", "customer"], "/wallet/customer");

// Withdraw (customer — Interac e-Transfer)
export const useCustomerWithdraw = () =>
  useCreate<unknown, CustomerWithdrawPayload>(
    "/wallet/withdraw",
    ["wallet", "customer"]
  );