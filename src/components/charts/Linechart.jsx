import { COLORS } from "../../data/MockData";

export default function LineChart({ data }) {
  const max = Math.max(...data.map(d => Math.max(d.income, d.expense)), 1);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:140, paddingTop:8 }}>
        {data.map((m, i) => (
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <div style={{ width:"100%", display:"flex", gap:2, alignItems:"flex-end", height:110 }}>
              <div style={{ flex:1, background:COLORS.income, borderRadius:"3px 3px 0 0", height: Math.max(4,(m.income/max)*100)+"px", opacity:0.85 }} />
              <div style={{ flex:1, background:COLORS.expense, borderRadius:"3px 3px 0 0", height: Math.max(4,(m.expense/max)*100)+"px", opacity:0.85 }} />
            </div>
            <span style={{ fontSize:10, color:"#888" }}>{m.label}</span>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:14, marginTop:8 }}>
        {[["Income", COLORS.income], ["Expense", COLORS.expense]].map(([l, c]) => (
          <div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#888" }}>
            <div style={{ width:10, height:10, borderRadius:2, background:c }} />
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}