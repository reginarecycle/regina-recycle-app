export type TransactionStatus = "COMPLETED" | "PENDING" | "FAILED";
export type TransactionType = "payout" | "topup" | "withdrawal";
export type PaymentMethod = "card" | "mobile" | null;

export interface Transaction {
  id: string;
  name: string;
  type: TransactionType;
  date: string;
  amount: number;
  status: TransactionStatus;
}

export interface WalletManagementProps {
  balance?: number;
  totalPayouts?: number;
  netFlow?: number;
  transactions?: Transaction[];
}
