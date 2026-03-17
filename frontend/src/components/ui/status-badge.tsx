
type TxStatus = "CREDIT" | "WITHDRAWAL" | "FAILED";

const statusStyles: Record<TxStatus, { badgeBg: string; badgeText: string }> = {
  CREDIT: { badgeBg: "#DCFCE7", badgeText: "#166534" },
  WITHDRAWAL: { badgeBg: "#EAF2FF", badgeText: "#2563EB" },
  FAILED: { badgeBg: "#FEE2E2", badgeText: "#DC2626" },
};

export function StatusBadge({ status }: { status: TxStatus }) {
  const { badgeBg, badgeText } = statusStyles[status];
  return (
    <span
      className="inline-flex items-center justify-center rounded-[34px] px-2"
      style={{ background: badgeBg }}
    >
      <span
        className="text-[10px] font-bold leading-[18px] uppercase"
        style={{ color: badgeText }}
      >
        {status}
      </span>
    </span>
  );
}

export function getAmountColor(status: TxStatus): string {
  const colors: Record<TxStatus, string> = {
    CREDIT: "#166534",
    WITHDRAWAL: "#DD1E1E",
    FAILED: "#DD1E1E",
  };
  return colors[status];
}