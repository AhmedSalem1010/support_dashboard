'use client';

import { useState } from 'react';
import { Camera, Video, Upload, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type InspectionType = 'vehicle' | 'accommodation';

interface VehicleInfo {
  id: string;
  plateNumber: string;
  manufacturer: string;
  model: string;
  year: number;
  driver?: {
    name: string;
    phone: string;
    team: string;
  };
}

interface EquipmentChecklist {
  bakium: boolean;
  galandar: boolean;
  blicher: boolean;
  leMay: boolean;
  leShoft: boolean;
  ladderBig: boolean;
  ladderSmall: boolean;
}

export default function Inspection() {
  const [inspectionType, setInspectionType] = useState<InspectionType>('vehicle');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
  const [supervisor, setSupervisor] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  // Equipment checklist
  const [equipment, setEquipment] = useState<EquipmentChecklist>({
    bakium: false,
    galandar: false,
    blicher: false,
    leMay: false,
    leShoft: false,
    ladderBig: false,
    ladderSmall: false,
  });

  // Media files
  const [vehicleImages, setVehicleImages] = useState<File[]>([]);
  const [vehicleVideo, setVehicleVideo] = useState<File | null>(null);
  const [equipmentWorkerVideo, setEquipmentWorkerVideo] = useState<File | null>(null);
  
  // Accommodation media
  const [accommodationImages, setAccommodationImages] = useState<File[]>([]);
  const [accommodationVideo, setAccommodationVideo] = useState<File | null>(null);

  // Mock data - في التطبيق الفعلي سيتم جلبها من API
  const mockVehicles = [
    { id: '1', plateName: 'مركبة 1 - ABC 123', plateNumber: 'ABC 123' },
    { id: '2', plateName: 'مركبة 2 - XYZ 456', plateNumber: 'XYZ 456' },
    { id: '3', plateName: 'مركبة 3 - DEF 789', plateNumber: 'DEF 789' },
  ];

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    
    // Mock: جلب معلومات المركبة والسائق من API
    if (vehicleId) {
      setVehicleInfo({
        id: vehicleId,
        plateNumber: 'ABC 123',
        manufacturer: 'تويوتا',
        model: 'هايلوكس',
        year: 2023,
        driver: {
          name: 'أحمد محمد',
          phone: '0501234567',
          team: 'فريق النظافة - المنطقة الشمالية',
        },
      });
    } else {
      setVehicleInfo(null);
    }
  };

  const handleEquipmentChange = (item: keyof EquipmentChecklist) => {
    setEquipment(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'vehicle' | 'accommodation') => {
    const files = Array.from(e.target.files || []);
    if (type === 'vehicle') {
      setVehicleImages(prev => [...prev, ...files]);
    } else {
      setAccommodationImages(prev => [...prev, ...files]);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'vehicle' | 'equipment' | 'accommodation') => {
    const file = e.target.files?.[0] || null;
    if (type === 'vehicle') {
      setVehicleVideo(file);
    } else if (type === 'equipment') {
      setEquipmentWorkerVideo(file);
    } else {
      setAccommodationVideo(file);
    }
  };

  const removeImage = (index: number, type: 'vehicle' | 'accommodation') => {
    if (type === 'vehicle') {
      setVehicleImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setAccommodationImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('inspectionType', inspectionType);
    formData.append('supervisor', supervisor);
    formData.append('notes', notes);

    if (inspectionType === 'vehicle') {
      formData.append('vehicleId', selectedVehicle);
      formData.append('equipment', JSON.stringify(equipment));
      
      vehicleImages.forEach((image, index) => {
        formData.append(`vehicleImage_${index}`, image);
      });
      
      if (vehicleVideo) {
        formData.append('vehicleVideo', vehicleVideo);
      }
      
      if (equipmentWorkerVideo) {
        formData.append('equipmentWorkerVideo', equipmentWorkerVideo);
      }
    } else {
      accommodationImages.forEach((image, index) => {
        formData.append(`accommodationImage_${index}`, image);
      });
      
      if (accommodationVideo) {
        formData.append('accommodationVideo', accommodationVideo);
      }
    }

    console.log('Submitting inspection:', Object.fromEntries(formData));
    alert('تم إرسال الفحص بنجاح!');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">الفحص</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* نوع الفحص */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">نوع الفحص</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setInspectionType('vehicle')}
              className={`p-3 sm:p-4 border-2 rounded-lg transition-all ${
                inspectionType === 'vehicle'
                  ? 'border-[#09b9b5] bg-[#effefa] text-[#09b9b5]'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-center">
                <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🚗</div>
                <div className="text-sm sm:text-base font-semibold">فحص المركبة</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setInspectionType('accommodation')}
              className={`p-3 sm:p-4 border-2 rounded-lg transition-all ${
                inspectionType === 'accommodation'
                  ? 'border-[#09b9b5] bg-[#effefa] text-[#09b9b5]'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-center">
                <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🏠</div>
                <div className="text-sm sm:text-base font-semibold">فحص السكن</div>
              </div>
            </button>
          </div>
        </div>

        {/* حقول فحص المركبة */}
        {inspectionType === 'vehicle' && (
          <>
            {/* اختيار المركبة */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">معلومات المركبة</h2>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    اختر المركبة <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedVehicle}
                    onChange={(e) => handleVehicleSelect(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]"
                  >
                    <option value="">-- اختر المركبة --</option>
                    {mockVehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.plateName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* معلومات المركبة والسائق */}
                {vehicleInfo && (
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <span className="text-xs sm:text-sm text-gray-600">رقم اللوحة:</span>
                        <p className="text-sm sm:text-base font-semibold">{vehicleInfo.plateNumber}</p>
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm text-gray-600">الصانع:</span>
                        <p className="text-sm sm:text-base font-semibold">{vehicleInfo.manufacturer}</p>
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm text-gray-600">الموديل:</span>
                        <p className="text-sm sm:text-base font-semibold">{vehicleInfo.model}</p>
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm text-gray-600">السنة:</span>
                        <p className="text-sm sm:text-base font-semibold">{vehicleInfo.year}</p>
                      </div>
                    </div>

                    {vehicleInfo.driver && (
                      <div className="border-t pt-3 mt-3">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">معلومات السائق</h3>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <span className="text-xs sm:text-sm text-gray-600">الاسم:</span>
                            <p className="text-sm sm:text-base font-semibold">{vehicleInfo.driver.name}</p>
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm text-gray-600">الهاتف:</span>
                            <p className="text-sm sm:text-base font-semibold">{vehicleInfo.driver.phone}</p>
                          </div>
                          <div className="col-span-2">
                            <span className="text-xs sm:text-sm text-gray-600">الفريق:</span>
                            <p className="text-sm sm:text-base font-semibold">{vehicleInfo.driver.team}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* المعدات */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">المعدات</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                {Object.entries(equipment).map(([key, value]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleEquipmentChange(key as keyof EquipmentChecklist)}
                    className={`p-2 sm:p-4 border-2 rounded-lg transition-all ${
                      value
                        ? 'border-[#00a287] bg-[#effefa]'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs sm:text-sm font-medium">
                        {key === 'bakium' && 'باكيوم'}
                        {key === 'galandar' && 'قلندر'}
                        {key === 'blicher' && 'بليشر'}
                        {key === 'leMay' && 'لي ماء'}
                        {key === 'leShoft' && 'لي شفط'}
                        {key === 'ladderBig' && 'سلم كبير'}
                        {key === 'ladderSmall' && 'سلم صغير'}
                      </span>
                      {value ? (
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* الوسائط - المركبة */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">صور وفيديو المركبة</h2>
              
              <div className="space-y-4 sm:space-y-6">
                {/* صور المركبة */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    <Camera className="w-4 h-4 inline ml-1" />
                    صور المركبة (يمكن إضافة عدة صور)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e, 'vehicle')}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  />
                  
                  {vehicleImages.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      {vehicleImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`صورة ${index + 1}`}
                            className="w-full h-24 sm:h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index, 'vehicle')}
                            className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <p className="text-xs text-gray-600 mt-1 truncate">{image.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* فيديو المركبة */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    <Video className="w-4 h-4 inline ml-1" />
                    فيديو المركبة
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleVideoUpload(e, 'vehicle')}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  />
                  {vehicleVideo && (
                    <div className="mt-2 flex items-center justify-between bg-[#effefa] p-2 sm:p-3 rounded-lg">
                      <span className="text-xs sm:text-sm text-gray-700 truncate">{vehicleVideo.name}</span>
                      <button
                        type="button"
                        onClick={() => setVehicleVideo(null)}
                        className="text-red-500 hover:text-red-700 flex-shrink-0 ml-2"
                      >
                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* فيديو المعدات والعمال */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    <Video className="w-4 h-4 inline ml-1" />
                    فيديو المعدات والعمال
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleVideoUpload(e, 'equipment')}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                  />
                  {equipmentWorkerVideo && (
                    <div className="mt-2 flex items-center justify-between bg-[#effefa] p-2 sm:p-3 rounded-lg">
                      <span className="text-xs sm:text-sm text-gray-700 truncate">{equipmentWorkerVideo.name}</span>
                      <button
                        type="button"
                        onClick={() => setEquipmentWorkerVideo(null)}
                        className="text-red-500 hover:text-red-700 flex-shrink-0 ml-2"
                      >
                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* حقول فحص السكن */}
        {inspectionType === 'accommodation' && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">صور وفيديو السكن</h2>
            
            <div className="space-y-4 sm:space-y-6">
              {/* صور السكن */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  <Camera className="w-4 h-4 inline ml-1" />
                  صور السكن (يمكن إضافة عدة صور)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e, 'accommodation')}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                />
                
                {accommodationImages.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {accommodationImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`صورة ${index + 1}`}
                          className="w-full h-24 sm:h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index, 'accommodation')}
                          className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <p className="text-xs text-gray-600 mt-1 truncate">{image.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* فيديو السكن */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  <Video className="w-4 h-4 inline ml-1" />
                  فيديو السكن
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleVideoUpload(e, 'accommodation')}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                />
                {accommodationVideo && (
                  <div className="mt-2 flex items-center justify-between bg-[#effefa] p-2 sm:p-3 rounded-lg">
                    <span className="text-xs sm:text-sm text-gray-700 truncate">{accommodationVideo.name}</span>
                    <button
                      type="button"
                      onClick={() => setAccommodationVideo(null)}
                      className="text-red-500 hover:text-red-700 flex-shrink-0 ml-2"
                    >
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* المشرف والملاحظات */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">معلومات إضافية</h2>
          
          <div className="space-y-3 sm:space-y-4">
            <Input
              label="المشرف المسؤول"
              type="text"
              value={supervisor}
              onChange={(e) => setSupervisor(e.target.value)}
              placeholder="أدخل اسم المشرف"
              required
            />

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                الملاحظات
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أدخل أي ملاحظات إضافية..."
                rows={3}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]"
              />
            </div>
          </div>
        </div>

        {/* أزرار الحفظ */}
        <div className="flex justify-end gap-2 sm:gap-3">
          <Button variant="outline" type="button" className="text-sm">
            إلغاء
          </Button>
          <Button variant="success" type="submit" className="text-sm">
            <Upload className="w-4 h-4 ml-1 sm:ml-2" />
            <span className="hidden sm:inline">حفظ الفحص</span>
            <span className="sm:hidden">حفظ</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
