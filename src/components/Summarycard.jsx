export default function SummaryCard({ label, value, color, note, isDark }) {
  const card   = isDark ? "#1a1a2e" : "#ffffff";
  const txt    = isDark ? "#e8e8f0" : "#1a1a2e";
  const muted  = isDark ? "#9898b0" : "#666688";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  return (
    <div style={{ background: card, border: `1px solid ${border}`, borderRadius: "14px", padding: "18px 20px", flex: 1, minWidth: "140px" }}>
      <div style={{ fontSize: "12px", color: muted, marginBottom: "6px", letterSpacing: "0.03em" }}>{label}</div>
      <div style={{ fontSize: "24px", fontWeight: 700, color: color || txt, marginBottom: note ? "4px" : 0 }}>{value}</div>
      {note && <div style={{ fontSize: "12px", color: muted }}>{note}</div>}
    </div>
  );
}