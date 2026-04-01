import { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import "./Dashboard.css";
Chart.register(...registerables);

const DATA = {
  "7d": {
    metrics: [
      { label: "Receita total",     value: "R$ 48.200", raw: 48200, delta: "+12,4%", up: true,  icon: "💰" },
      { label: "Novos clientes",    value: "312",       raw: 312,   delta: "+8,1%",  up: true,  icon: "👥" },
      { label: "Taxa de conversão", value: "4,7%",      raw: 4.7,   delta: "-0,3%",  up: false, icon: "📈" },
      { label: "Ticket médio",      value: "R$ 154",    raw: 154,   delta: "+5,2%",  up: true,  icon: "🎫" },
    ],
    revenue: [6200, 7400, 5800, 8100, 7200, 6900, 6600],
    target:  [6000, 7000, 7000, 7500, 7000, 7000, 7000],
    labels:  ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"],
    sparklines: [
      [5800,6000,6200,5900,7400,6800,6200],
      [290,305,298,312,308,311,312],
      [5.1,4.9,5.0,4.8,4.7,4.8,4.7],
      [142,148,150,152,149,153,154],
    ],
  },
  "30d": {
    metrics: [
      { label: "Receita total",     value: "R$ 184.600", raw: 184600, delta: "+18,7%", up: true,  icon: "💰" },
      { label: "Novos clientes",    value: "1.240",      raw: 1240,   delta: "+22,3%", up: true,  icon: "👥" },
      { label: "Taxa de conversão", value: "5,1%",       raw: 5.1,    delta: "+0,6%",  up: true,  icon: "📈" },
      { label: "Ticket médio",      value: "R$ 149",     raw: 149,    delta: "+3,8%",  up: true,  icon: "🎫" },
    ],
    revenue: [38000,42000,31000,52000,44000,48000,55000,43000,61000,57000,49000,66000],
    target:  [40000,40000,40000,50000,50000,50000,55000,55000,55000,60000,60000,60000],
    labels:  ["1","4","7","10","13","16","19","22","25","27","28","30"],
    sparklines: [
      [140000,152000,158000,165000,170000,176000,184600],
      [900,980,1050,1100,1140,1190,1240],
      [4.5,4.6,4.7,4.9,5.0,5.0,5.1],
      [140,143,145,147,147,148,149],
    ],
  },
  "90d": {
    metrics: [
      { label: "Receita total",     value: "R$ 512.800", raw: 512800, delta: "+31,2%", up: true,  icon: "💰" },
      { label: "Novos clientes",    value: "3.870",      raw: 3870,   delta: "+28,5%", up: true,  icon: "👥" },
      { label: "Taxa de conversão", value: "5,4%",       raw: 5.4,    delta: "+1,1%",  up: true,  icon: "📈" },
      { label: "Ticket médio",      value: "R$ 132",     raw: 132,    delta: "-2,1%",  up: false, icon: "🎫" },
    ],
    revenue: [120000,138000,155000,162000,175000,185000,195000,205000,215000,230000,242000,256000],
    target:  [130000,140000,150000,160000,170000,180000,190000,200000,210000,220000,230000,240000],
    labels:  ["Jan","","","Fev","","","Mar","","","Abr","",""],
    sparklines: [
      [390000,420000,450000,468000,490000,501000,512800],
      [3000,3200,3400,3550,3680,3780,3870],
      [4.3,4.5,4.7,4.9,5.1,5.2,5.4],
      [140,138,136,135,134,133,132],
    ],
  },
};

const ALL_ORDERS = [
  { id: "#4521", name: "Ana Souza",       value: "R$ 1.240", raw: 1240,  status: "Pago",     cls: "ok",   date: "01/04/2026", cat: "Eletrônicos" },
  { id: "#4520", name: "Carlos Lima",     value: "R$ 890",   raw: 890,   status: "Pendente", cls: "warn", date: "01/04/2026", cat: "Moda"        },
  { id: "#4519", name: "Beatriz Costa",   value: "R$ 2.100", raw: 2100,  status: "Pago",     cls: "ok",   date: "31/03/2026", cat: "Casa"        },
  { id: "#4518", name: "Rafael Alves",    value: "R$ 540",   raw: 540,   status: "Análise",  cls: "info", date: "31/03/2026", cat: "Esporte"     },
  { id: "#4517", name: "Juliana Melo",    value: "R$ 1.780", raw: 1780,  status: "Pago",     cls: "ok",   date: "30/03/2026", cat: "Eletrônicos" },
  { id: "#4516", name: "Marcos Pereira",  value: "R$ 3.200", raw: 3200,  status: "Pago",     cls: "ok",   date: "30/03/2026", cat: "Moda"        },
  { id: "#4515", name: "Fernanda Lima",   value: "R$ 670",   raw: 670,   status: "Cancelado",cls: "err",  date: "29/03/2026", cat: "Casa"        },
  { id: "#4514", name: "Pedro Gomes",     value: "R$ 1.450", raw: 1450,  status: "Pendente", cls: "warn", date: "29/03/2026", cat: "Esporte"     },
];

const CHANNELS = [
  { name: "Orgânico", pct: 41, color: "#378ADD", trend: "+3%" },
  { name: "Pago",     pct: 28, color: "#1D9E75", trend: "+1%" },
  { name: "Social",   pct: 18, color: "#D85A30", trend: "-2%" },
  { name: "E-mail",   pct:  9, color: "#BA7517", trend: "+0%" },
  { name: "Direto",   pct:  4, color: "#888780", trend: "-1%" },
];

const NAV_ITEMS = [
  { icon: "⊞", label: "Visão geral", id: "dashboard" },
  { icon: "📊", label: "Relatórios",  id: "reports"   },
  { icon: "🛍️", label: "Pedidos",     id: "orders"    },
  { icon: "👤", label: "Clientes",    id: "clients"   },
  { icon: "⚙️", label: "Config.",     id: "settings"  },
];

function Sparkline({ data, up }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const chart = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: data.map((_, i) => i),
        datasets: [{
          data,
          borderColor: up ? "#1D9E75" : "#dc2626",
          borderWidth: 1.5,
          pointRadius: 0,
          tension: 0.4,
          fill: true,
          backgroundColor: up
            ? "rgba(29,158,117,0.08)"
            : "rgba(220,38,38,0.08)",
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          x: { display: false },
          y: { display: false },
        },
        animation: { duration: 400 },
      },
    });
    return () => chart.destroy();
  }, [data, up]);
  return <div style={{ height: 40, width: 80 }}><canvas ref={canvasRef} /></div>;
}

function MetricCard({ label, value, delta, up, sparkline, animDelay }) {
  return (
    <div className="metric-card" style={{ animationDelay: `${animDelay}ms` }}>
      <div className="metric-top">
        <span className="metric-label">{label}</span>
        <span className={`metric-delta ${up ? "up" : "down"}`}>
          {up ? "▲" : "▼"} {delta}
        </span>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-bottom">
        <span className="metric-hint">vs período anterior</span>
        <Sparkline data={sparkline} up={up} />
      </div>
    </div>
  );
}

function RevenueChart({ period }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    const d = DATA[period];
    if (chartRef.current) {
      chartRef.current.data.labels = d.labels;
      chartRef.current.data.datasets[0].data = d.revenue;
      chartRef.current.data.datasets[1].data = d.target;
      chartRef.current.update("active");
      return;
    }
    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: d.labels,
        datasets: [
          {
            label: "Receita",
            data: d.revenue,
            backgroundColor: "rgba(55,138,221,0.85)",
            borderRadius: 6,
            borderSkipped: false,
            order: 2,
          },
          {
            label: "Meta",
            data: d.target,
            type: "line",
            borderColor: "#1D9E75",
            backgroundColor: "rgba(29,158,117,0.05)",
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: "#1D9E75",
            tension: 0.4,
            fill: true,
            order: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1a1a1a",
            titleColor: "#fff",
            bodyColor: "#aaa",
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => {
                const v = ctx.parsed.y;
                return ` ${ctx.dataset.label}: R$ ${v >= 1000 ? (v/1000).toFixed(0)+"k" : v}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 }, color: "#888780" },
          },
          y: {
            grid: { color: "rgba(136,135,128,0.12)", drawBorder: false },
            ticks: {
              font: { size: 11 },
              color: "#888780",
              callback: (v) => "R$" + (v >= 1000 ? (v/1000).toFixed(0)+"k" : v),
            },
          },
        },
      },
    });
    return () => {
      if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
    };
  }, [period]);

  return <div className="chart-wrap"><canvas ref={canvasRef} /></div>;
}

function DonutChart() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const chart = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: ["Eletrônicos","Moda","Casa","Esporte"],
        datasets: [{
          data: [38, 27, 21, 14],
          backgroundColor: ["#378ADD","#1D9E75","#D85A30","#BA7517"],
          borderWidth: 2,
          borderColor: "#ffffff",
          hoverOffset: 8,
          hoverBorderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "72%",
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1a1a1a",
            titleColor: "#fff",
            bodyColor: "#aaa",
            padding: 10,
            cornerRadius: 8,
            callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%` },
          },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return (
    <div style={{ position: "relative" }}>
      <div className="chart-wrap"><canvas ref={canvasRef} /></div>
      <div className="donut-center">
        <div className="donut-center-value">100%</div>
        <div className="donut-center-label">vendas</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [period, setPeriod]         = useState("30d");
  const [sidebarOpen, setSidebar]   = useState(true);
  const [activeNav, setActiveNav]   = useState("dashboard");
  const [orderFilter, setOrderFilter] = useState("Todos");
  const [orderSort, setOrderSort]   = useState("date");
  const [searchQ, setSearchQ]       = useState("");
  const [darkMode, setDarkMode]     = useState(false);
  const [mobileMenuOpen, setMobileMenu] = useState(false);
  const metrics = DATA[period].metrics;

  const filteredOrders = ALL_ORDERS
    .filter(o => {
      if (orderFilter !== "Todos" && o.status !== orderFilter) return false;
      if (searchQ && !o.name.toLowerCase().includes(searchQ.toLowerCase()) &&
          !o.id.includes(searchQ)) return false;
      return true;
    })
    .sort((a, b) => {
      if (orderSort === "value") return b.raw - a.raw;
      if (orderSort === "name")  return a.name.localeCompare(b.name);
      return 0;
    });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const totalRevenue = DATA[period].metrics[0].value;
  const topOrdersPct = Math.round(
    filteredOrders.filter(o=>o.status==="Pago").length / Math.max(filteredOrders.length,1) * 100
  );

  return (
    <div className={`app-shell ${darkMode ? "dark" : ""}`}>

      {/* ── Mobile overlay ── */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenu(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "collapsed"} ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">V</div>
          {(sidebarOpen || mobileMenuOpen) && <span className="logo-text">Vendas Pro</span>}
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeNav === item.id ? "active" : ""}`}
              onClick={() => { setActiveNav(item.id); setMobileMenu(false); }}
              title={!sidebarOpen ? item.label : ""}
            >
              <span className="nav-icon">{item.icon}</span>
              {(sidebarOpen || mobileMenuOpen) && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>
        <button className="sidebar-toggle" onClick={() => setSidebar(v => !v)}>
          {sidebarOpen ? "◀" : "▶"}
        </button>
      </aside>

      {/* ── Main ── */}
      <div className="main-area">

        {/* Top Bar */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="hamburger" onClick={() => setMobileMenu(v => !v)}>☰</button>
            <h1 className="dash-title">Painel de desempenho</h1>
            <span className="dash-sub">Atualizado agora mesmo · março 2026</span>
          </div>
          <div className="topbar-right">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                placeholder="Buscar pedido ou cliente…"
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="period-btns">
              {["7d","30d","90d"].map((p) => (
                <button
                  key={p}
                  className={`period-btn ${period === p ? "active" : ""}`}
                  onClick={() => setPeriod(p)}
                >{p}</button>
              ))}
            </div>
            <span className="badge-live">● Ao vivo</span>
            <button className="icon-btn" onClick={() => setDarkMode(v=>!v)}>
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        <div className="dash">

          {/* KPI Progress Bar */}
          <div className="kpi-bar card">
            <div className="kpi-item">
              <span className="kpi-label">Meta mensal</span>
              <span className="kpi-value">78% atingido</span>
            </div>
            <div className="kpi-track">
              <div className="kpi-fill" style={{ width: "78%", background: "#378ADD" }} />
            </div>
            <div className="kpi-item">
              <span className="kpi-label">Faltam R$ 40.600</span>
              <span className="kpi-target">Meta: {totalRevenue}</span>
            </div>
          </div>

          {/* Métricas */}
          <div className="metrics-grid">
            {metrics.map((m, i) => (
              <MetricCard
                key={m.label}
                {...m}
                sparkline={DATA[period].sparklines[i]}
                animDelay={i * 80}
              />
            ))}
          </div>

          {/* Gráficos */}
          <div className="charts-row">
            <div className="card">
              <div className="card-header">
                <div className="card-title">Receita × Meta</div>
                <div className="chart-legend">
                  <span className="legend-item">
                    <span className="legend-dot" style={{ background: "#378ADD" }} />Receita
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot" style={{ background: "#1D9E75" }} />Meta
                  </span>
                </div>
              </div>
              <RevenueChart period={period} />
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">Categorias</div>
              </div>
              <DonutChart />
              <div className="donut-legend">
                {[
                  ["Eletrônicos","#378ADD","38%"],
                  ["Moda","#1D9E75","27%"],
                  ["Casa","#D85A30","21%"],
                  ["Esporte","#BA7517","14%"],
                ].map(([name, color, pct]) => (
                  <div key={name} className="donut-legend-row">
                    <span className="legend-dot" style={{ background: color }} />
                    <span className="donut-legend-name">{name}</span>
                    <div className="donut-bar-bg">
                      <div className="donut-bar-fill" style={{ width: pct, background: color }} />
                    </div>
                    <span className="donut-legend-pct">{pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pedidos + Canais */}
          <div className="bottom-row">
            <div className="card">
              <div className="card-header">
                <div className="card-title">Pedidos recentes</div>
                <div className="table-controls">
                  <select
                    className="filter-select"
                    value={orderFilter}
                    onChange={e => setOrderFilter(e.target.value)}
                  >
                    {["Todos","Pago","Pendente","Análise","Cancelado"].map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <select
                    className="filter-select"
                    value={orderSort}
                    onChange={e => setOrderSort(e.target.value)}
                  >
                    <option value="date">Data</option>
                    <option value="value">Valor</option>
                    <option value="name">Nome</option>
                  </select>
                </div>
              </div>
              <div className="orders-summary">
                <span className="orders-count">{filteredOrders.length} pedidos</span>
                <span className="orders-paid">{topOrdersPct}% pagos</span>
              </div>
              <div className="table-scroll">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th className="th-left col-id">ID</th>
                      <th className="th-left">Cliente</th>
                      <th className="th-left col-cat">Categoria</th>
                      <th className="th-left">Valor</th>
                      <th className="th-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="order-row">
                        <td className="td td-id col-id">{o.id}</td>
                        <td className="td">{o.name}</td>
                        <td className="td col-cat">
                          <span className="cat-tag">{o.cat}</span>
                        </td>
                        <td className="td td-value">{o.value}</td>
                        <td className="td td-right">
                          <span className={`status-badge status-${o.cls}`}>{o.status}</span>
                        </td>
                      </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                      <tr><td colSpan={5} className="td empty-state">Nenhum pedido encontrado</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">Origem de tráfego</div>
              </div>
              {CHANNELS.map((c) => (
                <div key={c.name} className="channel-row">
                  <span className="channel-name">{c.name}</span>
                  <div className="bar-bg">
                    <div
                      className="bar-fill"
                      style={{ width: `${c.pct}%`, background: c.color }}
                    />
                  </div>
                  <span className="channel-pct">{c.pct}%</span>
                  <span className={`channel-trend ${c.trend.startsWith("+") ? "up" : "down"}`}>
                    {c.trend}
                  </span>
                </div>
              ))}

              {/* Mini stat summary */}
              <div className="traffic-summary">
                <div className="traffic-stat">
                  <div className="traffic-stat-val">24.8k</div>
                  <div className="traffic-stat-label">Visitantes</div>
                </div>
                <div className="traffic-stat">
                  <div className="traffic-stat-val">3m 42s</div>
                  <div className="traffic-stat-label">Tempo médio</div>
                </div>
                <div className="traffic-stat">
                  <div className="traffic-stat-val">38,2%</div>
                  <div className="traffic-stat-label">Taxa rejeição</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}