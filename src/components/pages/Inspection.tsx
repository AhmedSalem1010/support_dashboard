'use client';

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useVehiclesList } from "@/hooks/useVehiclesList";
import { Portal } from "@/components/ui/Portal";

// --- Types ---
interface InspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VehicleInfo {
  id: string;
  plateNumber: string;
  manufacturer: string;
  model: string;
  year: number;
  driver: { name: string; phone: string; team: string };
}

type EquipmentKey = "bakium" | "galandar" | "blicher" | "leMay" | "leShoft" | "ladderBig" | "ladderSmall";

interface MediaUploaderProps {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  inputId: string;
  accept: string;
  multiple?: boolean;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  files: File[];
  onRemove: (index: number) => void;
  isImage?: boolean;
  color?: string;
}

// --- Icons ---
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const CameraIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
);
const VideoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
);
const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
);
const SaveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
);
const CarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="36" height="36"><path d="M1 3h15l3 5h4v8h-2M1 16V8l2-5"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/><path d="M8 16h8"/></svg>
);
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="36" height="36"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

// --- Media Uploader Component ---
function MediaUploader({ icon, label, sub, inputId, accept, multiple = false, onUpload, files, onRemove, isImage = false, color = "#09b9b5" }: MediaUploaderProps) {
  const [drag, setDrag] = useState(false);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{ fontSize: 22, display: "flex", alignItems: "center" }}>{icon}</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{label}</div>
          {sub && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
      <label htmlFor={inputId}>
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          style={{ border: `2px dashed ${drag ? color : "#d1d5db"}`, borderRadius: 14, padding: "32px 20px", textAlign: "center", cursor: "pointer", background: drag ? `${color}08` : "#fafafa", transition: "all 0.3s ease", transform: drag ? "scale(1.02)" : "scale(1)" }}
        >
          <div style={{ color: drag ? color : "#9ca3af", marginBottom: 12, display: "flex", justifyContent: "center" }}><UploadIcon /></div>
          <div style={{ fontSize: 15, color: drag ? color : "#6b7280", fontWeight: 600, marginBottom: 4 }}>{drag ? "اسحب الملفات هنا" : "اضغط أو اسحب الملفات"}</div>
          <div style={{ fontSize: 13, color: "#9ca3af" }}>{accept.includes("image") ? "PNG, JPG, WEBP (حد أقصى 10 ميجابايت)" : "MP4, MOV, AVI (حد أقصى 500 ميجابايت)"}</div>
        </div>
        <input id={inputId} type="file" accept={accept} multiple={multiple} onChange={onUpload} style={{ display: "none" }} />
      </label>
      {files.length > 0 && (
        <div style={{ marginTop: 18 }}>
          {isImage ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 12 }}>
              {files.map((f: File, i: number) => (
                <div key={i} style={{ position: "relative", borderRadius: 12, overflow: "hidden", aspectRatio: "1", background: "#f3f4f6", border: "2px solid #e5e7eb", transition: "all 0.2s" }}>
                  <img src={URL.createObjectURL(f)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <button type="button" onClick={() => onRemove(i)} style={{ position: "absolute", top: 6, right: 6, background: "rgba(239,68,68,0.95)", border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}><XIcon /></button>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.5)", color: "white", padding: "4px 8px", fontSize: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</div>
                </div>
              ))}
            </div>
          ) : (
            files.map((f: File, i: number) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: `${color}12`, border: `1.5px solid ${color}30`, padding: "14px 16px", borderRadius: 12, marginTop: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <div style={{ color, fontSize: 20, display: "flex", alignItems: "center" }}><VideoIcon /></div>
                  <div style={{ fontSize: 14, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>{f.name}</div>
                </div>
                <button type="button" onClick={() => onRemove(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", flexShrink: 0, fontSize: 20, padding: "4px 8px" }}><XIcon /></button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// --- Main Component ---
export default function InspectionModal({ isOpen, onClose }: InspectionModalProps) {
  const [inspectionType, setInspectionType] = useState("vehicle");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
  const [supervisor, setSupervisor] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [equipment, setEquipment] = useState<Record<EquipmentKey, boolean>>({
    bakium: false, galandar: false, blicher: false,
    leMay: false, leShoft: false, ladderBig: false, ladderSmall: false,
  });
  const [vehicleImages, setVehicleImages] = useState<File[]>([]);
  const [vehicleVideo, setVehicleVideo] = useState<File | null>(null);
  const [equipmentWorkerVideo, setEquipmentWorkerVideo] = useState<File | null>(null);
  const [accommodationImages, setAccommodationImages] = useState<File[]>([]);
  const [accommodationVideo, setAccommodationVideo] = useState<File | null>(null);

  const { vehicles, vehicleOptions } = useVehiclesList();

  const equipmentLabels: Record<EquipmentKey, string> = {
    bakium: "باكيوم", galandar: "قلندر", blicher: "بليشر",
    leMay: "لي ماء", leShoft: "لي شفط", ladderBig: "سلم كبير", ladderSmall: "سلم صغير",
  };
  const equipmentEmojis: Record<EquipmentKey, string> = {
    bakium: "🧹", galandar: "🔧", blicher: "⚙️",
    leMay: "💧", leShoft: "🌀", ladderBig: "🪜", ladderSmall: "🪜",
  };

  const handleVehicleSelect = (id: string) => {
    setSelectedVehicle(id);
    if (!id) { setVehicleInfo(null); return; }
    const v = vehicles.find((x) => x.id === id);
    setVehicleInfo(v ? { id: v.id, plateNumber: v.plateName || v.plateNumber, manufacturer: v.manufacturer, model: v.model, year: v.year, driver: { name: "—", phone: "—", team: "—" } } : null);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); onClose(); }, 2000);
  };

  const checkedCount = Object.values(equipment).filter(Boolean).length;
  const totalCount = Object.keys(equipment).length;
  const progressPct = (checkedCount / totalCount) * 100;

  if (!isOpen) return null;

  return (
    <Portal>
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
      <div
        style={{ position: "relative", background: "white", borderRadius: 20, width: "100%", maxWidth: 900, maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 25px 50px rgba(0,0,0,0.25)", animation: "slideUp 0.3s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');
          @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
          .progress { transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        `}</style>

        {/* Modal Header */}
        <div style={{ background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 50%, #06b6d4 100%)", padding: "24px 28px", position: "relative", flexShrink: 0 }}>
          <button onClick={onClose} style={{ position: "absolute", top: 16, left: 16, background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white", backdropFilter: "blur(10px)" }}>
            <XIcon />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 48, height: 48, background: "rgba(255,255,255,0.25)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)", fontSize: 24 }}>🔍</div>
            <div>
              <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: 0, fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>نموذج الفحص الشامل</h2>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, margin: "4px 0 0", fontWeight: 500 }}>
                {new Date().toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", fontFamily: "'IBM Plex Sans Arabic', 'Segoe UI', sans-serif", direction: "rtl" }}>

          {/* Type Selector */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#6b7280", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.8px" }}>اختر نوع الفحص</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { key: "vehicle", icon: <CarIcon />, label: "فحص المركبة", desc: "فحص شامل للمركبة والمعدات", color: "#14b8a6", bg: "#f0fdfa" },
                { key: "accommodation", icon: <HomeIcon />, label: "فحص السكن", desc: "فحص شامل للسكن والمرافق", color: "#8b5cf6", bg: "#f5f3ff" },
              ].map(item => {
                const active = inspectionType === item.key;
                return (
                  <button key={item.key} type="button" onClick={() => setInspectionType(item.key)}
                    style={{ padding: "16px 18px", background: active ? item.bg : "white", border: `2px solid ${active ? item.color : "#e5e7eb"}`, borderRadius: 14, cursor: "pointer", textAlign: "right", boxShadow: active ? `0 4px 16px ${item.color}25` : "0 1px 3px rgba(0,0,0,0.05)", transition: "all 0.2s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ fontSize: 32, color: item.color, display: "flex" }}>{item.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 2 }}>{item.label}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>{item.desc}</div>
                      </div>
                      {active && <div style={{ width: 22, height: 22, background: item.color, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }}><CheckIcon /></div>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {inspectionType === "vehicle" ? (
              <>
                {/* Vehicle Info */}
                <div style={{ background: "#f9fafb", borderRadius: 16, padding: 22, border: "1px solid #e5e7eb" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 8, height: 28, background: "linear-gradient(180deg, #14b8a6, #06b6d4)", borderRadius: 99 }} />
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: 0 }}>معلومات المركبة</h3>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#1f2937", display: "block", marginBottom: 8 }}>اختر المركبة <span style={{ color: "#ef4444" }}>*</span></label>
                    <select value={selectedVehicle} onChange={e => handleVehicleSelect(e.target.value)} required
                      style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontFamily: "inherit", fontSize: 14, color: "#1f2937", background: "white", cursor: "pointer", outline: "none" }}>
                      <option value="">— اختر المركبة —</option>
                      {vehicleOptions.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                    </select>
                  </div>
                  {vehicleInfo && (
                    <div style={{ background: "linear-gradient(135deg, #f0fdfa 0%, #ecfdf5 100%)", borderRadius: 12, padding: 18, border: "1.5px solid #99f6e4" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                        <div style={{ background: "white", padding: 12, borderRadius: 10, border: "1px solid #ccfbf1" }}>
                          <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, marginBottom: 4 }}>رقم اللوحة</div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: "#0f766e" }}>{vehicleInfo.plateNumber}</div>
                        </div>
                        <div style={{ background: "white", padding: 12, borderRadius: 10, border: "1px solid #ccfbf1" }}>
                          <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, marginBottom: 4 }}>سنة الصنع</div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: "#0f766e" }}>{vehicleInfo.year}</div>
                        </div>
                        <div style={{ background: "white", padding: 12, borderRadius: 10, border: "1px solid #ccfbf1" }}>
                          <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, marginBottom: 4 }}>الصانع</div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: "#0f766e" }}>{vehicleInfo.manufacturer}</div>
                        </div>
                        <div style={{ background: "white", padding: 12, borderRadius: 10, border: "1px solid #ccfbf1" }}>
                          <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, marginBottom: 4 }}>الموديل</div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: "#0f766e" }}>{vehicleInfo.model}</div>
                        </div>
                      </div>
                      <div style={{ background: "white", padding: 14, borderRadius: 10, border: "1px solid #ccfbf1" }}>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: "#0f766e", margin: "0 0 10px", display: "flex", alignItems: "center", gap: 8 }}><UserIcon /> معلومات السائق</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                          <div><div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, marginBottom: 3 }}>الاسم</div><div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{vehicleInfo.driver.name}</div></div>
                          <div><div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, marginBottom: 3 }}>الهاتف</div><div style={{ fontSize: 14, fontWeight: 700, color: "#111827", direction: "ltr" }}>{vehicleInfo.driver.phone}</div></div>
                          <div><div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, marginBottom: 3 }}>الفريق</div><div style={{ fontSize: 13, fontWeight: 600, color: "#0f766e", background: "#ecfdf5", padding: "6px 10px", borderRadius: 6 }}>{vehicleInfo.driver.team}</div></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Equipment Checklist */}
                <div style={{ background: "#f9fafb", borderRadius: 16, padding: 22, border: "1px solid #e5e7eb" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 8, height: 28, background: "linear-gradient(180deg, #f59e0b, #f97316)", borderRadius: 99 }} />
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: 0 }}>قائمة المعدات</h3>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fef3c7", padding: "6px 12px", borderRadius: 8, border: "1px solid #fcd34d" }}>
                      <div style={{ width: 70, height: 5, background: "#fed7aa", borderRadius: 99, overflow: "hidden" }}>
                        <div className="progress" style={{ height: "100%", width: `${progressPct}%`, background: progressPct === 100 ? "linear-gradient(90deg, #10b981, #059669)" : "linear-gradient(90deg, #f59e0b, #f97316)", borderRadius: 99 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: "#92400e" }}>{checkedCount}/{totalCount}</span>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                    {(Object.entries(equipment) as [EquipmentKey, boolean][]).map(([key, val]) => (
                      <button key={key} type="button" onClick={() => setEquipment(p => ({ ...p, [key]: !p[key] }))}
                        style={{ padding: "14px 12px", background: val ? "linear-gradient(135deg, #f0fdfa, #ecfdf5)" : "white", border: `2px solid ${val ? "#14b8a6" : "#e5e7eb"}`, borderRadius: 10, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transition: "all 0.2s", boxShadow: val ? "0 4px 12px rgba(20, 184, 166, 0.2)" : "none" }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: val ? "#14b8a6" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", color: val ? "white" : "#9ca3af", fontSize: 18, transition: "all 0.2s" }}>
                          {val ? <CheckIcon /> : equipmentEmojis[key]}
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: val ? "#0f766e" : "#6b7280", textAlign: "center" }}>{equipmentLabels[key]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Media */}
                <div style={{ background: "#f9fafb", borderRadius: 16, padding: 22, border: "1px solid #e5e7eb" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 8, height: 28, background: "linear-gradient(180deg, #8b5cf6, #a78bfa)", borderRadius: 99 }} />
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: 0 }}>الوسائط والملفات</h3>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <div style={{ paddingBottom: 20, borderBottom: "1px solid #f3f4f6" }}>
                      <MediaUploader icon={<CameraIcon />} label="صور المركبة" sub="يمكن إضافة عدة صور" inputId="v-img" accept="image/*" multiple
                        onUpload={(e) => setVehicleImages((p) => [...p, ...Array.from(e.target.files || [])])}
                        files={vehicleImages} onRemove={(i) => setVehicleImages((p) => p.filter((_, j) => j !== i))} isImage color="#14b8a6" />
                    </div>
                    <div style={{ paddingBottom: 20, borderBottom: "1px solid #f3f4f6" }}>
                      <MediaUploader icon={<VideoIcon />} label="فيديو المركبة" sub="يمكن إضافة فيديو واحد" inputId="v-vid" accept="video/*"
                        onUpload={(e) => setVehicleVideo(e.target.files?.[0] || null)}
                        files={vehicleVideo ? [vehicleVideo] : []} onRemove={() => setVehicleVideo(null)} color="#8b5cf6" />
                    </div>
                    <MediaUploader icon={<VideoIcon />} label="فيديو المعدات والعمال" sub="يمكن إضافة فيديو واحد" inputId="eq-vid" accept="video/*"
                      onUpload={(e) => setEquipmentWorkerVideo(e.target.files?.[0] || null)}
                      files={equipmentWorkerVideo ? [equipmentWorkerVideo] : []} onRemove={() => setEquipmentWorkerVideo(null)} color="#f59e0b" />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Accommodation Media */}
                <div style={{ background: "#f9fafb", borderRadius: 16, padding: 22, border: "1px solid #e5e7eb" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 8, height: 28, background: "linear-gradient(180deg, #8b5cf6, #a78bfa)", borderRadius: 99 }} />
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: 0 }}>الوسائط والملفات</h3>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <div style={{ paddingBottom: 20, borderBottom: "1px solid #f3f4f6" }}>
                      <MediaUploader icon={<CameraIcon />} label="صور السكن" sub="يمكن إضافة عدة صور" inputId="a-img" accept="image/*" multiple
                        onUpload={(e) => setAccommodationImages((p) => [...p, ...Array.from(e.target.files || [])])}
                        files={accommodationImages} onRemove={(i) => setAccommodationImages((p) => p.filter((_, j) => j !== i))} isImage color="#8b5cf6" />
                    </div>
                    <MediaUploader icon={<VideoIcon />} label="فيديو السكن" sub="يمكن إضافة فيديو واحد" inputId="a-vid" accept="video/*"
                      onUpload={(e) => setAccommodationVideo(e.target.files?.[0] || null)}
                      files={accommodationVideo ? [accommodationVideo] : []} onRemove={() => setAccommodationVideo(null)} color="#8b5cf6" />
                  </div>
                </div>
              </>
            )}

            {/* Additional Info */}
            <div style={{ background: "#f9fafb", borderRadius: 16, padding: 22, border: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 8, height: 28, background: "linear-gradient(180deg, #3b82f6, #60a5fa)", borderRadius: 99 }} />
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: 0 }}>معلومات إضافية</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#1f2937", display: "block", marginBottom: 8 }}>المشرف المسؤول <span style={{ color: "#ef4444" }}>*</span></label>
                  <input type="text" value={supervisor} onChange={e => setSupervisor(e.target.value)} placeholder="مثال: محمد أحمد علي" required
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontFamily: "inherit", fontSize: 14, color: "#1f2937", background: "white", outline: "none" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#1f2937", display: "block", marginBottom: 8 }}>الملاحظات والتعليقات</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="أدخل أي ملاحظات أو تعليقات إضافية..." rows={3}
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontFamily: "inherit", fontSize: 14, color: "#1f2937", background: "white", outline: "none", resize: "vertical" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }} />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 8 }}>
              <button type="button" onClick={onClose}
                style={{ padding: "10px 24px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, fontWeight: 700, color: "#6b7280", fontFamily: "inherit", background: "white", cursor: "pointer" }}>
                إلغاء
              </button>
              <button type="submit"
                style={{ padding: "10px 28px", borderRadius: 10, background: "linear-gradient(135deg, #14b8a6, #0d9488)", border: "none", color: "white", fontSize: 14, fontWeight: 700, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", boxShadow: "0 4px 16px rgba(20, 184, 166, 0.4)" }}>
                <SaveIcon />
                حفظ الفحص
              </button>
            </div>
          </form>
        </div>

        {/* Toast */}
        {submitted && (
          <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #10b981, #059669)", color: "white", padding: "12px 24px", borderRadius: 10, boxShadow: "0 10px 32px rgba(16, 185, 129, 0.4)", display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 700, zIndex: 999, whiteSpace: "nowrap" }}>
            <div style={{ width: 24, height: 24, background: "rgba(255,255,255,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><CheckIcon /></div>
            تم حفظ الفحص بنجاح!
          </div>
        )}
      </div>
    </div>
    </Portal>
  );
}
