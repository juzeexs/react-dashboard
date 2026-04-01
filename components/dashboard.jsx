import { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import "./Dashboard.css";
Chart.register(...registerables);

const DATA = {
  "7d": {
    metrics: [
      { label: "Receita total",      value: "R$ 48.200", delta: "+12,4%", up: true  },
      { label: "Novos clientes",     value: "312",       delta: "+8,1%",  up: true  },
      { label: "Taxa de conversão",  value: "4,7%",      delta: "-0,3%",  up: false },
      { label: "Ticket médio",       value: "R$ 154",    delta: "+5,2%",  up: true  },
    ],
    revenue: [6200, 7400, 5800, 8100, 7200, 6900, 6600],
    target:  [6000, 7000, 7000, 7500, 7000, 7000, 7000],
    labels:  ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"],
  },
  "30d": {
    metrics: [
      { label: "Receita total",      value: "R$ 184.600", delta: "+18,7%", up: true },
      { label: "Novos clientes",     value: "1.240",      delta: "+22,3%", up: true },
      { label: "Taxa de conversão",  value: "5,1%",       delta: "+0,6%",  up: true },
      { label: "Ticket médio",       value: "R$ 149",     delta: "+3,8%",  up: true },
    ],
    revenue: [38000,42000,31000,52000,44000,48000,55000,43000,61000,57000,49000,66000],
    target:  [40000,40000,40000,50000,50000,50000,55000,55000,55000,60000,60000,60000],
    labels:  ["1","4","7","10","13","16","19","22","25","27","28","30"],
  },
  "90d": {
    metrics: [
      { label: "Receita total",      value: "R$ 512.800", delta: "+31,2%", up: true  },
      { label: "Novos clientes",     value: "3.870",      delta: "+28,5%", up: true  },
      { label: "Taxa de conversão",  value: "5,4%",       delta: "+1,1%",  up: true  },
      { label: "Ticket médio",       value: "R$ 132",     delta: "-2,1%",  up: false },
    ],
    revenue: [120000,138000,155000,162000,175000,185000,195000,205000,215000,230000,242000,256000],
    target:  [130000,140000,150000,160000,170000,180000,190000,200000,210000,220000,230000,240000],
    labels:  ["Jan","","","Fev","","","Mar","","","Abr","",""],
  },
};

const ORDERS = [
  { name: "Ana Souza",     value: "R$ 1.240", status: "Pago",     cls: "ok"   },
  { name: "Carlos Lima",   value: "R$ 890",   status: "Pendente", cls: "warn" },
  { name: "Beatriz Costa", value: "R$ 2.100", status: "Pago",     cls: "ok"   },
  { name: "Rafael Alves",  value: "R$ 540",   status: "Análise",  cls: "info" },
  { name: "Juliana Melo",  value: "R$ 1.780", status: "Pago",     cls: "ok"   },
];

const CHANNELS = [
  { name: "Orgânico", pct: 41, color: "#378ADD" },
  { name: "Pago",     pct: 28, color: "#1D9E75" },
  { name: "Social",   pct: 18, color: "#D85A30" },
  { name: "E-mail",   pct:  9, color: "#BA7517" },
  { name: "Direto",   pct:  4, color: "#888780" },
];

function MetricCard({ label, value, delta, up }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className={`metric-delta ${up ? "up" : "down"}`}>
        {up ? "▲" : "▼"} {delta} vs período anterior
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
      chartRef.current.update();
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
            backgroundColor: "#378ADD",
            borderRadius: 4,
            borderSkipped: false,
            order: 2,
          },
          {
            label: "Meta",
            data: d.target,
            type: "line",
            borderColor: "#1D9E75",
            backgroundColor: "transparent",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
            order: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 }, color: "#888780" },
          },
          y: {
            grid: { color: "rgba(136,135,128,0.15)" },
            ticks: {
              font: { size: 11 },
              color: "#888780",
              callback: (v) => "R$" + (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v),
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
          borderWidth: 0,
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => " " + ctx.label + ": " + ctx.parsed + "%" } },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <div className="chart-wrap"><canvas ref={canvasRef} /></div>;
}

export default function Dashboard() {
  const [period, setPeriod] = useState("30d");
  const metrics = DATA[period].metrics;

  return (
    <div className="dash">

      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Painel de desempenho</h1>
          <p className="dash-sub">Atualizado agora mesmo — março 2026</p>
        </div>
        <div className="dash-controls">
          <span className="badge-live">Ao vivo</span>
          <div className="period-btns">
            {["7d","30d","90d"].map((p) => (
              <button
                key={p}
                className={`period-btn ${period === p ? "active" : ""}`}
                onClick={() => setPeriod(p)}
              >{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className="metrics-grid">
        {metrics.map((m) => <MetricCard key={m.label} {...m} />)}
      </div>

      {/* Gráficos */}
      <div className="charts-row">
        <div className="card">
          <div className="card-title">Receita mensal</div>
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-dot" style={{ background: "#378ADD" }} />Receita
            </span>
            <span className="legend-item">
              <span className="legend-dot" style={{ background: "#1D9E75" }} />Meta
            </span>
          </div>
          <RevenueChart period={period} />
        </div>

        <div className="card">
          <div className="card-title">Categorias</div>
          <DonutChart />
          <div className="donut-legend">
            {[["Eletrônicos","#378ADD","38%"],["Moda","#1D9E75","27%"],["Casa","#D85A30","21%"],["Esporte","#BA7517","14%"]].map(([name, color, pct]) => (
              <span key={name} className="legend-item">
                <span className="legend-dot" style={{ background: color }} />{name} {pct}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Pedidos + Canais */}
      <div className="bottom-row">
        <div className="card">
          <div className="card-title">Pedidos recentes</div>
          <table className="orders-table">
            <thead>
              <tr>
                <th className="th-left">Cliente</th>
                <th className="th-left">Valor</th>
                <th className="th-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {ORDERS.map((o) => (
                <tr key={o.name}>
                  <td className="td">{o.name}</td>
                  <td className="td">{o.value}</td>
                  <td className="td td-right">
                    <span className={`status-badge status-${o.cls}`}>{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-title">Origem de tráfego</div>
          {CHANNELS.map((c) => (
            <div key={c.name} className="channel-row">
              <span className="channel-name">{c.name}</span>
              <div className="bar-bg">
                <div className="bar-fill" style={{ width: `${c.pct}%`, background: c.color }} />
              </div>
              <span className="channel-pct">{c.pct}%</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}