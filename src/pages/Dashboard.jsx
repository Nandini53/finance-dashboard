import { useState, useEffect, useMemo } from "react";
import { INITIAL_TRANSACTIONS, CATEGORIES, COLORS, fmt } from "../data/MockData";
import SummaryCard from "../components/Summarycard";
import TransactionTable from "../components/Transactiontable";
import PieChart from "../components/charts/pieChart";
import LineChart from "../components/charts/Linechart";

// custom hook to get window width for responsive logic
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return width;
}

// modal for adding or editing a transaction
function TransactionModal({ onClose, onSave, existing, isDark }) {
  const emptyForm = { date: "", description: "", amount: "", category: "Food", type: "expense" };
  const [form, setForm] = useState(existing || emptyForm);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "9px 12px",
    border: "1px solid #e0cece",
    borderRadius: "8px",
    fontSize: "14px",
    background: isDark ? "#313155" : "#fff",
    color: isDark ? "#c4c4dc" : "#242443",
    outline: "none",
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(45, 41, 41, 0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 999,
        padding: "16px",
      }}
    >
      <div style={{
        background: isDark ? "#1a1a2e" : "#fff",
        borderRadius: "16px",
        padding: "28px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 600, color: isDark ? "#e8e8f0" : "#1a1a2e" }}>
            {existing ? "Edit Transaction" : "New Transaction"}
          </h3>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", fontSize: "22px", color: "#999", lineHeight: 1 }}>
            ×
          </button>
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "13px", color: "#777", marginBottom: "4px" }}>Date</label>
          <input type="date" value={form.date} onChange={handleChange("date")} style={inputStyle} />
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "13px", color: "#777", marginBottom: "4px" }}>Description</label>
          <input type="text" value={form.description} onChange={handleChange("description")} placeholder="e.g. Zomato order" style={inputStyle} />
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "13px", color: "#777", marginBottom: "4px" }}>Amount (₹)</label>
          <input type="number" value={form.amount} onChange={handleChange("amount")} placeholder="0" style={inputStyle} />
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "13px", color: "#777", marginBottom: "4px" }}>Category</label>
          <select value={form.category} onChange={handleChange("category")} style={inputStyle}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: "22px" }}>
          <label style={{ display: "block", fontSize: "13px", color: "#777", marginBottom: "6px" }}>Type</label>
          <div style={{ display: "flex", gap: "8px" }}>
            {["income", "expense"].map((type) => {
              const isSelected = form.type === type;
              const activeColor = type === "income" ? COLORS.income : COLORS.expense;
              return (
                <button
                  key={type}
                  onClick={() => setForm((prev) => ({ ...prev, type }))}
                  style={{
                    flex: 1, padding: "9px",
                    borderRadius: "8px",
                    border: `2px solid ${isSelected ? activeColor : "#ddd"}`,
                    background: isSelected ? (type === "income" ? "#e1f5ee" : "#faece7") : "transparent",
                    color: isSelected ? activeColor : "#888",
                    fontWeight: isSelected ? 600 : 400,
                    cursor: "pointer", fontSize: "13px",
                    textTransform: "capitalize",
                    transition: "all 0.15s",
                  }}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => onSave(form)}
          style={{
            width: "100%", padding: "12px",
            background: "#1a1a2e", color: "#fff",
            border: "none", borderRadius: "10px",
            fontSize: "15px", fontWeight: 600, cursor: "pointer",
          }}
        >
          {existing ? "Save Changes" : "Add Transaction"}
        </button>
      </div>
    </div>
  );
}


export default function Dashboard({ isDark, toggleDark }) {
  const width = useWindowWidth();
  const isMobile = width < 640;
  const isTablet = width < 900;

  // load from localStorage if available
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem("finview_transactions");
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [activeTab, setActiveTab]         = useState("dashboard");
  const [userRole, setUserRole]           = useState("viewer");
  const [showModal, setShowModal]         = useState(false);
  const [editingTxn, setEditingTxn]       = useState(null);
  const [searchQuery, setSearchQuery]     = useState("");
  const [typeFilter, setTypeFilter]       = useState("all");
  const [catFilter, setCatFilter]         = useState("all");
  const [sortOption, setSortOption]       = useState("date-desc");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = userRole === "admin";

  // theme
  const theme = {
    bg:     isDark ? "#0f0f1a"                : "#f0f0f5",
    card:   isDark ? "#1a1a2e"                : "#ffffff",
    text:   isDark ? "#e8e8f0"                : "#1a1a2e",
    muted:  isDark ? "#9898b0"                : "#666688",
    border: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    input:  isDark ? "#252540"                : "#f8f8fc",
  };

  // save to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem("finview_transactions", JSON.stringify(transactions));
    } catch (err) {
      console.warn("localStorage write failed", err);
    }
  }, [transactions]);

  // totals
  const totals = useMemo(() => {
    const income  = transactions.filter((t) => t.type === "income").reduce((s, t)  => s + t.amount, 0);
    const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  // monthly breakdown for bar chart
  const byMonth = useMemo(() =>
    ["Jan", "Feb", "Mar"].map((label, idx) => ({
      label,
      income:  transactions.filter((t) => t.type === "income"  && new Date(t.date).getMonth() === idx).reduce((s, t) => s + t.amount, 0),
      expense: transactions.filter((t) => t.type === "expense" && new Date(t.date).getMonth() === idx).reduce((s, t) => s + t.amount, 0),
    }))
  , [transactions]);

  // spending by category for pie chart
  const byCategory = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, value]) => ({ label, value }));
  }, [transactions]);

  // insights
  const insights = useMemo(() => {
    const topSpend   = byCategory[0] || null;
    const marchTotal = transactions.filter((t) => t.type === "expense" && t.date.startsWith("2024-03")).reduce((s, t) => s + t.amount, 0);
    const febTotal   = transactions.filter((t) => t.type === "expense" && t.date.startsWith("2024-02")).reduce((s, t) => s + t.amount, 0);
    const diff       = marchTotal - febTotal;
    const avgAmount  = transactions.length ? Math.round(transactions.reduce((s, t) => s + t.amount, 0) / transactions.length) : 0;
    return {
      topSpend,
      trendText: diff > 0 ? `+${fmt(diff)} vs Feb` : `-${fmt(Math.abs(diff))} vs Feb`,
      spentMore: diff > 0,
      avgAmount,
      count: transactions.length,
    };
  }, [transactions, byCategory]);

  // filtered + sorted transactions
  const visibleTransactions = useMemo(() => {
    let list = [...transactions];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((t) =>
        t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      );
    }
    if (typeFilter !== "all") list = list.filter((t) => t.type === typeFilter);
    if (catFilter  !== "all") list = list.filter((t) => t.category === catFilter);
    const [sortKey, sortDir] = sortOption.split("-");
    list.sort((a, b) => {
      const va = sortKey === "date" ? a.date : a.amount;
      const vb = sortKey === "date" ? b.date : b.amount;
      return sortDir === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    return list;
  }, [transactions, searchQuery, typeFilter, catFilter, sortOption]);

  const openAddModal  = () => { setEditingTxn(null);  setShowModal(true); };
  const openEditModal = (txn) => { setEditingTxn(txn); setShowModal(true); };
  const closeModal    = () => { setShowModal(false); setEditingTxn(null); };

  const handleSave = (formData) => {
    const amount = parseFloat(formData.amount) || 0;
    if (editingTxn) {
      setTransactions((prev) => prev.map((t) => t.id === editingTxn.id ? { ...t, ...formData, amount } : t));
    } else {
      setTransactions((prev) => [...prev, { ...formData, amount, id: Date.now() }]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Remove this transaction?"))
      setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const downloadCSV = () => {
    const header = ["Date", "Description", "Category", "Type", "Amount"];
    const rows   = visibleTransactions.map((t) => [t.date, t.description, t.category, t.type, t.amount]);
    const csv    = [header, ...rows].map((r) => r.join(",")).join("\n");
    const link   = document.createElement("a");
    link.href     = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    link.download = "my_transactions.csv";
    link.click();
  };

  const selectStyle = {
    padding: "8px 10px",
    border: `1px solid ${theme.border}`,
    borderRadius: "8px",
    background: theme.input,
    color: theme.text,
    fontSize: "13px",
    cursor: "pointer",
    fontFamily: "inherit",
  };

  const cardStyle = {
    background: theme.card,
    border: `1px solid ${theme.border}`,
    borderRadius: "14px",
    padding: "20px",
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text, fontFamily: "'DM Sans', system-ui, sans-serif", transition: "background 0.3s" }}>

      {/* ── NAV ── */}
      <nav style={{ background: theme.card, borderBottom: `1px solid ${theme.border}`, padding: "0 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {/* top row — always visible */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", height: "60px" }}>

            {/* brand */}
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #534AB7, #1D9E75)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 15, fontWeight: 700, flexShrink: 0 }}>
              ₹
            </div>
            <span style={{ fontWeight: 700, fontSize: "17px", color: theme.text, letterSpacing: "-0.02em", flexShrink: 0 }}>Finance Dashboard</span>

            <div style={{ flex: 1 }} />

            {/* tabs — hidden on mobile, shown inline on tablet+ */}
            {!isMobile && (
              <div style={{ display: "flex", gap: "2px", background: theme.input, borderRadius: "10px", padding: "3px" }}>
                {["dashboard", "transactions", "insights"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "6px 14px", borderRadius: "8px", border: "none",
                      background: activeTab === tab ? theme.card : "transparent",
                      color: activeTab === tab ? theme.text : theme.muted,
                      fontWeight: activeTab === tab ? 600 : 400,
                      cursor: "pointer", fontSize: "13px",
                      boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                      transition: "all 0.15s", textTransform: "capitalize",
                      fontFamily: "inherit",
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}

            {/* role picker — hidden on mobile */}
            {!isMobile && (
              <select value={userRole} onChange={(e) => setUserRole(e.target.value)} style={selectStyle}>
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
            )}

            {/* dark mode toggle */}
            <button
              onClick={toggleDark}
              title={isDark ? "Light mode" : "Dark mode"}
              style={{ width: 36, height: 36, borderRadius: "8px", border: `1px solid ${theme.border}`, background: theme.input, color: theme.text, cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            {/* hamburger — only on mobile */}
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen((o) => !o)}
                style={{ width: 36, height: 36, borderRadius: "8px", border: `1px solid ${theme.border}`, background: theme.input, color: theme.text, cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              >
                {mobileMenuOpen ? "✕" : "☰"}
              </button>
            )}
          </div>

          {/* mobile dropdown menu */}
          {isMobile && mobileMenuOpen && (
            <div style={{ paddingBottom: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>

              {/* mobile tabs */}
              <div style={{ display: "flex", gap: "4px", background: theme.input, borderRadius: "10px", padding: "4px" }}>
                {["dashboard", "transactions", "insights"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setMobileMenuOpen(false); }}
                    style={{
                      flex: 1, padding: "7px 4px", borderRadius: "8px", border: "none",
                      background: activeTab === tab ? theme.card : "transparent",
                      color: activeTab === tab ? theme.text : theme.muted,
                      fontWeight: activeTab === tab ? 600 : 400,
                      cursor: "pointer", fontSize: "12px",
                      textTransform: "capitalize", fontFamily: "inherit",
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* mobile role picker */}
              <select value={userRole} onChange={(e) => setUserRole(e.target.value)} style={{ ...selectStyle, width: "100%" }}>
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
        </div>
      </nav>

      {/* ── PAGE CONTENT ── */}
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: isMobile ? "16px" : "24px" }}>

        {/* admin banner */}
        {isAdmin && (
          <div style={{ background: "linear-gradient(135deg, #4d478f, #32669a)", borderRadius: "12px", padding: isMobile ? "12px 14px" : "12px 20px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", color: "#fff", flexWrap: "wrap" }}>
            <span>⚙️</span>
            <span style={{ fontSize: "14px", fontWeight: 500, flex: 1 }}>Admin mode — add, edit or delete transactions</span>
            <button
              onClick={openAddModal}
              style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: "8px", padding: "6px 16px", cursor: "pointer", fontSize: "13px", fontWeight: 500, fontFamily: "inherit", whiteSpace: "nowrap" }}
            >
              + Add Transaction
            </button>
          </div>
        )}

        {/* ══ DASHBOARD TAB ══ */}
        {activeTab === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* stat cards — 2 col on mobile, 4 col on desktop */}
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : isTablet ? "1fr 1fr" : "repeat(4, 1fr)",
              gap: "12px",
            }}>
              <SummaryCard isDark={isDark} label="Net Balance"    value={fmt(totals.balance)}  color={COLORS.balance}  note={`${transactions.length} transactions`} />
              <SummaryCard isDark={isDark} label="Total Income"   value={fmt(totals.income)}   color={COLORS.income}   note="All sources" />
              <SummaryCard isDark={isDark} label="Total Expenses" value={fmt(totals.expense)}  color={COLORS.expense}  note={`${transactions.filter(t => t.type === "expense").length} entries`} />
              <SummaryCard isDark={isDark} label="Savings Rate"   value={totals.income ? Math.round((totals.balance / totals.income) * 100) + "%" : "—"} note="of income saved" />
            </div>

            {/* charts — stacked on mobile, side by side on desktop */}
            <div style={{
              display: "grid",
              gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr",
              gap: "16px",
            }}>
              <div style={cardStyle}>
                <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: 600, color: theme.text }}>Monthly Overview</p>
                <p style={{ margin: "0 0 14px", fontSize: "12px", color: theme.muted }}>Jan – Mar income vs spending</p>
                <LineChart data={byMonth} />
              </div>
              <div style={cardStyle}>
                <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: 600, color: theme.text }}>Where the money went</p>
                <p style={{ margin: "0 0 14px", fontSize: "12px", color: theme.muted }}>Top 6 expense categories</p>
                <PieChart data={byCategory} />
              </div>
            </div>

            {/* recent 5 transactions */}
            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <span style={{ fontSize: "14px", fontWeight: 600, color: theme.text }}>Recent Activity</span>
                <button onClick={() => setActiveTab("transactions")} style={{ fontSize: "12px", color: COLORS.balance, background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
                  See all →
                </button>
              </div>
              {transactions.slice(0, 5).map((t) => (
                <div key={t.id} style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${theme.border}`, gap: "10px" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: t.type === "income" ? "#e1f5ee" : "#faece7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                    {t.type === "income" ? "💰" : "💸"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: isMobile ? "13px" : "14px", fontWeight: 500, color: theme.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.description}</div>
                    <div style={{ fontSize: "12px", color: theme.muted }}>{t.category} · {t.date}</div>
                  </div>
                  <span style={{ fontWeight: 600, color: t.type === "income" ? COLORS.income : COLORS.expense, fontSize: isMobile ? "13px" : "15px", whiteSpace: "nowrap", flexShrink: 0 }}>
                    {t.type === "income" ? "+" : "−"}{fmt(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ TRANSACTIONS TAB ══ */}
        {activeTab === "transactions" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* filter bar */}
            <div style={cardStyle}>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                <input
                  placeholder="Search by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ flex: "1 1 200px", minWidth: 0, padding: "8px 12px", border: `1px solid ${theme.border}`, borderRadius: "8px", background: theme.input, color: theme.text, fontSize: "14px", outline: "none", fontFamily: "inherit" }}
                />

                {/* on mobile show filters in a 2-col grid */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", width: isMobile ? "100%" : "auto" }}>
                  <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ ...selectStyle, flex: isMobile ? "1 1 calc(50% - 4px)" : "none" }}>
                    <option value="all">All types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expenses</option>
                  </select>
                  <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={{ ...selectStyle, flex: isMobile ? "1 1 calc(50% - 4px)" : "none" }}>
                    <option value="all">All categories</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} style={{ ...selectStyle, flex: isMobile ? "1 1 calc(50% - 4px)" : "none" }}>
                    <option value="date-desc">Newest first</option>
                    <option value="date-asc">Oldest first</option>
                    <option value="amount-desc">Highest amount</option>
                    <option value="amount-asc">Lowest amount</option>
                  </select>
                  <button onClick={downloadCSV} style={{ ...selectStyle, fontWeight: 500, flex: isMobile ? "1 1 calc(50% - 4px)" : "none" }}>
                    ↓ Export CSV
                  </button>
                  {isAdmin && (
                    <button
                      onClick={openAddModal}
                      style={{ padding: "8px 16px", background: "#534AB7", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontWeight: 500, fontFamily: "inherit", flex: isMobile ? "1 1 100%" : "none" }}
                    >
                      + Add Transaction
                    </button>
                  )}
                </div>
              </div>
            </div>

            <TransactionTable
              transactions={visibleTransactions}
              isAdmin={isAdmin}
              onEdit={openEditModal}
              onDelete={handleDelete}
              isDark={isDark}
              isMobile={isMobile}
            />
          </div>
        )}

        {/* ══ INSIGHTS TAB ══ */}
        {activeTab === "insights" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* insight cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : isTablet ? "1fr 1fr" : "repeat(4, 1fr)",
              gap: "14px",
            }}>
              {[
                { label: "Biggest expense category", value: insights.topSpend?.label || "—",   sub: insights.topSpend ? fmt(insights.topSpend.value) : "no data",        color: "#534AB7" },
                { label: "March vs February",        value: insights.trendText,                 sub: insights.spentMore ? "spent more this month" : "spent less",          color: insights.spentMore ? COLORS.expense : COLORS.income },
                { label: "Average transaction",      value: fmt(insights.avgAmount),            sub: `across ${insights.count} entries`,                                   color: COLORS.balance },
                { label: "Savings rate",             value: totals.income ? Math.round((totals.balance / totals.income) * 100) + "%" : "—", sub: "of total income kept", color: COLORS.income },
              ].map((card, i) => (
                <div key={i} style={{ ...cardStyle, padding: isMobile ? "14px" : "20px" }}>
                  <div style={{ fontSize: isMobile ? "20px" : "24px", marginBottom: "10px" }}>{card.icon}</div>
                  <div style={{ fontSize: "11px", color: theme.muted, marginBottom: "4px", lineHeight: 1.3 }}>{card.label}</div>
                  <div style={{ fontSize: isMobile ? "16px" : "20px", fontWeight: 700, color: card.color, marginBottom: "2px" }}>{card.value}</div>
                  <div style={{ fontSize: "11px", color: theme.muted }}>{card.sub}</div>
                </div>
              ))}
            </div>

            {/* category progress bars */}
            <div style={cardStyle}>
              <p style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 600, color: theme.text }}>Spending by category</p>
              {byCategory.length === 0 && (
                <p style={{ color: theme.muted, fontSize: "13px" }}>No expense data yet.</p>
              )}
              {byCategory.map((cat, i) => {
                const pct = Math.round((cat.value / (byCategory[0]?.value || 1)) * 100);
                return (
                  <div key={i} style={{ marginBottom: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                      <span style={{ fontSize: "13px", color: theme.text }}>{cat.label}</span>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: theme.text }}>{fmt(cat.value)}</span>
                    </div>
                    <div style={{ background: theme.input, borderRadius: "6px", height: "8px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: pct + "%", background: COLORS.categories[i % COLORS.categories.length], borderRadius: "6px", transition: "width 0.5s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* monthly comparison table */}
            <div style={cardStyle}>
              <p style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 600, color: theme.text }}>Month-by-month summary</p>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: isMobile ? "12px" : "13px", minWidth: "320px" }}>
                  <thead>
                    <tr style={{ background: theme.input }}>
                      {["Month", "Income", "Expenses", "Net"].map((h) => (
                        <th key={h} style={{ padding: isMobile ? "8px 10px" : "10px 14px", textAlign: "left", color: theme.muted, fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {byMonth.map((row, i) => {
                      const net = row.income - row.expense;
                      return (
                        <tr key={i} style={{ borderTop: `1px solid ${theme.border}` }}>
                          <td style={{ padding: isMobile ? "8px 10px" : "10px 14px", color: theme.text,          fontWeight: 500 }}>{row.label}</td>
                          <td style={{ padding: isMobile ? "8px 10px" : "10px 14px", color: COLORS.income,         fontWeight: 500 }}>{fmt(row.income)}</td>
                          <td style={{ padding: isMobile ? "8px 10px" : "10px 14px", color: COLORS.expense,        fontWeight: 500 }}>{fmt(row.expense)}</td>
                          <td style={{ padding: isMobile ? "8px 10px" : "10px 14px", color: net >= 0 ? COLORS.income : COLORS.expense, fontWeight: 700 }}>{fmt(net)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* modal */}
      {showModal && (
        <TransactionModal
          onClose={closeModal}
          onSave={handleSave}
          existing={editingTxn}
          isDark={isDark}
        />
      )}
    </div>
  );
}