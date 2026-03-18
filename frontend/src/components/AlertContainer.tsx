import { useAlert } from "../lib/AlertContext";

const ICONS: Record<string, string> = {
  error: "✕",
  success: "✓",
  warning: "⚠",
  info: "ℹ",
};

export function AlertContainer() {
  const { alerts, removeAlert } = useAlert();

  if (alerts.length === 0) return null;

  return (
    <div className="alert-container" role="alert" aria-live="polite">
      {alerts.map((alert) => (
        <div key={alert.id} className={`alert alert--${alert.type}`}>
          <span className="alert__icon">{ICONS[alert.type]}</span>
          <span className="alert__message">{alert.message}</span>
          <button
            className="alert__close"
            onClick={() => removeAlert(alert.id)}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
