import { Dispatch, SetStateAction } from 'react';

interface Filters {
  store_name: string;
  date_of_purchase: string;
  date_from: string;
  date_to: string;
  approved: string;
}

interface FilterBarProps {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
}

const getDateRange = (range: string): { from: string; to: string } => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  switch (range) {
    case 'current-month': {
      const from = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
      const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
      const to = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      return { from, to };
    }
    case 'previous-month': {
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const from = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-01`;
      const lastDay = new Date(prevYear, prevMonth + 1, 0).getDate();
      const to = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      return { from, to };
    }
    case 'current-year':
      return { from: `${currentYear}-01-01`, to: `${currentYear}-12-31` };
    case 'last-year':
      return { from: `${currentYear - 1}-01-01`, to: `${currentYear - 1}-12-31` };
    default:
      return { from: '', to: '' };
  }
};

export default function FilterBar({ filters, setFilters }: FilterBarProps) {
  const handleChange = (field: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateRangeClick = (range: string) => {
    const { from, to } = getDateRange(range);
    setFilters((prev) => ({
      ...prev,
      date_from: from,
      date_to: to,
      date_of_purchase: '',
    }));
  };

  const handleReset = () => {
    setFilters({
      store_name: '',
      date_of_purchase: '',
      date_from: '',
      date_to: '',
      approved: '',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Name
            </label>
            <input
              type="text"
              placeholder="Search store..."
              value={filters.store_name}
              onChange={(e) => handleChange('store_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Purchase
            </label>
            <div className="flex gap-1">
              <input
                type="date"
                value={filters.date_of_purchase}
                onChange={(e) => handleChange('date_of_purchase', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-w-fit"
              />
              <button
                onClick={() => handleDateRangeClick('current-month')}
                className="text-sm px-2 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 whitespace-nowrap font-medium"
                title="This Month"
              >
                This Month
              </button>
              <button
                onClick={() => handleDateRangeClick('previous-month')}
                className="text-sm px-2 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 whitespace-nowrap font-medium"
                title="Last Month"
              >
                Last Month
              </button>
              <button
                onClick={() => handleDateRangeClick('current-year')}
                className="text-sm px-2 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 whitespace-nowrap font-medium"
                title="This Year"
              >
                This Year
              </button>
              <button
                onClick={() => handleDateRangeClick('last-year')}
                className="text-sm px-2 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 whitespace-nowrap font-medium"
                title="Last Year"
              >
                Last Year
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.approved}
              onChange={(e) => handleChange('approved', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All</option>
              <option value="true">Approved</option>
              <option value="false">Pending</option>
            </select>
          </div>

          <div className="lg:col-span-1 flex items-end">
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
