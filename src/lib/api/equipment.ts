/**
 * خدمة API المعدات والسكن (جرد العهدة)
 */

import api from './config';
import type { EquipmentInventoryApiResponse, EquipmentInventoryFetchParams } from '@/types/equipment';

const EQUIPMENT_ENDPOINT = '/vehicle-equipment-inventory';

function buildParams(params?: EquipmentInventoryFetchParams): Record<string, string> {
  const query: Record<string, string> = {};
  if (!params) return query;
  if (params.page != null) query.page = String(params.page);
  if (params.limit != null) query.limit = String(params.limit);
  if (params.equipmentInventoryStatus) query.equipmentInventoryStatus = params.equipmentInventoryStatus;
  if (params.equipmentInventoryType) query.equipmentInventoryType = params.equipmentInventoryType;
  if (params.vehicleAuthorizationId) query.vehicleAuthorizationId = params.vehicleAuthorizationId;
  if (params.supervisorId) query.supervisorId = params.supervisorId;
  if (params.vehiclePlateName) query.vehiclePlateName = params.vehiclePlateName;
  return query;
}

export async function fetchEquipmentInventories(
  params?: EquipmentInventoryFetchParams
): Promise<EquipmentInventoryApiResponse> {
  const { data } = await api.get<EquipmentInventoryApiResponse>(EQUIPMENT_ENDPOINT, {
    params: buildParams(params),
  });
  return data;
}

export async function fetchEquipmentInventoryById(id: string): Promise<any> {
  const { data } = await api.get(`${EQUIPMENT_ENDPOINT}/${id}`);
  return data;
}
