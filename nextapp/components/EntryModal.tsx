import React, { useState } from 'react';
import LineItemsEditor from './LineItemsEditor';
import type { LineItem } from '@/types';

type NewEntry = Omit<
  {
    id: number;
    created_at: string;
    store_name: string;
    store_address: string;
    store_phone: string;
    date_of_purchase: string;
    subtotal: number;
    gst: number;
    hst: number;
    total: number;
    total_discounts: number;
    payment_method: string;
    line_items: LineItem[] | { data: LineItem[] };
    file_name: string;
    approved: boolean;
  },
  'id' | 'created_at'
>;

interface EntryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (entry: NewEntry) => void;
}

export default function EntryModal({ open, onClose, onSave }: EntryModalProps) {
  const [form, setForm] = useState<NewEntry>({
    store_name: '',
    store_address: '',
    store_phone: '',
    date_of_purchase: '',
    subtotal: 0,
    gst: 0,
    hst: 0,
    total: 0,
    total_discounts: 0,
    payment_method: '',
    line_items: [],
    file_name: '',
    approved: false,
  });

  const handleChange = (field: string, value: string | number | boolean | LineItem[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold mb-4">Create New Entry</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
            <input
              type="text"
              value={form.store_name}
              onChange={(e) => handleChange('store_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Address</label>
            <input
              type="text"
              value={form.store_address}
              onChange={(e) => handleChange('store_address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Phone</label>
            <input
              type="text"
              value={form.store_phone}
              onChange={(e) => handleChange('store_phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Purchase</label>
            <input
              type="date"
              value={form.date_of_purchase ? new Date(form.date_of_purchase).toISOString().split('T')[0] : ''}
              onChange={(e) => handleChange('date_of_purchase', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtotal</label>
              <input
                type="number"
                step="0.01"
                value={form.subtotal ?? 0}
                onChange={(e) => handleChange('subtotal', parseFloat(e.target.value || '0'))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST</label>
              <input
                type="number"
                step="0.01"
                value={form.gst ?? 0}
                onChange={(e) => handleChange('gst', parseFloat(e.target.value || '0'))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">HST</label>
              <input
                type="number"
                step="0.01"
                value={form.hst ?? 0}
                onChange={(e) => handleChange('hst', parseFloat(e.target.value || '0'))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Discounts</label>
              <input
                type="number"
                step="0.01"
                value={form.total_discounts ?? 0}
                onChange={(e) => handleChange('total_discounts', parseFloat(e.target.value || '0'))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
            <input
              type="number"
              step="0.01"
              value={form.total ?? 0}
              onChange={(e) => handleChange('total', parseFloat(e.target.value || '0'))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <input
              type="text"
              value={form.payment_method || ''}
              onChange={(e) => handleChange('payment_method', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Line Items</h3>
            <LineItemsEditor
              lineItems={Array.isArray(form.line_items) ? form.line_items : []}
              onChange={(items) => handleChange('line_items', items)}
            />
          </div>

          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={!!form.approved}
              onChange={(e) => handleChange('approved', e.target.checked)}
              className="mr-2"
            />
            <label className="text-sm text-gray-700">Approved</label>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
