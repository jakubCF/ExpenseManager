'use client';

import { useState, useEffect } from 'react';
import EntryList from '@/components/EntryList';
import EntryDetail from '@/components/EntryDetail';
import FilterBar from '@/components/FilterBar';
import type { Entry } from '@/types';

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [filters, setFilters] = useState({
    store_name: '',
    date_of_purchase: '',
    date_from: '',
    date_to: '',
    approved: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.store_name) params.append('store_name', filters.store_name);
        if (filters.date_of_purchase) params.append('date_of_purchase', filters.date_of_purchase);
        if (filters.date_from) params.append('date_from', filters.date_from);
        if (filters.date_to) params.append('date_to', filters.date_to);
        if (filters.approved) params.append('approved', filters.approved);

        const res = await fetch(`/api/entries?${params.toString()}`);
        const data = await res.json();
        setEntries(data);
        setSelectedEntry(null);
      } catch (error) {
        console.error('Error fetching entries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [filters]);

  const handleSave = async (updatedEntry: Entry) => {
    try {
      const res = await fetch(`/api/entries/${updatedEntry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEntry),
      });

      if (res.ok) {
        const saved = await res.json();
        setSelectedEntry(saved);
        setEntries(entries.map((e) => (e.id === saved.id ? saved : e)));
      }
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const handleApprove = async () => {
    if (!selectedEntry) return;
    await handleSave({ ...selectedEntry, approved: true });
  };

  return (
    <main className="h-screen bg-gray-50 flex flex-col">
      <div className="max-w-full mx-auto p-4 flex-shrink-0">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Expense Manager</h1>

        <FilterBar filters={filters} setFilters={setFilters} />
      </div>

      <div className="max-w-full mx-auto px-4 flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* List */}
          <div className="lg:col-span-1 overflow-y-auto">
            <EntryList
              entries={entries}
              selectedEntry={selectedEntry}
              onSelect={setSelectedEntry}
              loading={loading}
            />
          </div>

          {/* Detail */}
          {selectedEntry && (
            <div className="lg:col-span-3">
              <EntryDetail
                entry={selectedEntry}
                onSave={handleSave}
                onApprove={handleApprove}
                onEntryChange={setSelectedEntry}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
