'use client';

import { LineItem } from '@/types';
import { useState } from 'react';

interface LineItemsEditorProps {
  lineItems: LineItem[];
  onChange: (items: LineItem[]) => void;
}

export default function LineItemsEditor({ lineItems, onChange }: LineItemsEditorProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleItemChange = (index: number, field: keyof LineItem, value: string | number | boolean) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAddItem = () => {
    const newItem: LineItem = {
      name: '',
      price: 0,
      quantity: 1,
      discount: 0,
      net_price: 0,
      tax_ght_hst: 0,
      included: true,
    };
    onChange([...lineItems, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    onChange(lineItems.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {Array.isArray(lineItems) && lineItems.length > 0 ? (
        lineItems.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
          <div className="flex items-center">
            <button
              onClick={() => setExpandedId(expandedId === index ? null : index)}
              className="flex-1 text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between"
            >
              <div className="text-left flex-1">
                <p className="font-medium text-gray-900">{item.name || 'Unnamed Item'}</p>
                <p className="text-sm text-gray-600">
                  Qty: {item.quantity} × ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}
                </p>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedId === index ? 'transform rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
            <button
              onClick={() => handleRemoveItem(index)}
              className="px-4 py-3 bg-gray-50 hover:bg-red-50 text-red-600 font-medium border-l border-gray-200"
              title="Delete item"
            >
              ✕
            </button>
          </div>

          {expandedId === index && (
            <div className="px-4 py-4 bg-white space-y-3 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.discount ?? 0}
                    onChange={(e) => handleItemChange(index, 'discount', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Net Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.net_price}
                    onChange={(e) => handleItemChange(index, 'net_price', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax (GST/HST)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={item.tax_ght_hst ?? 0}
                  onChange={(e) => handleItemChange(index, 'tax_ght_hst', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.included}
                  onChange={(e) => handleItemChange(index, 'included', e.target.checked)}
                  className="w-4 h-4 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">Included</label>
              </div>

              <button
                onClick={() => handleRemoveItem(index)}
                className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md font-medium"
              >
                Remove Item
              </button>
            </div>
          )}
        </div>
      ))
      ) : (
        <div className="p-4 text-center text-gray-500 border border-dashed border-gray-300 rounded-md">
          No line items yet
        </div>
      )}

      <button
        onClick={handleAddItem}
        className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-700 hover:border-gray-400 hover:bg-gray-50 font-medium"
      >
        + Add Line Item
      </button>
    </div>
  );
}
