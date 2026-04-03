import { COLORS, fmt } from "../data/MockData";

export default function TransactionTable({ transactions, isAdmin, onEdit, onDelete, isDark }) {
  const card   = isDark ? "#1a1a2e" : "#ffffff";
  const txt    = isDark ? "#e8e8f0" : "#1a1a2e";
  const muted  = isDark ? "#9898b0" : "#666688";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  if (transactions.length === 0) {
    return (
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: "14px", padding: "40px", textAlign: "center", color: muted }}>
        No transactions match your filters.
      </div>
    );
  }

  return (
    <div style={{ background: card, border: `1px solid ${border}`, borderRadius: "14px", overflow: "hidden" }}>
      {transactions.map((t) => (
        <div key={t.id} style={{ display: "flex", alignItems: "center", padding: "13px 20px", borderBottom: `1px solid ${border}`, gap: "12px" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: t.type === "income" ? "#9ec2b6" : "#dcb3a5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
            {t.type === "income" ? "📈" : "📉"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "14px", fontWeight: 500, color: txt, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.description}</div>
            <div style={{ fontSize: "12px", color: muted }}>{t.date}</div>
          </div>
          <span style={{ padding: "3px 10px", borderRadius: "20px", background: t.type === "income" ? "#e1f5ee" : "#faece7", color: t.type === "income" ? COLORS.income : COLORS.expense, fontSize: "11px", fontWeight: 500, whiteSpace: "nowrap" }}>
            {t.category}
          </span>
          <div style={{ fontWeight: 700, color: t.type === "income" ? COLORS.income : COLORS.expense, fontSize: "15px", minWidth: "90px", textAlign: "right", whiteSpace: "nowrap" }}>
            {t.type === "income" ? "+" : "−"}{fmt(t.amount)}
          </div>
          {isAdmin && (
            <div style={{ display: "flex", gap: "4px" }}>
              <button onClick={() => onEdit(t)}    style={{ padding: "5px 10px", border: `1px solid ${border}`, borderRadius: "6px", background: "transparent", color: muted,          fontSize: "12px", cursor: "pointer" }}>Edit</button>
              <button onClick={() => onDelete(t.id)} style={{ padding: "5px 10px", border: "1px solid #fcc",       borderRadius: "6px", background: "transparent", color: COLORS.expense, fontSize: "12px", cursor: "pointer" }}>Del</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}