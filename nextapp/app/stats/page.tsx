'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Entry } from '@/types';

interface YearStats {
  year: number;
  subtotal: number;
  taxes: number; // GST + HST combined
  total: number;
  count: number;
}

export default function StatsPage() {
  const [stats, setStats] = useState<YearStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ subtotal: 0, taxes: 0, total: 0, count: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/entries?approved=true');
        const entries: Entry[] = await res.json();

        const yearMap = new Map<number, YearStats>();

        entries.forEach((entry) => {
          const year = new Date(entry.date_of_purchase).getFullYear();
          const subtotal = parseFloat(String(entry.subtotal || 0));
          const gst = parseFloat(String(entry.gst || 0));
          const hst = parseFloat(String(entry.hst || 0));
          const total = parseFloat(String(entry.total || 0));

          const existing = yearMap.get(year) || {
            year,
            subtotal: 0,
            taxes: 0,
            total: 0,
            count: 0,
          };

          existing.subtotal += subtotal;
          existing.taxes += gst + hst;
          existing.total += total;
          existing.count += 1;

          yearMap.set(year, existing);
        });

        const statsArray = Array.from(yearMap.values()).sort((a, b) => b.year - a.year);
        setStats(statsArray);

        const totalsData = statsArray.reduce(
          (acc, stat) => ({
            subtotal: acc.subtotal + stat.subtotal,
            taxes: acc.taxes + stat.taxes,
            total: acc.total + stat.total,
            count: acc.count + stat.count,
          }),
          { subtotal: 0, taxes: 0, total: 0, count: 0 }
        );

        setTotals(totalsData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(value);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-900">Expense Statistics</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Back to Entries
          </Link>
        </div>

        {stats.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <p>No approved expenses found.</p>
          </div>
        ) : (
          <>
            {/* Yearly Breakdown */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
              <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Breakdown by Year</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Year
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                        Count
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                        Subtotal
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                        GST + HST
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map((stat) => (
                      <tr key={stat.year} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{stat.year}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 text-right">{stat.count}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 text-right">
                          {formatCurrency(stat.subtotal)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 text-right">
                          {formatCurrency(stat.taxes)}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                          {formatCurrency(stat.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals Summary */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Overall Totals</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-medium mb-2">Total Items</p>
                  <p className="text-3xl font-bold text-gray-900">{totals.count}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-medium mb-2">Subtotal</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(totals.subtotal)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-medium mb-2">GST + HST</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(totals.taxes)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm font-medium mb-2">Total</p>
                  <p className="text-3xl font-bold text-blue-600">{formatCurrency(totals.total)}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
