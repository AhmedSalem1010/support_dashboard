'use client';

import { useState, useMemo } from 'react';
import { Plus, AlertTriangle, Car, Calendar, User, Search, Filter, Download, X, Eye, Edit, MapPin, Clock, FileText, Image as ImageIcon, Trash2, TrendingDown, TrendingUp, Activity } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { useVehiclesList } from '@/hooks/useVehiclesList';
import { useLastAuthorizationData } from '@/hooks/useLastAuthorizationData';
import { VehicleDriverSummary } from '@/components/ui/VehicleDriverSummary';
import { ACCIDENT_STATUS_LABELS, ACCIDENT_SEVERITY_LABELS, statusToArabic } from '@/lib/enums';
import { Portal } from '@/components/ui/Portal';

export function Accidents() {
  const { vehicleOptions } = useVehiclesList();
  const [showModal, setShowModal] = useState(false);
  const [selectedAccident, setSelectedAccident] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [accidentImages, setAccidentImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    accidentNumber: '',
    vehicleId: '',
    driverId: '',
    date: '',
    location: '',
    severity: '',
    details: '',
    estimatedCost: '',
    injuries: 'none',
  });
  const selectedPlateName = vehicleOptions.find((o) => o.value === formData.vehicleId)?.plateName ?? null;
  const lastAuth = useLastAuthorizationData(selectedPlateName);

  const accidents = [
    { 
      id: 1, 
      accidentNumber: 'ACC-2024-001', 
      vehicle: 'ABC 1234',
      vehicleModel: 'تويوتا كامري', 
      driver: 'محمد أحمد', 
      date: '2024-01-08',
      time: '10:30 AM',
      location: 'طريق الملك فهد - الرياض',
      severity: 'بسيط', 
      status: 'مغلق',
      estimatedCost: 5000,
      images: 3,
      injuries: 'لا يوجد',
    },
    { 
      id: 2, 
      accidentNumber: 'ACC-2024-002', 
      vehicle: 'XYZ 5678',
      vehicleModel: 'هوندا أكورد',
      driver: 'عبدالله سعيد', 
      date: '2024-01-12',
      time: '02:15 PM',
      location: 'طريق الخرج - الرياض',
      severity: 'متوسط', 
      status: 'قيد المتابعة',
      estimatedCost: 15000,
      images: 5,
      injuries: 'إصابات بسيطة',
    },
    { 
      id: 3, 
      accidentNumber: 'ACC-2024-003', 
      vehicle: 'DEF 9012',
      vehicleModel: 'نيسان التيما',
      driver: 'سعيد محمود', 
      date: '2024-01-20',
      time: '08:45 AM',
      location: 'طريق المطار - الرياض',
      severity: 'بسيط', 
      status: 'مغلق',
      estimatedCost: 3500,
      images: 2,
      injuries: 'لا يوجد',
    },
    { 
      id: 4, 
      accidentNumber: 'ACC-2024-004', 
      vehicle: 'GHI 3456',
      vehicleModel: 'فورد إكسبلورر',
      driver: 'أحمد عبدالله', 
      date: '2024-02-01',
      time: '05:20 PM',
      location: 'طريق الدمام - الخبر',
      severity: 'خطير', 
      status: 'قيد المتابعة',
      estimatedCost: 45000,
      images: 8,
      injuries: 'إصابات متوسطة',
    },
  ];

  const monthData = [
    { month: 'يناير', count: 3 },
    { month: 'فبراير', count: 1 },
    { month: 'مارس', count: 2 },
    { month: 'أبريل', count: 1 },
    { month: 'مايو', count: 1 },
    { month: 'يونيو', count: 5 },
  ];
  const maxCount = Math.max(...monthData.map((m) => m.count));

  const severityDistribution = [
    { label: 'بسيطة', count: 7, percent: 58, color: 'bg-[#00a287]' },
    { label: 'متوسطة', count: 4, percent: 33, color: 'bg-[#f57c00]' },
    { label: 'خطيرة', count: 1, percent: 9, color: 'bg-[#d32f2f]' },
  ];

  // Filter accidents
  const filteredAccidents = useMemo(() => {
    return accidents.filter(accident => {
      const matchesSearch = 
        accident.accidentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        accident.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        accident.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
        accident.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSeverity = filterSeverity === '' || accident.severity === filterSeverity;
      const matchesStatus = filterStatus === '' || statusToArabic(accident.status) === filterStatus;
      
      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [searchTerm, filterSeverity, filterStatus]);

  // Statistics
  const stats = {
    total: accidents.length,
    thisMonth: accidents.filter(a => new Date(a.date).getMonth() === new Date().getMonth()).length,
    inProgress: accidents.filter(a => a.status === 'قيد المتابعة').length,
    closed: accidents.filter(a => a.status === 'مغلق').length,
    totalCost: accidents.reduce((sum, a) => sum + a.estimatedCost, 0),
  };

  const columns = [
    {
      key: 'accidentNumber',
      label: 'رقم الحادث',
      render: (value: unknown, row: any) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500/10 to-red-500/20 rounded-xl flex items-center justify-center border border-red-500/20">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
              <span className="text-[10px] font-bold text-red-600">{row.images}</span>
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
      label: 'المركبة والسائق',
      render: (value: unknown, row: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <Car className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="text-sm font-semibold">{String(value)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-50 rounded-lg">
              <User className="w-3.5 h-3.5 text-green-600" />
            </div>
            <span className="text-xs text-gray-500">{row.driver}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'التاريخ والموقع',
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
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-500 truncate max-w-[150px]">{row.location}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'severity',
      label: 'الخطورة',
      render: (value: unknown, row: any) => {
        const v = String(value);
        const config = {
          'بسيط': { variant: 'success' as const, icon: Activity },
          'متوسط': { variant: 'warning' as const, icon: AlertTriangle },
          'خطير': { variant: 'danger' as const, icon: AlertTriangle },
        };
        const { variant, icon: Icon } = config[v as keyof typeof config] || config['بسيط'];
        return (
          <div className="space-y-1">
            <Badge variant={variant} className="flex items-center gap-1.5 w-fit">
              <Icon className="w-3.5 h-3.5" />
              {v}
            </Badge>
            <p className="text-xs text-gray-500">{row.estimatedCost.toLocaleString()} ر.س</p>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (value: unknown, row: any) => {
        const v = String(value);
        const displayStatus = statusToArabic(v);
        const variant = displayStatus === 'مغلق' ? 'default' as const : 'info' as const;
        return (
          <div className="space-y-1">
            <Badge variant={variant}>{displayStatus}</Badge>
            <p className="text-xs text-gray-500">{row.injuries}</p>
          </div>
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
              setSelectedAccident(row);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAccidentImages((prev) => [...prev, ...files]);
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setAccidentImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">الحوادث</h1>
              <p className="text-sm text-[#617c96]">تسجيل ومتابعة حوادث المركبات - {accidents.length} حادث</p>
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
                  ? 'bg-white shadow-sm text-red-600 font-semibold' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              جدول
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                viewMode === 'grid' 
                  ? 'bg-white shadow-sm text-red-600 font-semibold' 
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
            {(filterSeverity || filterStatus) && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full"></span>
            )}
          </Button>
          
          <Button variant="secondary" className="text-sm group">
            <Download className="w-4 h-4 ml-1 sm:ml-2 group-hover:translate-y-0.5 transition-transform" />
            <span className="hidden xs:inline">تصدير</span>
          </Button>
          
          <Button 
            variant="danger" 
            onClick={() => {
              setShowModal(true);
              setAccidentImages([]);
              setImagePreviews([]);
            }} 
            className="text-sm group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            <Plus className="w-4 h-4 ml-1 sm:ml-2 relative z-10 group-hover:rotate-90 transition-transform" />
            <span className="hidden sm:inline relative z-10">تسجيل حادث</span>
            <span className="sm:hidden relative z-10">تسجيل</span>
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
                إجمالي الحوادث
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                {stats.total}
              </p>
              <p className="text-xs text-gray-500 mt-1">هذا العام</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#d32f2f]/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <div className="w-10 h-10 bg-[#ffebee] rounded-xl flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-5 h-5 text-[#d32f2f]" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-r-4 border-[#f57c00] hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#f57c00] rounded-full animate-pulse"></span>
                هذا الشهر
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                {stats.thisMonth}
              </p>
              <p className="text-xs text-green-600 mt-1 font-semibold flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                -15% عن السابق
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#f57c00]/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <div className="w-10 h-10 bg-[#fff3e0] rounded-xl flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5 text-[#f57c00]" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-r-4 border-[#1976d2] hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#1976d2] rounded-full animate-pulse"></span>
                قيد المتابعة
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                {stats.inProgress}
              </p>
              <p className="text-xs text-gray-500 mt-1">نشط</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#1976d2]/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <div className="w-10 h-10 bg-[#e3f2fd] rounded-xl flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5 text-[#1976d2]" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-r-4 border-[#00a287] hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#00a287] rounded-full animate-pulse"></span>
                مغلقة
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                {stats.closed}
              </p>
              <p className="text-xs text-gray-500 mt-1">مكتملة</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#00a287]/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <div className="w-10 h-10 bg-[#effefa] rounded-xl flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5 text-[#00a287]" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-r-4 border-purple-500 hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                التكلفة الإجمالية
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                {stats.totalCost.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">ريال سعودي</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-t-4 border-red-600">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن حادث برقم الحادث، المركبة، السائق، أو الموقع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-right"
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
                <label className="block text-sm font-medium text-[#4d647c] mb-2">مستوى الخطورة</label>
                <select 
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 bg-white"
                >
                  <option value="">الكل</option>
                  {Object.entries(ACCIDENT_SEVERITY_LABELS).map(([val, label]) => (
                    <option key={val} value={label}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">الحالة</label>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 bg-white"
                >
                  <option value="">الكل</option>
                  {Object.entries(ACCIDENT_STATUS_LABELS).map(([val, label]) => (
                    <option key={val} value={label}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">الفترة الزمنية</label>
                <select className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 bg-white">
                  <option value="">الكل</option>
                  <option value="today">اليوم</option>
                  <option value="week">هذا الأسبوع</option>
                  <option value="month">هذا الشهر</option>
                  <option value="year">هذا العام</option>
                </select>
              </div>

              {/* Reset Button */}
              {(filterSeverity || filterStatus) && (
                <div className="sm:col-span-3 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilterSeverity('');
                      setFilterStatus('');
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
          <span>تم العثور على <strong className="text-blue-600">{filteredAccidents.length}</strong> نتيجة</span>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-t-4 border-red-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-600" />
              الحوادث على مدار العام
            </h3>
            <Badge variant="default">2024</Badge>
          </div>
          <div className="h-56 flex flex-col justify-end">
            <div className="flex-1 min-h-[100px] flex items-end justify-around gap-2 pb-10 pt-2">
              {monthData.map((item, index) => (
                <div 
                  key={item.month} 
                  className="flex flex-col items-center flex-1 group cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-xs font-semibold text-gray-700 mb-1 group-hover:text-red-600 transition-colors">
                    {item.count}
                  </span>
                  <div 
                    className="w-full max-w-[36px] bg-gradient-to-t from-red-600 to-red-400 rounded-t group-hover:from-red-700 group-hover:to-red-500 transition-all duration-300 shadow-lg animate-fadeIn" 
                    style={{ 
                      height: `${(item.count / maxCount) * 100}%`, 
                      minHeight: item.count ? '12px' : '0' 
                    }} 
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-around gap-1 text-xs text-gray-500 border-t pt-2 mt-1">
              {monthData.map((m) => (
                <span key={m.month} className="flex-1 text-center hover:text-gray-900 transition-colors cursor-pointer">
                  {m.month}
                </span>
              ))}
            </div>
          </div>
        </Card>

        <Card className="border-t-4 border-orange-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              توزيع الحوادث حسب الخطورة
            </h3>
          </div>
          <div className="space-y-4">
            {severityDistribution.map((item, index) => (
              <div 
                key={item.label} 
                className="group cursor-pointer animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${item.color} group-hover:scale-125 transition-transform`} />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">{item.count} حادث</span>
                    <span className="text-sm text-gray-500">({item.percent}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 ${item.color} rounded-full group-hover:opacity-80 transition-all duration-500`}
                    style={{ width: `${item.percent}%` }}
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
            data={filteredAccidents} 
            onRowClick={(row) => setSelectedAccident(row)} 
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAccidents.map((accident, index) => (
            <Card 
              key={accident.id}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-t-4 border-red-600 overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => setSelectedAccident(accident)}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white rounded-xl shadow-md">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{accident.accidentNumber}</h3>
                      <p className="text-sm text-gray-600">{accident.vehicleModel}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      accident.severity === 'بسيط' ? 'success' : 
                      accident.severity === 'متوسط' ? 'warning' : 
                      'danger'
                    }
                  >
                    {accident.severity}
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
                      <p className="font-semibold text-gray-900">{accident.vehicle}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <User className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">السائق</p>
                      <p className="font-semibold text-gray-900 truncate">{accident.driver}</p>
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">التاريخ</span>
                    <span className="font-semibold">{accident.date}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">الوقت</span>
                    <span className="font-semibold">{accident.time}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600 line-clamp-2">{accident.location}</p>
                </div>

                {/* Cost & Images */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-sm">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span className="font-bold text-gray-900">{accident.estimatedCost.toLocaleString()}</span>
                    <span className="text-gray-500">ر.س</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <ImageIcon className="w-4 h-4" />
                    <span>{accident.images} صور</span>
                  </div>
                </div>

                {/* Status */}
                <Badge 
                  variant={statusToArabic(accident.status) === 'مغلق' ? 'default' : 'info'}
                  className="w-full justify-center"
                >
                  {statusToArabic(accident.status)}
                </Badge>

                {/* Actions */}
                <button className="w-full py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  عرض التفاصيل
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Accident Details Modal */}
      {selectedAccident && (
        <Portal>
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 animate-fadeIn" 
          onClick={() => setSelectedAccident(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-lg max-w-4xl w-full max-h-[85vh] overflow-y-auto animate-slideUp" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
              <button
                onClick={() => setSelectedAccident(null)}
                className="absolute top-4 left-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">{selectedAccident.accidentNumber}</h2>
                  <p className="text-white/90">{selectedAccident.vehicleModel}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge 
                      variant={
                        (s => s === 'بسيط' ? 'success' : s === 'متوسط' ? 'warning' : 'danger')(
                          statusToArabic(selectedAccident.severity)
                        )
                      }
                      className="bg-white/20 border-white/30"
                    >
                      {statusToArabic(selectedAccident.severity)}
                    </Badge>
                    <Badge variant="info" className="bg-white/20 border-white/30">
                      {statusToArabic(selectedAccident.status)}
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
                  <p className="text-sm font-bold text-gray-900">{selectedAccident.vehicle}</p>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-100">
                  <User className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">السائق</p>
                  <p className="text-sm font-bold text-gray-900">{selectedAccident.driver}</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-100">
                  <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">التكلفة</p>
                  <p className="text-sm font-bold text-gray-900">{selectedAccident.estimatedCost.toLocaleString()} ر.س</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-100">
                  <ImageIcon className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">الصور</p>
                  <p className="text-lg font-bold text-gray-900">{selectedAccident.images}</p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-red-600" />
                  التاريخ والوقت
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">التاريخ</p>
                    <p className="font-semibold text-gray-900">{selectedAccident.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">الوقت</p>
                    <p className="font-semibold text-gray-900">{selectedAccident.time}</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  موقع الحادث
                </h3>
                <p className="text-gray-700">{selectedAccident.location}</p>
              </div>

              {/* Injuries */}
              <div className="p-4 bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl border border-red-200">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  الإصابات
                </h3>
                <p className="text-gray-700">{selectedAccident.injuries}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button variant="danger" className="flex-1 group">
                  <Edit className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                  تعديل الحادث
                </Button>
                <Button variant="secondary" className="flex-1 group">
                  <FileText className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                  إنشاء تقرير
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

      {/* Add Accident Modal */}
      {showModal && (
        <Portal>
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 animate-fadeIn" 
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-lg max-w-3xl w-full max-h-[85vh] overflow-y-auto animate-slideUp" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-red-600 to-red-700 p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">تسجيل حادث جديد</h2>
                    <p className="text-white/80 text-sm mt-0.5">أدخل تفاصيل الحادث بدقة</p>
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
                setShowModal(false); 
              }} 
              className="p-6 space-y-5"
            >
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-bold text-gray-900">معلومات الحادث</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      رقم الحادث <span className="text-[#d32f2f]">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={formData.accidentNumber} 
                      onChange={(e) => setFormData({ ...formData, accidentNumber: e.target.value })} 
                      placeholder="ACC-2024-XXX" 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      المركبة <span className="text-[#d32f2f]">*</span>
                    </label>
                    <select 
                      value={formData.vehicleId} 
                      onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })} 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">اختر المركبة</option>
                      {vehicleOptions.map((v) => (
                        <option key={v.value} value={v.value}>{v.label}</option>
                      ))}
                    </select>
                    <div className="mt-2">
                      <VehicleDriverSummary
                        data={lastAuth.data}
                        isLoading={lastAuth.isLoading}
                        error={lastAuth.error}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      السائق <span className="text-[#d32f2f]">*</span>
                    </label>
                    <select 
                      value={formData.driverId} 
                      onChange={(e) => setFormData({ ...formData, driverId: e.target.value })} 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">اختر السائق</option>
                      <option value="1">محمد أحمد</option>
                      <option value="2">عبدالله سعيد</option>
                      <option value="3">سعيد محمود</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تاريخ الحادث <span className="text-[#d32f2f]">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="date" 
                        value={formData.date} 
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
                        required 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الموقع <span className="text-[#d32f2f]">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={formData.location} 
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                      placeholder="طريق الملك فهد - الرياض" 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      مستوى الخطورة <span className="text-[#d32f2f]">*</span>
                    </label>
                    <select 
                      value={formData.severity} 
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value })} 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">اختر المستوى</option>
                      {Object.entries(ACCIDENT_SEVERITY_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      التكلفة التقديرية
                    </label>
                    <input 
                      type="number" 
                      value={formData.estimatedCost} 
                      onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })} 
                      placeholder="5000" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الإصابات
                    </label>
                    <select 
                      value={formData.injuries} 
                      onChange={(e) => setFormData({ ...formData, injuries: e.target.value })} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="none">لا يوجد</option>
                      <option value="minor">إصابات بسيطة</option>
                      <option value="moderate">إصابات متوسطة</option>
                      <option value="severe">إصابات خطيرة</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  تفاصيل الحادث <span className="text-[#d32f2f]">*</span>
                </label>
                <textarea 
                  value={formData.details} 
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })} 
                  rows={4} 
                  required 
                  placeholder="اكتب تفاصيل الحادث بشكل دقيق...." 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-y"
                />
              </div>

              {/* Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-gray-500" />
                  صور الحادث
                </label>
                
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gradient-to-br from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all group">
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    className="hidden" 
                    onChange={handleImageUpload} 
                  />
                  <div className="flex flex-col items-center justify-center pt-4 pb-4">
                    <ImageIcon className="w-10 h-10 text-gray-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm text-gray-600">اضغط لرفع الصور أو اسحبها هنا</p>
                    <p className="text-xs text-gray-500 mt-0.5">PNG, JPG حتى 10MB</p>
                    {accidentImages.length > 0 && (
                      <p className="mt-2 text-sm text-green-600 font-medium flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {accidentImages.length} صورة محددة
                      </p>
                    )}
                  </div>
                </label>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
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
                  variant="danger"
                  className="group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform"></div>
                  <AlertTriangle className="w-4 h-4 ml-2 relative z-10 group-hover:scale-110 transition-transform" />
                  <span className="relative z-10">تسجيل الحادث</span>
                </Button>
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
    </div>
  );
}