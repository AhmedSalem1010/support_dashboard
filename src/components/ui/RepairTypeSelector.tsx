'use client';

import { useState, useRef } from 'react';
import { Search, X, ImageIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface RepairTypeItem {
  id: string;
  label: string;
  isCustom?: boolean;
}

interface RepairTypeSelectorProps {
  selectedItems: RepairTypeItem[];
  selectedImages: Record<string, string>;
  onChange: (items: RepairTypeItem[], images: Record<string, string>) => void;
  options: RepairTypeItem[];
  disabled?: boolean;
}

export function RepairTypeSelector({
  selectedItems,
  selectedImages,
  onChange,
  options,
  disabled = false,
}: RepairTypeSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [showAddOther, setShowAddOther] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const allOptions = [...options];
  const filteredOptions = allOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSelected = (id: string) => selectedItems.some((s) => s.id === id);

  const toggleItem = (item: RepairTypeItem) => {
    if (disabled) return;
    if (isSelected(item.id)) {
      const newItems = selectedItems.filter((s) => s.id !== item.id);
      const newImages = { ...selectedImages };
      delete newImages[item.id];
      onChange(newItems, newImages);
    } else {
      onChange([...selectedItems, item], selectedImages);
    }
  };

  const removeCustomItem = (id: string) => {
    const newItems = selectedItems.filter((s) => s.id !== id);
    const newImages = { ...selectedImages };
    delete newImages[id];
    onChange(newItems, newImages);
  };

  const addCustomOption = () => {
    const label = customInput.trim() || 'غير ذلك';
    const id = `custom-${Date.now()}`;
    const newItem: RepairTypeItem = { id, label, isCustom: true };
    const newItems = [...selectedItems, newItem];
    onChange(newItems, selectedImages);
    setCustomInput('');
    setShowAddOther(false);
  };

  const handleImageUpload = (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(selectedItems, { ...selectedImages, [itemId]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (itemId: string) => {
    const newImages = { ...selectedImages };
    delete newImages[itemId];
    onChange(selectedItems, newImages);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 mb-2">نوع الإصلاح وبياناته</label>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ابحث عن نوع الإصلاح..."
          className="w-full pr-10 pl-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5] focus:border-transparent"
          dir="rtl"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* List */}
      <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto bg-white">
        <div className="divide-y divide-gray-100">
          {filteredOptions.map((item) => {
            const selected = isSelected(item.id);
            const hasImage = selectedImages[item.id];
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                  selected ? 'bg-[#09b9b5]/5' : ''
                }`}
              >
                {item.isCustom ? (
                  <button
                    type="button"
                    onClick={() => removeCustomItem(item.id)}
                    className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 shrink-0"
                    title="حذف"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : selected ? (
                  <button
                    type="button"
                    onClick={() => toggleItem(item)}
                    className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-red-600 shrink-0"
                    title="إزالة من التحديد"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="w-8 shrink-0" />
                )}
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  {hasImage ? (
                    <div className="relative shrink-0 w-8 h-8 rounded overflow-hidden border">
                      <img src={hasImage} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(item.id)}
                        className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="shrink-0 cursor-pointer p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-[#09b9b5]">
                      <input
                        ref={(el) => { fileInputRefs.current[item.id] = el; }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(item.id, e)}
                      />
                      <ImageIcon className="w-4 h-4" />
                    </label>
                  )}
                  <span className={`text-sm ${selected ? 'font-medium text-[#09b9b5]' : 'text-gray-700'}`}>
                    {item.label}
                  </span>
                </div>
                <label className="shrink-0 cursor-pointer flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleItem(item)}
                    disabled={disabled}
                    className="w-4 h-4 rounded border-gray-300 text-[#09b9b5 focus:ring-[#09b9b5]"
                  />
                </label>
              </div>
            );
          })}
        </div>

        {/* Selected custom items */}
        {selectedItems
          .filter(
            (s) =>
              s.isCustom &&
              (searchTerm === '' || s.label.toLowerCase().includes(searchTerm.toLowerCase()))
          )
          .map((item) => {
            const hasImage = selectedImages[item.id];
            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#09b9b5]/5 border-t border-gray-100"
              >
                <button
                  type="button"
                  onClick={() => removeCustomItem(item.id)}
                  className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex-1 flex items-center gap-2">
                  {hasImage ? (
                    <div className="relative shrink-0 w-8 h-8 rounded overflow-hidden border">
                      <img src={hasImage} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(item.id)}
                        className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="shrink-0 cursor-pointer p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-[#09b9b5]">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(item.id, e)}
                      />
                      <ImageIcon className="w-4 h-4" />
                    </label>
                  )}
                  <span className="text-sm font-medium text-[#09b9b5]">{item.label}</span>
                </div>
                <label className="shrink-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked
                    onChange={() => toggleItem(item)}
                    className="w-4 h-4 rounded border-gray-300 text-[#09b9b5 focus:ring-[#09b9b5]"
                  />
                </label>
              </div>
            );
          })}

        {/* Add custom / Other */}
        {showAddOther ? (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="أدخل الخيار أو اتركه فارغاً لـ غير ذلك"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#09b9b5]"
              dir="rtl"
              autoFocus
            />
            <Button type="button" variant="primary" size="sm" onClick={addCustomOption}>
              إضافة
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowAddOther(false);
                setCustomInput('');
              }}
            >
              إلغاء
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddOther(true)}
            className="w-full px-4 py-3 border-t border-gray-200 text-sm text-[#09b9b5] hover:bg-[#09b9b5]/5 flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            إضافة خيار أو إضافة &quot;غير ذلك&quot;
          </button>
        )}
      </div>
    </div>
  );
}
