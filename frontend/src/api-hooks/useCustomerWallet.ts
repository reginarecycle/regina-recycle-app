// All customer wallet hooks and types live in useWallet.ts
// This file re-exports them so existing imports don't break

export {
  useGetCustomerWallet,
  useCustomerWithdraw,
} from "./useWallet";

export type {
  CustomerWallet,
  CustomerWithdrawPayload,
  TxType,
  TxStatus,
  WalletTransaction,
  PaginatedTransactions,
  TransactionQuery,
} from "./useWallet";