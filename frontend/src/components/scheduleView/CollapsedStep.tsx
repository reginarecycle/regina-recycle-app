type Props = {
  number: number;
  title: string;
  subtitle: string;
  onEdit?: () => void;
};

export function CollapsedStep({ number, title, subtitle, onEdit }: Props) {
  return (
    <div className="rounded-xl border border-border bg-white px-5 sm:px-6 py-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
            {number}
          </div>
          <div>
            <p className="text-[15px] font-semibold text-foreground">{title}</p>
            <p className="text-[13px] text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-[13px] font-semibold text-primary hover:underline shrink-0"
          >
            EDIT SELECTION
          </button>
        )}
      </div>
    </div>
  );
}
