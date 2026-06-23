import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  Clock,
  Download,
  FileSpreadsheet,
  IndianRupee,
  LineChart,
  LogOut,
  Printer,
  ReceiptText,
  TrendingUp,
  Users,
} from "lucide-react";
import "./AdminExpense.css";

const API_URL = "http://localhost:8080/api/orders";

const sampleExpenses = [
  { id: 1, category: "Paper purchase", amount: 6200, date: "2026-05-03" },
  { id: 2, category: "Ink expenses", amount: 4300, date: "2026-05-07" },
  { id: 3, category: "Printer maintenance", amount: 2800, date: "2026-05-11" },
  { id: 4, category: "Electricity", amount: 3500, date: "2026-05-14" },
  { id: 5, category: "Staff salary", amount: 12000, date: "2026-05-16" },
];

const fallbackOrders = [
  {
    id: 1,
    trackId: "SX1001",
    printType: "color",
    totalPrice: 1250,
    phone: "9876543210",
    paperSize: "A4",
    binding: "spiral",
    copies: 3,
    status: "COMPLETED",
    createdAt: "2026-05-18T10:30:00",
  },
  {
    id: 2,
    trackId: "SX1002",
    printType: "bw",
    totalPrice: 420,
    phone: "9123456780",
    paperSize: "A4",
    binding: "none",
    copies: 2,
    status: "PENDING",
    createdAt: "2026-05-17T18:15:00",
  },
  {
    id: 3,
    trackId: "SX1003",
    printType: "color",
    totalPrice: 2460,
    phone: "9876543210",
    paperSize: "A3",
    binding: "calico",
    copies: 4,
    status: "COMPLETED",
    createdAt: "2026-05-16T16:45:00",
  },
  {
    id: 4,
    trackId: "SX1004",
    printType: "bw",
    totalPrice: 860,
    phone: "9988776655",
    paperSize: "A4",
    binding: "spiral",
    copies: 5,
    status: "COMPLETED",
    createdAt: "2026-05-12T19:20:00",
  },
  {
    id: 5,
    trackId: "SX1005",
    printType: "color",
    totalPrice: 1780,
    phone: "9123456780",
    paperSize: "A4",
    binding: "none",
    copies: 1,
    status: "PENDING",
    createdAt: "2026-04-29T12:00:00",
  },
  {
    id: 6,
    trackId: "SX1006",
    printType: "color",
    totalPrice: 3900,
    phone: "9000011111",
    paperSize: "A3",
    binding: "spiral",
    copies: 6,
    status: "COMPLETED",
    createdAt: "2025-12-20T17:30:00",
  },
];

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date) {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.getFullYear(), date.getMonth(), diff);
}

function toAmount(order) {
  return Number(order.totalPrice || order.amount || order.total || 0);
}

function isCompleted(order) {
  return String(order.status || "").toUpperCase() === "COMPLETED";
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function ExportButton({ icon: Icon, label, onClick }) {
  return (
    <button className="admin-expense__button" onClick={onClick} type="button">
      <Icon size={17} />
      {label}
    </button>
  );
}

function MetricCard({ icon: Icon, label, value, detail, tone = "blue" }) {
  return (
    <article className={`admin-expense__metric admin-expense__metric--${tone}`}>
      <div className="admin-expense__metric-icon">
        <Icon size={22} />
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{detail}</span>
      </div>
    </article>
  );
}

function BarChart({ data, valuePrefix = "₹" }) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="admin-expense__bar-chart">
      {data.map((item) => (
        <div className="admin-expense__bar-item" key={item.label}>
          <div className="admin-expense__bar-track">
            <div
              className="admin-expense__bar-fill"
              style={{ height: `${Math.max((item.value / max) * 100, item.value ? 7 : 0)}%` }}
              title={`${item.label}: ${valuePrefix}${item.value.toLocaleString("en-IN")}`}
            />
          </div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function LineGraph({ data }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  const points = data
    .map((item, index) => {
      const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100;
      const y = 90 - (item.value / max) * 76;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="admin-expense__line-wrap">
      <svg className="admin-expense__line-chart" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline points={points} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <div className="admin-expense__line-labels">
        {data.map((item) => (
          <span key={item.label}>{item.label}</span>
        ))}
      </div>
    </div>
  );
}

export default function AdminExpense() {
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState(sampleExpenses);
  const [dataSource, setDataSource] = useState("live");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unable to fetch order analytics");
        return res.json();
      })
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setDataSource("live");
      })
      .catch((err) => {
        console.error("Failed to fetch analytics:", err);
        setOrders(fallbackOrders);
        setDataSource("sample");
      });
  }, []);

  const analytics = useMemo(() => {
    const now = new Date();
    const today = startOfDay(now);
    const weekStart = startOfWeek(now);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const completedOrders = orders.filter(isCompleted);
    const revenueOrders = completedOrders.length ? completedOrders : orders;

    const sumRevenue = (items) => items.reduce((sum, order) => sum + toAmount(order), 0);
    const byDate = (startDate) => revenueOrders.filter((order) => new Date(order.createdAt || order.createdDate || Date.now()) >= startDate);

    const pendingOrders = orders.filter((order) => !isCompleted(order));
    const totalRevenue = sumRevenue(revenueOrders);
    const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue ? Math.round((netProfit / totalRevenue) * 100) : 0;

    const weeklyData = weekLabels.slice(1).concat("Sun").map((label) => ({ label, value: 0 }));
    revenueOrders.forEach((order) => {
      const date = new Date(order.createdAt || order.createdDate || Date.now());
      if (date >= weekStart) {
        const index = date.getDay() === 0 ? 6 : date.getDay() - 1;
        weeklyData[index].value += toAmount(order);
      }
    });

    const monthlyData = monthLabels.map((label) => ({ label, value: 0 }));
    revenueOrders.forEach((order) => {
      const date = new Date(order.createdAt || order.createdDate || Date.now());
      if (date.getFullYear() === now.getFullYear()) {
        monthlyData[date.getMonth()].value += toAmount(order);
      }
    });

    const yearlyMap = new Map();
    revenueOrders.forEach((order) => {
      const year = new Date(order.createdAt || order.createdDate || Date.now()).getFullYear();
      yearlyMap.set(year, (yearlyMap.get(year) || 0) + toAmount(order));
    });
    const yearlyData = Array.from(yearlyMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([label, value]) => ({ label: String(label), value }));

    const customerMap = new Map();
    orders.forEach((order) => {
      const phone = order.phone || "Unknown";
      const current = customerMap.get(phone) || { phone, orders: 0, spent: 0 };
      current.orders += 1;
      current.spent += toAmount(order);
      customerMap.set(phone, current);
    });
    const topCustomers = Array.from(customerMap.values()).sort((a, b) => b.spent - a.spent).slice(0, 5);

    const typeCounts = orders.reduce(
      (acc, order) => {
        const type = String(order.printType || "").toLowerCase();
        if (type === "color") acc.color += 1;
        if (type === "bw" || type.includes("black")) acc.bw += 1;
        if (String(order.binding || "").toLowerCase() === "spiral") acc.spiral += 1;
        return acc;
      },
      { color: 0, bw: 0, spiral: 0 }
    );

    const dayCounts = new Map();
    const timeCounts = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
    orders.forEach((order) => {
      const date = new Date(order.createdAt || order.createdDate || Date.now());
      const day = date.toLocaleDateString("en-IN", { weekday: "long" });
      dayCounts.set(day, (dayCounts.get(day) || 0) + 1);
      const hour = date.getHours();
      if (hour >= 5 && hour < 12) timeCounts.Morning += 1;
      else if (hour >= 12 && hour < 17) timeCounts.Afternoon += 1;
      else if (hour >= 17 && hour < 21) timeCounts.Evening += 1;
      else timeCounts.Night += 1;
    });

    const peakDay = Array.from(dayCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || "No data";
    const peakTime = Object.entries(timeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "No data";

    const paperCounts = orders.reduce((acc, order) => {
      const size = order.paperSize || "Unknown";
      acc[size] = (acc[size] || 0) + 1;
      return acc;
    }, {});
    const mostUsedPaper = Object.entries(paperCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "No data";
    const mostOrderedType = typeCounts.color >= typeCounts.bw ? "Color Prints" : "B/W Prints";
    const averageOrderValue = orders.length ? Math.round(orders.reduce((sum, order) => sum + toAmount(order), 0) / orders.length) : 0;
    const averageCopies = orders.length ? (orders.reduce((sum, order) => sum + Number(order.copies || 0), 0) / orders.length).toFixed(1) : "0";

    return {
      todayIncome: sumRevenue(revenueOrders.filter((order) => sameDay(new Date(order.createdAt || order.createdDate || Date.now()), today))),
      weekIncome: sumRevenue(byDate(weekStart)),
      monthIncome: sumRevenue(byDate(monthStart)),
      yearIncome: sumRevenue(byDate(yearStart)),
      pendingAmount: pendingOrders.reduce((sum, order) => sum + toAmount(order), 0),
      totalOrders: orders.length,
      pendingOrders: pendingOrders.length,
      completedOrders: completedOrders.length,
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      weeklyData,
      monthlyData,
      yearlyData: yearlyData.length ? yearlyData : [{ label: String(now.getFullYear()), value: totalRevenue }],
      topCustomers,
      repeatCustomers: topCustomers.filter((customer) => customer.orders > 1).length,
      averageOrderValue,
      typeCounts,
      peakDay,
      peakTime,
      mostUsedPaper,
      mostOrderedType,
      averageCopies,
    };
  }, [orders, expenses]);

  const handleExpenseChange = (id, field, value) => {
    setExpenses((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === "amount" ? Number(value) : value,
            }
          : item
      )
    );
  };

  const downloadCsv = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Revenue", analytics.totalRevenue],
      ["Total Expenses", analytics.totalExpenses],
      ["Net Profit", analytics.netProfit],
      ["Profit Margin", `${analytics.profitMargin}%`],
      ["Total Orders", analytics.totalOrders],
      ["Pending Amount", analytics.pendingAmount],
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sai-xerox-money-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <main className="admin-expense">
      <header className="admin-expense__header">
        <div className="admin-expense__brand">
          <div className="admin-expense__logo">
            <IndianRupee size={24} />
          </div>
          <div>
            <p>Owner Money Manager</p>
            <h1>Analytics Dashboard</h1>
          </div>
        </div>

        <div className="admin-expense__actions">
          <ExportButton icon={FileSpreadsheet} label="Excel CSV" onClick={downloadCsv} />
          <ExportButton icon={Download} label="PDF Report" onClick={() => window.print()} />
          <button className="admin-expense__button" type="button" onClick={() => (window.location.href = "/admin/orders")}>
            <Printer size={17} />
            Orders
          </button>
          <button className="admin-expense__button admin-expense__button--dark" type="button" onClick={handleLogout}>
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </header>

      {dataSource === "sample" && (
        <div className="admin-expense__notice">
          <AlertTriangle size={18} />
          Showing sample analytics because live order data could not be loaded.
        </div>
      )}

      <section className="admin-expense__metrics" aria-label="Revenue summary">
        <MetricCard icon={IndianRupee} label="Today Income" value={currency.format(analytics.todayIncome)} detail="Earnings today" tone="green" />
        <MetricCard icon={CalendarDays} label="This Week" value={currency.format(analytics.weekIncome)} detail="Monday to Sunday" />
        <MetricCard icon={BarChart3} label="This Month" value={currency.format(analytics.monthIncome)} detail="Monthly revenue" tone="violet" />
        <MetricCard icon={TrendingUp} label="This Year" value={currency.format(analytics.yearIncome)} detail="Yearly revenue" tone="orange" />
        <MetricCard icon={ReceiptText} label="Pending Amount" value={currency.format(analytics.pendingAmount)} detail="Not completed" tone="red" />
        <MetricCard icon={Printer} label="Total Orders" value={analytics.totalOrders.toLocaleString("en-IN")} detail="All print orders" tone="slate" />
      </section>

      <section className="admin-expense__grid admin-expense__grid--charts">
        <article className="admin-expense__panel">
          <div className="admin-expense__panel-head">
            <h2>Weekly Revenue</h2>
            <span>Mon to Sun</span>
          </div>
          <BarChart data={analytics.weeklyData} />
        </article>

        <article className="admin-expense__panel">
          <div className="admin-expense__panel-head">
            <h2>Monthly Revenue</h2>
            <span>Jan to Dec</span>
          </div>
          <LineGraph data={analytics.monthlyData} />
        </article>

        <article className="admin-expense__panel">
          <div className="admin-expense__panel-head">
            <h2>Yearly Growth</h2>
            <span>Revenue growth</span>
          </div>
          <BarChart data={analytics.yearlyData} />
        </article>
      </section>

      <section className="admin-expense__grid admin-expense__grid--business">
        <article className="admin-expense__panel">
          <div className="admin-expense__panel-head">
            <h2>Order Statistics</h2>
            <span>{analytics.mostOrderedType} lead</span>
          </div>
          <div className="admin-expense__stat-list">
            <p><span>Total BW Orders</span><strong>{analytics.typeCounts.bw}</strong></p>
            <p><span>Total Color Orders</span><strong>{analytics.typeCounts.color}</strong></p>
            <p><span>Spiral Binding Orders</span><strong>{analytics.typeCounts.spiral}</strong></p>
            <p><span>Pending Orders</span><strong>{analytics.pendingOrders}</strong></p>
            <p><span>Completed Orders</span><strong>{analytics.completedOrders}</strong></p>
          </div>
        </article>

        <article className="admin-expense__panel">
          <div className="admin-expense__panel-head">
            <h2>Customer Analytics</h2>
            <span>{analytics.repeatCustomers} repeat customers</span>
          </div>
          <div className="admin-expense__customer-list">
            {analytics.topCustomers.map((customer) => (
              <div className="admin-expense__customer" key={customer.phone}>
                <div>
                  <Users size={17} />
                  <span>{customer.phone}</span>
                </div>
                <strong>{currency.format(customer.spent)}</strong>
                <small>{customer.orders} orders</small>
              </div>
            ))}
          </div>
          <div className="admin-expense__mini-kpis">
            <p><span>Average Order Value</span><strong>{currency.format(analytics.averageOrderValue)}</strong></p>
            <p><span>Average Copies / Order</span><strong>{analytics.averageCopies}</strong></p>
          </div>
        </article>

        <article className="admin-expense__panel admin-expense__profit">
          <div className="admin-expense__panel-head">
            <h2>Profit Dashboard</h2>
            <span>Income - Expenses</span>
          </div>
          <div className="admin-expense__profit-ring" style={{ "--profit": `${Math.max(0, Math.min(100, analytics.profitMargin))}%` }}>
            <strong>{analytics.profitMargin}%</strong>
            <span>Profit Margin</span>
          </div>
          <div className="admin-expense__stat-list">
            <p><span>Total Revenue</span><strong>{currency.format(analytics.totalRevenue)}</strong></p>
            <p><span>Total Expenses</span><strong>{currency.format(analytics.totalExpenses)}</strong></p>
            <p><span>Net Profit</span><strong>{currency.format(analytics.netProfit)}</strong></p>
          </div>
        </article>
      </section>

      <section className="admin-expense__grid admin-expense__grid--bottom">
        <article className="admin-expense__panel">
          <div className="admin-expense__panel-head">
            <h2>Expense Tracking</h2>
            <span>Editable owner ledger</span>
          </div>
          <div className="admin-expense__table-wrap">
            <table className="admin-expense__table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>
                      <input value={expense.category} onChange={(e) => handleExpenseChange(expense.id, "category", e.target.value)} />
                    </td>
                    <td>
                      <input type="date" value={expense.date} onChange={(e) => handleExpenseChange(expense.id, "date", e.target.value)} />
                    </td>
                    <td>
                      <input type="number" min="0" value={expense.amount} onChange={(e) => handleExpenseChange(expense.id, "amount", e.target.value)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-expense__panel">
          <div className="admin-expense__panel-head">
            <h2>Peak Business Time</h2>
            <span>Staff planning</span>
          </div>
          <div className="admin-expense__insight-grid">
            <div>
              <Clock size={24} />
              <span>Busiest Time</span>
              <strong>{analytics.peakTime}</strong>
            </div>
            <div>
              <CalendarDays size={24} />
              <span>Highest Order Day</span>
              <strong>{analytics.peakDay}</strong>
            </div>
          </div>
        </article>

        <article className="admin-expense__panel">
          <div className="admin-expense__panel-head">
            <h2>Smart Alerts</h2>
            <span>AI insights</span>
          </div>
          <div className="admin-expense__alerts">
            <p><TrendingUp size={17} /> {analytics.mostOrderedType} are the most ordered print type.</p>
            <p><Printer size={17} /> {analytics.mostUsedPaper} paper is used most often.</p>
            <p><AlertTriangle size={17} /> {analytics.pendingOrders > 10 ? "High pending orders need attention." : "Pending order level is under control."}</p>
            <p><LineChart size={17} /> Net profit is {currency.format(analytics.netProfit)} after tracked expenses.</p>
          </div>
        </article>
      </section>
    </main>
  );
}
