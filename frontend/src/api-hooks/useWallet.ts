import { useGetOne, useCreate } from "@/lib/queryHelpers";

export type TxType = "CREDIT" | "DEBIT";
export type TxStatus = "PENDING" | "FAILED" | "COMPLETED";
export type PaymentMethodType = "CARD" | "MOBILE_PAYMENT";

export interface CollectorWallet {
  userId: string;
  walletId: string;
  balance: number;
  monthlyPayouts: number;
  monthlyNetFlow: number;
  pendingRequestsAmount: number;
  pendingApprovalAmount: number;
}

export interface WalletTransaction {
  userId?: string;
  walletId: string;
  type: TxType;
  amount: number;
  status: TxStatus;
  description?: string;
  referenceType?: string;
  referenceId?: string;
  createdAt: string;
}

export interface PaginatedTransactions {
  data: WalletTransaction[];
  meta: {
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
  };
}

export interface TransactionQuery {
  page?: number;
  limit?: number;
  search?: string;
  type?: TxType;
  status?: TxStatus;
  startDate?: string;
  endDate?: string;
}

export interface TopUpPayload {
  amount: number;
  paymentType: PaymentMethodType;
  cardLast4?: string;
  cardBrand?: string;
  expMonth?: number;
  expYear?: number;
  mobileProvider?: string;
}

export interface CollectorWithdrawPayload {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  amount: number;
}

export const useGetCollectorWallet = () =>
  useGetOne<CollectorWallet>(["wallet", "collector"], "/wallet/collector");

export const useGetWalletTransactions = (query?: TransactionQuery) => {
  const params = new URLSearchParams();
  if (query?.page) params.append("page", String(query.page));
  if (query?.limit) params.append("limit", String(query.limit));
  if (query?.search) params.append("search", query.search);
  if (query?.type) params.append("type", query.type);
  if (query?.status) params.append("status", query.status);
  if (query?.startDate) params.append("startDate", query.startDate);
  if (query?.endDate) params.append("endDate", query.endDate);

  const queryString = params.toString();
  const endpoint = queryString ? `/wallet/transactions?${queryString}` : "/wallet/transactions";

  return useGetOne<PaginatedTransactions>(["wallet", "transactions", query ?? {}], endpoint);
};

export const useTopUp = () =>
  useCreate<unknown, TopUpPayload>("/wallet/top-up", ["wallet"]);

export const useCollectorWithdraw = () =>
  useCreate<unknown, CollectorWithdrawPayload>("/wallet/withdraw/collector", ["wallet"]);