/**
 * خدمة API المستخدمين والعمال
 */

import api from './config';
import type { UsersWithWorkersResponse } from '@/types/users';

const USERS_ENDPOINT = '/users';

/**
 * جلب جميع المستخدمين مع بيانات العمال (المشرفين)
 * يستدعي: GET /users/api/all-users-workers
 */
export async function fetchAllUsersWithWorkers(): Promise<UsersWithWorkersResponse> {
  const { data } = await api.get<UsersWithWorkersResponse>(`${USERS_ENDPOINT}/api/all-users-workers`);
  return data;
}
