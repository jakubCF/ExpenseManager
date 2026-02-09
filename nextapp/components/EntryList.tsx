import { Entry } from '@/types';
import { format } from 'date-fns';

interface EntryListProps {
  entries: Entry[];
  selectedEntry: Entry | null;
  onSelect: (entry: Entry) => void;
  loading: boolean;
  onCreate?: () => void;
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
  onCreate,
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
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Entries ({entries.length})</h2>
        <div>
          <button
            type="button"
            onClick={() => onCreate?.()}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
            aria-label="Create new entry"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>New</span>
          </button>
        </div>
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
