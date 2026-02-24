'use client';

import { useState, useRef, useEffect, type FormEvent } from "react";
import { useVehiclesList } from "@/hooks/useVehiclesList";
import { useLastAuthorizationData } from "@/hooks/useLastAuthorizationData";
import { useVehicleEquipmentInfo } from "@/hooks/useVehicleEquipmentInfo";
import { createVehicleEquipmentInventory, getVehicleInfoRequestInfo } from "@/lib/api/equipment";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { useNotificationsContext } from "@/components/ui/Notifications";
import type { CreateVehicleEquipmentInventoryItemDto, CreateVehicleEquipmentInventoryDto } from "@/types/equipment";
import { VehicleEquipmentInfoDialog } from "@/components/ui/VehicleEquipmentInfoDialog";
import { Portal } from "@/components/ui/Portal";

// --- Types ---
interface EquipmentInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type EquipmentKey = "blicher" | "bakium" | "ladderBig" | "ladderSmall" | "leMay" | "leBakium" | "leShoft" | "noselShaft" | "noselMay" | "noselKabir";

/** ربط أسماء المعدات من API (vehicle-info) بمفاتيح الجرد - مع وبدون "ال" */
const VEHICLE_INFO_ITEM_NAME_TO_KEY: Record<string, EquipmentKey> = {
  "بليشر": "blicher", "البليشر": "blicher",
  "باكيوم": "bakium", "الباكيوم": "bakium",
  "سلم صغير": "ladderSmall", "السلم الصغير": "ladderSmall",
  "سلم كبير": "ladderBig", "السلم الكبير": "ladderBig",
  "لي ماء": "leMay", "لي الماء": "leMay",
  "لي باكيوم": "leBakium", "لي الباكيوم": "leBakium",
  "لي شفط": "leShoft", "لي الشفط": "leShoft",
  "نوسل شفط": "noselShaft",
  "نوسل ماء": "noselMay",
  "نوسل كبير": "noselKabir",
};

function getEquipmentKeyFromItemName(itemName: string): EquipmentKey | null {
  const trimmed = itemName.trim();
  if (VEHICLE_INFO_ITEM_NAME_TO_KEY[trimmed]) return VEHICLE_INFO_ITEM_NAME_TO_KEY[trimmed];
  const withoutAl = trimmed.replace(/^ال/, "");
  return VEHICLE_INFO_ITEM_NAME_TO_KEY[withoutAl] ?? null;
}

// --- Icons ---
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const VideoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
);
const SaveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const CarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M1 3h15l3 5h4v8h-2M1 16V8l2-5"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/><path d="M8 16h8"/></svg>
);
const RecordIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><circle cx="12" cy="12" r="8"/></svg>
);
const StopIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
);
const BoxIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const MinusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const InventoryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
);

// --- Video Recorder Component ---
function VideoRecorder({ label, color, onRecorded }: { label: string; color: string; onRecorded: (file: File) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: true });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
        const file = new File([blob], `recording-${Date.now()}.webm`, { type: "video/webm" });
        onRecorded(file);
        stream.getTracks().forEach(t => t.stop());
        if (videoRef.current) { videoRef.current.srcObject = null; videoRef.current.src = url; }
      };
      recorder.start();
      setIsRecording(true);
      setDuration(0);
      setRecordedUrl(null);
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    } catch {
      alert("لا يمكن الوصول إلى الكاميرا. تأكد من منح الإذن.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resetRecording = () => {
    setRecordedUrl(null);
    setDuration(0);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (videoRef.current) { videoRef.current.srcObject = null; videoRef.current.src = ""; }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div style={{ background: "#f9fafb", borderRadius: 14, padding: 18, border: "1px solid #e5e7eb" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ color, display: "flex", alignItems: "center" }}><VideoIcon /></div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{label}</div>
        {isRecording && (
          <div style={{ marginRight: "auto", display: "flex", alignItems: "center", gap: 6, background: "#fef2f2", padding: "4px 10px", borderRadius: 8, border: "1px solid #fecaca" }}>
            <div style={{ width: 8, height: 8, background: "#ef4444", borderRadius: "50%", animation: "pulse 1s infinite" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", fontVariantNumeric: "tabular-nums" }}>{formatTime(duration)}</span>
          </div>
        )}
      </div>

      <div style={{ borderRadius: 12, overflow: "hidden", background: "#000", marginBottom: 12, aspectRatio: "16/9", position: "relative" }}>
        <video ref={videoRef} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} playsInline muted={isRecording} controls={!!recordedUrl && !isRecording} />
        {!isRecording && !recordedUrl && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#9ca3af", gap: 8 }}>
            <VideoIcon />
            <span style={{ fontSize: 13, fontWeight: 600 }}>اضغط لبدء التسجيل</span>
          </div>
        )}
      </div>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }`}</style>

      <div style={{ display: "flex", gap: 8 }}>
        {!isRecording && !recordedUrl && (
          <button type="button" onClick={startRecording}
            style={{ flex: 1, padding: "10px", borderRadius: 10, background: `linear-gradient(135deg, ${color}, ${color}dd)`, border: "none", color: "white", fontSize: 13, fontWeight: 700, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", boxShadow: `0 4px 12px ${color}40` }}>
            <RecordIcon /> بدء التسجيل
          </button>
        )}
        {isRecording && (
          <button type="button" onClick={stopRecording}
            style={{ flex: 1, padding: "10px", borderRadius: 10, background: "linear-gradient(135deg, #ef4444, #dc2626)", border: "none", color: "white", fontSize: 13, fontWeight: 700, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", boxShadow: "0 4px 12px rgba(239,68,68,0.4)" }}>
            <StopIcon /> إيقاف التسجيل
          </button>
        )}
        {recordedUrl && (
          <button type="button" onClick={resetRecording}
            style={{ flex: 1, padding: "10px", borderRadius: 10, background: "white", border: "1.5px solid #e5e7eb", color: "#6b7280", fontSize: 13, fontWeight: 700, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}>
            إعادة التسجيل
          </button>
        )}
      </div>
    </div>
  );
}

// --- Main Component ---
export default function EquipmentInventoryModal({ isOpen, onClose }: EquipmentInventoryModalProps) {
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [vehicleAuthorizationId, setVehicleAuthorizationId] = useState<string | null>(null);
  const [supervisor, setSupervisor] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [equipment, setEquipment] = useState<Record<EquipmentKey, number>>({
    blicher: 0, bakium: 0, ladderBig: 0,
    ladderSmall: 0, leMay: 0, leBakium: 0,
    leShoft: 0, noselShaft: 0, noselMay: 0, noselKabir: 0,
  });
  const [vehicleVideoFile, setVehicleVideoFile] = useState<File | null>(null);
  const [equipmentVideoFile, setEquipmentVideoFile] = useState<File | null>(null);
  const [showPayloadDialog, setShowPayloadDialog] = useState(false);
  const [payloadToSend, setPayloadToSend] = useState<CreateVehicleEquipmentInventoryDto | null>(null);

  const { vehicles, vehicleOptions } = useVehiclesList();
  const selectedPlateName = vehicleOptions.find((o) => o.value === selectedVehicle)?.plateName ?? null;
  const lastAuth = useLastAuthorizationData(selectedPlateName);
  const { data: vehicleEquipmentData, isLoading: vehicleEquipmentLoading, error: vehicleEquipmentError } = useVehicleEquipmentInfo(selectedPlateName);
  const selectedVehicleData = selectedVehicle ? vehicles.find((v) => v.id === selectedVehicle) : null;
  const [showVehicleInfoDialog, setShowVehicleInfoDialog] = useState(false);
  const { success: showSuccess, error: showError } = useNotificationsContext();

  /** معرف المشرف من بيانات آخر تفويض (مطلوب للإرسال) */
  const supervisorId =
    lastAuth.data?.supervisorId ??
    (lastAuth.data?.supervisor && typeof lastAuth.data.supervisor === "object" && "id" in lastAuth.data.supervisor
      ? (lastAuth.data.supervisor as { id: string }).id
      : null);

  /** عدد الفريق من نفس اند بوينت بيانات المركبة والسائق (last-authorization-data) */
  const teamWorkerCount = lastAuth.data?.teamWorkerCount ?? lastAuth.data?.workersCount ?? 0;

  const equipmentLabels: Record<EquipmentKey, string> = {
    blicher: "البليشر", bakium: "الباكيوم", ladderBig: "السلم الكبير",
    ladderSmall: "السلم الصغير", leMay: "لي الماء", leBakium: "لي الباكيوم",
    leShoft: "لي الشفط", noselShaft: "نوسل شفط", noselMay: "نوسل ماء", noselKabir: "نوسل كبير",
  };

  const incrementItem = (key: EquipmentKey) => setEquipment(p => ({ ...p, [key]: p[key] + 1 }));
  const decrementItem = (key: EquipmentKey) => setEquipment(p => ({ ...p, [key]: Math.max(0, p[key] - 1) }));

  useEffect(() => {
    if (!selectedPlateName) {
      setEquipment({
        blicher: 0, bakium: 0, ladderBig: 0, ladderSmall: 0, leMay: 0, leBakium: 0,
        leShoft: 0, noselShaft: 0, noselMay: 0, noselKabir: 0,
      });
      return;
    }
    if (!vehicleEquipmentData || vehicleEquipmentData.length === 0) return;
    const defaults: Record<EquipmentKey, number> = {
      blicher: 0, bakium: 0, ladderBig: 0, ladderSmall: 0, leMay: 0, leBakium: 0,
      leShoft: 0, noselShaft: 0, noselMay: 0, noselKabir: 0,
    };
    vehicleEquipmentData.forEach((item) => {
      const key = getEquipmentKeyFromItemName(item.itemName);
      if (key != null && typeof item.itemCount === "number" && item.itemCount >= 0) {
        defaults[key] = item.itemCount;
      }
    });
    setEquipment(defaults);
  }, [vehicleEquipmentData, selectedPlateName]);

  useEffect(() => {
    if (!selectedPlateName) setShowVehicleInfoDialog(false);
    else setShowVehicleInfoDialog(true);
  }, [selectedPlateName]);

  /** vehicleAuthorizationId من نفس اند بوينت بيانات المركبة والسائق (last-authorization-data) */
  useEffect(() => {
    if (lastAuth.data?.id) setVehicleAuthorizationId(lastAuth.data.id);
    else setVehicleAuthorizationId(null);
  }, [lastAuth.data?.id, selectedPlateName]);

  useEffect(() => {
    const name = lastAuth.data?.supervisor && typeof lastAuth.data.supervisor === "object" && "name" in lastAuth.data.supervisor
      ? (lastAuth.data.supervisor as { name?: string }).name
      : "";
    setSupervisor((prev) => (name ? name : prev));
  }, [lastAuth.data?.supervisor, selectedPlateName]);

  const handleVehicleSelect = (id: string) => {
    setSelectedVehicle(id);
    if (!id) setVehicleAuthorizationId(null);
  };

  const buildPayload = (): CreateVehicleEquipmentInventoryDto => {
    const items: CreateVehicleEquipmentInventoryItemDto[] = (Object.entries(equipment) as [EquipmentKey, number][]).map(
      ([key, itemCount]) => ({
        itemName: equipmentLabels[key],
        itemCount,
        itemStatus: "usable",
        itemInventoryStatus: "ok",
      })
    );
    return {
      vehicleAuthorizationId: vehicleAuthorizationId ?? "",
      equipmentInventoryType: "inventory",
      supervisorId: supervisorId ?? "",
      items,
      equipmentInventoryNote: notes || undefined,
      equipmentInventoryDescription: supervisor ? `المشرف: ${supervisor}` : undefined,
      equipmentInventoryStatus: "check",
      teamWorkerCount,
    };
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPayloadToSend(buildPayload());
    setShowPayloadDialog(true);
  };

  const handleConfirmSend = async () => {
    if (!payloadToSend) return;
    setSubmitted(true);
    try {
      const res = await createVehicleEquipmentInventory(payloadToSend);
      setShowPayloadDialog(false);
      setPayloadToSend(null);
      if (res.success && res.data) {
        showSuccess("تم حفظ الجرد بنجاح", res.message);
        setTimeout(() => {
          setSubmitted(false);
          onClose();
        }, 1500);
      } else {
        setSubmitted(false);
        const msg = (res as { message?: string }).message ?? (res.error as Error)?.message ?? "حدث خطأ";
        showError("فشل حفظ الجرد", msg);
      }
    } catch (err) {
      setSubmitted(false);
      setShowPayloadDialog(false);
      setPayloadToSend(null);
      showError("فشل حفظ الجرد", err instanceof Error ? err.message : "حدث خطأ أثناء الإرسال");
    }
  };

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
            <div style={{ width: 48, height: 48, background: "rgba(255,255,255,0.25)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)", fontSize: 24 }}>📋</div>
            <div>
              <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: 0, fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>جرد المعدات</h2>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, margin: "4px 0 0", fontWeight: 500 }}>
                جرد عهدة المركبة مع تصوير فيديو - {new Date().toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", fontFamily: "'IBM Plex Sans Arabic', 'Segoe UI', sans-serif", direction: "rtl" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* اختيار المركبة */}
            <div style={{ background: "linear-gradient(180deg, #f0fdfa 0%, #f9fafb 100%)", borderRadius: 16, padding: 22, border: "1.5px solid #99f6e4", boxShadow: "0 2px 12px rgba(20, 184, 166, 0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 8, height: 28, background: "linear-gradient(180deg, #14b8a6, #06b6d4)", borderRadius: 99 }} />
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: 0 }}>المركبة</h3>
                  <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>ابحث برقم اللوحة أو الموديل ثم اختر المركبة</p>
                </div>
              </div>
              <SearchableSelect
                label="اختر المركبة"
                options={vehicleOptions}
                value={selectedVehicle}
                onChange={handleVehicleSelect}
                placeholder="ابحث أو اختر المركبة..."
                required
              />

              {selectedVehicle && (
                <div style={{ marginTop: 16 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 12 }}>بيانات المركبة والسائق</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div style={{ background: "#f3f4f6", borderRadius: 12, padding: 14, border: "1px solid #e5e7eb" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <CarIcon />
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>المركبة</span>
                      </div>
                      {selectedVehicleData ? (
                        <>
                          <p style={{ fontSize: 14, fontWeight: 600, color: "#1f2937", margin: "0 0 4px" }}>{selectedVehicleData.plateName || selectedVehicleData.plateNumber}</p>
                          <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 4px" }}>{selectedVehicleData.manufacturer} {selectedVehicleData.model} - {selectedVehicleData.year}</p>
                          <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{selectedVehicleData.vehicleType || "—"}</p>
                        </>
                      ) : (
                        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>—</p>
                      )}
                    </div>
                    <div style={{ background: "#f3f4f6", borderRadius: 12, padding: 14, border: "1px solid #e5e7eb" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <UserIcon />
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>السائق</span>
                      </div>
                      {lastAuth.isLoading ? (
                        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>جاري التحميل...</p>
                      ) : (
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#1f2937", margin: 0 }}>{lastAuth.data?.driver?.name ?? "—"}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Equipment Inventory - Card Style */}
            <div style={{ background: "white", borderRadius: 16, padding: 22, border: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <InventoryIcon />
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: 0 }}>جرد العهدة</h3>
                </div>
                {selectedPlateName && vehicleEquipmentLoading && (
                  <span style={{ fontSize: 12, color: "#0d9488", fontWeight: 600 }}>جاري تحميل المعدات...</span>
                )}
                {selectedPlateName && vehicleEquipmentError && (
                  <span style={{ fontSize: 12, color: "#dc2626", fontWeight: 600 }}>{vehicleEquipmentError}</span>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {(Object.entries(equipment) as [EquipmentKey, number][]).map(([key, count]) => {
                  const isActive = count > 0;
                  return (
                    <div key={key}
                      style={{
                        background: isActive ? "#f0fdfa" : "#f8fafc",
                        border: `1.5px solid ${isActive ? "#14b8a6" : "#e2e8f0"}`,
                        borderRadius: 12,
                        padding: "16px 12px",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        transition: "all 0.2s",
                      }}>
                      <div style={{ flexShrink: 0 }}><BoxIcon /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{equipmentLabels[key]}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <button type="button" onClick={() => decrementItem(key)}
                            style={{ width: 28, height: 28, borderRadius: 6, border: "1.5px solid #e2e8f0", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#94a3b8", transition: "all 0.15s" }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "#14b8a6"; e.currentTarget.style.color = "#14b8a6"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#94a3b8"; }}>
                            <MinusIcon />
                          </button>
                          <span style={{ fontSize: 18, fontWeight: 800, color: isActive ? "#0f766e" : "#64748b", minWidth: 28, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>{count}</span>
                          <button type="button" onClick={() => incrementItem(key)}
                            style={{ width: 28, height: 28, borderRadius: 6, border: "1.5px solid #e2e8f0", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#94a3b8", transition: "all 0.15s" }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "#14b8a6"; e.currentTarget.style.color = "#14b8a6"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#94a3b8"; }}>
                            <PlusIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Video Recording Section */}
            <div style={{ background: "white", borderRadius: 16, padding: 22, border: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 8, height: 28, background: "linear-gradient(180deg, #8b5cf6, #a78bfa)", borderRadius: 99 }} />
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: 0 }}>تصوير فيديو</h3>
                <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>سجّل فيديو للمركبة والمعدات</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <VideoRecorder label="فيديو المركبة" color="#14b8a6" onRecorded={(f) => setVehicleVideoFile(f)} />
                <VideoRecorder label="فيديو المعدات" color="#f59e0b" onRecorded={(f) => setEquipmentVideoFile(f)} />
              </div>
            </div>

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
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#1f2937", display: "block", marginBottom: 8 }}>الملاحظات</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="أدخل أي ملاحظات إضافية..." rows={3}
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
                حفظ الجرد
              </button>
            </div>
          </form>
        </div>

        {/* Toast */}
        {submitted && (
          <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #10b981, #059669)", color: "white", padding: "12px 24px", borderRadius: 10, boxShadow: "0 10px 32px rgba(16, 185, 129, 0.4)", display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 700, zIndex: 999, whiteSpace: "nowrap" }}>
            <div style={{ width: 24, height: 24, background: "rgba(255,255,255,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><CheckIcon /></div>
            تم حفظ الجرد بنجاح!
          </div>
        )}
      </div>
    </div>

    {/* ديلوج عرض البيانات المرسلة */}
    {showPayloadDialog && payloadToSend && (
      <div style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.5)" }} onClick={() => setShowPayloadDialog(false)}>
        <div
          style={{ background: "white", borderRadius: 16, width: "100%", maxWidth: 560, maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 25px 50px rgba(0,0,0,0.25)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#111827" }}>البيانات المرسلة للاند بوينت</h3>
            <button type="button" onClick={() => { setShowPayloadDialog(false); setPayloadToSend(null); }} style={{ padding: 6, border: "none", background: "#f3f4f6", borderRadius: 8, cursor: "pointer" }}>
              <XIcon />
            </button>
          </div>
          <pre style={{ flex: 1, overflow: "auto", margin: 0, padding: 20, fontSize: 12, fontFamily: "ui-monospace, monospace", background: "#f8fafc", color: "#1e293b", direction: "ltr", textAlign: "left" }}>
            {JSON.stringify(payloadToSend, null, 2)}
          </pre>
          <div style={{ padding: 16, borderTop: "1px solid #e5e7eb", display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button type="button" onClick={() => { setShowPayloadDialog(false); setPayloadToSend(null); }}
              style={{ padding: "10px 20px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, fontWeight: 700, color: "#6b7280", background: "white", cursor: "pointer" }}>
              إلغاء
            </button>
            <button type="button" onClick={handleConfirmSend} disabled={submitted}
              style={{ padding: "10px 24px", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 700, color: "white", background: submitted ? "#9ca3af" : "#0d9488", cursor: submitted ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <SaveIcon />
              {submitted ? "جاري الإرسال..." : "إرسال"}
            </button>
          </div>
        </div>
      </div>
    )}

    <VehicleEquipmentInfoDialog
      isOpen={showVehicleInfoDialog}
      onClose={() => setShowVehicleInfoDialog(false)}
      vehiclePlateName={selectedPlateName}
      requestInfo={selectedPlateName ? getVehicleInfoRequestInfo(selectedPlateName) : null}
      data={vehicleEquipmentData}
      isLoading={vehicleEquipmentLoading}
      error={vehicleEquipmentError}
    />
    </Portal>
  );
}
