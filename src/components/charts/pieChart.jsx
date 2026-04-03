import { COLORS } from "../../data/MockData";

export default function PieChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let cumAngle = -Math.PI / 2;
  const cx = 80, cy = 80, r = 60, inner = 38;

  const slices = data.map((d, i) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(cumAngle), y1 = cy + r * Math.sin(cumAngle);
    cumAngle += angle;
    const x2 = cx + r * Math.cos(cumAngle), y2 = cy + r * Math.sin(cumAngle);
    const ix1 = cx + inner * Math.cos(cumAngle - angle), iy1 = cy + inner * Math.sin(cumAngle - angle);
    const ix2 = cx + inner * Math.cos(cumAngle), iy2 = cy + inner * Math.sin(cumAngle);
    const large = angle > Math.PI ? 1 : 0;
    return {
      path: `M${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} L${ix2},${iy2} A${inner},${inner} 0 ${large},0 ${ix1},${iy1} Z`,
      color: COLORS.categories[i % COLORS.categories.length],
      pct: Math.round((d.value / total) * 100),
      label: d.label,
    };
  });

  return (
    <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
      <svg width={160} height={160} viewBox="0 0 160 160">
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke="#fff" strokeWidth={2} />
        ))}
      </svg>
      <div style={{ display:"flex", flexDirection:"column", gap:6, flex:1, minWidth:120 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12 }}>
            <div style={{ width:10, height:10, borderRadius:2, background:s.color, flexShrink:0 }} />
            <span style={{ flex:1, color:"#555" }}>{s.label}</span>
            <span style={{ fontWeight:500, color:"#222" }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}