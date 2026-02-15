'use client';

import { useState, useEffect } from "react";

// --- Icons ---
const CarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><path d="M1 3h15l3 5h4v8h-2M1 16V8l2-5"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/><path d="M8 16h8"/></svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
);

const WrenchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);

const TrendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);

const CalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><polyline points="20 6 9 17 4 12"/></svg>
);

// Animated Counter
function Counter({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}</span>;
}

// Mini Spark Chart
function Spark({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 32 }}>
      {values.map((v: number, i: number) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${(v / max) * 100}%`,
            background: color,
            borderRadius: "3px 3px 0 0",
            opacity: 0.25 + i * 0.12,
            minHeight: 3,
            transition: "all 0.3s",
          }}
        />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  const stats = [
    {
      label: "إجمالي المركبات",
      value: 48,
      sub: "مركبة نشطة",
      icon: <CarIcon />,
      color: "#14b8a6",
      bg: "#f0fdfa",
      border: "#99f6e4",
      trend: "+3",
      trendUp: true,
      spark: [30, 38, 35, 42, 40, 48],
    },
    {
      label: "المستخدمين النشطين",
      value: 24,
      sub: "مستخدم مسجّل",
      icon: <UsersIcon />,
      color: "#10b981",
      bg: "#ecfdf5",
      border: "#6ee7b7",
      trend: "+2",
      trendUp: true,
      spark: [18, 20, 19, 22, 21, 24],
    },
    {
      label: "التفويضات السارية",
      value: 28,
      sub: "تفويض فعّال",
      icon: <FileIcon />,
      color: "#f97316",
      bg: "#fff7ed",
      border: "#fed7aa",
      trend: "+5",
      trendUp: true,
      spark: [20, 24, 22, 26, 25, 28],
    },
    {
      label: "قيد الصيانة",
      value: 5,
      sub: "مركبة متوقفة",
      icon: <WrenchIcon />,
      color: "#8b5cf6",
      bg: "#f5f3ff",
      border: "#c4b5fd",
      trend: "-2",
      trendUp: false,
      spark: [8, 7, 9, 6, 7, 5],
    },
  ];

  const authorizations = [
    {
      vehicle: "ABC 1234",
      driver: "محمد أحمد",
      endDate: "2024-06-30",
      status: "نشط",
      statusColor: "#10b981",
    },
    {
      vehicle: "XYZ 5678",
      driver: "عبدالله سعيد",
      endDate: "2024-07-15",
      status: "نشط",
      statusColor: "#10b981",
    },
    {
      vehicle: "DEF 9012",
      driver: "سعيد محمود",
      endDate: "2024-05-20",
      status: "منتهي",
      statusColor: "#f97316",
    },
  ];

  const recentActivity = [
    {
      text: "تمت إضافة مركبة جديدة",
      time: "منذ 10 دقائق",
      icon: "🚗",
      color: "#14b8a6",
    },
    {
      text: "تجديد تفويض XYZ 5678",
      time: "منذ 45 دقيقة",
      icon: "📄",
      color: "#f97316",
    },
    {
      text: "إكمال صيانة DEF 9012",
      time: "منذ ساعتين",
      icon: "🔧",
      color: "#8b5cf6",
    },
    {
      text: "تسجيل دخول مستخدم جديد",
      time: "منذ 3 ساعات",
      icon: "👤",
      color: "#10b981",
    },
  ];

  const monthBars = [
    { m: "يناير", fuel: 45, maint: 30 },
    { m: "فبراير", fuel: 52, maint: 38 },
    { m: "مارس", fuel: 38, maint: 25 },
    { m: "أبريل", fuel: 65, maint: 42 },
    { m: "مايو", fuel: 55, maint: 35 },
    { m: "يونيو", fuel: 72, maint: 48 },
  ];
  const maxBar = Math.max(...monthBars.flatMap((b) => [b.fuel, b.maint]));

  return (
    <div
      style={{
        fontFamily: "'IBM Plex Sans Arabic', 'Segoe UI', sans-serif",
        direction: "rtl",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0fdfc 0%, #f8fafc 45%, #f5f3ff 100%)",
        padding: 0,
        margin: 0,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .card { background: white; border-radius: 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.04); border: 1px solid rgba(0,0,0,0.05); overflow: hidden; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        
        .stat-card { cursor: default; position: relative; animation: slideIn 0.5s ease-out backwards; }
        .stat-card:hover { transform: translateY(-8px); box-shadow: 0 20px 48px rgba(0,0,0,0.12) !important; }
        
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        
        .auth-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid #f3f4f6; transition: all 0.2s; cursor: pointer; }
        .auth-row:last-child { border-bottom: none; }
        .auth-row:hover { background: #f8fafc; margin: 0 -12px; padding: 14px 12px; border-radius: 10px; }
        
        .activity-row { display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid #f3f4f6; animation: fadeIn 0.4s ease both; }
        .activity-row:last-child { border-bottom: none; }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      {/* ─── HEADER ─── */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 50%, #06b6d4 100%)",
          padding: "40px 28px 80px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(15, 118, 110, 0.2)",
        }}
      >
        {/* Decorative Circles */}
        {[
          { t: -80, r: -60, s: 200, o: 0.06 },
          { t: 20, l: "30%", s: 100, o: 0.04 },
          { b: -40, r: 40, s: 150, o: 0.05 },
        ].map((circle, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: circle.t,
              bottom: circle.b,
              right: circle.r,
              left: circle.l,
              width: circle.s,
              height: circle.s,
              background: `rgba(255, 255, 255, ${circle.o})`,
              borderRadius: "50%",
              filter: "blur(40px)",
            }}
          />
        ))}

        <div style={{ maxWidth: 1600, margin: "0 auto", position: "relative", width: "100%", padding: "0 24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    background: "rgba(255, 255, 255, 0.2)",
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                  }}
                >
                  📊
                </div>
                <span style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14, fontWeight: 600 }}>
                  نظام المساندة ودعم الفرق
                </span>
              </div>
              <h1
                style={{
                  color: "white",
                  fontSize: 32,
                  fontWeight: 800,
                  marginBottom: 8,
                  letterSpacing: "-0.5px",
                }}
              >
                لوحة التحكم
              </h1>
              <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: 15, fontWeight: 500 }}>
                نظرة عامة على النظام والمركبات والفرق
              </p>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                backdropFilter: "blur(10px)",
                borderRadius: 14,
                padding: "12px 20px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  background: "#34d399",
                  borderRadius: "50%",
                  boxShadow: "0 0 12px rgba(52, 211, 153, 0.6)",
                }}
              />
              <span style={{ color: "white", fontSize: 14, fontWeight: 600 }}>
                {new Date().toLocaleDateString("ar-SA", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div style={{ maxWidth: 1600, margin: "-48px auto 0", padding: "0 28px", position: "relative", zIndex: 10, width: "100%", boxSizing: "border-box" }}>
        {/* ─── STAT CARDS ─── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            marginBottom: 36,
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="card stat-card"
              style={{
                padding: 28,
                animationDelay: `${i * 100}ms`,
              }}
              onMouseEnter={() => setHoveredStat(i)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              {/* Colored Top Border */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 5,
                  height: "100%",
                  background: stat.color,
                  borderRadius: "0 18px 18px 0",
                }}
              />

              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: stat.bg,
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: stat.color,
                  border: `1.5px solid ${stat.border}`,
                }}
              >
                  {stat.icon}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: stat.trendUp ? "#ecfdf5" : "#fef2f2",
                    color: stat.trendUp ? "#10b981" : "#ef4444",
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {stat.trendUp ? "📈" : "📉"} {stat.trend}
                </div>
              </div>

              {/* Label */}
              <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, marginBottom: 8 }}>
                {stat.label}
              </div>

              {/* Value */}
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 800,
                  color: "#111827",
                  marginBottom: 8,
                  letterSpacing: "-1px",
                }}
              >
                <Counter target={stat.value} />
              </div>

              {/* Sub */}
              <div style={{ fontSize: 12, color: stat.color, fontWeight: 700, marginBottom: 14 }}>
                {stat.sub}
              </div>

              {/* Spark Chart */}
              <Spark values={stat.spark} color={stat.color} />
            </div>
          ))}
        </div>

        {/* ─── CHARTS & CARDS ROW ─── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 24,
            marginBottom: 36,
          }}
        >
          {/* Monthly Chart */}
          <div className="card" style={{ padding: 28, gridColumn: "span 2" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div
                style={{
                  width: 5,
                  height: 24,
                  background: "linear-gradient(180deg, #14b8a6, #06b6d4)",
                  borderRadius: 3,
                }}
              />
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
                مصاريف المركبات الشهرية
              </h2>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: 24, marginBottom: 20 }}>
              {[
                { color: "#14b8a6", label: "الوقود" },
                { color: "#8b5cf6", label: "الصيانة" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: item.color,
                    }}
                  />
                  <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 16,
                height: 200,
              }}
            >
              {monthBars.map((bar, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "100%",
                    justifyContent: "flex-end",
                    gap: 8,
                  }}
                >
                  {/* Bars */}
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      gap: 2,
                      alignItems: "flex-end",
                      height: "85%",
                    }}
                  >
                    {[
                      { value: bar.fuel, color: "linear-gradient(180deg, #06b6d4, #14b8a6)" },
                      {
                        value: bar.maint,
                        color: "linear-gradient(180deg, #a78bfa, #8b5cf6)",
                      },
                    ].map((item, j) => (
                      <div
                        key={j}
                        style={{
                          flex: 1,
                          height: `${(item.value / maxBar) * 100}%`,
                          background: item.color,
                          borderRadius: "6px 6px 0 0",
                          minHeight: 4,
                          transition: "all 0.3s",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.filter = "brightness(1.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.filter = "brightness(1)";
                        }}
                      />
                    ))}
                  </div>
                  {/* Label */}
                  <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>
                    {bar.m.slice(0, 3)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Incidents Card */}
          <div className="card" style={{ padding: 28, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 5,
                  height: 24,
                  background: "linear-gradient(180deg, #ef4444, #dc2626)",
                  borderRadius: 3,
                }}
              />
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>ملخص الحوادث</h2>
            </div>

            {/* Center Content */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px 0",
              }}
            >
              <div
                style={{
                  width: 100,
                  height: 100,
                  background: "linear-gradient(135deg, #fff7ed, #ffedd5)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 18,
                  border: "3px solid #fed7aa",
                  boxShadow: "0 8px 24px rgba(249, 115, 22, 0.15)",
                  fontSize: 40,
                }}
              >
                <AlertIcon />
              </div>
              <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8, fontWeight: 600 }}>
                حوادث هذا الشهر
              </div>
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 900,
                  color: "#111827",
                  lineHeight: 1,
                  letterSpacing: "-2px",
                  marginBottom: 8,
                }}
              >
                <Counter target={2} duration={800} />
              </div>
              <div style={{ fontSize: 13, color: "#f97316", fontWeight: 700 }}>حادثة مسجّلة</div>
            </div>

            {/* Footer */}
            <div
              style={{
                marginTop: "auto",
                background: "linear-gradient(135deg, #ecfdf5, #f0fdf4)",
                borderRadius: 14,
                padding: 14,
                border: "1px solid #bbf7d0",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: "white",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#10b981",
                  border: "1px solid #bbf7d0",
                  flexShrink: 0,
                  fontSize: 16,
                }}
              >
                <TrendIcon />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#065f46" }}>انخفاض 20%</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                  مقارنة بالشهر الماضي
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── THREE COLUMN SECTION ─── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 24,
            marginBottom: 48,
          }}
        >
          {/* Authorizations */}
          <div className="card" style={{ padding: 28 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 5,
                    height: 24,
                    background: "linear-gradient(180deg, #f97316, #f59e0b)",
                    borderRadius: 3,
                  }}
                />
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>
                  آخر التفويضات
                </h2>
              </div>
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#14b8a6",
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  transition: "all 0.2s",
                }}
              >
                عرض الكل <ArrowIcon />
              </button>
            </div>

            <div>
              {authorizations.map((auth, i) => (
                <div key={i} className="auth-row">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        background: "linear-gradient(135deg, #f0fdfa, #ecfdf5)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#14b8a6",
                        border: "1px solid #ccfbf1",
                        flexShrink: 0,
                      }}
                    >
                      <CarIcon />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#1f2937" }}>
                        {auth.vehicle}
                      </div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                        {auth.driver}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                    <span
                      style={{
                        fontSize: 11,
                        background: `${auth.statusColor}15`,
                        color: auth.statusColor,
                        padding: "3px 12px",
                        borderRadius: 20,
                        fontWeight: 700,
                      }}
                    >
                      {auth.status}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        color: "#9ca3af",
                        fontSize: 11,
                      }}
                    >
                      <CalIcon />
                      {auth.endDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card" style={{ padding: 28, gridColumn: "span 2" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div
                style={{
                  width: 5,
                  height: 24,
                  background: "linear-gradient(180deg, #8b5cf6, #a78bfa)",
                  borderRadius: 3,
                }}
              />
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>
                آخر النشاطات
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 0,
              }}
            >
              {recentActivity.map((activity, i) => (
                <div key={i} className="activity-row" style={{ animationDelay: `${i * 80}ms` }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: `${activity.color}12`,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      flexShrink: 0,
                      border: `1px solid ${activity.color}25`,
                    }}
                  >
                    {activity.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", marginBottom: 2 }}>
                      {activity.text}
                    </div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{activity.time}</div>
                  </div>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: activity.color,
                      flexShrink: 0,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}