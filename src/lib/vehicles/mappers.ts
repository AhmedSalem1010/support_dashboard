/**
 * تحويل بيانات المركبات من صيغة API إلى صيغة الواجهة
 */

import type { VehicleApiResponse } from '@/types/vehicle';
import { VEHICLE_STATUS_LABELS, INSURANCE_STATUS_LABELS, INSPECTION_STATUS_LABELS, ISTIMARAH_STATUS_LABELS, statusToArabic } from '@/lib/enums';

export interface VehicleDisplay {
  id: string;
  plateNumber: string;
  plateName: string;
  serialNumber: string;
  vin: string;
  manufacturer: string;
  model: string;
  year: number;
  type: string;
  insuranceStatus: string;
  insuranceExpiry: string | null;
  registrationExpiry: string | null;
  inspectionExpiry: string | null;
  inspectionStatus: string | null;
  status: string;
  color: string;
  fuelType: string;
  odometerReading: number;
  image: string;
  chassisNumber: string;
  vehicleType: string;
  istimarahStatus: string;
}

export function mapVehicleFromApi(vehicle: VehicleApiResponse): VehicleDisplay {
  return {
    id: vehicle.id,
    plateNumber: vehicle.plateNumber,
    plateName: vehicle.plateName,
    serialNumber: vehicle.serialNumber,
    vin: vehicle.chassisNumber,
    chassisNumber: vehicle.chassisNumber,
    manufacturer: vehicle.manufacturer,
    model: vehicle.model,
    year: vehicle.year,
    type: vehicle.vehicleType,
    vehicleType: vehicle.vehicleType,
    insuranceStatus: (() => {
      const v = vehicle.vehicleInsuranceStatus ?? (vehicle as any).insuranceStatus;
      return INSURANCE_STATUS_LABELS[v] ?? statusToArabic(v);
    })(),
    insuranceExpiry: vehicle.insuranceExpiry ?? null,
    registrationExpiry: vehicle.istimarahExpiry ?? null,
    inspectionExpiry: vehicle.inspectionExpiry ?? null,
    inspectionStatus: vehicle.inspectionStatus
      ? (INSPECTION_STATUS_LABELS[vehicle.inspectionStatus] ?? statusToArabic(vehicle.inspectionStatus))
      : null,
    status: (() => {
      const v = vehicle.vehicleStatus ?? (vehicle as any).status;
      return VEHICLE_STATUS_LABELS[v] ?? statusToArabic(v);
    })(),
    color: vehicle.vehicleColor,
    fuelType: '', // غير متوفر في الـ API
    odometerReading: 0, // غير متوفر في الـ API
    image: vehicle.vehicleType?.includes('فان') ? '🚐' : '🚗',
    istimarahStatus: vehicle.istimarahStatus
      ? (ISTIMARAH_STATUS_LABELS[vehicle.istimarahStatus] ?? statusToArabic(vehicle.istimarahStatus))
      : '—',
  };
}
