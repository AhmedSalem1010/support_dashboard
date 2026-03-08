import React from 'react';
import type { LastAuthorizationDataItem } from '@/types/authorization';

interface VehicleData {
  plateName?: string;
  plateNumber?: string;
  manufacturer?: string;
  model?: string;
  year?: number;
  vehicleType?: string;
}

interface VehicleDriverInfoCardProps {
  vehicleData?: VehicleData | null;
  lastAuthData?: LastAuthorizationDataItem | null;
  isLoading?: boolean;
}

const CarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M5 17h14v2H5v-2z"/>
    <path d="M16 6l3 4v7H5v-7l3-4h8z"/>
    <circle cx="8.5" cy="15.5" r="1.5"/>
    <circle cx="15.5" cy="15.5" r="1.5"/>
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

export default function VehicleDriverInfoCard({
  vehicleData,
  lastAuthData,
  isLoading = false,
}: VehicleDriverInfoCardProps) {
  const driverDisplayName = lastAuthData?.driverName || lastAuthData?.driver?.name || lastAuthData?.userDriver?.name;
  const driverJisrId = lastAuthData?.driverJisrId || (lastAuthData?.driver && 'jisrId' in lastAuthData.driver ? lastAuthData.driver.jisrId : null);
  const driverType = lastAuthData?.driverType;
  const driverTypeLabel = driverType === 'userDriver' ? 'سائق مستخدم' : driverType === 'driver' ? 'سائق' : null;

  return (
    <div style={{ marginTop: 16, width: "100%" }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 12 }}>بيانات المركبة والسائق</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: "100%", minWidth: 0 }}>
        <div style={{ background: "#f3f4f6", borderRadius: 12, padding: 14, border: "1px solid #e5e7eb", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <CarIcon />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>المركبة</span>
          </div>
          {vehicleData ? (
            <>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#1f2937", margin: "0 0 4px" }}>
                {vehicleData.plateName || vehicleData.plateNumber}
              </p>
              <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 4px" }}>
                {vehicleData.manufacturer} {vehicleData.model} - {vehicleData.year}
              </p>
              <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
                {vehicleData.vehicleType || "—"}
              </p>
            </>
          ) : (
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>—</p>
          )}
        </div>
        <div style={{ background: "#f3f4f6", borderRadius: 12, padding: 14, border: "1px solid #e5e7eb", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <UserIcon />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>السائق</span>
          </div>
          {isLoading ? (
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>جاري التحميل...</p>
          ) : driverDisplayName ? (
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#1f2937", margin: 0, marginBottom: 4 }}>
                {driverDisplayName}
              </p>
              {driverTypeLabel && (
                <p style={{ fontSize: 12, color: "#6b7280", margin: 0, marginBottom: 4 }}>
                  النوع: {driverTypeLabel}
                </p>
              )}
              {driverJisrId && (
                <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
                  رقم جسر: {driverJisrId}
                </p>
              )}
            </div>
          ) : (
            <p style={{ fontSize: 14, fontWeight: 600, color: "#ef4444", margin: 0 }}>
              ⚠️ لا يوجد سائق مسجل
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
