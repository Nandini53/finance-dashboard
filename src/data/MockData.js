export const INITIAL_TRANSACTIONS = [
  { id:1, date:"2026-03-01", description:"Salary", amount:90000, category:"Income", type:"income" },
  { id:2, date:"2026-03-03", description:"Rent", amount:15000, category:"Housing", type:"expense" },
  { id:3, date:"2026-03-05", description:"Groceries", amount:3200, category:"Food", type:"expense" },
  { id:4, date:"2026-03-07", description:"Uber rides", amount:1800, category:"Transport", type:"expense" },
  { id:5, date:"2026-03-10", description:"Netflix subscription", amount:559, category:"Entertainment", type:"expense" },
  { id:6, date:"2026-03-12", description:"Tax", amount:22000, category:"Income", type:"income" },
  { id:7, date:"2026-03-14", description:"Electricity bill", amount:2100, category:"Utilities", type:"expense" },
  { id:8, date:"2026-03-15", description:"Zomato orders", amount:4500, category:"Food", type:"expense" },
  { id:9, date:"2026-03-17", description:"Gym membership", amount:2500, category:"Health", type:"expense" },
  { id:10, date:"2026-03-19", description:"Amazon shopping", amount:6800, category:"Shopping", type:"expense" },
  { id:11, date:"2026-03-21", description:"Interest income", amount:3200, category:"Income", type:"income" },
  { id:12, date:"2026-03-22", description:"Petrol", amount:2200, category:"Transport", type:"expense" },
  { id:13, date:"2026-03-24", description:"Doctor visit", amount:1500, category:"Health", type:"expense" },
  { id:14, date:"2026-03-26", description:"Movie tickets", amount:800, category:"Entertainment", type:"expense" },
  { id:15, date:"2026-03-28", description:"Internet bill", amount:999, category:"Utilities", type:"expense" },
  { id:16, date:"2026-02-01", description:"Salary", amount:75000, category:"Income", type:"income" },
  { id:17, date:"2026-02-03", description:"Rent", amount:15000, category:"Housing", type:"expense" },
  { id:18, date:"2026-02-08", description:"Groceries", amount:2800, category:"Food", type:"expense" },
  { id:19, date:"2026-02-12", description:"Shopping", amount:15000, category:"Income", type:"income" },
  { id:20, date:"2026-02-18", description:"Shopping mall", amount:8500, category:"Shopping", type:"expense" },
  { id:21, date:"2026-02-22", description:"Restaurant dinner", amount:3200, category:"Food", type:"expense" },
  { id:22, date:"2026-01-01", description:"Salary", amount:92000, category:"Income", type:"income" },
  { id:23, date:"2026-01-05", description:"Rent", amount:15000, category:"Housing", type:"expense" },
  { id:24, date:"2026-01-10", description:"Groceries", amount:3500, category:"Food", type:"expense" },
  { id:25, date:"2026-01-15", description:"Shopping", amount:5000, category:"Entertainment", type:"expense" },
];

export const CATEGORIES = ["Food","Housing","Transport","Entertainment","Utilities","Health","Shopping","Income"];

export const COLORS = {
  income: "#890b90",
  expense: "#817cd7",
  balance: "#788a28",
  categories: ["#10e3f2","#1D9E75","#D85A30","#D4537E","#BA7517","#185FA5","#639922","#993C1D"],
};

export function fmt(n) {
  return "₹" + Math.abs(n).toLocaleString("en-IN");
}