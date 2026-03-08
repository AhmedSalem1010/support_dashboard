/**
 * Hook لجلب بيانات المستخدمين مع العمال (المشرفين)
 */

import { useState, useEffect } from 'react';
import { fetchAllUsersWithWorkers } from '@/lib/api/users';
import type { UserWithWorker } from '@/types/users';

interface UseUsersWithWorkersResult {
  users: UserWithWorker[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUsersWithWorkers(): UseUsersWithWorkersResult {
  const [users, setUsers] = useState<UserWithWorker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 جاري جلب بيانات المستخدمين والعمال...');
      const response = await fetchAllUsersWithWorkers();
      console.log('📦 استجابة API:', response);
      
      if (response.success && response.data) {
        console.log('✅ تم جلب البيانات بنجاح:', response.data.length, 'مستخدم');
        setUsers(response.data);
      } else {
        console.error('❌ فشل جلب البيانات:', response.message);
        setError(response.message || 'فشل في جلب البيانات');
      }
    } catch (err) {
      console.error('❌ خطأ في جلب بيانات المستخدمين:', err);
      
      // تحديد نوع الخطأ وعرض رسالة واضحة
      if (err instanceof Error) {
        if (err.message.includes('Network Error') || err.message.includes('ERR_NETWORK')) {
          setError('⚠️ لا يمكن الاتصال بالخادم. تأكد من تشغيل الباك إند على http://localhost:5050');
          console.warn('💡 تلميح: قم بتشغيل الباك إند باستخدام: npm run start:dev');
        } else if (err.message.includes('timeout')) {
          setError('⏱️ انتهت مهلة الاتصال. الخادم بطيء أو غير متاح');
        } else {
          setError(err.message);
        }
      } else {
        setError('حدث خطأ غير متوقع');
      }
      
      // عدم إيقاف التطبيق - السماح بالاستمرار بدون بيانات المستخدمين
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchData,
  };
}
