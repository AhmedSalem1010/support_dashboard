import { useState, type FormEvent } from "react";

// --- Icons ---
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const CarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M1 3h15l3 5h4v8h-2M1 16V8l2-5"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/><path d="M8 16h8"/></svg>
);
const CalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);
const RiyalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);
const ReceiptIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M9 5H7a2 2 0 0 0-2 2v12l3-2 2 2 2-2 2 2 2-2 3 2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1" ry="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>
);
const FuelIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M3 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M13 10h2a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V8l-3-3"/><line x1="3" y1="22" x2="17" y2="22"/><line x1="6" y1="10" x2="10" y2="10"/></svg>
);
const OilIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
);
const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
);
const TotalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="12" height="12"><polyline points="20 6 9 17 4 12"/></svg>
);

// type badge styles
type ExpenseType = "وقود" | "زيت" | "أخرى";
const typeBadge: Record<ExpenseType, { bg: string; color: string; border: string }> = {
  "وقود": { bg:"#f0fdfc", color:"#0d9488", border:"#99f6e4" },
  "زيت":  { bg:"#fff7ed", color:"#c2410c", border:"#fed7aa" },
  "أخرى": { bg:"#f8fafc", color:"#475569", border:"#e2e8f0" },
};

export function Expenses() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ vehicleId:"", category:"fuel", amount:"", date:new Date().toISOString().split("T")[0], description:"" });
  const [saved, setSaved] = useState(false);
  const [activeRow, setActiveRow] = useState<number | null>(null);

  const expenses = [
    { id:1, vehicle:"ABC 1234", type:"وقود", amount:"250", date:"2024-01-15", invoice:"موجودة" },
    { id:2, vehicle:"XYZ 5678", type:"زيت",  amount:"180", date:"2024-01-14", invoice:"موجودة" },
    { id:3, vehicle:"DEF 9012", type:"وقود", amount:"320", date:"2024-01-12", invoice:"موجودة" },
    { id:4, vehicle:"ABC 1234", type:"أخرى", amount:"150", date:"2024-01-10", invoice:"موجودة" },
  ];

  const monthData = [
    {month:"يناير",value:38},{month:"فبراير",value:42},{month:"مارس",value:35},
    {month:"أبريل",value:50},{month:"مايو",value:45},{month:"يونيو",value:55},
  ];
  const maxMonth = Math.max(...monthData.map(m=>m.value));

  const expensesByType = [
    {label:"وقود",  amount:"28,500", percent:74, color:"#09b9b5", light:"#f0fdfc"},
    {label:"زيت",   amount:"6,200",  percent:16, color:"#f97316", light:"#fff7ed"},
    {label:"أخرى",  amount:"3,700",  percent:10, color:"#94a3b8", light:"#f8fafc"},
  ];

  const stats = [
    { label:"إجمالي المصاريف", value:"38,400", sub:"هذا الشهر", icon:<TotalIcon />, color:"#09b9b5", bg:"#f0fdfc", trend:"+4.2%" },
    { label:"الوقود",           value:"28,500", sub:"74% من الإجمالي", icon:<FuelIcon />, color:"#0d9488", bg:"#ecfdf5", trend:"+2.1%" },
    { label:"الزيت",            value:"6,200",  sub:"16% من الإجمالي", icon:<OilIcon />, color:"#f97316", bg:"#fff7ed", trend:"-1.3%" },
    { label:"أخرى",             value:"3,700",  sub:"10% من الإجمالي", icon:<GridIcon />, color:"#8b5cf6", bg:"#f5f3ff", trend:"+0.8%" },
  ];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(()=>{ setSaved(false); setShowModal(false); },1500);
  };

  return (
    <div className="e-page-root" style={{fontFamily:"'IBM Plex Sans Arabic','Segoe UI',sans-serif",direction:"rtl",width:"100%",minHeight:"100vh",background:"linear-gradient(150deg,#f0fdfc 0%,#f8fafc 40%,#f5f3ff 100%)",paddingBottom:60,boxSizing:"border-box"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

        .e-card{background:white;border-radius:clamp(14px,2.5vw,20px);box-shadow:0 1px 3px rgba(0,0,0,0.05),0 4px 20px rgba(0,0,0,0.04);border:1px solid rgba(0,0,0,0.05);overflow:hidden;}
        .e-stat{transition:all .25s cubic-bezier(.4,0,.2,1);}
        .e-stat:hover{transform:translateY(-4px);box-shadow:0 12px 36px rgba(0,0,0,0.1)!important;}

        .e-add-btn{cursor:pointer;display:flex;align-items:center;gap:8px;padding:clamp(9px,2vw,11px) clamp(16px,3vw,22px);border-radius:clamp(9px,1.8vw,12px);background:linear-gradient(135deg,#09b9b5,#0d9488);border:none;color:white;font-size:clamp(12px,2.5vw,14px);font-weight:700;font-family:inherit;box-shadow:0 4px 15px rgba(9,185,181,.3);transition:all .25s ease;}
        .e-add-btn:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(9,185,181,.45);}
        .e-add-btn:active{transform:translateY(0);}

        .e-bar-row{cursor:pointer;transition:background .15s;}
        .e-bar-row:hover{background:#f8fafc;}

        .e-month-bar{border-radius:6px 6px 0 0;transition:all .3s ease;cursor:pointer;}
        .e-month-bar:hover{filter:brightness(1.1);}

        .e-input{width:100%;padding:clamp(9px,2vw,11px) clamp(10px,2.5vw,14px);border:1.5px solid #e5e7eb;border-radius:clamp(9px,1.8vw,12px);font-family:inherit;font-size:clamp(13px,2.5vw,14px);color:#1f2937;background:#fafafa;transition:all .2s;outline:none;appearance:none;}
        .e-input:focus{border-color:#09b9b5;box-shadow:0 0 0 3px rgba(9,185,181,.12);background:white;}
        select.e-input{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M5 6L0 0h10z' fill='%236b7280'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:left 12px center;}

        .e-modal-save{cursor:pointer;transition:all .25s;display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:clamp(10px,2vw,13px);border-radius:clamp(9px,1.8vw,12px);background:linear-gradient(135deg,#09b9b5,#0d9488);border:none;color:white;font-size:clamp(13px,2.5vw,15px);font-weight:700;font-family:inherit;box-shadow:0 4px 15px rgba(9,185,181,.3);}
        .e-modal-save:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(9,185,181,.4);}
        .e-modal-cancel{cursor:pointer;transition:all .2s;padding:clamp(9px,2vw,11px);border-radius:clamp(9px,1.8vw,12px);border:1.5px solid #e5e7eb;font-size:clamp(12px,2.5vw,14px);font-weight:600;color:#6b7280;font-family:inherit;background:white;width:100%;}
        .e-modal-cancel:hover{background:#f3f4f6;}

        .e-fade{animation:eFade .3s ease;}
        @keyframes eFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

        .e-modal-anim{animation:eModal .35s cubic-bezier(.4,0,.2,1);}
        @keyframes eModal{from{opacity:0;transform:scale(.93) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}

        .e-progress{transition:width .8s cubic-bezier(.4,0,.2,1);}

        .e-badge{display:inline-flex;align-items:center;padding:3px clamp(8px,2vw,12px);border-radius:20px;font-size:clamp(10px,1.8vw,12px);font-weight:600;border:1px solid;}

        .e-page-root{width:100%;min-height:100vh;}
        @media(max-width:900px){ .e-content-wrap{padding:0 16px!important;} .e-header-wrap{padding:0 16px!important;} }
        @media(max-width:768px){
          .e-stats-grid{grid-template-columns:repeat(2,1fr)!important;gap:12px!important;}
          .e-charts-row{grid-template-columns:1fr!important;}
          .e-table-inner{min-width:500px;}
        }
        @media(max-width:640px){
          .e-header-inner{flex-direction:column!important;align-items:flex-start!important;gap:12px!important;}
          .e-add-btn{width:100%;justify-content:center;}
        }
        @media(max-width:520px){
          .e-stats-grid{grid-template-columns:1fr!important;gap:12px!important;}
        }
        @media(max-width:480px){
          .e-table-vehicle{display:none!important;}
          .e-table-date{display:none!important;}
          .e-table-inner{min-width:320px;}
        }
        @media(max-width:360px){
          .e-modal-btns{flex-direction:column!important;}
          .e-content-wrap{padding:0 12px!important;}
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{width:"100%",background:"linear-gradient(135deg,#0f766e 0%,#09b9b5 55%,#0891b2 100%)",padding:"clamp(20px,4vw,32px) clamp(16px,4vw,28px) clamp(48px,8vw,72px)",position:"relative",overflow:"hidden",boxSizing:"border-box"}}>
        <div style={{position:"absolute",top:-40,left:-40,width:"clamp(100px,18vw,180px)",height:"clamp(100px,18vw,180px)",background:"rgba(255,255,255,0.06)",borderRadius:"50%"}} />
        <div style={{position:"absolute",bottom:-28,right:"8%",width:"clamp(80px,14vw,150px)",height:"clamp(80px,14vw,150px)",background:"rgba(255,255,255,0.05)",borderRadius:"50%"}} />
        <div className="e-header-wrap e-header-inner" style={{width:"100%",maxWidth:"100%",margin:0,position:"relative",display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:16,padding:"0 clamp(16px,4vw,28px)",boxSizing:"border-box"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <div style={{width:"clamp(30px,5vw,38px)",height:"clamp(30px,5vw,38px)",background:"rgba(255,255,255,0.2)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"clamp(14px,3vw,18px)"}}>💰</div>
              <span style={{color:"rgba(255,255,255,0.8)",fontSize:"clamp(11px,2.2vw,13px)",fontWeight:500}}>إدارة المصاريف التشغيلية</span>
            </div>
            <h1 style={{color:"white",fontSize:"clamp(20px,5vw,30px)",fontWeight:700,marginBottom:4}}>المصاريف التشغيلية</h1>
            <p style={{color:"rgba(255,255,255,0.72)",fontSize:"clamp(11px,2.2vw,14px)"}}>إدارة مصاريف الوقود والزيت والمصاريف الأخرى</p>
          </div>
          <button className="e-add-btn" onClick={()=>setShowModal(true)}>
            <PlusIcon />
            <span>إضافة مصروف</span>
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="e-content-wrap" style={{width:"100%",maxWidth:"100%",margin:"clamp(-30px,-5vw,-44px) 0 0",padding:"0 clamp(12px,3vw,24px)",boxSizing:"border-box"}}>

        {/* Stats */}
        <div className="e-stats-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,220px),1fr))",gap:"clamp(12px,2.5vw,20px)",marginBottom:"clamp(16px,3vw,24px)",alignItems:"stretch"}}>
          {stats.map((s,i)=>(
            <div key={i} className="e-card e-stat e-fade" style={{padding:"clamp(16px,2.5vw,22px)",position:"relative",overflow:"hidden",minHeight:140,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
              <div style={{position:"absolute",top:0,right:0,width:4,height:"100%",background:s.color,borderRadius:"0 20px 20px 0"}} />
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12}}>
                <div style={{width:"clamp(36px,5vw,44px)",height:"clamp(36px,5vw,44px)",background:s.bg,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",color:s.color,flexShrink:0}}>{s.icon}</div>
                <span style={{fontSize:"clamp(10px,1.8vw,12px)",fontWeight:700,color:s.trend.startsWith("+")?"#16a34a":"#dc2626",background:s.trend.startsWith("+")?"#f0fdf4":"#fef2f2",padding:"2px 7px",borderRadius:20}}>{s.trend}</span>
              </div>
              <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"flex-start",gap:4}}>
                <div style={{fontSize:"clamp(10px,1.8vw,11px)",color:"#9ca3af",fontWeight:500}}>{s.label}</div>
                <div style={{fontSize:"clamp(18px,3.5vw,24px)",fontWeight:800,color:"#111827",letterSpacing:"-0.3px",lineHeight:1.2}}>{s.value}</div>
                <div style={{fontSize:"clamp(9px,1.6vw,11px)",color:s.color,fontWeight:600}}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="e-charts-row" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,340px),1fr))",gap:"clamp(14px,3vw,20px)",marginBottom:"clamp(16px,3vw,24px)"}}>

          {/* Monthly Bar Chart */}
          <div className="e-card e-fade" style={{padding:"clamp(16px,3vw,24px)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"clamp(16px,3vw,22px)"}}>
              <div style={{width:4,height:20,background:"linear-gradient(180deg,#09b9b5,#0891b2)",borderRadius:4,flexShrink:0}} />
              <h2 style={{fontSize:"clamp(14px,2.8vw,16px)",fontWeight:700,color:"#111827"}}>المصاريف الشهرية</h2>
              <span style={{marginRight:"auto",fontSize:"clamp(10px,1.8vw,12px)",color:"#6b7280",background:"#f3f4f6",padding:"3px 10px",borderRadius:20}}>ريال (ألف)</span>
            </div>
            <div style={{display:"flex",alignItems:"flex-end",gap:"clamp(6px,1.5vw,10px)",height:"clamp(100px,18vw,140px)",paddingBottom:0}}>
              {monthData.map((item,i)=>(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:0,height:"100%",justifyContent:"flex-end"}}>
                  <div style={{fontSize:"clamp(8px,1.5vw,11px)",color:"#09b9b5",fontWeight:700,marginBottom:4}}>{item.value}</div>
                  <div
                    className="e-month-bar"
                    style={{
                      width:"100%",
                      height:`${(item.value/maxMonth)*100}%`,
                      minHeight:8,
                      background:`linear-gradient(180deg,#09b9b5,#0d9488)`,
                      opacity: i===5?1:0.45+i*0.1,
                    }}
                  />
                </div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-around",gap:4,borderTop:"1px solid #f3f4f6",paddingTop:"clamp(8px,1.5vw,12px)",marginTop:"clamp(8px,1.5vw,12px)"}}>
              {monthData.map(m=>(
                <span key={m.month} style={{flex:1,textAlign:"center",fontSize:"clamp(8px,1.5vw,11px)",color:"#9ca3af"}}>{m.month}</span>
              ))}
            </div>
          </div>

          {/* By Type */}
          <div className="e-card e-fade" style={{padding:"clamp(16px,3vw,24px)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"clamp(16px,3vw,22px)"}}>
              <div style={{width:4,height:20,background:"linear-gradient(180deg,#f59e0b,#f97316)",borderRadius:4,flexShrink:0}} />
              <h2 style={{fontSize:"clamp(14px,2.8vw,16px)",fontWeight:700,color:"#111827"}}>المصاريف حسب النوع</h2>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"clamp(14px,2.5vw,20px)"}}>
              {expensesByType.map((item,i)=>(
                <div key={i}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:10,height:10,borderRadius:"50%",background:item.color,flexShrink:0}} />
                      <span style={{fontSize:"clamp(12px,2.2vw,14px)",fontWeight:600,color:"#374151"}}>{item.label}</span>
                      <span style={{fontSize:"clamp(10px,1.8vw,12px)",fontWeight:700,color:item.color,background:item.light,padding:"2px 8px",borderRadius:20}}>{item.percent}%</span>
                    </div>
                    <span style={{fontSize:"clamp(12px,2.2vw,13px)",color:"#6b7280"}}>{item.amount} <span style={{fontSize:"clamp(9px,1.6vw,11px)",color:"#9ca3af"}}>ر.س</span></span>
                  </div>
                  <div style={{height:8,background:"#f3f4f6",borderRadius:99,overflow:"hidden"}}>
                    <div className="e-progress" style={{height:"100%",width:`${item.percent}%`,background:`linear-gradient(90deg,${item.color}99,${item.color})`,borderRadius:99}} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="e-card e-fade e-table-wrap" style={{overflow:"hidden",marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"clamp(14px,2.5vw,20px) clamp(16px,3vw,24px)",borderBottom:"1px solid #f3f4f6",flexWrap:"wrap",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:4,height:20,background:"linear-gradient(180deg,#8b5cf6,#a78bfa)",borderRadius:4}} />
              <h2 style={{fontSize:"clamp(14px,2.8vw,16px)",fontWeight:700,color:"#111827"}}>سجل المصاريف</h2>
            </div>
            <span style={{fontSize:"clamp(10px,1.8vw,12px)",color:"#9ca3af",background:"#f8fafc",border:"1px solid #e5e7eb",padding:"3px 12px",borderRadius:20}}>
              {expenses.length} عملية
            </span>
          </div>

          <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
          {/* Table Header */}
          <div className="e-table-inner" style={{display:"grid",gridTemplateColumns:"2fr 1.2fr 1.2fr 1.2fr 1fr",padding:"clamp(10px,2vw,12px) clamp(16px,3vw,24px)",background:"#f8fafc",borderBottom:"1px solid #f3f4f6",gap:8}}>
            {[["المركبة","e-table-vehicle"],["نوع المصروف",""],["المبلغ",""],["التاريخ","e-table-date"],["الفاتورة",""]].map(([col,cls])=>(
              <span key={col} className={cls} style={{fontSize:"clamp(10px,1.8vw,12px)",fontWeight:700,color:"#6b7280",letterSpacing:"0.5px"}}>{col}</span>
            ))}
          </div>

          {/* Rows */}
          {expenses.map((row,i)=>{
            const badge = typeBadge[row.type as ExpenseType] || typeBadge["أخرى"];
            return (
              <div
                key={row.id}
                className="e-bar-row e-table-inner"
                onClick={()=>setActiveRow(activeRow===row.id?null:row.id)}
                style={{display:"grid",gridTemplateColumns:"2fr 1.2fr 1.2fr 1.2fr 1fr",padding:"clamp(12px,2vw,16px) clamp(16px,3vw,24px)",borderBottom:i<expenses.length-1?"1px solid #f9fafb":"none",gap:8,alignItems:"center",background:activeRow===row.id?"#f0fdfc":"white",minWidth:0}}
              >
                <div className="e-table-vehicle" style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:"clamp(28px,4vw,34px)",height:"clamp(28px,4vw,34px)",background:"#f0fdfc",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",color:"#09b9b5",flexShrink:0,border:"1px solid #ccfbf1"}}>
                    <CarIcon />
                  </div>
                  <span style={{fontSize:"clamp(12px,2.2vw,14px)",fontWeight:600,color:"#1f2937"}}>{row.vehicle}</span>
                </div>
                <div>
                  <span className="e-badge" style={{background:badge.bg,color:badge.color,borderColor:badge.border}}>{row.type}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{color:"#9ca3af"}}><RiyalIcon /></span>
                  <span style={{fontSize:"clamp(12px,2.2vw,14px)",fontWeight:700,color:"#1f2937"}}>{row.amount}</span>
                  <span style={{fontSize:"clamp(9px,1.6vw,11px)",color:"#9ca3af"}}>ر.س</span>
                </div>
                <div className="e-table-date" style={{display:"flex",alignItems:"center",gap:6,color:"#6b7280"}}>
                  <span style={{color:"#d1d5db"}}><CalIcon /></span>
                  <span style={{fontSize:"clamp(11px,2vw,13px)"}}>{row.date}</span>
                </div>
                <div>
                  <span className="e-badge" style={{background:"#f0fdf4",color:"#16a34a",borderColor:"#bbf7d0"}}>
                    <span style={{marginLeft:4}}><CheckIcon /></span>
                    {row.invoice}
                  </span>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      {showModal&&(
        <div
          onClick={()=>setShowModal(false)}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:"clamp(12px,3vw,20px)"}}
        >
          <div
            className="e-modal-anim"
            onClick={e=>e.stopPropagation()}
            style={{background:"white",borderRadius:"clamp(16px,3vw,24px)",width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 60px rgba(0,0,0,0.2)"}}
          >
            {/* Modal Header */}
            <div style={{background:"linear-gradient(135deg,#0f766e,#09b9b5)",padding:"clamp(18px,3.5vw,26px) clamp(18px,3.5vw,26px) clamp(16px,3vw,22px)",display:"flex",alignItems:"center",justifyContent:"space-between",borderRadius:"clamp(16px,3vw,24px) clamp(16px,3vw,24px) 0 0"}}>
              <div>
                <div style={{color:"rgba(255,255,255,0.8)",fontSize:"clamp(10px,2vw,12px)",marginBottom:4}}>نموذج جديد</div>
                <h2 style={{color:"white",fontSize:"clamp(17px,4vw,22px)",fontWeight:700}}>إضافة مصروف</h2>
              </div>
              <button onClick={()=>setShowModal(false)} style={{width:"clamp(32px,5vw,38px)",height:"clamp(32px,5vw,38px)",background:"rgba(255,255,255,0.18)",border:"none",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"white"}}>
                <XIcon />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} style={{padding:"clamp(16px,3vw,24px)",display:"flex",flexDirection:"column",gap:"clamp(12px,2.5vw,18px)"}}>
              {[
                {label:"المركبة",required:true,el:<select value={formData.vehicleId} onChange={e=>setFormData({...formData,vehicleId:e.target.value})} className="e-input" required><option value="">اختر المركبة</option><option value="1">ABC 1234</option><option value="2">XYZ 5678</option><option value="3">DEF 9012</option></select>},
                {label:"نوع المصروف",el:<select value={formData.category} onChange={e=>setFormData({...formData,category:e.target.value})} className="e-input"><option value="fuel">وقود</option><option value="oil">زيت</option><option value="maintenance">صيانة</option><option value="other">أخرى</option></select>},
                {label:"المبلغ (ريال)",required:true,el:<input type="number" min="0" step="0.01" value={formData.amount} onChange={e=>setFormData({...formData,amount:e.target.value})} required className="e-input" placeholder="0.00"/>},
                {label:"التاريخ",required:true,el:<input type="date" value={formData.date} onChange={e=>setFormData({...formData,date:e.target.value})} required className="e-input"/>},
                {label:"الوصف",el:<textarea value={formData.description} onChange={e=>setFormData({...formData,description:e.target.value})} rows={3} className="e-input" style={{resize:"vertical",minHeight:70}} placeholder="وصف المصروف (اختياري)"/>},
              ].map(({label,required,el},i)=>(
                <div key={i}>
                  <label style={{fontSize:"clamp(12px,2.2vw,13px)",fontWeight:600,color:"#374151",display:"block",marginBottom:7}}>
                    {label} {required&&<span style={{color:"#ef4444"}}>*</span>}
                  </label>
                  {el}
                </div>
              ))}

              <div className="e-modal-btns" style={{display:"flex",gap:"clamp(8px,2vw,12px)",paddingTop:4}}>
                <button type="button" className="e-modal-cancel" onClick={()=>setShowModal(false)}>إلغاء</button>
                <button type="submit" className="e-modal-save">
                  {saved ? <><span style={{fontSize:16}}>✓</span> تم الحفظ!</> : <>حفظ المصروف</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}