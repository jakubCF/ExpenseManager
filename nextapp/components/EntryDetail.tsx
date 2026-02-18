'use client';

import { useState, useEffect } from 'react';
import { Entry, LineItem } from '@/types';
import LineItemsEditor from './LineItemsEditor';
import Image from 'next/image';

interface EntryDetailProps {
  entry: Entry;
  onSave: (entry: Entry) => Promise<void>;
  onApprove: () => Promise<void>;
  onEntryChange: (entry: Entry) => void;
}

export default function EntryDetail({
  entry,
  onSave,
  onApprove,
  onEntryChange,
}: EntryDetailProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [approving, setApproving] = useState(false);
  const [localEntry, setLocalEntry] = useState(entry);

  // Fetch S3 image URL
  useEffect(() => {
    const fetchImageUrl = async () => {
      if (!entry.file_name) return;
      try {
        const res = await fetch(`/api/image-url?file_name=${entry.file_name}`);
        const data = await res.json();
        setImageUrl(data.url);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImageUrl();
  }, [entry.file_name]);

  // Update local entry when prop changes
  useEffect(() => {
    // Normalize line_items to always be an array
    const normalized = { ...entry };
    if (normalized.line_items && !Array.isArray(normalized.line_items)) {
      normalized.line_items = ((normalized.line_items as { data: LineItem[] }).data) || [];
    }
    setLocalEntry(normalized);
  }, [entry]);

  const handleChange = (field: string, value: string | number | boolean | object) => {
    let finalValue = value;
    // If updating line_items, wrap in data object if needed
    if (field === 'line_items' && Array.isArray(value)) {
      finalValue = { data: value };
    }
    const updated = { ...localEntry, [field]: finalValue };
    setLocalEntry(updated);
    onEntryChange(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(localEntry);
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async () => {
    setApproving(true);
    try {
      await onApprove();
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen">
      {/* Details */}
      <div className="lg:col-span-1 bg-white rounded-lg shadow p-6 overflow-y-auto max-h-[calc(100vh-250px)]">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Entry Details</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Name
            </label>
            <input
              type="text"
              value={localEntry.store_name || ''}
              onChange={(e) => handleChange('store_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Address
            </label>
            <input
              type="text"
              value={localEntry.store_address || ''}
              onChange={(e) => handleChange('store_address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Phone
            </label>
            <input
              type="text"
              value={localEntry.store_phone || ''}
              onChange={(e) => handleChange('store_phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Purchase
            </label>
            <input
              type="date"
              value={localEntry.date_of_purchase ? new Date(localEntry.date_of_purchase).toISOString().split('T')[0] : ''}
              onChange={(e) => handleChange('date_of_purchase', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtotal
              </label>
              <input
                type="number"
                step="0.01"
                value={localEntry.subtotal ?? 0}
                onChange={(e) => handleChange('subtotal', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST
              </label>
              <input
                type="number"
                step="0.01"
                value={localEntry.gst ?? 0}
                onChange={(e) => handleChange('gst', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HST
              </label>
              <input
                type="number"
                step="0.01"
                value={localEntry.hst ?? 0}
                onChange={(e) => handleChange('hst', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Discounts
              </label>
              <input
                type="number"
                step="0.01"
                value={localEntry.total_discounts ?? 0}
                onChange={(e) => handleChange('total_discounts', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total
            </label>
            <input
              type="number"
              step="0.01"
              value={localEntry.total ?? 0}
              onChange={(e) => handleChange('total', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <input
              type="text"
              value={localEntry.payment_method || ''}
              onChange={(e) => handleChange('payment_method', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-3 py-4 border-t">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleApprove}
              disabled={approving || entry.approved}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              {approving ? 'Approving...' : 'Save & Approve'}
            </button>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Line Items</h3>
            <LineItemsEditor
              lineItems={Array.isArray(localEntry.line_items) ? localEntry.line_items : []}
              onChange={(items) => handleChange('line_items', items)}
            />
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center sticky top-0 h-[calc(100vh-250px)] overflow-hidden">
        {imageUrl ? (
          <div className="w-full h-full flex items-top justify-center">
            <img
              src={imageUrl}
              alt="Receipt"
              width={800}
              height={800}
              crossOrigin="anonymous"
              className="max-w-full rounded-lg object-contain"
            />
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p className="mb-2">No image available</p>
            <p className="text-sm">{entry.file_name || 'No file name'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
