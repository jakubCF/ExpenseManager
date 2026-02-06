import { Entry } from '@/types';
import { format } from 'date-fns';

interface EntryListProps {
  entries: Entry[];
  selectedEntry: Entry | null;
  onSelect: (entry: Entry) => void;
  loading: boolean;
}

const parseLocalDate = (dateString: string): Date => {
  // Parse YYYY-MM-DD format without timezone conversion
  const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
  return new Date(year, month - 1, day);
};

export default function EntryList({
  entries,
  selectedEntry,
  onSelect,
  loading,
}: EntryListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Entries ({entries.length})</h2>
      </div>
      <div className="divide-y divide-gray-200 h-[calc(100vh-310px)] overflow-y-auto">
        {entries.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No entries found</div>
        ) : (
          entries.map((entry) => (
            <button
              key={entry.id}
              onClick={() => onSelect(entry)}
              className={`w-full text-left p-4 transition-colors ${
                selectedEntry?.id === entry.id
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{entry.store_name}</p>
                  <p className="text-sm text-gray-600">
                    {entry.date_of_purchase ? format(parseLocalDate(entry.date_of_purchase), 'MMM dd, yyyy') : 'N/A'}
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    ${Number(entry.total).toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  {entry.approved ? (
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                      Approved
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
