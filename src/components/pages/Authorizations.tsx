'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, FileText, User, Car, Calendar, Package, Search, Filter, Download, X, Eye, Edit, XCircle, CheckCircle, AlertCircle, Clock, TrendingUp, Users, Shield, RefreshCw, Loader2, KeyRound, Database } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { PageLoading } from '@/components/ui/PageLoading';
import { Input } from '@/components/ui/Input';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { useAuthorizations } from '@/hooks/useAuthorizations';
import { cancelAuthorization, createAuthorization, sendVehicleAuthorizationOTP, verifyVehicleAuthorizationOTP, fetchTammVehicleAuthorization } from '@/lib/api/authorizations';
import type { CreateAuthorizationDto } from '@/types/authorization';
import { createVehicleEquipmentInventory } from '@/lib/api/equipment';
import type { CreateVehicleEquipmentInventoryDto, CreateVehicleEquipmentInventoryItemDto } from '@/types/equipment';
import { useVehiclesList } from '@/hooks/useVehiclesList';
import { fetchVehicleTools, updateVehicleTools } from '@/lib/api/vehicles';
import type { UpdateVehicleToolsDto } from '@/types/vehicle';
import { useLastAuthorizationData } from '@/hooks/useLastAuthorizationData';
import { useVehicleEquipmentInfo } from '@/hooks/useVehicleEquipmentInfo';
import { useUsersWithWorkers } from '@/hooks/useUsersWithWorkers';
import { getVehicleInfoRequestInfo } from '@/lib/api/equipment';
import { VehicleDriverSummary } from '@/components/ui/VehicleDriverSummary';
import { EquipmentInventoryGrid, type EquipmentKey, EQUIPMENT_LABELS } from '@/components/ui/EquipmentInventoryGrid';
import { AUTHORIZATION_STATUS_LABELS, AUTHORIZATION_TYPE_LABELS, statusToArabic } from '@/lib/enums';
import type { AuthorizationDisplay } from '@/lib/authorizations/mappers';
import { useNotificationsContext } from '@/components/ui/Notifications';
import { Portal } from '@/components/ui/Portal';
import { useAlertDialog } from '@/components/ui/AlertDialog';
import { OTPDialog } from '@/components/ui/OTPDialog';
import { RenewConfirmDialog } from '@/components/ui/RenewConfirmDialog';
import { CancelAuthorizationDialog } from '@/components/ui/CancelAuthorizationDialog';
import { DriverSearchFilter } from '@/components/ui/DriverSearchFilter';
import { VehiclePlateInput } from '@/components/ui/VehiclePlateInput';
import { useAuth } from '@/contexts/AuthContext';

function addDaysToDate(dateStr: string, days: number): string {
  if (!dateStr || days <= 0) return '';
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

function getDaysRemaining(endDate: string): number {
  const today = new Date();
  const end = new Date(endDate);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

function getStatusVariant(status: string): 'success' | 'warning' | 'danger' | 'info' | 'default' {
  const statusLower = status.toLowerCase();
  if (statusLower === 'active' || statusLower === 'ساري') return 'success';
  if (statusLower === 'pending' || statusLower === 'قيد الانتظار' || statusLower === 'new' || statusLower === 'جديد') return 'info';
  if (statusLower === 'expired' || statusLower === 'منتهي') return 'danger';
  if (statusLower === 'cancelled' || statusLower === 'ملغي' || statusLower === 'rejected' || statusLower === 'مرفوض') return 'default';
  if (statusLower === 'failed' || statusLower === 'فشل') return 'danger';
  if (statusLower === 'maintenance' || statusLower === 'صيانة') return 'warning';
  return 'default';
}

function getStatusIcon(status: string) {
  const statusLower = status.toLowerCase();
  if (statusLower === 'active' || statusLower === 'ساري') return CheckCircle;
  if (statusLower === 'pending' || statusLower === 'قيد الانتظار' || statusLower === 'new' || statusLower === 'جديد') return Clock;
  if (statusLower === 'expired' || statusLower === 'منتهي') return XCircle;
  if (statusLower === 'cancelled' || statusLower === 'ملغي' || statusLower === 'rejected' || statusLower === 'مرفوض') return X;
  if (statusLower === 'failed' || statusLower === 'فشل') return AlertCircle;
  if (statusLower === 'maintenance' || statusLower === 'صيانة') return RefreshCw;
  return AlertCircle;
}

function getTypeVariant(type: string): 'info' | 'success' | 'default' {
  if (type === 'تم + محلي' || type === 'tamm_and_local') return 'info';
  if (type === 'محلي فقط' || type === 'local_only') return 'success';
  return 'default';
}

const API_ITEM_NAME_TO_EQUIPMENT_KEY: Record<string, EquipmentKey> = {
  'بليشر': 'blicher', 'البليشر': 'blicher',
  'باكيوم': 'bakium', 'الباكيوم': 'bakium',
  'سلم كبير': 'ladderBig', 'السلم الكبير': 'ladderBig',
  'سلم صغير': 'ladderSmall', 'السلم الصغير': 'ladderSmall',
  'لي ماء': 'leMay', 'لي الماء': 'leMay',
  'لي باكيوم': 'leBakium', 'لي الباكيوم': 'leBakium',
  'لي شفط': 'leShoft', 'لي الشفط': 'leShoft',
  'نوسل ماء': 'noselMay',
  'نوسل شفط': 'noselShaft',
  'نوسل كبير': 'noselKabir',
};

export function Authorizations() {
  const { user } = useAuth();
  const { vehicleOptions } = useVehiclesList();
  const [formVehicleId, setFormVehicleId] = useState<string>('');
  const selectedPlateName = vehicleOptions.find((o) => o.value === formVehicleId)?.plateName ?? null;
  const lastAuth = useLastAuthorizationData(selectedPlateName);
  const vehicleEquipment = useVehicleEquipmentInfo(selectedPlateName);
  const { users: usersWithWorkers, loading: usersLoading, error: usersError } = useUsersWithWorkers();
  const { success: showSuccess, error: showError, warning, info, loading } = useNotificationsContext();
  const { confirm, DialogComponent } = useAlertDialog();
  const [filters, setFilters] = useState({
    authorizationType: '',
    authorizationStatus: '',
    vehiclePlateName: '',
    driverName: '',
    driverTypeFilter: '', // 'employee' للموظف أو 'supervisor' لمشرف الفريق
    driverJisrId: '',
    driverIdReceivedFromName: '',
    authorizationStartDate: '',
    authorizationEndDate: '',
    authorizationEndDateFrom: '',
    authorizationEndDateTo: '',
  });

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const isValidLicenseStatus = (status?: string | null): boolean => {
    if (!status) return false;
    const normalized = status.trim().toLowerCase();
    return (
      normalized === 'valid' ||
      normalized === 'active' ||
      status.trim() === 'سارية' ||
      status.trim() === 'ساري' ||
      status.trim() === 'جارية' ||
      status.trim() === 'جاري'
    );
  };

  const extractLicenseStatus = (item: unknown, type: 'user' | 'worker'): string | null => {
    if (!item || typeof item !== 'object') return null;
    const record = item as Record<string, unknown>;

    const userKeys = [
      'userEmployeeData_license_status',
      'user_license_status',
      'user_licenseStatus',
      'user_employeeData_licenseStatus',
      'employeeData_licenseStatus',
      'licenseStatus',
    ];

    const workerKeys = [
      'workersEmployeeData_license_status',
      'workers_license_status',
      'workers_licenseStatus',
      'workers_employeeData_licenseStatus',
      'worker_license_status',
      'employeeData_licenseStatus',
      'licenseStatus',
    ];

    const keys = type === 'user' ? userKeys : workerKeys;
    for (const key of keys) {
      const value = record[key];
      if (typeof value === 'string' && value.trim()) {
        return value;
      }
    }

    return null;
  };

  const getFallbackLicenseStatusFromLastAuth = (
    selectedName: string,
    selectedId?: string | null,
    selectedJisrId?: string | null
  ): string | null => {
    const lastDriver = lastAuth.data?.driver;
    if (!lastDriver) return null;

    const sameById = Boolean(selectedId && lastDriver.id === selectedId);
    const sameByName = Boolean(selectedName && lastDriver.name === selectedName);
    const sameByJisr = Boolean(selectedJisrId && lastDriver.jisrId === selectedJisrId);

    if (!sameById && !sameByName && !sameByJisr) return null;
    return lastDriver.employeeData?.licenseStatus ?? null;
  };

  const { authorizations, meta, isLoading, error, refetch, page, setPage } = useAuthorizations({
    limit: 10,
    authorizationType: filters.authorizationType || undefined,
    authorizationStatus: filters.authorizationStatus || undefined,
    vehiclePlateName: filters.vehiclePlateName?.trim() || undefined,
    driverName: (filters.driverTypeFilter === 'supervisor' && filters.driverName) || undefined,
    userDriverName: (filters.driverTypeFilter === 'employee' && filters.driverName) || undefined,
    driverJisrId: filters.driverJisrId || undefined,
    driverIdReceivedFromName: filters.driverIdReceivedFromName || undefined,
    authorizationStartDate: filters.authorizationStartDate || undefined,
    authorizationEndDate: filters.authorizationEndDate || undefined,
    authorizationEndDateFrom: filters.authorizationEndDateFrom || undefined,
    authorizationEndDateTo: filters.authorizationEndDateTo || undefined,
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedAuth, setSelectedAuth] = useState<AuthorizationDisplay | null>(null);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [otpAuthId, setOtpAuthId] = useState<string>('');
  const [otpAuthNumber, setOtpAuthNumber] = useState<string>('');
  const [renewingId, setRenewingId] = useState<string | null>(null);
  const [showRenewDialog, setShowRenewDialog] = useState(false);
  const [renewAuthData, setRenewAuthData] = useState<AuthorizationDisplay | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelAuthData, setCancelAuthData] = useState<AuthorizationDisplay | null>(null);
  const [showTammDialog, setShowTammDialog] = useState(false);
  const [tammDialogAuth, setTammDialogAuth] = useState<AuthorizationDisplay | null>(null);
  const [tammDialogData, setTammDialogData] = useState<{ authorizationStatus: string; currentDriverName: string; lastDriverName: string } | null>(null);
  const [tammDialogLoading, setTammDialogLoading] = useState(false);
  const [tammOverrides, setTammOverrides] = useState<Record<string, { authorizationStatus: string; currentDriverName: string; lastDriverName: string }>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [currentStep, setCurrentStep] = useState(1);
  
  const [workersCount, setWorkersCount] = useState<string>('one');
  const [authorizationDays, setAuthorizationDays] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>('');
  const [receiverDriverId, setReceiverDriverId] = useState<string>('');
  const [receiverDriverName, setReceiverDriverName] = useState<string>('');
  const [supervisorName, setSupervisorName] = useState<string>('');
  const [authorizationType, setAuthorizationType] = useState<'local_only' | 'tamm_and_local' | ''>('');
  const [vehicleDescription, setVehicleDescription] = useState<string>('');
  const [tammAuthorizedPersonId, setTammAuthorizedPersonId] = useState<string>('');
  const [tammAuthorizedPersonName, setTammAuthorizedPersonName] = useState<string>('');
  const [tammAuthorizedAutoFilled, setTammAuthorizedAutoFilled] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdAuthorizationId, setCreatedAuthorizationId] = useState<string>('');

  const [authorizationEquipment, setAuthorizationEquipment] = useState<Record<EquipmentKey, number>>({
    blicher: 0, bakium: 0, ladderBig: 0, ladderSmall: 0,
    leMay: 0, leBakium: 0, leShoft: 0, noselShaft: 0, noselMay: 0, noselKabir: 0,
  });

  const [vehicleTools, setVehicleTools] = useState({
    wheelWrenchNumber: 0,
    spareTireNumber: 0,
    tireJackNumber: 0,
  });

  // عند تغيير المركبة: جلب عدد العمال تلقائياً
  useEffect(() => {
    if (!lastAuth.data) return;
    const count = lastAuth.data.teamWorkerCount ?? lastAuth.data.workersCount;
    if (count === 0) setWorkersCount('none');
    else if (count === 1) setWorkersCount('one');
    else if (count !== undefined && count >= 2) setWorkersCount('two');
  }, [lastAuth.data]);

  // عند اختيار المركبة: جلب بيانات أدوات المركبة تلقائياً
  useEffect(() => {
    if (!formVehicleId) {
      setVehicleTools({
        wheelWrenchNumber: 0,
        spareTireNumber: 0,
        tireJackNumber: 0,
      });
      return;
    }

    const loadVehicleTools = async () => {
      try {
        const response = await fetchVehicleTools(formVehicleId);
        if (response.success && response.data) {
          setVehicleTools({
            wheelWrenchNumber: response.data.wheelWrenchNumber ?? 0,
            spareTireNumber: response.data.spareTireNumber ?? 0,
            tireJackNumber: response.data.tireJackNumber ?? 0,
          });
        }
      } catch (error) {
        console.error('Error fetching vehicle tools:', error);
      }
    };

    loadVehicleTools();
  }, [formVehicleId]);

  useEffect(() => {
    if (!vehicleEquipment.data || vehicleEquipment.data.length === 0) {
      if (!selectedPlateName) {
        setAuthorizationEquipment({
          blicher: 0, bakium: 0, ladderBig: 0, ladderSmall: 0,
          leMay: 0, leBakium: 0, leShoft: 0, noselShaft: 0, noselMay: 0, noselKabir: 0,
        });
      }
      return;
    }
    const next: Record<EquipmentKey, number> = {
      blicher: 0, bakium: 0, ladderBig: 0, ladderSmall: 0,
      leMay: 0, leBakium: 0, leShoft: 0, noselShaft: 0, noselMay: 0, noselKabir: 0,
    };
    vehicleEquipment.data.forEach((item) => {
      const trimmed = item.itemName.trim();
      const key = API_ITEM_NAME_TO_EQUIPMENT_KEY[trimmed] ?? API_ITEM_NAME_TO_EQUIPMENT_KEY[trimmed.replace(/^ال/, '')];
      if (key != null && typeof item.itemCount === 'number' && item.itemCount >= 0) {
        next[key] = item.itemCount;
      }
    });
    setAuthorizationEquipment(next);
  }, [vehicleEquipment.data, selectedPlateName]);

  /** تنبيهات عند تغيير المركبة في نموذج إضافة تفويض */
  useEffect(() => {
    if (!selectedPlateName) return;
    
    // تنبيه: لا يوجد جرد معدات للمركبة
    if (!vehicleEquipment.isLoading && (!vehicleEquipment.data || vehicleEquipment.data.length === 0)) {
      showError('لا يوجد جرد معدات', `لا توجد بيانات معدات للمركبة ${selectedPlateName}`);
    }
    
    // تنبيه: حالة التفويض ملغي
    if (!lastAuth.isLoading && lastAuth.data?.authorizationStatus === 'cancelled') {
      showError('تفويض ملغي', `التفويض الأخير للمركبة ${selectedPlateName} في حالة ملغي`);
    }
  }, [selectedPlateName, vehicleEquipment.data, vehicleEquipment.isLoading, lastAuth.data?.authorizationStatus, lastAuth.isLoading]);

  const endDate = startDate && authorizationDays > 0 ? addDaysToDate(startDate, authorizationDays) : '';

  const handleSubmitAuthorization = async () => {
    if (!formVehicleId || !selectedPlateName) {
      showError('خطأ في البيانات', 'يرجى اختيار المركبة');
      return;
    }
    if (!receiverDriverName) {
      showError('خطأ في البيانات', 'يرجى اختيار السائق المستلم');
      return;
    }
    if (!authorizationDays || authorizationDays <= 0) {
      showError('خطأ في البيانات', 'يرجى إدخال عدد أيام التفويض');
      return;
    }
    if (!startDate) {
      showError('خطأ في البيانات', 'يرجى إدخال تاريخ البداية');
      return;
    }

    setIsSubmitting(true);
    const loadingId = loading('جاري حفظ التفويض...', 'يتم إرسال البيانات إلى الخادم');

    try {
      const dto: CreateAuthorizationDto = {
        vehiclePlateName: selectedPlateName,
        driverName: receiverDriverName,
        driverNameReceivedFrom: lastAuth.data?.driver?.name,
        supervisorName: supervisorName || undefined,
        authorizationDaysCount: authorizationDays,
        authorizationStartDate: startDate,
        authorizationEndDate: endDate || undefined,
        authType: authorizationType || undefined,
        driverNameInTammSystem: tammAuthorizedPersonName || undefined,
        vehicleAuthorizationDescription: vehicleDescription || undefined,
      };

      const response = await createAuthorization(dto);

      if (response.success) {
        const authId = response.data?.id || '';
        setCreatedAuthorizationId(authId);
        showSuccess('تم حفظ التفويض بنجاح', response.message || 'تم إنشاء التفويض بنجاح');

        // المطلوب: لا تحديث بعد الخطوة الأولى، الانتقال مباشرة للخطوة الثانية
        setCurrentStep(2);
      } else {
        showError('فشل حفظ التفويض', response.message || 'حدث خطأ أثناء حفظ التفويض');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
      showError('فشل حفظ التفويض', errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFormAndReload = () => {
    setShowModal(false);
    setCurrentStep(1);
    setFormVehicleId('');
    setReceiverDriverId('');
    setReceiverDriverName('');
    setSupervisorName('');
    setAuthorizationType('');
    setVehicleDescription('');
    setAuthorizationDays(0);
    setStartDate('');
    setTammAuthorizedPersonName('');
    setTammAuthorizedAutoFilled(false);
    setCreatedAuthorizationId('');
    setAuthorizationEquipment({
      blicher: 0, bakium: 0, ladderBig: 0, ladderSmall: 0,
      leMay: 0, leBakium: 0, leShoft: 0, noselShaft: 0, noselMay: 0, noselKabir: 0,
    });
    setVehicleTools({
      wheelWrenchNumber: 0,
      spareTireNumber: 0,
      tireJackNumber: 0,
    });
    window.location.reload();
  };

  const handleSubmitEquipmentInventory = async () => {
    // إذا لا يوجد عمال، ننتقل مباشرة للخطوة الثالثة
    if (workersCount === 'none') {
      setCurrentStep(3);
      return;
    }

    if (!createdAuthorizationId) {
      showError('خطأ في البيانات', 'لم يتم العثور على معرف التفويض. يرجى إعادة المحاولة من الخطوة الأولى.');
      return;
    }

    setIsSubmitting(true);
    const loadingId = loading('جاري حفظ جرد العهدة...', 'يتم إرسال البيانات إلى الخادم');

    try {
      const items: CreateVehicleEquipmentInventoryItemDto[] = Object.entries(authorizationEquipment).map(([key, count]) => ({
        itemName: EQUIPMENT_LABELS[key as EquipmentKey],
        itemCount: count,
        itemStatus: 'active',
        itemInventoryStatus: 'good',
      }));

      const teamWorkerCount = workersCount === 'one' ? 1 : 2;

      const inventoryDto: CreateVehicleEquipmentInventoryDto = {
        vehicleAuthorizationId: createdAuthorizationId,
        items,
        equipmentInventoryType: 'authorization',
        supervisorId: user?.username || user?.name || supervisorName || 'temp-supervisor-id',
        equipmentInventoryDescription: vehicleDescription || undefined,
        teamWorkerCount,
        equipmentInventoryStatus: 'check',
      };

      const inventoryResponse = await createVehicleEquipmentInventory(inventoryDto);

      if (inventoryResponse.success) {
        showSuccess('تم حفظ جرد العهدة بنجاح', inventoryResponse.message || 'تم إنشاء جرد العهدة بنجاح');
        setCurrentStep(3);
      } else {
        showError('فشل حفظ جرد العهدة', inventoryResponse.message || 'حدث خطأ أثناء حفظ جرد العهدة');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
      showError('فشل حفظ جرد العهدة', errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishAuthorizationFlow = async () => {
    if (!formVehicleId) {
      showError('خطأ في البيانات', 'لم يتم العثور على معرف المركبة.');
      return;
    }

    setIsSubmitting(true);
    const loadingId = loading('جاري حفظ بيانات الأدوات...', 'يتم إرسال البيانات إلى الخادم');

    try {
      const toolsDto: UpdateVehicleToolsDto = {
        vehicleId: formVehicleId,
        wheelWrenchNumber: vehicleTools.wheelWrenchNumber,
        spareTireNumber: vehicleTools.spareTireNumber,
        tireJackNumber: vehicleTools.tireJackNumber,
      };

      const toolsResponse = await updateVehicleTools(toolsDto);

      if (toolsResponse.success) {
        showSuccess('تم حفظ جميع البيانات بنجاح', 'تم حفظ بيانات الأدوات بنجاح');
        resetFormAndReload();
      } else {
        showError('فشل حفظ بيانات الأدوات', toolsResponse.message || 'حدث خطأ أثناء حفظ بيانات الأدوات');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
      showError('فشل حفظ البيانات', errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleRenewAuthorization = async (auth: AuthorizationDisplay) => {
    setRenewAuthData(auth);
    setShowRenewDialog(true);
  };

  const handleTammStatusClick = async (auth: AuthorizationDisplay) => {
    const raw = auth.raw as any;
    const serialNumber = raw?.vehicle?.serialNumber;
    let iqamahNumber = raw?.driver?.employeeData?.iqamahNumber ?? raw?.userDriver?.employeeData?.iqamahNumber;
    if (!iqamahNumber && usersWithWorkers.length > 0) {
      const driverName = auth.driver || raw?.driver?.name || raw?.userDriver?.name;
      const matchedUser = usersWithWorkers.find(
        (u) =>
          u.user_name === driverName ||
          u.workers_name === driverName
      );
      iqamahNumber =
        matchedUser?.userEmployeeData_iqamah_number ??
        matchedUser?.workersEmployeeData_iqamah_number ??
        matchedUser?.workersEmployeeData_personal_received ??
        null;
    }
    if (!serialNumber || !iqamahNumber) {
      showError('بيانات ناقصة', 'رقم التسلسل أو رقم الإقامة غير متوفر لهذا التفويض. تأكد من إضافة رقم الإقامة للمستخدم في صفحة المستخدمين.');
      return;
    }
    setTammDialogAuth(auth);
    setTammDialogData(null);
    setShowTammDialog(true);
    setTammDialogLoading(true);
    try {
      const response = await fetchTammVehicleAuthorization(serialNumber, iqamahNumber);
      if (response.data) {
        setTammDialogData(response.data);
      } else {
        setTammDialogData({
          authorizationStatus: response.message || '—',
          currentDriverName: '—',
          lastDriverName: '—',
        });
      }
    } catch (err: any) {
      const errData = err?.response?.data;
      if (errData?.data) {
        setTammDialogData(errData.data);
      } else {
        showError('فشل جلب بيانات تم', err?.response?.data?.message || err?.message || 'حدث خطأ');
        setShowTammDialog(false);
      }
    } finally {
      setTammDialogLoading(false);
    }
  };

  const closeTammDialog = () => {
    if (tammDialogAuth && tammDialogData) {
      setTammOverrides((prev) => ({
        ...prev,
        [tammDialogAuth.id]: tammDialogData,
      }));
    }
    setShowTammDialog(false);
    setTammDialogAuth(null);
    setTammDialogData(null);
  };

  const confirmRenewAuthorization = async () => {
    if (!renewAuthData) return;

    setRenewingId(renewAuthData.id);
    const loadingId = loading('جاري إعادة إرسال التفويض...', 'يتم إرسال الطلب إلى نظام تم');

    try {
      const response = await sendVehicleAuthorizationOTP(renewAuthData.id);

      if (response.success) {
        showSuccess('تم إعادة إرسال التفويض بنجاح', response.message || 'تم إرسال رمز OTP إلى السائق');
        refetch();
      } else {
        showError('فشل إعادة إرسال التفويض', response.message || 'حدث خطأ أثناء إعادة إرسال التفويض');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
      showError('فشل إعادة إرسال التفويض', errorMsg);
    } finally {
      setRenewingId(null);
    }
  };

  const handleOTPSubmit = async (otp: string) => {
    if (!otpAuthId) {
      showError('خطأ في البيانات', 'لم يتم العثور على معرف التفويض');
      return;
    }

    const loadingId = loading('جاري تأكيد رمز التحقق...', 'يتم التحقق من الرمز');

    try {
      const response = await verifyVehicleAuthorizationOTP(otpAuthId, otp);

      if (response.success) {
        showSuccess('تم تأكيد التفويض بنجاح', response.message || 'تم تأكيد رمز OTP بنجاح');
        setShowOTPDialog(false);
        refetch();
      } else {
        showError('فشل تأكيد رمز التحقق', response.message || 'الرمز غير صحيح أو منتهي الصلاحية');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
      showError('فشل تأكيد رمز التحقق', errorMsg);
    }
  };

  const handleCancelAuthorization = (auth: AuthorizationDisplay) => {
    setCancelAuthData(auth);
    setShowCancelDialog(true);
  };

  const confirmCancelAuthorization = async () => {
    if (!cancelAuthData) return;
    
    setCancellingId(cancelAuthData.id);
    setShowCancelDialog(false);
    const loadingId = loading('جاري إلغاء التفويض...', `تفويض المركبة ${cancelAuthData.vehicle}`);
    
    try {
      await cancelAuthorization(cancelAuthData.id);
      await refetch();
      setSelectedAuth(null);
      showSuccess('تم إلغاء التفويض بنجاح', `تم إلغاء تفويض المركبة ${cancelAuthData.vehicle}`);
    } catch (err) {
      showError('فشل إلغاء التفويض', err instanceof Error ? err.message : 'حدث خطأ أثناء إلغاء التفويض');
    } finally {
      setCancellingId(null);
      setCancelAuthData(null);
    }
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);
  const clearFilters = () => {
    setFilters({
      authorizationType: '',
      authorizationStatus: '',
      vehiclePlateName: '',
      driverName: '',
      driverTypeFilter: '',
      driverJisrId: '',
      driverIdReceivedFromName: '',
      authorizationStartDate: '',
      authorizationEndDate: '',
      authorizationEndDateFrom: '',
      authorizationEndDateTo: '',
    });
    setPage(1);
  };

  // البيانات من API مع دمج تحديثات تم (عند إغلاق الديلوج)
  const displayedAuthorizations = useMemo(() => {
    return authorizations.map((auth) => {
      const override = tammOverrides[auth.id];
      if (!override) return auth;
      return {
        ...auth,
        status: override.authorizationStatus,
        driver: override.currentDriverName,
      };
    });
  }, [authorizations, tammOverrides]);

  // Statistics (من الصفحة الحالية)
  const stats = {
    active: authorizations.filter(a => a.status === 'ساري').length,
    expiringSoon: authorizations.filter(a => a.status === 'قريب الانتهاء').length,
    expired: authorizations.filter(a => a.status === 'منتهي').length,
    total: meta?.total ?? authorizations.length,
  };

  const columns = [
    {
      key: 'authNumber',
      label: 'رقم التفويض',
      render: (value: unknown, row: any) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-[#09b9b5]/10 to-[#09b9b5]/20 rounded-xl flex items-center justify-center border border-[#09b9b5]/20">
              <FileText className="w-5 h-5 text-[#09b9b5]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
              <CheckCircle className="w-3 h-3 text-green-500" />
            </div>
          </div>
          <div>
            <p className="font-bold text-gray-900">{String(value)}</p>
            <p className="text-xs text-gray-500">{row.vehicleModel}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'vehicle',
      label: 'المركبة',
      render: (value: unknown, row: any) => (
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Car className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-semibold">{String(value)}</span>
        </div>
      ),
    },
    {
      key: 'driver',
      label: 'السائق والمشرف',
      render: (value: unknown, row: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium">{String(value)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">{row.supervisor}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'startDate',
      label: 'الفترة',
      render: (value: unknown, row: any) => {
        const daysRemaining = getDaysRemaining(row.endDate);
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-sm">{String(value)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500">{row.endDate}</span>
            </div>
            {daysRemaining > 0 && (
              <p className="text-xs text-gray-500">متبقي {daysRemaining} يوم</p>
            )}
          </div>
        );
      },
    },
    {
      key: 'type',
      label: 'النوع',
      render: (value: unknown, row: any) => (
        <div className="space-y-1">
          <Badge variant={getTypeVariant(String(value))}>
            {String(value)}
          </Badge>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">{row.workersCount} عمال</span>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (value: unknown) => {
        const v = String(value);
        const displayStatus = statusToArabic(v);
        const variant = getStatusVariant(v);
        const Icon = getStatusIcon(v);
        return (
          <Badge variant={variant} className="flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5" />
            {displayStatus}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (_: unknown, row: any) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleTammStatusClick(row);
            }}
            className="p-2 hover:bg-amber-50 rounded-lg transition-colors group"
            title="حالة التفويض من تم"
          >
            <Database className="w-4 h-4 text-gray-400 group-hover:text-amber-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAuth(row);
            }}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
            title="عرض التفاصيل"
          >
            <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
          </button>
          {(row.status === 'new' || row.status === 'pending' || statusToArabic(row.status) === 'جديد' || statusToArabic(row.status) === 'قيد الانتظار') && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOtpAuthId(row.id);
                setOtpAuthNumber(row.authNumber);
                setShowOTPDialog(true);
              }}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
              title="إدخال رمز التحقق (OTP)"
            >
              <KeyRound className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCancelAuthorization(row);
            }}
            disabled={cancellingId === row.id || row.status === 'expired' || row.status === 'cancelled'}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
            title="إلغاء التفويض"
          >
            {cancellingId === row.id ? (
              <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
            ) : (
              <XCircle className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRenewAuthorization(row);
            }}
            disabled={renewingId === row.id || row.status === 'active' || statusToArabic(row.status) === 'ساري'}
            className="p-2 hover:bg-purple-50 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
            title={row.status === 'active' || statusToArabic(row.status) === 'ساري' ? 'التفويض ساري - لا يمكن إعادة الإرسال' : 'إعادة إرسال'}
          >
            {renewingId === row.id ? (
              <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-[#09b9b5] to-[#0da9a5] rounded-xl shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">إدارة التفويض</h1>
              <p className="text-sm text-[#617c96]">تفويض المركبات وجرد العهدة - {meta?.total ?? 0} تفويض</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                viewMode === 'table' 
                  ? 'bg-white shadow-sm text-[#09b9b5] font-semibold' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              جدول
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                viewMode === 'grid' 
                  ? 'bg-white shadow-sm text-[#09b9b5] font-semibold' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              بطاقات
            </button>
          </div>

          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)} 
            className="text-sm relative"
          >
            <Filter className="w-4 h-4 ml-1 sm:ml-2" />
            <span className="hidden xs:inline">تصفية</span>
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#09b9b5] rounded-full"></span>
            )}
          </Button>
          
          <Button variant="secondary" className="text-sm group">
            <Download className="w-4 h-4 ml-1 sm:ml-2 group-hover:translate-y-0.5 transition-transform" />
            <span className="hidden xs:inline">تصدير</span>
          </Button>
          
          <Button 
            variant="primary" 
            onClick={() => {
              setShowModal(true);
              setCurrentStep(1);
            }} 
            className="text-sm group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            <Plus className="w-4 h-4 ml-1 sm:ml-2 relative z-10 group-hover:rotate-90 transition-transform" />
            <span className="hidden sm:inline relative z-10">تفويض جديد</span>
            <span className="sm:hidden relative z-10">تفويض</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards - Enhanced */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card 
          className="border-r-4 border-[#09b9b5] hover:shadow-xl transition-all duration-300 group cursor-pointer"
          onClick={() => info('إجمالي التفويضات', `يوجد حالياً ${stats.total} تفويض في النظام`)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#09b9b5] rounded-full animate-pulse"></span>
                إجمالي التفويضات
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                {stats.total}
              </p>
              <p className="text-xs text-gray-500 mt-1">جميع الحالات</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#09b9b5]/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-[#09b9b5] flex-shrink-0 relative z-10 group-hover:scale-110 transition-all" />
            </div>
          </div>
        </Card>

        <Card 
          className="border-r-4 border-[#00a287] hover:shadow-xl transition-all duration-300 group cursor-pointer"
          onClick={() => showSuccess('التفويضات السارية', `${stats.active} تفويض ساري المفعول حالياً`)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#00a287] rounded-full animate-pulse"></span>
                التفويضات السارية
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                {stats.active}
              </p>
              <p className="text-xs text-green-600 mt-1 font-semibold">
                {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% نشطة
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#00a287]/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-[#00a287] flex-shrink-0 relative z-10 group-hover:scale-110 transition-all" />
            </div>
          </div>
        </Card>

        <Card 
          className="border-r-4 border-[#f57c00] hover:shadow-xl transition-all duration-300 group cursor-pointer"
          onClick={() => warning('قريبة من الانتهاء', `${stats.expiringSoon} تفويض تحتاج إلى إعادة إرسال خلال 30 يوم`)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#f57c00] rounded-full animate-pulse"></span>
                قريبة من الانتهاء
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                {stats.expiringSoon}
              </p>
              <p className="text-xs text-orange-600 mt-1 font-semibold">تحتاج إعادة إرسال</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#f57c00]/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-[#f57c00] flex-shrink-0 relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-all" />
            </div>
          </div>
        </Card>

        <Card 
          className="border-r-4 border-[#d32f2f] hover:shadow-xl transition-all duration-300 group cursor-pointer"
          onClick={() => showError('التفويضات المنتهية', `${stats.expired} تفويض منتهي الصلاحية`)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#d32f2f] rounded-full animate-pulse"></span>
                منتهية
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                {stats.expired}
              </p>
              <p className="text-xs text-red-600 mt-1 font-semibold">غير نشطة</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#d32f2f]/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <X className="w-8 h-8 sm:w-10 sm:h-10 text-[#d32f2f] flex-shrink-0 relative z-10 group-hover:scale-110 transition-all" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-t-4 border-[#09b9b5]">
        <div className="space-y-4">
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 animate-slideDown">
              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">نوع التفويض</label>
                <select 
                  value={filters.authorizationType}
                  onChange={(e) => updateFilter('authorizationType', e.target.value)}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
                >
                  <option value="">الكل</option>
                  {Object.entries(AUTHORIZATION_TYPE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">حالة التفويض</label>
                <select 
                  value={filters.authorizationStatus}
                  onChange={(e) => updateFilter('authorizationStatus', e.target.value)}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
                >
                  <option value="">الكل</option>
                  {Object.entries(AUTHORIZATION_STATUS_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <VehiclePlateInput
                  value={filters.vehiclePlateName}
                  onChange={(v) => updateFilter('vehiclePlateName', v)}
                  label="لوحة المركبة"
                />
              </div>

              <DriverSearchFilter
                driverTypeFilter={filters.driverTypeFilter}
                driverName={filters.driverName}
                onDriverTypeChange={(value) => updateFilter('driverTypeFilter', value)}
                onDriverNameChange={(value) => updateFilter('driverName', value)}
              />

              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">رقم السائق (جسر)</label>
                <input
                  type="text"
                  value={filters.driverJisrId}
                  onChange={(e) => updateFilter('driverJisrId', e.target.value)}
                  placeholder="مثال: 755"
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">اسم المستلم منه</label>
                <input
                  type="text"
                  value={filters.driverIdReceivedFromName}
                  onChange={(e) => updateFilter('driverIdReceivedFromName', e.target.value)}
                  placeholder="بحث بالاسم"
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">تاريخ البداية</label>
                <input
                  type="date"
                  value={filters.authorizationStartDate}
                  onChange={(e) => updateFilter('authorizationStartDate', e.target.value)}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">تاريخ النهاية</label>
                <input
                  type="date"
                  value={filters.authorizationEndDate}
                  onChange={(e) => updateFilter('authorizationEndDate', e.target.value)}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
                />
              </div>

              {/* Reset Button */}
              {hasActiveFilters && (
                <div className="sm:col-span-3 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="text-sm"
                  >
                    <X className="w-4 h-4 ml-2" />
                    مسح الفلاتر
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Results Summary */}
      {hasActiveFilters && meta && (
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
          <Search className="w-4 h-4 text-blue-600" />
          <span>تم العثور على <strong className="text-blue-600">{meta.total}</strong> نتيجة</span>
        </div>
      )}

      {/* Loading / Error */}
      {isLoading && (
        <PageLoading message="جاري تحميل التفويضات..." />
      )}
      {error && (
        <Card className="border-red-200 bg-red-50 text-red-700 py-4 px-4">
          {error}
        </Card>
      )}

      {/* Table/Grid View */}
      {!isLoading && !error && (viewMode === 'table' ? (
        <Card>
          <Table 
            columns={columns} 
            data={displayedAuthorizations} 
            onRowClick={(row) => setSelectedAuth(row)} 
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedAuthorizations.map((auth, index) => {
            const daysRemaining = getDaysRemaining(auth.endDate);
            return (
              <Card 
                key={auth.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-t-4 border-[#09b9b5] overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setSelectedAuth(auth)}
              >
                {/* Header */}
                <div className="relative bg-gradient-to-br from-[#09b9b5]/10 via-[#09b9b5]/5 to-transparent p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white rounded-xl shadow-md">
                        <FileText className="w-6 h-6 text-[#09b9b5]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{auth.authNumber}</h3>
                        <p className="text-sm text-gray-600">{auth.vehicleModel}</p>
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(auth.status)}>
                      {statusToArabic(auth.status)}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Vehicle & Driver */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Car className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">المركبة</p>
                        <p className="font-semibold text-gray-900">{auth.vehicle}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <User className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">السائق</p>
                        <p className="font-semibold text-gray-900">{auth.driver}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">تاريخ البداية</span>
                      <span className="font-semibold">{auth.startDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">تاريخ الانتهاء</span>
                      <span className="font-semibold">{auth.endDate}</span>
                    </div>
                    {daysRemaining > 0 && (
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-orange-600 font-semibold">
                          متبقي {daysRemaining} يوم
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Type & Workers */}
                  <div className="flex items-center justify-between">
                    <Badge variant={auth.type === 'تم + محلي' ? 'info' : 'default'}>
                      {auth.type}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{auth.workersCount} عمال</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleTammStatusClick(auth); }}
                      className="p-2 hover:bg-amber-50 rounded-lg transition-colors"
                      title="حالة التفويض من تم"
                    >
                      <Database className="w-4 h-4 text-amber-600" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedAuth(auth); }}
                      className="flex-1 py-2 px-3 bg-[#09b9b5] hover:bg-[#0da9a5] text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      عرض التفاصيل
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <RefreshCw className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ))}

      {meta && <Pagination meta={meta} onPageChange={setPage} />}

      {/* Authorization Details Modal */}
      {selectedAuth && (
        <Portal>
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 animate-fadeIn" 
          onClick={() => setSelectedAuth(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-lg max-w-4xl w-full max-h-[85vh] overflow-y-auto animate-slideUp" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-[#09b9b5] to-[#0da9a5] p-6 text-white">
              <button
                onClick={() => setSelectedAuth(null)}
                className="absolute top-4 left-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">{selectedAuth.authNumber}</h2>
                  <p className="text-white/90">{selectedAuth.vehicleModel}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={getStatusVariant(selectedAuth.status)} className="bg-white/20 border-white/30">
                      {statusToArabic(selectedAuth.status)}
                    </Badge>
                    <Badge variant={getTypeVariant(selectedAuth.type)} className="bg-white/20 border-white/30">
                      {selectedAuth.type}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-100">
                  <Car className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">المركبة</p>
                  <p className="text-sm font-bold text-gray-900">{selectedAuth.vehicle}</p>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-100">
                  <User className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">السائق</p>
                  <p className="text-sm font-bold text-gray-900">{selectedAuth.driver}</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-100">
                  <Shield className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">المشرف</p>
                  <p className="text-sm font-bold text-gray-900">{selectedAuth.supervisor}</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-100">
                  <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">العمال</p>
                  <p className="text-lg font-bold text-gray-900">{selectedAuth.workersCount}</p>
                </div>
              </div>

              {/* Period */}
              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200 space-y-3">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#09b9b5]" />
                  فترة التفويض
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">تاريخ البداية</p>
                    <p className="font-semibold text-gray-900">{selectedAuth.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">تاريخ الانتهاء</p>
                    <p className="font-semibold text-gray-900">{selectedAuth.endDate}</p>
                  </div>
                </div>
                {getDaysRemaining(selectedAuth.endDate) > 0 && (
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <span className="text-sm">
                      متبقي <strong className="text-orange-600">{getDaysRemaining(selectedAuth.endDate)}</strong> يوم
                    </span>
                  </div>
                )}
              </div>

              {/* Equipment Inventory - غير متوفر من API حالياً */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#09b9b5]" />
                  جرد العهدة
                </h3>
                <div className="p-4 bg-gray-50 rounded-xl text-center text-gray-500">
                  جرد العهدة غير متوفر من السيرفر حالياً
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button variant="primary" className="flex-1 group">
                  <Edit className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                  تعديل التفويض
                </Button>
                <Button variant="secondary" className="flex-1 group">
                  <RefreshCw className="w-4 h-4 ml-2 group-hover:rotate-180 transition-transform" />
                  إعادة إرسال التفويض
                </Button>
                <Button variant="outline" className="group">
                  <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Portal>
      )}

      {/* Add Authorization Modal (Multi-Step) */}
      {showModal && (
        <Portal>
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 animate-fadeIn" 
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-lg max-w-5xl w-full max-h-[85vh] overflow-y-auto animate-slideUp" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-[#09b9b5] to-[#0da9a5] p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">تفويض جديد</h2>
                    <p className="text-white/80 text-sm mt-0.5">إنشاء تفويض مركبة وجرد العهدة</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-between mt-6">
                {[
                  { num: 1, label: 'معلومات أساسية', icon: FileText },
                  { num: 2, label: 'جرد العهدة', icon: Package },
                  { num: 3, label: 'أغراض الباص', icon: Car },
                ].map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={i} className="flex items-center gap-2 flex-1">
                      <button
                        onClick={() => setCurrentStep(step.num)}
                        className={`flex items-center gap-3 flex-1 p-3 rounded-xl transition-all ${
                          currentStep === step.num
                            ? 'bg-white text-[#09b9b5] shadow-lg'
                            : currentStep > step.num
                            ? 'bg-white/20 text-white hover:bg-white/30'
                            : 'bg-white/10 text-white/60'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                          currentStep === step.num
                            ? 'bg-[#09b9b5] text-white'
                            : currentStep > step.num
                            ? 'bg-green-500 text-white'
                            : 'bg-white/20 text-white/60'
                        }`}>
                          {currentStep > step.num ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                        </div>
                        <div className="text-right hidden sm:block">
                          <p className="text-xs opacity-80">الخطوة {step.num}</p>
                          <p className="text-sm font-semibold">{step.label}</p>
                        </div>
                      </button>
                      {i < 2 && (
                        <div className={`w-8 h-0.5 hidden sm:block ${
                          currentStep > step.num ? 'bg-white' : 'bg-white/20'
                        }`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <form className="p-6 space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmitAuthorization(); }}>
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                    <FileText className="w-5 h-5 text-[#09b9b5]" />
                    <h3 className="text-lg font-bold text-gray-900">المعلومات الأساسية</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        نوع التفويض<span className="text-red-500 mr-1">*</span>
                      </label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]"
                        value={authorizationType}
                        onChange={(e) => setAuthorizationType(e.target.value as 'local_only' | 'tamm_and_local' | '')}
                        required
                      >
                        <option value="">اختر النوع</option>
                        <option value="local_only">محلي فقط</option>
                        <option value="tamm_and_local">تم + محلي</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50/80 to-white p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 bg-[#09b9b5]/10 rounded-lg">
                            <Car className="w-4 h-4 text-[#09b9b5]" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-800">المركبة</h4>
                            <p className="text-xs text-gray-500">ابحث برقم اللوحة أو الموديل ثم اختر</p>
                          </div>
                        </div>
                        <SearchableSelect
                          label=""
                          options={vehicleOptions}
                          value={formVehicleId}
                          onChange={setFormVehicleId}
                          placeholder="ابحث أو اختر المركبة..."
                          required
                          className="mb-3"
                        />
                        <VehicleDriverSummary
                          data={lastAuth.data}
                          isLoading={lastAuth.isLoading}
                          error={lastAuth.error}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        السائق المستلم<span className="text-red-500 mr-1">*</span>
                      </label>
                      <SearchableSelect
                        options={
                          usersLoading 
                            ? [{ value: '', label: 'جاري التحميل...' }]
                            : usersError
                            ? [{ value: '', label: 'خطأ في التحميل' }]
                            : (() => {
                                const allOptions: Array<{ value: string; label: string }> = [
                                  { value: '', label: 'اختر الشخص' }
                                ];
                                
                                usersWithWorkers.forEach(user => {
                                  if (user.user_name) {
                                    allOptions.push({
                                      value: `user_${user.user_name}`,
                                      label: `${user.user_name}${user.user_jisr_id ? ` (${user.user_jisr_id})` : ''} - مستخدم`,
                                    });
                                  }
                                  
                                  if (user.workers_id && user.workers_name) {
                                    allOptions.push({
                                      value: user.workers_id || '',
                                      label: `${user.workers_name}${user.workers_jisr_id ? ` (${user.workers_jisr_id})` : ''}${user.workers_role ? ` - ${user.workers_role}` : ' - عامل'}`,
                                    });
                                  }
                                });
                                
                                return allOptions;
                              })()
                        }
                        value={receiverDriverId}
                        onChange={(val) => {
                          setReceiverDriverId(val);
                          if (!val) {
                            setReceiverDriverName('');
                            setTammAuthorizedAutoFilled(false);
                            setTammAuthorizedPersonId('');
                            setTammAuthorizedPersonName('');
                            return;
                          }
                          
                          if (val.startsWith('user_')) {
                            const userName = val.replace('user_', '');
                            const selectedUser = usersWithWorkers.find(u => u.user_name === userName);
                            if (selectedUser && selectedUser.user_name) {
                              setReceiverDriverName(selectedUser.user_name);

                              const licenseStatus =
                                extractLicenseStatus(selectedUser, 'user') ||
                                getFallbackLicenseStatusFromLastAuth(
                                  selectedUser.user_name,
                                  null,
                                  selectedUser.user_jisr_id
                                );

                              if (isValidLicenseStatus(licenseStatus)) {
                                setTammAuthorizedPersonId(val);
                                setTammAuthorizedPersonName(selectedUser.user_name);
                                setTammAuthorizedAutoFilled(true);
                              } else {
                                setTammAuthorizedAutoFilled(false);
                                setTammAuthorizedPersonId('');
                                setTammAuthorizedPersonName('');
                              }
                            }
                          } else {
                            const selectedUser = usersWithWorkers.find(u => u.workers_id === val);
                            if (selectedUser && selectedUser.workers_name) {
                              setReceiverDriverName(selectedUser.workers_name);

                              const licenseStatus =
                                extractLicenseStatus(selectedUser, 'worker') ||
                                getFallbackLicenseStatusFromLastAuth(
                                  selectedUser.workers_name,
                                  selectedUser.workers_id,
                                  selectedUser.workers_jisr_id
                                );

                              if (isValidLicenseStatus(licenseStatus)) {
                                setTammAuthorizedPersonId(val);
                                setTammAuthorizedPersonName(selectedUser.workers_name);
                                setTammAuthorizedAutoFilled(true);
                              } else {
                                setTammAuthorizedAutoFilled(false);
                                setTammAuthorizedPersonId('');
                                setTammAuthorizedPersonName('');
                              }
                            }
                          }
                        }}
                        placeholder="ابحث عن السائق..."
                        disabled={usersLoading}
                      />
                      {usersError && (
                        <p className="text-xs text-red-500 mt-1">
                          ⚠️ {usersError}
                        </p>
                      )}
                      {!usersLoading && !usersError && usersWithWorkers.length === 0 && (
                        <p className="text-xs text-amber-600 mt-1">
                          ⚠️ لا توجد بيانات مشرفين متاحة
                        </p>
                      )}
                      {receiverDriverId && (() => {
                        let licenseStatus: string | null = null;
                        let personName = '';

                        if (receiverDriverId.startsWith('user_')) {
                          const userName = receiverDriverId.replace('user_', '');
                          const selectedUser = usersWithWorkers.find(u => u.user_name === userName);
                          personName = selectedUser?.user_name || '';
                          licenseStatus =
                            extractLicenseStatus(selectedUser, 'user') ||
                            getFallbackLicenseStatusFromLastAuth(personName, null, selectedUser?.user_jisr_id);
                        } else {
                          const selectedUser = usersWithWorkers.find(u => u.workers_id === receiverDriverId);
                          personName = selectedUser?.workers_name || '';
                          licenseStatus =
                            extractLicenseStatus(selectedUser, 'worker') ||
                            getFallbackLicenseStatusFromLastAuth(
                              personName,
                              selectedUser?.workers_id,
                              selectedUser?.workers_jisr_id
                            );
                        }

                        if (!licenseStatus) {
                          return (
                            <p className="text-xs mt-1 text-amber-600">
                              ⚠️ تعذر التحقق من حالة الرخصة لهذا الشخص من البيانات الحالية
                            </p>
                          );
                        }

                        const isValid = isValidLicenseStatus(licenseStatus);
                        return (
                          <p className={`text-xs mt-1 ${isValid ? 'text-green-600' : 'text-red-500'}`}>
                            {isValid
                              ? `✓ الرخصة سارية - تم ملء المفوض في تم تلقائياً (${personName})`
                              : `✗ الرخصة ${licenseStatus} - غير سارية`}
                          </p>
                        );
                      })()}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        المشرف المسلم<span className="text-red-500 mr-1">*</span>
                      </label>
                      <input
                        type="text"
                        value={supervisorName || user?.username || user?.name || ''}
                        readOnly
                        disabled
                        placeholder="أدخل اسم المشرف المسلم"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الشخص المفوض السابق
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={lastAuth.isLoading ? 'جاري التحميل...' : (lastAuth.data?.driver?.name ?? '')}
                        placeholder={formVehicleId ? 'لا يوجد سائق مسجل' : 'يُجلب تلقائياً عند اختيار المركبة'}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                      />
                      {lastAuth.data?.driver?.jisrId && (
                        <p className="text-xs text-gray-500 mt-1">رقم جسر: {lastAuth.data.driver.jisrId}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الشخص المفوض في تم
                        {tammAuthorizedAutoFilled && (
                          <span className="mr-2 text-xs text-green-600 font-normal">✓ مُعبأ تلقائياً</span>
                        )}
                      </label>
                      {tammAuthorizedAutoFilled ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            readOnly
                            value={tammAuthorizedPersonName}
                            className="flex-1 px-3 py-2 border border-green-300 rounded-lg bg-green-50 text-gray-700"
                          />
                          <button
                            type="button"
                            onClick={() => { setTammAuthorizedAutoFilled(false); setTammAuthorizedPersonId(''); setTammAuthorizedPersonName(''); }}
                            className="px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            title="تغيير يدوياً"
                          >
                            تغيير
                          </button>
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={tammAuthorizedPersonName}
                          onChange={(e) => setTammAuthorizedPersonName(e.target.value)}
                          placeholder="أدخل اسم الشخص المفوض في تم"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        عدد العمال في الفريق<span className="text-red-500 mr-1">*</span>
                        {(lastAuth.data?.teamWorkerCount !== undefined || lastAuth.data?.workersCount !== undefined) && (
                          <span className="mr-2 text-xs text-blue-600 font-normal">✓ من بيانات المركبة</span>
                        )}
                      </label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]"
                        value={workersCount}
                        onChange={(e) => setWorkersCount(e.target.value)}
                      >
                        <option value="one">عامل واحد</option>
                        <option value="two">عاملين</option>
                        <option value="none">لا يوجد</option>
                      </select>
                    </div>

                    <Input 
                      label="عدد أيام التفويض" 
                      type="number" 
                      min="1"
                      value={authorizationDays || ''}
                      onChange={(e) => setAuthorizationDays(Number(e.target.value) || 0)}
                      required 
                    />

                    <Input 
                      label="تاريخ البداية" 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required 
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        تاريخ الانتهاء <span className="text-gray-500 text-xs">(يُحسب تلقائياً)</span>
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                      />
                      {endDate && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          البداية + {authorizationDays} يوم = {endDate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      حالة المركبة عند التسليم
                    </label>
                    <textarea
                      rows={3}
                      value={vehicleDescription}
                      onChange={(e) => setVehicleDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]"
                      placeholder="اكتب ملاحظات عن حالة المركبة..."
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Step 2: Equipment Inventory */}
              {currentStep === 2 && (
                <div className="animate-fadeIn">
                  {workersCount === 'none' ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800 text-sm">
                      لا يوجد عمال في الفريق، سيتم تجاوز جرد العهدة والانتقال للخطوة التالية.
                    </div>
                  ) : (
                    <EquipmentInventoryGrid
                      equipment={authorizationEquipment}
                      onChange={setAuthorizationEquipment}
                      isLoading={vehicleEquipment.isLoading}
                      error={vehicleEquipment.error}
                    />
                  )}
                </div>
              )}

              {/* Step 3: Bus Main Items */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                    <Car className="w-5 h-5 text-[#09b9b5]" />
                    <h3 className="text-lg font-bold text-gray-900">أغراض الباص الرئيسية</h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gradient-to-br from-green-50 to-white rounded-xl border-2 border-green-200 hover:border-green-400 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                          <Package className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-700 mb-1 block">كفر استبنه</label>
                          <input 
                            type="number" 
                            min="0" 
                            value={vehicleTools.spareTireNumber}
                            onChange={(e) => setVehicleTools({ ...vehicleTools, spareTireNumber: parseInt(e.target.value) || 0 })}
                            className="w-full text-lg font-bold border-0 p-0 focus:ring-0 text-gray-900"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-green-50 to-white rounded-xl border-2 border-green-200 hover:border-green-400 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                          <Package className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-700 mb-1 block">عفريته</label>
                          <input 
                            type="number" 
                            min="0" 
                            value={vehicleTools.tireJackNumber}
                            onChange={(e) => setVehicleTools({ ...vehicleTools, tireJackNumber: parseInt(e.target.value) || 0 })}
                            className="w-full text-lg font-bold border-0 p-0 focus:ring-0 text-gray-900"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-green-50 to-white rounded-xl border-2 border-green-200 hover:border-green-400 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                          <Package className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <label className="text-sm font-medium text-gray-700 mb-1 block">مفك عجل</label>
                          <input 
                            type="number" 
                            min="0" 
                            value={vehicleTools.wheelWrenchNumber}
                            onChange={(e) => setVehicleTools({ ...vehicleTools, wheelWrenchNumber: parseInt(e.target.value) || 0 })}
                            className="w-full text-lg font-bold border-0 p-0 focus:ring-0 text-gray-900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-3 pt-4 border-t-2 border-gray-200 sticky bottom-0 bg-white pb-2">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="group"
                  >
                    <X className="w-4 h-4 ml-2 group-hover:rotate-90 transition-transform" />
                    إلغاء
                  </Button>
                  
                  {currentStep > 1 && (
                    <Button 
                      variant="secondary" 
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="group"
                    >
                      السابق
                    </Button>
                  )}
                </div>

                <div className="flex gap-2">
                  {currentStep === 1 ? (
                    <Button 
                      variant="primary" 
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform"></div>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 relative z-10 animate-spin" />
                          <span className="relative z-10">جاري الحفظ...</span>
                        </>
                      ) : (
                        <>
                          <span className="relative z-10">التالي</span>
                          <TrendingUp className="w-4 h-4 mr-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  ) : currentStep === 2 ? (
                    <Button 
                      variant="primary" 
                      type="button"
                      onClick={handleSubmitEquipmentInventory}
                      disabled={isSubmitting}
                      className="group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform"></div>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 relative z-10 animate-spin" />
                          <span className="relative z-10">جاري الحفظ...</span>
                        </>
                      ) : (
                        <>
                          <span className="relative z-10">حفظ والتالي</span>
                          <TrendingUp className="w-4 h-4 mr-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button 
                      variant="primary" 
                      type="button"
                      onClick={handleFinishAuthorizationFlow}
                      disabled={isSubmitting}
                      className="group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform"></div>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 relative z-10 animate-spin" />
                          <span className="relative z-10">جاري الحفظ...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 ml-2 relative z-10 group-hover:scale-110 transition-transform" />
                          <span className="relative z-10">حفظ وإنهاء</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </Portal>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
      
      {/* AlertDialog Component */}
      <DialogComponent />

      {/* OTP Dialog */}
      <OTPDialog
        isOpen={showOTPDialog}
        onClose={() => setShowOTPDialog(false)}
        onSubmit={handleOTPSubmit}
        authorizationNumber={otpAuthNumber}
      />

      {/* Renew Confirmation Dialog */}
      <RenewConfirmDialog
        isOpen={showRenewDialog}
        onClose={() => {
          setShowRenewDialog(false);
          setRenewAuthData(null);
        }}
        onConfirm={confirmRenewAuthorization}
        vehicleName={renewAuthData?.vehicle || ''}
        authNumber={renewAuthData?.authNumber || ''}
      />

      {/* Cancel Authorization Dialog */}
      <CancelAuthorizationDialog
        isOpen={showCancelDialog}
        onClose={() => {
          setShowCancelDialog(false);
          setCancelAuthData(null);
        }}
        onConfirm={confirmCancelAuthorization}
        vehicleName={cancelAuthData?.vehicle || ''}
        authNumber={cancelAuthData?.authNumber || ''}
        startDate={cancelAuthData?.startDate || ''}
        endDate={cancelAuthData?.endDate || ''}
        isLoading={cancellingId === cancelAuthData?.id}
      />

      {/* TAMM Status Dialog */}
      {showTammDialog && (
        <Portal>
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 animate-fadeIn"
            onClick={closeTammDialog}
          >
            <div
              className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-slideUp"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-6 h-6" />
                  <h3 className="text-lg font-bold">حالة التفويض من نظام تم</h3>
                </div>
                <button
                  onClick={closeTammDialog}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {tammDialogLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                  </div>
                ) : tammDialogData ? (
                  <>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">حالة التفويض</p>
                      <p className="font-semibold text-gray-900">{statusToArabic(tammDialogData.authorizationStatus)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">السائق الحالي</p>
                      <p className="font-semibold text-gray-900">{tammDialogData.currentDriverName}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">السائق السابق</p>
                      <p className="font-semibold text-gray-900">{tammDialogData.lastDriverName}</p>
                    </div>
                  </>
                ) : null}
              </div>
              <div className="p-4 border-t bg-gray-50">
                <Button variant="primary" onClick={closeTammDialog} className="w-full">
                  إغلاق
                </Button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}