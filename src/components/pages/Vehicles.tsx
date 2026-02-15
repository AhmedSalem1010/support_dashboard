'use client';

import { useState, useMemo } from 'react';
import { Plus, Filter, Download, Car, Calendar, Shield, CheckCircle, Search, X, Edit, Trash2, Eye, FileText, AlertCircle, TrendingUp, Fuel, Settings, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';

export function Vehicles() {
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterInsurance, setFilterInsurance] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [formData, setFormData] = useState({
    plateNumber: '',
    plateName: '',
    serialNumber: '',
    vin: '',
    manufacturer: '',
    paletText1: '',
    paletText2: '',
    paletText3: '',
    model: '',
    year: new Date().getFullYear(),
    type: '',
    insuranceStatus: 'active',
    insuranceExpiry: '',
    registrationExpiry: '',
    inspectionExpiry: '',
    status: 'available',
    color: '',
    fuelType: '',
    odometerReading: 0,
    notes: '',
  });

  const vehicles = [
    {
      id: 1,
      plateNumber: 'ABC 1234',
      vin: '1HGBH41JXMN109186',
      manufacturer: 'تويوتا',
      model: 'كامري',
      year: 2022,
      type: 'سيدان',
      insuranceStatus: 'ساري',
      insuranceExpiry: '2024-12-31',
      registrationExpiry: '2024-11-15',
      inspectionExpiry: '2024-10-20',
      status: 'متاح',
      color: 'أبيض',
      fuelType: 'بنزين',
      odometerReading: 45000,
      image: '🚗',
    },
    {
      id: 2,
      plateNumber: 'XYZ 5678',
      vin: '2HGBH41JXMN109187',
      manufacturer: 'هوندا',
      model: 'أكورد',
      year: 2023,
      type: 'سيدان',
      insuranceStatus: 'قارب على الانتهاء',
      insuranceExpiry: '2024-02-10',
      registrationExpiry: '2024-08-15',
      inspectionExpiry: '2024-07-20',
      status: 'مفوض',
      color: 'فضي',
      fuelType: 'بنزين',
      odometerReading: 32000,
      image: '🚙',
    },
    {
      id: 3,
      plateNumber: 'DEF 9012',
      vin: '3HGBH41JXMN109188',
      manufacturer: 'نيسان',
      model: 'التيما',
      year: 2021,
      type: 'سيدان',
      insuranceStatus: 'ساري',
      insuranceExpiry: '2024-09-30',
      registrationExpiry: '2024-12-15',
      inspectionExpiry: '2024-11-20',
      status: 'صيانة',
      color: 'أسود',
      fuelType: 'هجين',
      odometerReading: 67000,
      image: '🚘',
    },
  ];

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      const matchesSearch = 
        vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === '' || vehicle.status === filterStatus;
      const matchesInsurance = filterInsurance === '' || vehicle.insuranceStatus === filterInsurance;
      
      return matchesSearch && matchesStatus && matchesInsurance;
    });
  }, [searchTerm, filterStatus, filterInsurance]);

  // Statistics
  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'متاح').length,
    maintenance: vehicles.filter(v => v.status === 'صيانة').length,
    expired: vehicles.filter(v => v.insuranceStatus === 'قارب على الانتهاء').length,
  };

  const columns = [
    {
      key: 'plateNumber',
      label: 'رقم اللوحة',
      render: (value: unknown, row: any) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-[#09b9b5]/10 to-[#09b9b5]/20 rounded-xl flex items-center justify-center border border-[#09b9b5]/20">
              <span className="text-2xl">{row.image}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
              <Car className="w-3 h-3 text-[#09b9b5]" />
            </div>
          </div>
          <div>
            <p className="font-bold text-gray-900">{String(value)}</p>
            <p className="text-xs text-gray-500">{row.vin}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'manufacturer',
      label: 'المركبة',
      render: (value: unknown, row: any) => (
        <div>
          <p className="font-semibold text-gray-900">{String(value)}</p>
          <p className="text-sm text-gray-500">{row.model} - {row.year}</p>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'التفاصيل',
      render: (value: unknown, row: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-700">{String(value)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">{row.fuelType}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'odometerReading',
      label: 'العداد',
      render: (value: unknown) => (
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-[#09b9b5]" />
          <span className="font-mono text-sm">{Number(value).toLocaleString()} كم</span>
        </div>
      ),
    },
    {
      key: 'insuranceStatus',
      label: 'حالة التأمين',
      render: (value: unknown, row: any) => {
        const v = String(value);
        const daysUntilExpiry = Math.floor((new Date(row.insuranceExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return (
          <div className="space-y-1">
            <Badge variant={v === 'ساري' ? 'success' : 'warning'}>{v}</Badge>
            {daysUntilExpiry > 0 && (
              <p className="text-xs text-gray-500">{daysUntilExpiry} يوم متبقي</p>
            )}
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (value: unknown) => {
        const v = String(value);
        const variant = v === 'متاح' ? 'success' : v === 'مفوض' ? 'info' : 'warning';
        const icon = v === 'متاح' ? CheckCircle : v === 'مفوض' ? FileText : Settings;
        const Icon = icon;
        return (
          <span className="flex items-center gap-1.5">
            <Badge variant={variant}>
              <Icon className="w-3.5 h-3.5" />
              {v}
            </Badge>
          </span>
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
              setSelectedVehicle(row);
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

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-[#09b9b5] to-[#0da9a5] rounded-xl shadow-lg">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">إدارة المركبات</h1>
              <p className="text-sm text-[#617c96]">عرض وإدارة {vehicles.length} مركبة في الأسطول</p>
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
            {(filterStatus || filterInsurance) && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#09b9b5] rounded-full"></span>
            )}
          </Button>
          
          <Button variant="secondary" className="text-sm group">
            <Download className="w-4 h-4 ml-1 sm:ml-2 group-hover:translate-y-0.5 transition-transform" />
            <span className="hidden xs:inline">تصدير</span>
          </Button>
          
          <Button 
            variant="primary" 
            onClick={() => setShowModal(true)} 
            className="text-sm group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            <Plus className="w-4 h-4 ml-1 sm:ml-2 relative z-10 group-hover:rotate-90 transition-transform" />
            <span className="hidden sm:inline relative z-10">إضافة مركبة</span>
            <span className="sm:hidden relative z-10">إضافة</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards - Enhanced */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-r-4 border-[#09b9b5] hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#09b9b5] rounded-full animate-pulse"></span>
                إجمالي المركبات
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                {stats.total}
              </p>
              <p className="text-xs text-gray-500 mt-1">+3 هذا الشهر</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#09b9b5]/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <Car className="w-8 h-8 sm:w-10 sm:h-10 text-[#09b9b5] flex-shrink-0 relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-all" />
            </div>
          </div>
        </Card>

        <Card className="border-r-4 border-[#00a287] hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#00a287] rounded-full animate-pulse"></span>
                المتاحة
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                {stats.available}
              </p>
              <p className="text-xs text-green-600 mt-1 font-semibold">
                {Math.round((stats.available / stats.total) * 100)}% من الأسطول
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#00a287]/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-[#00a287] flex-shrink-0 relative z-10 group-hover:scale-110 transition-all" />
            </div>
          </div>
        </Card>

        <Card className="border-r-4 border-[#f57c00] hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#f57c00] rounded-full animate-pulse"></span>
                قيد الصيانة
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                {stats.maintenance}
              </p>
              <p className="text-xs text-orange-600 mt-1 font-semibold">متوسط 3 أيام</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#f57c00]/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <Settings className="w-8 h-8 sm:w-10 sm:h-10 text-[#f57c00] flex-shrink-0 relative z-10 group-hover:scale-110 group-hover:rotate-45 transition-all" />
            </div>
          </div>
        </Card>

        <Card className="border-r-4 border-[#d32f2f] hover:shadow-xl transition-all duration-300 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#d32f2f] rounded-full animate-pulse"></span>
                تنبيهات
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                {stats.expired}
              </p>
              <p className="text-xs text-red-600 mt-1 font-semibold">تحتاج تجديد</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#d32f2f]/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-[#d32f2f] flex-shrink-0 relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-all" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters Bar */}
      <Card className="border-t-4 border-[#09b9b5]">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن مركبة برقم اللوحة، الشركة المصنعة، أو الموديل..."
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

          {/* Quick Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 animate-slideDown">
              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">الشركة المصنعة</label>
                <select className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white">
                  <option value="">الكل</option>
                  <option value="toyota">تويوتا</option>
                  <option value="honda">هوندا</option>
                  <option value="nissan">نيسان</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">حالة التأمين</label>
                <select 
                  value={filterInsurance}
                  onChange={(e) => setFilterInsurance(e.target.value)}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white"
                >
                  <option value="">الكل</option>
                  <option value="ساري">ساري</option>
                  <option value="قارب على الانتهاء">قارب على الانتهاء</option>
                  <option value="منتهي">منتهي</option>
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
                  <option value="متاح">متاح</option>
                  <option value="مفوض">مفوض</option>
                  <option value="صيانة">صيانة</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4d647c] mb-2">نوع الوقود</label>
                <select className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all duration-200 bg-white">
                  <option value="">الكل</option>
                  <option value="بنزين">بنزين</option>
                  <option value="ديزل">ديزل</option>
                  <option value="هجين">هجين</option>
                  <option value="كهربائي">كهربائي</option>
                </select>
              </div>

              {/* Reset Button */}
              {(filterStatus || filterInsurance) && (
                <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilterStatus('');
                      setFilterInsurance('');
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
          <span>تم العثور على <strong className="text-blue-600">{filteredVehicles.length}</strong> نتيجة</span>
        </div>
      )}

      {/* Table/Grid View */}
      {viewMode === 'table' ? (
        <Card>
          <Table 
            columns={columns} 
            data={filteredVehicles} 
            onRowClick={(row) => setSelectedVehicle(row)} 
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map((vehicle, index) => (
            <Card 
              key={vehicle.id}
              className="group cursor-pointer hover:shadow-2xl transition-all duration-300 border-t-4 border-[#09b9b5] overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => setSelectedVehicle(vehicle)}
            >
              {/* Vehicle Image/Icon */}
              <div className="relative h-32 bg-gradient-to-br from-[#09b9b5]/10 via-[#09b9b5]/5 to-transparent flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                <span className="text-7xl relative z-10 group-hover:scale-110 transition-transform">{vehicle.image}</span>
                <Badge 
                  variant={vehicle.status === 'متاح' ? 'success' : vehicle.status === 'مفوض' ? 'info' : 'warning'}
                  className="absolute top-3 right-3 z-20"
                >
                  {vehicle.status}
                </Badge>
              </div>

              {/* Vehicle Details */}
              <div className="p-4 space-y-3">
                {/* Header */}
                <div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#09b9b5] transition-colors">
                    {vehicle.plateNumber}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {vehicle.manufacturer} {vehicle.model} - {vehicle.year}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <Car className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">النوع</p>
                      <p className="font-semibold text-gray-900">{vehicle.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <div className="p-1.5 bg-green-50 rounded-lg">
                      <Fuel className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">الوقود</p>
                      <p className="font-semibold text-gray-900">{vehicle.fuelType}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <div className="p-1.5 bg-purple-50 rounded-lg">
                      <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">العداد</p>
                      <p className="font-semibold text-gray-900">{vehicle.odometerReading.toLocaleString()} كم</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <div className="p-1.5 bg-orange-50 rounded-lg">
                      <Shield className="w-3.5 h-3.5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">التأمين</p>
                      <Badge 
                        variant={vehicle.insuranceStatus === 'ساري' ? 'success' : 'warning'}
                        style={{ fontSize: '10px', padding: '2px 6px' }}
                      >
                        {vehicle.insuranceStatus}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button className="flex-1 py-2 px-3 bg-[#09b9b5] hover:bg-[#0da9a5] text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    عرض التفاصيل
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fadeIn" 
          onClick={() => setSelectedVehicle(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-slideUp" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - متناسق مع App Bar */}
            <div className="relative bg-gradient-to-r from-[#09b9b5] via-[#0da9a5] to-[#09b9b5] p-6 text-white shadow-lg">
              <button
                onClick={() => setSelectedVehicle(null)}
                className="absolute top-4 left-4 p-2.5 hover:bg-white/15 rounded-xl transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4 pr-10">
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <span className="text-5xl">{selectedVehicle.image}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold mb-1 bg-gradient-to-l from-white to-white/90 bg-clip-text text-transparent">
                    {selectedVehicle.plateNumber}
                  </h2>
                  <p className="text-white/80 text-sm sm:text-base">
                    {selectedVehicle.manufacturer} {selectedVehicle.model} - {selectedVehicle.year}
                  </p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-xl bg-white/15 border border-white/20 text-sm font-medium">
                      {selectedVehicle.status}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-xl bg-white/15 border border-white/20 text-sm font-medium">
                      {selectedVehicle.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 min-h-0">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-100">
                  <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">العداد</p>
                  <p className="text-lg font-bold text-gray-900">{selectedVehicle.odometerReading.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">كم</p>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-100">
                  <Fuel className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">الوقود</p>
                  <p className="text-sm font-bold text-gray-900">{selectedVehicle.fuelType}</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-100">
                  <div className="w-6 h-6 mx-auto mb-2 rounded-full" style={{backgroundColor: selectedVehicle.color === 'أبيض' ? '#fff' : selectedVehicle.color === 'أسود' ? '#000' : '#c0c0c0', border: '2px solid #666'}}></div>
                  <p className="text-xs text-gray-600 mb-1">اللون</p>
                  <p className="text-sm font-bold text-gray-900">{selectedVehicle.color}</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-100">
                  <Calendar className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 mb-1">السنة</p>
                  <p className="text-lg font-bold text-gray-900">{selectedVehicle.year}</p>
                </div>
              </div>

              {/* Documents Status */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#09b9b5]" />
                  حالة الوثائق
                </h3>
                
                <div className="space-y-2">
                  {[
                    { label: 'التأمين', date: selectedVehicle.insuranceExpiry, status: selectedVehicle.insuranceStatus },
                    { label: 'الاستمارة', date: selectedVehicle.registrationExpiry, status: 'ساري' },
                    { label: 'الفحص الدوري', date: selectedVehicle.inspectionExpiry, status: 'ساري' },
                  ].map((doc, i) => {
                    const daysLeft = Math.floor((new Date(doc.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${doc.status === 'ساري' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                            <Shield className={`w-4 h-4 ${doc.status === 'ساري' ? 'text-green-600' : 'text-yellow-600'}`} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{doc.label}</p>
                            <p className="text-sm text-gray-500">{new Date(doc.date).toLocaleDateString('ar-SA')}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <Badge variant={doc.status === 'ساري' ? 'success' : 'warning'}>
                            {doc.status}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{daysLeft} يوم متبقي</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* VIN Info */}
              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">رقم الشاسيه (VIN)</p>
                <p className="font-mono text-lg font-bold text-gray-900">{selectedVehicle.vin}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button variant="primary" className="flex-1 group">
                  <Edit className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                  تعديل المركبة
                </Button>
                <Button variant="secondary" className="flex-1 group">
                  <MapPin className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                  تتبع الموقع
                </Button>
                <Button variant="outline" className="group">
                  <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal (Enhanced) */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" 
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp" 
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
                    <h2 className="text-2xl font-bold">إضافة مركبة جديدة</h2>
                    <p className="text-white/80 text-sm mt-0.5">أدخل تفاصيل المركبة الجديدة</p>
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
                console.log('Form Data:', formData);
                setShowModal(false);
                setFormData({
                  plateNumber: '',
                  plateName: '',
                  serialNumber: '',
                  vin: '',
                  manufacturer: '',
                  paletText1: '',
                  paletText2: '',
                  paletText3: '',
                  model: '',
                  year: new Date().getFullYear(),
                  type: '',
                  insuranceStatus: 'active',
                  insuranceExpiry: '',
                  registrationExpiry: '',
                  inspectionExpiry: '',
                  status: 'available',
                  color: '',
                  fuelType: '',
                  odometerReading: 0,
                  notes: '',
                });
              }}
              className="p-6 space-y-6"
            >
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-6">
                {['معلومات أساسية', 'التفاصيل الفنية', 'الوثائق'].map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      i === 0 ? 'bg-[#09b9b5] text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:inline">{step}</span>
                    {i < 2 && <div className="w-12 h-0.5 bg-gray-200 mx-2 hidden sm:block"></div>}
                  </div>
                ))}
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                  <Car className="w-5 h-5 text-[#09b9b5]" />
                  <h3 className="text-lg font-bold text-gray-900">المعلومات الأساسية</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="رقم اللوحة"
                    placeholder="ABC 1234"
                    required
                    value={formData.plateNumber}
                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                  />

                  <Input
                    label="اسم اللوحة"
                    placeholder="اسم اللوحة"
                    value={formData.plateName}
                    onChange={(e) => setFormData({ ...formData, plateName: e.target.value })}
                  />

                  <Input
                    label="الرقم التسلسلي"
                    placeholder="الرقم التسلسلي"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  />

                  <Input
                    label="رقم الشاسيه (VIN)"
                    placeholder="1HGBH41JXMN109186"
                    value={formData.vin}
                    onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الشركة المصنعة<span className="text-[#d32f2f] mr-1">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]"
                      required
                      value={formData.manufacturer}
                      onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    >
                      <option value="">اختر الشركة</option>
                      <option value="تويوتا">تويوتا</option>
                      <option value="هوندا">هوندا</option>
                      <option value="نيسان">نيسان</option>
                      <option value="فورد">فورد</option>
                      <option value="شيفروليه">شيفروليه</option>
                      <option value="مرسيدس">مرسيدس</option>
                      <option value="بي إم دبليو">بي إم دبليو</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>

                  <Input
                    label="الموديل"
                    placeholder="كامري"
                    required
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  />
                </div>
              </div>

              {/* Plate Texts */}
              <div className="space-y-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h4 className="text-md font-semibold text-gray-800">نصوص اللوحة</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="نص اللوحة 1"
                    placeholder="نص اللوحة الأول"
                    value={formData.paletText1}
                    onChange={(e) => setFormData({ ...formData, paletText1: e.target.value })}
                  />
                  <Input
                    label="نص اللوحة 2"
                    placeholder="نص اللوحة الثاني"
                    value={formData.paletText2}
                    onChange={(e) => setFormData({ ...formData, paletText2: e.target.value })}
                  />
                  <Input
                    label="نص اللوحة 3"
                    placeholder="نص اللوحة الثالث"
                    value={formData.paletText3}
                    onChange={(e) => setFormData({ ...formData, paletText3: e.target.value })}
                  />
                </div>
              </div>

              {/* Technical Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                  <Settings className="w-5 h-5 text-[#09b9b5]" />
                  <h3 className="text-lg font-bold text-gray-900">التفاصيل الفنية</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="سنة الصنع"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نوع المركبة<span className="text-[#d32f2f] mr-1">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]"
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="">اختر النوع</option>
                      <option value="سيدان">سيدان</option>
                      <option value="جيب">جيب</option>
                      <option value="شاحنة">شاحنة</option>
                      <option value="فان">فان</option>
                      <option value="بيك أب">بيك أب</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اللون</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    >
                      <option value="">اختر اللون</option>
                      <option value="أبيض">أبيض</option>
                      <option value="أسود">أسود</option>
                      <option value="فضي">فضي</option>
                      <option value="رمادي">رمادي</option>
                      <option value="أحمر">أحمر</option>
                      <option value="أزرق">أزرق</option>
                      <option value="أخضر">أخضر</option>
                      <option value="بني">بني</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">نوع الوقود</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]"
                      value={formData.fuelType}
                      onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                    >
                      <option value="">اختر نوع الوقود</option>
                      <option value="بنزين">بنزين</option>
                      <option value="ديزل">ديزل</option>
                      <option value="كهربائي">كهربائي</option>
                      <option value="هجين">هجين</option>
                    </select>
                  </div>

                  <Input
                    label="قراءة العداد"
                    type="number"
                    min="0"
                    value={formData.odometerReading}
                    onChange={(e) => setFormData({ ...formData, odometerReading: parseInt(e.target.value) || 0 })}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      حالة المركبة<span className="text-[#d32f2f] mr-1">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]"
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="available">متاح</option>
                      <option value="assigned">مفوض</option>
                      <option value="maintenance">صيانة</option>
                      <option value="out_of_service">خارج الخدمة</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-4 p-4 bg-gradient-to-br from-green-50 to-green-100/30 rounded-xl border border-green-100">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">معلومات التأمين والوثائق</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">حالة التأمين</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]"
                      value={formData.insuranceStatus}
                      onChange={(e) => setFormData({ ...formData, insuranceStatus: e.target.value })}
                    >
                      <option value="active">ساري</option>
                      <option value="expiring_soon">قارب على الانتهاء</option>
                      <option value="expired">منتهي</option>
                    </select>
                  </div>

                  <Input
                    label="تاريخ انتهاء التأمين"
                    type="date"
                    value={formData.insuranceExpiry}
                    onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })}
                  />

                  <Input
                    label="تاريخ انتهاء الاستمارة"
                    type="date"
                    value={formData.registrationExpiry}
                    onChange={(e) => setFormData({ ...formData, registrationExpiry: e.target.value })}
                  />

                  <Input
                    label="تاريخ انتهاء الفحص الدوري"
                    type="date"
                    value={formData.inspectionExpiry}
                    onChange={(e) => setFormData({ ...formData, inspectionExpiry: e.target.value })}
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  ملاحظات
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] transition-all"
                  placeholder="أي ملاحظات إضافية عن المركبة..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                ></textarea>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t-2 border-gray-200 sticky bottom-0 bg-white pb-2">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="group"
                >
                  <X className="w-4 h-4 ml-2 group-hover:rotate-90 transition-transform" />
                  إلغاء
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                  className="group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform"></div>
                  <CheckCircle className="w-4 h-4 ml-2 relative z-10 group-hover:scale-110 transition-transform" />
                  <span className="relative z-10">حفظ المركبة</span>
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