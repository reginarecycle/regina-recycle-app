import { useGetOne, useCreate } from "@/lib/queryHelpers";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TxType            = "CREDIT" | "DEBIT";
export type TxStatus          = "PENDING" | "FAILED" | "COMPLETED";
export type PaymentMethodType = "CARD" | "MOBILE_PAYMENT";

export interface CollectorWallet {
  userId:                string;
  walletId:              string;
  balance:               number;
  monthlyPayouts:        number;
  monthlyPayoutsChange:  number;
  monthlyNetFlow:        number;
  monthlyNetChange:      number;
  pendingRequestsAmount: number;
  pendingApprovalAmount: number;
}

export interface CustomerWallet {
  userId:                string;
  walletId:              string;
  balance:               number;
  monthlyEarnings:       number;
  yearlyEarnings:        number;
  pendingEarningsAmount: number;
  earningsChangeAmount:  number;
}

export interface WalletTransaction {
  transactionId:   string;
  referenceNumber?: string;
  userId?:         string;
  walletId:        string;
  type:            TxType;
  amount:          number;
  status:          TxStatus;
  description?:    string;
  referenceType?:  string;
  referenceId?:    string;
  createdAt:       string;
}

export interface PaginatedTransactions {
  data: WalletTransaction[];
  meta: {
    total:       number;
    page:        number;
    limit:       number;
    hasNextPage: boolean;
  };
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

export interface TransactionQuery {
  page?:      number;
  limit?:     number;
  search?:    string;
  type?:      TxType;
  status?:    TxStatus;
  startDate?: string;
  endDate?:   string;
}

export interface TopUpPayload {
  amount:          number;
  paymentType:     PaymentMethodType;
  cardLast4?:      string;
  cardBrand?:      string;
  expMonth?:       number;
  expYear?:        number;
  mobileProvider?: string;
}

export interface CustomerWithdrawPayload {
  amount:           number;
  interacEmail:     string;
  securityQuestion: string;
  securityAnswer:   string;
}

export interface CollectorWithdrawPayload {
  amount:            number;
  accountHolderName: string;
  bankName:          string;
  accountNumber:     string;
  routingNumber:     string;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

// GET /wallet/customer
export const useGetCustomerWallet = () =>
  useGetOne<CustomerWallet>(["wallet","customer"],"/wallet/customer", { refetchInterval: 15_000 });

// GET /wallet/collector
export const useGetCollectorWallet = () =>
  useGetOne<CollectorWallet>(["wallet", "collector"], "/wallet/collector", { refetchInterval: 15_000 });

// GET /wallet/balance
export const useGetWalletBalance = () =>
  useGetOne<WalletBalance>(["wallet", "balance"], "/wallet/balance");

// GET /wallet/transactions
export const useGetWalletTransactions = (query?: TransactionQuery) => {
  const params = new URLSearchParams();
  if (query?.page)      params.append("page",      String(query.page));
  if (query?.limit)     params.append("limit",     String(query.limit));
  if (query?.search)    params.append("search",    query.search);
  if (query?.type)      params.append("type",      query.type);
  if (query?.status)    params.append("status",    query.status);
  if (query?.startDate) params.append("startDate", query.startDate);
  if (query?.endDate)   params.append("endDate",   query.endDate);

  const qs       = params.toString();
  const endpoint = qs ? `/wallet/transactions?${qs}` : "/wallet/transactions";

  return useGetOne<PaginatedTransactions>(["wallet", "transactions", query ?? {}], endpoint, {
    refetchInterval: 15_000,
  });
};

// GET /wallet/transactions/:transactionId
export const useGetTransactionById = (transactionId: string) =>
  useGetOne<WalletTransaction>(
    ["wallet", "transaction", transactionId],
    `/wallet/transactions/${transactionId}`,
    { enabled: Boolean(transactionId) },
  );

// GET /wallet/stats
export const useGetWalletStats = (startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate)   params.append("endDate",   endDate);
  const qs = params.toString();
  return useGetOne<WalletStats>(
    ["wallet", "stats", startDate, endDate],
    qs ? `/wallet/stats?${qs}` : "/wallet/stats",
  );
};

// POST /wallet/top-up  (collector only)
export const useTopUp = () =>
  useCreate<unknown, TopUpPayload>("/wallet/top-up", ["wallet", "collector"]);

// POST /wallet/withdraw  (customer only)
// Invalidates all ["wallet"] queries so balance + transactions both refresh
export const useCustomerWithdraw = () =>
  useCreate<unknown, CustomerWithdrawPayload>("/wallet/withdraw", ["wallet"]);

// POST /wallet/withdraw/collector  (collector only)
export const useCollectorWithdraw = () =>
  useCreate<unknown, CollectorWithdrawPayload>("/wallet/withdraw/collector", ["wallet", "collector"]);