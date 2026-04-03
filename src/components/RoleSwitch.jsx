export default function RoleSwitch({ role, setRole, dark, onAdd }) {
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const inputBg = dark ? "#252540" : "#f8f8fc";
  const txt = dark ? "#e8e8f0" : "#1a1a2e";

  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <select value={role} onChange={e => setRole(e.target.value)} style={{ padding:"6px 10px", borderRadius:8, border:`1px solid ${border}`, background:inputBg, color:txt, fontSize:13, fontWeight:500, cursor:"pointer" }}>
        <option value="viewer">Viewer</option>
        <option value="admin">Admin</option>
      </select>
      {role === "admin" && (
        <button onClick={onAdd} style={{ padding:"6px 14px", background:"#58519d", color:"#fff", border:"none", borderRadius:8, fontSize:13, cursor:"pointer", fontWeight:500 }}>
          + Add
        </button>
      )}
    </div>
  );
}