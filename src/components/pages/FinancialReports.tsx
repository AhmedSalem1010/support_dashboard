'use client';

import { useState } from 'react';

// --- Icons ---
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);

const TrendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);

const DollarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);

const BarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>
);

const CarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M1 3h15l3 5h4v8h-2M1 16V8l2-5"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/><path d="M8 16h8"/></svg>
);

const SparkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/></svg>
);

// Mini sparkline bars
type SparkBarsProps = {
  color: string;
  values?: number[];
};

function SparkBars({ color, values = [40, 65, 45, 80, 55, 90, 70] }: SparkBarsProps) {
  const max = Math.max(...values);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 32 }}>
      {values.map((v, i) => (
        <div
          key={i}
          style={{
            width: 5,
            height: `${(v / max) * 100}%`,
            background: color,
            borderRadius: 3,
            opacity: i === values.length - 1 ? 1 : 0.4 + i * 0.08,
          }}
        />
      ))}
    </div>
  );
}

// Donut chart
interface DonutSegment {
  percent: number;
  color: string;
}

function DonutChart({ segments }: { segments: DonutSegment[] }) {
  let cumulative = 0;
  const r = 56,
    cx = 64,
    cy = 64,
    strokeW = 14;
  const circ = 2 * Math.PI * r;

  return (
    <svg width="128" height="128" viewBox="0 0 128 128">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={strokeW} />
      {segments.map((seg: DonutSegment, i: number) => {
        const dash = (seg.percent / 100) * circ;
        const offset = circ - (cumulative * circ) / 100;
        cumulative += seg.percent;
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeW}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 64 64)"
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        );
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fill="#6b7280" fontFamily="IBM Plex Sans Arabic, sans-serif">
        الإجمالي
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1f2937" fontFamily="IBM Plex Sans Arabic, sans-serif">
        542,400
      </text>
    </svg>
  );
}

// ✅ Main Component with proper export
export default function FinancialReports() {
  type PeriodKey = 'week' | 'month' | 'quarter' | 'year';
  const [period, setPeriod] = useState<PeriodKey>('month');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reportType, setReportType] = useState('summary');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 1500);
    setTimeout(() => setGenerated(false), 4000);
  };

  const periodLabels = {
    week: 'هذا الأسبوع',
    month: 'هذا الشهر',
    quarter: 'آخر ستة شهور',
    year: 'هذا العام',
  };

  const stats = [
    {
      label: 'إجمالي المصاريف',
      value: '542,400',
      sub: 'ر.س لهذه الفترة',
      icon: <DollarIcon />,
      color: '#09b9b5',
      bg: '#f0fdfc',
      sparkColor: 'rgba(9,185,181,0.5)',
      trend: '+8.2%',
      up: true,
      bars: [38, 52, 44, 71, 58, 83, 65],
    },
    {
      label: 'مصاريف الوقود',
      value: '185,000',
      sub: '34% من الإجمالي',
      icon: <TrendIcon />,
      color: '#f59e0b',
      bg: '#fffbeb',
      sparkColor: 'rgba(245,158,11,0.5)',
      trend: '+3.1%',
      up: true,
      bars: [55, 40, 68, 45, 72, 50, 78],
    },
    {
      label: 'مصاريف الصيانة',
      value: '268,800',
      sub: '50% من الإجمالي',
      icon: <BarIcon />,
      color: '#f97316',
      bg: '#fff7ed',
      sparkColor: 'rgba(249,115,22,0.5)',
      trend: '-2.4%',
      up: false,
      bars: [70, 82, 60, 90, 55, 75, 88],
    },
    {
      label: 'متوسط لكل مركبة',
      value: '11,300',
      sub: 'ر.س / مركبة',
      icon: <CarIcon />,
      color: '#8b5cf6',
      bg: '#f5f3ff',
      sparkColor: 'rgba(139,92,246,0.5)',
      trend: '+1.7%',
      up: true,
      bars: [42, 58, 48, 66, 52, 74, 60],
    },
  ];

  const categories = [
    { label: 'وقود', amount: '185,000', percent: 34, color: '#f59e0b', light: '#fffbeb' },
    { label: 'صيانة', amount: '268,800', percent: 50, color: '#f97316', light: '#fff7ed' },
    { label: 'إصلاحات', amount: '54,240', percent: 10, color: '#09b9b5', light: '#f0fdfc' },
    { label: 'أخرى', amount: '34,360', percent: 6, color: '#8b5cf6', light: '#f5f3ff' },
  ];

  return (
    <div
      style={{
        fontFamily: "'IBM Plex Sans Arabic','Segoe UI',sans-serif",
        direction: 'rtl',
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(150deg, #f0fdfc 0%, #f8fafc 40%, #fffbeb 100%)',
        paddingBottom: 60,
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .card { background: white; border-radius: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.04); border: 1px solid rgba(0,0,0,0.05); }
        .stat-card { transition: all 0.25s cubic-bezier(.4,0,.2,1); cursor: default; }
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.1) !important; }
        .input-field { width: 100%; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 12px; font-family: inherit; font-size: 14px; color: #1f2937; background: #fafafa; transition: all 0.2s; outline: none; appearance: none; }
        .input-field:focus { border-color: #09b9b5; box-shadow: 0 0 0 3px rgba(9,185,181,0.12); background: white; }
        .period-btn { cursor: pointer; border: none; font-family: inherit; transition: all 0.2s; }
        .period-btn:hover { background: #f3f4f6; }
        .export-btn { cursor: pointer; transition: all 0.25s ease; font-family: inherit; border: none; }
        .export-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(9,185,181,0.4) !important; }
        .generate-btn { cursor: pointer; transition: all 0.25s ease; font-family: inherit; border: none; }
        .generate-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(245,158,11,0.35) !important; }
        .bar-fill { transition: width 0.8s cubic-bezier(.4,0,.2,1); }
        .fade-in { animation: fadeIn 0.35s ease; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to{transform: rotate(360deg)} }
        .toast { animation: toastIn 0.4s cubic-bezier(.4,0,.2,1); }
        @keyframes toastIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        select.input-field { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath d='M5 7L0.669873 2.5L9.33013 2.5L5 7Z' fill='%236b7280'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: left 12px center; }
        .fr-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: clamp(12px, 2.5vw, 20px); margin-bottom: 24px; align-items: stretch; }
        @media (max-width: 768px) { .fr-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; } }
        @media (max-width: 520px) { .fr-stats-grid { grid-template-columns: 1fr !important; gap: 12px !important; } }
      `}</style>

      {/* Header */}
      <div
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #0f766e 0%, #09b9b5 55%, #0891b2 100%)',
          padding: '28px 24px 64px',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ position: 'absolute', top: -40, left: -40, width: 200, height: 200, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -30, right: 60, width: 130, height: 130, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: 20, right: '30%', width: 80, height: 80, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />

        <div style={{ width: '100%', maxWidth: '100%', margin: 0, position: 'relative', padding: '0 clamp(16px, 4vw, 28px)', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.18)', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  📊
                </div>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 500 }}>لوحة التقارير المالية</span>
              </div>
              <h1 style={{ color: 'white', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>التقارير المالية</h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>تقارير وإحصائيات المصاريف والإيرادات</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              {/* Period Selector */}
              <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', borderRadius: 14, padding: 4, display: 'flex', border: '1px solid rgba(255,255,255,0.15)' }}>
                {[
                  { k: 'week', l: 'أسبوع' },
                  { k: 'month', l: 'شهر' },
                  { k: 'quarter', l: 'ستة شهور' },
                  { k: 'year', l: 'سنة' },
                ].map((p) => (
                  <button
                    key={p.k}
                    className="period-btn"
                    onClick={() => setPeriod(p.k as PeriodKey)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 600,
                      color: period === p.k ? '#0f766e' : 'rgba(255,255,255,0.85)',
                      background: period === p.k ? 'white' : 'transparent',
                      transition: 'all 0.2s',
                    }}
                  >
                    {p.l}
                  </button>
                ))}
              </div>

              {/* Export Button */}
              <button
                className="export-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  background: 'white',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#0f766e',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                  border: 'none',
                }}
              >
                <DownloadIcon />
                تصدير التقرير
              </button>
            </div>
          </div>

          {/* Period label */}
          <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '4px 14px' }}>
            <div style={{ width: 8, height: 8, background: '#34d399', borderRadius: '50%', boxShadow: '0 0 6px #34d399' }} />
            <span style={{ color: 'white', fontSize: 13, fontWeight: 500 }}>{periodLabels[period]}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ width: '100%', maxWidth: '100%', margin: '-40px 0 0', padding: '0 clamp(16px, 4vw, 24px)', boxSizing: 'border-box' }}>
        {/* Stat Cards */}
        <div className="fr-stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="card stat-card fade-in" style={{ padding: 'clamp(16px, 2.5vw, 22px)', position: 'relative', overflow: 'hidden', minHeight: 160, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 4, height: '100%', background: s.color, borderRadius: '0 20px 20px 0' }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, background: s.bg, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>
                  {s.icon}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: s.up ? '#f0fdf4' : '#fef2f2', borderRadius: 20, padding: '3px 8px' }}>
                  <span style={{ color: s.up ? '#16a34a' : '#dc2626', fontSize: 11 }}>
                    <SparkIcon />
                  </span>
                  <span style={{ color: s.up ? '#16a34a' : '#dc2626', fontSize: 12, fontWeight: 700 }}>
                    {s.trend}
                  </span>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>{s.label}</div>
                <div style={{ fontSize: 'clamp(18px, 3.5vw, 24px)', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 11, color: s.color, fontWeight: 600 }}>{s.sub}</div>
              </div>
              <div style={{ marginTop: 12 }}>
                <SparkBars color={s.sparkColor} values={s.bars} />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* Category Summary */}
          <div className="card fade-in" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <div style={{ width: 4, height: 20, background: 'linear-gradient(180deg,#09b9b5,#0891b2)', borderRadius: 4 }} />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>المصاريف حسب الفئة</h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
              <DonutChart segments={categories} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                {categories.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#6b7280', flex: 1 }}>{c.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: c.color }}>{c.percent}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {categories.map((c, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{c.label}</span>
                    </div>
                    <span style={{ fontSize: 13, color: '#6b7280' }}>
                      {c.amount} <span style={{ fontSize: 11, color: '#9ca3af' }}>ر.س</span>
                    </span>
                  </div>
                  <div style={{ height: 7, background: '#f3f4f6', borderRadius: 99, overflow: 'hidden' }}>
                    <div className="bar-fill" style={{ height: '100%', width: `${c.percent}%`, background: `linear-gradient(90deg, ${c.color}99, ${c.color})`, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Report */}
          <div className="card fade-in" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <div style={{ width: 4, height: 20, background: 'linear-gradient(180deg,#f59e0b,#f97316)', borderRadius: 4 }} />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>تقرير مخصص</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 7 }}>
                  من تاريخ
                </label>
                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="input-field" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 7 }}>
                  إلى تاريخ
                </label>
                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="input-field" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 7 }}>
                  نوع التقرير
                </label>
                <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="input-field">
                  <option value="summary">ملخص المصاريف</option>
                  <option value="by-vehicle">حسب المركبة</option>
                  <option value="by-category">حسب الفئة</option>
                  <option value="detailed">تفصيلي</option>
                </select>
              </div>

              {/* Report type preview */}
              <div style={{ background: '#fffbeb', borderRadius: 12, padding: '12px 14px', border: '1px dashed #fcd34d', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>
                  {reportType === 'summary' ? '📋' : reportType === 'by-vehicle' ? '🚗' : reportType === 'by-category' ? '🗂️' : '📑'}
                </span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e' }}>
                    {reportType === 'summary'
                      ? 'ملخص المصاريف'
                      : reportType === 'by-vehicle'
                      ? 'تقرير حسب المركبة'
                      : reportType === 'by-category'
                      ? 'تقرير حسب الفئة'
                      : 'التقرير التفصيلي'}
                  </div>
                  <div style={{ fontSize: 11, color: '#b45309' }}>سيتم تضمين جميع البيانات المتاحة</div>
                </div>
              </div>

              <button
                className="generate-btn"
                onClick={handleGenerate}
                disabled={generating}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '12px 20px',
                  background: generating ? '#fcd34d' : 'linear-gradient(135deg,#f59e0b,#f97316)',
                  borderRadius: 12,
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 700,
                  boxShadow: '0 4px 15px rgba(245,158,11,0.3)',
                  cursor: generating ? 'not-allowed' : 'pointer',
                  opacity: generating ? 0.7 : 1,
                }}
              >
                {generating ? (
                  <>
                    <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    جارٍ الإنشاء...
                  </>
                ) : (
                  <>
                    <CalendarIcon />
                    إنشاء التقرير
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="card fade-in" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 4, height: 20, background: 'linear-gradient(180deg,#8b5cf6,#a78bfa)', borderRadius: 4 }} />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>الاتجاه الشهري للمصاريف</h2>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              {[
                ['#09b9b5', 'وقود'],
                ['#f97316', 'صيانة'],
                ['#8b5cf6', 'إصلاحات'],
              ].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                  <span style={{ fontSize: 12, color: '#6b7280' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 100 }}>
            {['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'].map((m, i) => {
              const vals = [
                [45, 60, 55, 70, 50, 80, 65, 75, 58, 82, 68, 90],
                [70, 55, 80, 60, 85, 45, 75, 88, 50, 72, 65, 95],
                [30, 40, 25, 45, 35, 55, 40, 50, 38, 60, 42, 68],
              ];
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                    {[
                      ['#09b9b5', vals[0][i]],
                      ['#f97316', vals[1][i]],
                      ['#8b5cf6', vals[2][i]],
                    ].map(([c, v]) => (
                      <div
                        key={c}
                        style={{
                          width: '80%',
                          height: `${(v as number) * 0.5}px`,
                          background: c,
                          borderRadius: '3px 3px 0 0',
                          opacity: 0.75,
                          transition: 'height 0.6s ease',
                          minHeight: 4,
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: 9, color: '#9ca3af', marginTop: 4, writingMode: 'initial' }}>
                    {m.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Toast */}
      {generated && (
        <div
          className="toast"
          style={{
            position: 'fixed',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg,#f59e0b,#f97316)',
            color: 'white',
            padding: '14px 28px',
            borderRadius: 16,
            boxShadow: '0 8px 30px rgba(245,158,11,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 15,
            fontWeight: 600,
            zIndex: 999,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontSize: 18 }}>✅</span>
          تم إنشاء التقرير بنجاح!
        </div>
      )}
    </div>
  );
}