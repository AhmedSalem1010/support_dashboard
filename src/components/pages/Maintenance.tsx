'use client';

import { useState, useMemo, useEffect } from 'react';
import { Plus, Wrench, Car, Calendar, DollarSign, Upload, Search, Filter, Download, X, Eye, Edit, Trash2, TrendingUp, TrendingDown, CheckCircle, Clock, FileText, User, Shield, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { RepairTypeSelector, type RepairTypeItem } from '@/components/ui/RepairTypeSelector';
import { useVehiclesList } from '@/hooks/useVehiclesList';
import { MAINTENANCE_STATUS_LABELS, statusToArabic } from '@/lib/enums';

export function Maintenance() {
  const [showModal, setShowModal] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCostOn, setFilterCostOn] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [invoicePreview, setInvoicePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    vehicleId: '',
    type: '',
    date: '',
    costOn: '',
    amount: '0.00',
    driverId: '',
    supervisorId: '',
    description: '',
  });
  const [repairTypeSelections, setRepairTypeSelections] = useState<RepairTypeItem[]>([]);
  const [repairTypeImages, setRepairTypeImages] = useState<Record<string, string>>({});
  const [descriptionNotes, setDescriptionNotes] = useState('');

  // خيارات القوائم المنسدلة - المركبات من API
  const { vehicleOptions } = useVehiclesList();
  const maintenanceTypeOptions = [
    { value: 'oil', label: 'تغيير زيت' },
    { value: 'periodic', label: 'صيانة دورية' },
    { value: 'repair', label: 'إصلاح' },
    { value: 'accident', label: 'حادث مروري' },
  ];
  const costOnOptions = [
    { value: 'company', label: 'الشركة' },
    { value: 'vehicle', label: 'المركبة' },
    { value: 'driver', label: 'السائق' },
  ];
  const driverOptions = [
    { value: '1', label: 'محمد أحمد' },
    { value: '2', label: 'خالد سعيد' },
    { value: '3', label: 'عبدالله محمود' },
  ];
  const supervisorOptions = [
    { value: '1', label: 'أحمد علي' },
    { value: '2', label: 'خالد محمد' },
    { value: '3', label: 'سعيد محمود' },
  ];

  // أنواع الإصلاح (من الصور، بدون تكرار)
  const repairTypeOptions: RepairTypeItem[] = [
    { id: 'temp-sensor', label: 'حساس الحرارة' },
    { id: 'oxygen-sensor', label: 'حساس الأوكسجين' },
    { id: 'fuel-pump', label: 'طرمبة البنزين' },
    { id: 'windshield-wipers', label: 'مساحات الزجاج' },
    { id: 'mirror', label: 'مرايه' },
    { id: 'fans', label: 'المراوح' },
    { id: 'car-computer', label: 'كمبيوتر السيارة' },
    { id: 'hoses-pipes', label: 'الليات والخراطيم' },
    { id: 'filters', label: 'الصفايات' },
    { id: 'brake-fluid', label: 'زيت فرامل' },
    { id: 'radiator-water', label: 'ماء لديتر' },
    { id: 'polishing', label: 'تلميع ساطع' },
    { id: 'tire-balancing', label: 'ترصيص كفرات' },
    { id: 'bearings', label: 'الرمانات' },
    { id: 'axle-alignment', label: 'میزان اذرعه' },
    { id: 'hub-turning', label: 'خرط صرة' },
    { id: 'bodywork', label: 'سمكره' },
    { id: 'mechanics', label: 'مكانيك' },
    { id: 'tires', label: 'الكفرات' },
    { id: 'brakes', label: 'الفرامل (الفحمات)' },
    { id: 'clutch', label: 'كلتش' },
    { id: 'sticker', label: 'استيكر' },
    { id: 'electricity', label: 'كهرباء' },
    { id: 'glass', label: 'الزجاج' },
    { id: 'freon', label: 'فريون' },
    { id: 'ac-fan-dynamo', label: 'دينمو مروحه مكيف' },
    { id: 'ac-radiator', label: 'لديتر مكيف' },
    { id: 'ac-filters', label: 'فلاتر المكيف' },
    { id: 'diesel-filter', label: 'فلتر الديزل' },
    { id: 'air-filter', label: 'فلتر الهواء' },
    { id: 'battery', label: 'البطارية' },
    { id: 'wiper', label: 'المساحه' },
    { id: 'lights', label: 'اسطبات' },
    { id: 'gear', label: 'قير' },
    { id: 'u-joints', label: 'صليبات' },
    { id: 'periodic-inspection', label: 'الفحص الدوري' },
    { id: 'estimation', label: 'التقدير' },
    { id: 'front-rear-lights', label: 'الإنوار الأمامية والخلفية' },
    { id: 'shock-absorbers', label: 'المساعدات' },
    { id: 'control-arm-bushings', label: 'جلد المقصات' },
    { id: 'spark-plugs', label: 'البواجي' },
    { id: 'engine-belt', label: 'سير المكينة' },
    { id: 'water-pump', label: 'طرمبة الماء' },
    { id: 'axles', label: 'العكوس' },
    { id: 'brake-lines', label: 'ليات الفرامل' },
    { id: 'hydraulic-oil', label: 'زيت هيدروليك' },
    { id: 'wheel-pull', label: 'سحب عجل' },
    { id: 'passenger-seat', label: 'تثبيت كرسي راكب نص' },
    { id: 'engine-mounts', label: 'كراسي مكينه' },
    { id: 'exhaust-mounts', label: 'كراسي شكمان' },
    { id: 'lost-pedal-key', label: 'مفتاح بدال فاقد' },
    { id: 'tire-sensor-valve', label: 'بلف حساس كفر' },
    { id: 'car-wash', label: 'غسيل السيارات' },
    { id: 'inner-patch', label: 'رقعه داخليه' },
    { id: 'bus-floor-mats', label: 'فرشات أرضية الباص (ربل)' },
    { id: 'lining-installation', label: 'تركيب بطانه' },
    { id: 'seat-cover', label: 'تلبيسه كرسي' },
    { id: 'steering-cover', label: 'تلبيسه سكان' },
    { id: 'hubcap-set', label: 'طقم طاسات' },
    { id: 'remote-batteries', label: 'بطاريات ريموت' },
    { id: 'rear-cylinder', label: 'سلندر خلفي' },
    { id: 'brake-pads-install', label: 'تركيب بطاين' },
    { id: 'engine-sheets', label: 'صاجات مكينه' },
  ];

  const showRepairTypeField =
    formData.type === 'repair' || formData.type === 'periodic' || formData.type === 'accident';

  // مزامنة وصف الصيانة مع أنواع الإصلاح المختارة
  useEffect(() => {
    if (showRepairTypeField) {
      const typesText = repairTypeSelections.map((s) => s.label).join('، ');
      const fullDescription = typesText + (descriptionNotes ? '\n\n' + descriptionNotes : '');
      setFormData((prev) => ({ ...prev, description: fullDescription }));
    }
  }, [showRepairTypeField, repairTypeSelections, descriptionNotes]);

  const maintenanceRecords = [
    { 
      id: 1, 
      vehicle: 'ABC 1234',
      vehicleModel: 'تويوتا كامري',
      type: 'تغيير زيت', 
      date: '2024-01-10',
      time: '10:00 AM',
      driver: 'محمد أحمد',
      supervisor: 'أحمد علي',
      costOn: 'الشركة', 
      amount: 350,
      status: 'مكتمل',
      description: 'تغيير زيت المحرك والفلتر',
      hasInvoice: true,
    },
    { 
      id: 2, 
      vehicle: 'XYZ 5678',
      vehicleModel: 'هوندا أكورد',
      type: 'إصلاح', 
      date: '2024-01-12',
      time: '02:30 PM',
      driver: 'عبد الله سعيد',
      supervisor: 'خالد محمد',
      costOn: 'السائق', 
      amount: 1200,
      status: 'مكتمل',
      description: 'إصلاح نظام التبريد',
      hasInvoice: true,
    },
    { 
      id: 3, 
      vehicle: 'DEF 9012',
      vehicleModel: 'نيسان التيما',
      type: 'صيانة دورية', 
      date: '2024-01-15',
      time: '09:00 AM',
      driver: 'سعيد محمود',
      supervisor: 'أحمد علي',
      costOn: 'الشركة', 
      amount: 800,
      status: 'قيد التنفيذ',
      description: 'فحص شامل للمركبة',
      hasInvoice: false,
    },
    { 
      id: 4, 
      vehicle: 'GHI 3456',
      vehicleModel: 'فورد إكسبلورر',
      type: 'إطارات', 
      date: '2024-01-18',
      time: '11:30 AM',
      driver: 'أحمد عبدالله',
      supervisor: 'محمد سعيد',
      costOn: 'المركبة', 
      amount: 2400,
      status: 'مكتمل',
      description: 'تغيير الإطارات الأربعة',
      hasInvoice: true,
    },
  ];

  const commonTypes = [
    { label: 'تغيير زيت', count: 45, color: 'bg-[#09b9b5]', percent: 29 },
    { label: 'صيانة دورية', count: 32, color: 'bg-[#00a287]', percent: 20 },
    { label: 'إصلاحات', count: 28, color: 'bg-[#f57c00]', percent: 18 },
    { label: 'إطارات', count: 20, color: 'bg-purple-500', percent: 13 },
    { label: 'أخرى', count: 31, color: 'bg-[#617c96]', percent: 20 },
  ];
  const maxCount = Math.max(...commonTypes.map((t) => t.count));

  const monthlyData = [
    { month: 'يناير', amount: 40000 },
    { month: 'فبراير', amount: 65000 },
    { month: 'مارس', amount: 45000 },
    { month: 'أبريل', amount: 80000 },
    { month: 'مايو', amount: 55000 },
    { month: 'يونيو', amount: 70000 },
  ];
  const maxAmount = Math.max(...monthlyData.map(m => m.amount));

  // Filter maintenance records
  const filteredRecords = useMemo(() => {
    return maintenanceRecords.filter(record => {
      const matchesSearch = 
        record.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.driver.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === '' || record.type === filterType;
      const matchesStatus = filterStatus === '' || statusToArabic(record.status) === filterStatus;
      const matchesCostOn = filterCostOn === '' || record.costOn === filterCostOn;
      
      return matchesSearch && matchesType && matchesStatus && matchesCostOn;
    });
  }, [searchTerm, filterType, filterStatus, filterCostOn]);

  // Statistics
  const stats = {
    driverCost: maintenanceRecords.filter(r => r.costOn === 'السائق').reduce((sum, r) => sum + r.amount, 0),
    companyCost: maintenanceRecords.filter(r => r.costOn === 'الشركة').reduce((sum, r) => sum + r.amount, 0),
    inProgress: maintenanceRecords.filter(r => r.status === 'قيد التنفيذ').length,
    total: maintenanceRecords.length,
    vehicleCost: maintenanceRecords.filter(r => r.costOn === 'المركبة').reduce((sum, r) => sum + r.amount, 0),
  };

  const columns = [
    { 
      key: 'vehicle', 
      label: 'المركبة',
      render: (value: unknown, row: any) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-[#09b9b5]/10 to-[#09b9b5]/20 rounded-xl flex items-center justify-center border border-[#09b9b5]/20">
              <Car className="w-5 h-5 text-[#09b9b5]" />
            </div>
            {row.hasInvoice && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                <FileText className="w-3 h-3 text-green-600" />
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-gray-900">{String(value)}</p>
            <p className="text-xs text-gray-500">{row.vehicleModel}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'نوع الصيانة',
      render: (value: unknown, row: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <Wrench className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="text-sm font-semibold">{String(value)}</span>
          </div>
          <p className="text-xs text-gray-500 truncate max-w-[150px]">{row.description}</p>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'التاريخ',
      render: (value: unknown, row: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-sm">{String(value)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-500">{row.time}</span>
          </div>
        </div>
      ),
    },
    { 
      key: 'driver', 
      label: 'السائق والمشرف',
      render: (value: unknown, row: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-sm">{String(value)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-500">{row.supervisor}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'costOn',
      label: 'التكلفة',
      render: (value: unknown, row: any) => {
        const v = String(value);
        const variant = v === 'الشركة' ? 'info' : v === 'السائق' ? 'warning' : 'default';
        return (
          <div className="space-y-1">
            <Badge variant={variant}>{v}</Badge>
            <p className="text-sm font-bold text-gray-900">{row.amount.toLocaleString()} ر.س</p>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (value: unknown) => {
        const v = String(value);
        const displayStatus = statusToArabic(v);
        const variant = displayStatus === 'مكتمل' ? 'success' : displayStatus === 'قيد التنفيذ' || displayStatus === 'قيد الانتظار' ? 'warning' : 'default';
        const icon = displayStatus === 'مكتمل' ? CheckCircle : Clock;
        const Icon = icon;
        return (
          <Badge variant={variant} className="flex items-center gap-1.5 w-fit">
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
              setSelectedMaintenance(row);
            }}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
            title="عرض التفاصيل"
          >
            <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Edit logic
            }}
            className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
            title="تعديل"
          >
            <Edit className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Delete logic
            }}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
            title="حذف"
          >
            <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  const handleInvoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInvoiceFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setInvoicePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setInvoicePreview('');
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-[#09b9b5] to-[#0da9a5] rounded-xl shadow-lg">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">الصيانة</h1>
              <p className="text-sm text-[#617c96]">إدارة سجلات صيانة المركبات - {maintenanceRecords.length} سجل</p>
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
            {(filterType || filterStatus || filterCostOn) && (
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
              setInvoiceFile(null);
              setInvoicePreview('');
              setRepairTypeSelections([]);
              setRepairTypeImages({});
              setDescriptionNotes('');
            }} 
            className="text-sm group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            <Plus className="w-4 h-4 ml-1 sm:ml-2 relative z-10 group-hover:rotate-90 transition-transform" />
            <span className="hidden sm:inline relative z-10">إضافة سجل صيانة</span>
            <span className="sm:hidden relative z-10">إضافة</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards - Enhanced */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <Card className="border-r-4 border-[#d32f2f] hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#d32f2f] rounded-full animate-pulse"></span>
                تكلفة السائق
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                {stats.driverCost.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">ريال سعودي</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#d32f2f]/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-[#d32f2f] flex-shrink-0 relative z-10 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </Card>

        <Card className="border-r-4 border-[#00a287] hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#00a287] rounded-full animate-pulse"></span>
                تكلفة الشركة
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                {stats.companyCost.toLocaleString()}
              </p>
              <p className="text-xs text-green-600 mt-1 font-semibold flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                -8% عن الماضي
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#00a287]/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-[#00a287] flex-shrink-0 relative z-10 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </Card>

        <Card className="border-r-4 border-purple-500 hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                تكلفة المركبة
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                {stats.vehicleCost.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">ريال سعودي</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <Car className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500 flex-shrink-0 relative z-10 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </Card>

        <Card className="border-r-4 border-[#f57c00] hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#f57c00] rounded-full animate-pulse"></span>
                قيد التنفيذ
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                {stats.inProgress}
              </p>
              <p className="text-xs text-gray-500 mt-1">صيانة جارية</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#f57c00]/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-[#f57c00] flex-shrink-0 relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-all" />
            </div>
          </div>
        </Card>

        <Card className="border-r-4 border-[#09b9b5] hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#09b9b5] rounded-full animate-pulse"></span>
                إجمالي الصيانات
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                {stats.total}
              </p>
              <p className="text-xs text-gray-500 mt-1">هذا العام</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#09b9b5]/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <Wrench className="w-8 h-8 sm:w-10 sm:h-10 text-[#09b9b5] flex-shrink-0 relative z-10 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-t-4 border-[#09b9b5]">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن سجل صيانة بالمركبة، النوع، أو السائق..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#09b9b5] focus:border-transparent transition-all text-right"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 animate-slideDown">
              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">نوع الصيانة</label>
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
                >
                  <option value="">الكل</option>
                  <option value="تغيير زيت">تغيير زيت</option>
                  <option value="صيانة دورية">صيانة دورية</option>
                  <option value="إصلاح">إصلاح</option>
                  <option value="إطارات">إطارات</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">الحالة</label>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
                >
                  <option value="">الكل</option>
                  {Object.entries(MAINTENANCE_STATUS_LABELS).map(([val, label]) => (
                    <option key={val} value={label}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">التكلفة على</label>
                <select 
                  value={filterCostOn}
                  onChange={(e) => setFilterCostOn(e.target.value)}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
                >
                  <option value="">الكل</option>
                  <option value="الشركة">الشركة</option>
                  <option value="السائق">السائق</option>
                  <option value="المركبة">المركبة</option>
                </select>
              </div>

              {/* Reset Button */}
              {(filterType || filterStatus || filterCostOn) && (
                <div className="sm:col-span-3 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilterType('');
                      setFilterStatus('');
                      setFilterCostOn('');
                      setSearchTerm('');
                    }}
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
      {searchTerm && (
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
          <Search className="w-4 h-4 text-blue-600" />
          <span>تم العثور على <strong className="text-blue-600">{filteredRecords.length}</strong> نتيجة</span>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Costs Chart */}
        <Card className="border-t-4 border-[#09b9b5]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#09b9b5]" />
              التكاليف الشهرية
            </h3>
            <Badge variant="default">2024</Badge>
          </div>
          <div className="h-56 flex flex-col justify-end">
            <div className="flex-1 min-h-[120px] flex items-end justify-around gap-2 pb-10 pt-2">
              {monthlyData.map((item, index) => (
                <div 
                  key={item.month} 
                  className="flex flex-col items-center flex-1 group cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-xs font-semibold text-gray-700 mb-1 group-hover:text-[#09b9b5] transition-colors">
                    {(item.amount / 1000).toFixed(0)}k
                  </span>
                  <div 
                    className="w-full max-w-[48px] bg-gradient-to-t from-[#09b9b5] to-[#0da9a5] rounded-t group-hover:from-[#0da9a5] group-hover:to-[#09b9b5] transition-all duration-300 shadow-lg animate-fadeIn" 
                    style={{ 
                      height: `${(item.amount / maxAmount) * 100}%`,
                      minHeight: '12px'
                    }} 
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-around gap-1 text-xs text-gray-500 border-t pt-2 mt-1">
              {monthlyData.map((m) => (
                <span key={m.month} className="flex-1 text-center hover:text-gray-900 transition-colors cursor-pointer">
                  {m.month}
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Maintenance Types Chart */}
        <Card className="border-t-4 border-[#00a287]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#00a287]" />
              أنواع الصيانة الشائعة
            </h3>
          </div>
          <div className="space-y-4">
            {commonTypes.map((item, index) => (
              <div 
                key={item.label} 
                className="group cursor-pointer animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${item.color} group-hover:scale-125 transition-transform`} />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors w-32">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">{item.count}</span>
                    <span className="text-sm text-gray-500 w-12 text-left">{item.percent}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 ${item.color} rounded-full group-hover:opacity-80 transition-all duration-500`}
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Table/Grid View */}
      {viewMode === 'table' ? (
        <Card>
          <Table 
            columns={columns} 
            data={filteredRecords} 
            onRowClick={(row) => setSelectedMaintenance(row)} 
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map((record, index) => (
            <Card 
              key={record.id}
              className="group cursor-pointer hover:shadow-2xl transition-all duration-300 border-t-4 border-[#09b9b5] overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => setSelectedMaintenance(record)}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-br from-[#09b9b5]/10 via-[#09b9b5]/5 to-transparent p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white rounded-xl shadow-md">
                      <Wrench className="w-6 h-6 text-[#09b9b5]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{record.vehicle}</h3>
                      <p className="text-sm text-gray-600">{record.vehicleModel}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={(s => s === 'مكتمل' ? 'success' : s === 'قيد التنفيذ' || s === 'قيد الانتظار' ? 'warning' : 'default')(statusToArabic(record.status))}
                  >
                    {statusToArabic(record.status)}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Type */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Wrench className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-semibold">{record.type}</span>
                  </div>
                  {record.hasInvoice && (
                    <FileText className="w-4 h-4 text-green-600" />
                  )}
                </div>

                {/* Date & Time */}
                <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">التاريخ</span>
                    <span className="font-semibold">{record.date}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">الوقت</span>
                    <span className="font-semibold">{record.time}</span>
                  </div>
                </div>

                {/* Driver & Supervisor */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-600 truncate">{record.driver}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-600 truncate">{record.supervisor}</span>
                  </div>
                </div>

                {/* Cost */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <Badge 
                    variant={
                      record.costOn === 'الشركة' ? 'info' : 
                      record.costOn === 'السائق' ? 'warning' : 
                      'default'
                    }
                  >
                    {record.costOn}
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-[#09b9b5]" />
                    <span className="font-bold text-gray-900">{record.amount.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">ر.س</span>
                  </div>
                </div>

                {/* Actions */}
                <button className="w-full py-2 px-3 bg-[#09b9b5] hover:bg-[#0da9a5] text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  عرض التفاصيل
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Maintenance Details Modal */}
      {selectedMaintenance && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" 
          onClick={() => setSelectedMaintenance(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-[#09b9b5] to-[#0da9a5] p-6 text-white">
              <button
                onClick={() => setSelectedMaintenance(null)}
                className="absolute top-4 left-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Wrench className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">{selectedMaintenance.type}</h2>
                  <p className="text-white/90">{selectedMaintenance.vehicle} - {selectedMaintenance.vehicleModel}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={(s => s === 'مكتمل' ? 'success' : s === 'قيد التنفيذ' || s === 'قيد الانتظار' ? 'warning' : 'default')(statusToArabic(selectedMaintenance.status))} className="bg-white/20 border-white/30">
                      {statusToArabic(selectedMaintenance.status)}
                    </Badge>
                    <Badge variant="info" className="bg-white/20 border-white/30">
                      {selectedMaintenance.costOn}
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
                  <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">التاريخ</p>
                  <p className="text-sm font-bold text-gray-900">{selectedMaintenance.date}</p>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-100">
                  <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">الوقت</p>
                  <p className="text-sm font-bold text-gray-900">{selectedMaintenance.time}</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-100">
                  <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">التكلفة</p>
                  <p className="text-sm font-bold text-gray-900">{selectedMaintenance.amount.toLocaleString()} ر.س</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-100">
                  <FileText className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">الفاتورة</p>
                  <p className="text-sm font-bold text-gray-900">{selectedMaintenance.hasInvoice ? 'متوفرة' : 'غير متوفرة'}</p>
                </div>
              </div>

              {/* People */}
              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-[#09b9b5]" />
                  المسؤولون
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">السائق</p>
                    <p className="font-semibold text-gray-900">{selectedMaintenance.driver}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">المشرف</p>
                    <p className="font-semibold text-gray-900">{selectedMaintenance.supervisor}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  وصف الصيانة
                </h3>
                <p className="text-gray-700">{selectedMaintenance.description}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button variant="primary" className="flex-1 group">
                  <Edit className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                  تعديل السجل
                </Button>
                <Button variant="secondary" className="flex-1 group">
                  <FileText className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                  عرض الفاتورة
                </Button>
                <Button variant="outline" className="group">
                  <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Maintenance Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" 
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp" 
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
                    <h2 className="text-2xl font-bold">إضافة صيانة جديدة</h2>
                    <p className="text-white/80 text-sm mt-0.5">سجل بيانات الصيانة بدقة</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form 
              onSubmit={(e) => { 
                e.preventDefault(); 
                if (!formData.vehicleId || !formData.type || !formData.date || !formData.costOn || !formData.amount || !formData.description) return;
                setShowModal(false); 
              }} 
              className="p-6 space-y-5"
            >
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                  <Wrench className="w-5 h-5 text-[#09b9b5]" />
                  <h3 className="text-lg font-bold text-gray-900">معلومات الصيانة</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <SearchableSelect
                      label="المركبة"
                      required
                      placeholder="اختر المركبة"
                      options={vehicleOptions}
                      value={formData.vehicleId}
                      onChange={(val) => setFormData({ ...formData, vehicleId: val })}
                    />
                  </div>

                  <div>
                    <SearchableSelect
                      label="نوع الصيانة"
                      required
                      placeholder="اختر النوع"
                      options={maintenanceTypeOptions}
                      value={formData.type}
                      onChange={(val) => {
                        const isRepairType = val === 'repair' || val === 'periodic' || val === 'accident';
                        setFormData((prev) => ({
                          ...prev,
                          type: val,
                          description: isRepairType ? prev.description : '',
                        }));
                        if (!isRepairType) {
                          setRepairTypeSelections([]);
                          setRepairTypeImages({});
                          setDescriptionNotes('');
                        }
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تاريخ الصيانة <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="date" 
                        value={formData.date} 
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
                        required 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]" 
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <SearchableSelect
                      label="التكلفة على"
                      required
                      placeholder="اختر"
                      options={costOnOptions}
                      value={formData.costOn}
                      onChange={(val) => setFormData({ ...formData, costOn: val })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      المبلغ (ريال) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        value={formData.amount} 
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })} 
                        required 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]" 
                        placeholder="0.00" 
                      />
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <SearchableSelect
                      label="السائق المفوض"
                      placeholder="اختر السائق"
                      options={driverOptions}
                      value={formData.driverId}
                      onChange={(val) => setFormData({ ...formData, driverId: val })}
                    />
                  </div>
                </div>

                <div>
                  <SearchableSelect
                    label="المشرف المستلم"
                    placeholder="اختر المشرف"
                    options={supervisorOptions}
                    value={formData.supervisorId}
                    onChange={(val) => setFormData({ ...formData, supervisorId: val })}
                  />
                </div>
              </div>

              {/* نوع الإصلاح - يظهر عند اختيار إصلاح أو صيانة دورية أو حادث مروري */}
              {showRepairTypeField && (
                <div className="pt-4 border-t border-gray-200">
                  <RepairTypeSelector
                    options={repairTypeOptions}
                    selectedItems={repairTypeSelections}
                    selectedImages={repairTypeImages}
                    onChange={(items, images) => {
                      setRepairTypeSelections(items);
                      setRepairTypeImages(images);
                    }}
                  />
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  وصف الصيانة أو القطع أو ملاحظات <span className="text-red-500">*</span>
                </label>
                {showRepairTypeField ? (
                  <>
                    <div className="mb-2 p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[80px] text-sm text-gray-700 whitespace-pre-wrap">
                      {repairTypeSelections.length > 0 ? (
                        repairTypeSelections.map((s) => s.label).join('، ')
                      ) : (
                        <span className="text-gray-400">اختر أنواع الإصلاح أعلاه لإضافتها تلقائياً</span>
                      )}
                    </div>
                    <textarea
                      value={descriptionNotes}
                      onChange={(e) => setDescriptionNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]"
                      placeholder="أضف ملاحظات إضافية إن وجدت..."
                      dir="rtl"
                    />
                  </>
                ) : (
                  <textarea 
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    rows={4} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]" 
                    placeholder="اكتب تفاصيل الصيانة أو القطع أو الملاحظات..." 
                    dir="rtl"
                  />
                )}
              </div>

              {/* Invoice Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-gray-500" />
                  صورة الفاتورة
                </label>
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gradient-to-br from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all group">
                  <input 
                    type="file" 
                    accept=".png,.jpg,.jpeg,.pdf" 
                    className="hidden" 
                    onChange={handleInvoiceUpload} 
                  />
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-2 text-gray-400 group-hover:scale-110 transition-transform" />
                    <p className="mb-1 text-sm text-gray-600">اضغط لرفع الفاتورة أو اسحبها هنا</p>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF حتى 10MB</p>
                    {invoiceFile && (
                      <p className="mt-2 text-sm text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {invoiceFile.name}
                      </p>
                    )}
                  </div>
                </label>

                {/* Preview */}
                {invoicePreview && (
                  <div className="mt-4 relative">
                    <img 
                      src={invoicePreview} 
                      alt="Invoice preview" 
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setInvoiceFile(null);
                        setInvoicePreview('');
                      }}
                      className="absolute top-2 left-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t-2 border-gray-200 sticky bottom-0 bg-white pb-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowModal(false)}
                  className="group"
                >
                  <X className="w-4 h-4 ml-2 group-hover:rotate-90 transition-transform" />
                  إلغاء
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  className="group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform"></div>
                  <CheckCircle className="w-4 h-4 ml-2 relative z-10 group-hover:scale-110 transition-transform" />
                  <span className="relative z-10">حفظ السجل</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
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
    </div>
  );
}
