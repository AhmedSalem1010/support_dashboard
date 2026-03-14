/**
 * أنواع بيانات المستخدمين والعمال
 */

/** بيانات المستخدم مع العامل (المشرف) */
export interface UserWithWorker {
  user_name: string;
  user_phone: string | null;
  user_jisr_id: string | null;
  userEmployeeData_license_status?: string | null;
  user_license_status?: string | null;
  /** رقم الإقامة للمستخدم */
  userEmployeeData_iqamah_number?: string | null;
  workers_id: string | null;
  workers_name: string | null;
  workers_jisr_id: string | null;
  workers_role: 'SUPERVISOR' | null;
  workersEmployeeData_license_status?: string | null;
  workersEmployeeData_personal_received?: string | null;
  /** رقم الإقامة للعامل */
  workersEmployeeData_iqamah_number?: string | null;
  workers_license_status?: string | null;
}

/** استجابة جلب المستخدمين مع العمال */
export interface UsersWithWorkersResponse {
  data: UserWithWorker[];
  error: string | null;
  success: boolean;
  message: string;
  status: number;
}
