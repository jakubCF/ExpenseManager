# Application Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              App (Client-Side)                        │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │                                                        │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐ │   │
│  │  │ FilterBar   │  │ EntryList    │  │ EntryDetail │ │   │
│  │  │             │  │              │  │             │ │   │
│  │  │ - store     │  │ - entries    │  │ - form      │ │   │
│  │  │ - date      │  │ - selection  │  │ - image     │ │   │
│  │  │ - status    │  │ - status     │  │ - buttons   │ │   │
│  │  └─────────────┘  └──────────────┘  └─────────────┘ │   │
│  │         ↓               ↓                  ↓          │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │        State Management (React Hooks)          │  │   │
│  │  │  - entries, selectedEntry, filters, loading   │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │                                                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           API Layer (Route Handlers)                 │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │                                                        │   │
│  │  GET  /api/entries?store_name&date&approved         │   │
│  │  GET  /api/entries/[id]                             │   │
│  │  PUT  /api/entries/[id]                             │   │
│  │  GET  /api/image-url?file_name                      │   │
│  │                                                        │   │
│  └──────────────────────────────────────────────────────┘   │
│         ↓                              ↓                     │
│  ┌────────────────────────┐   ┌─────────────────────────┐  │
│  │   PostgreSQL DB        │   │   MinIO S3 (Images)     │  │
│  │  (chrisexp table)       │   │  (chris-expenses)       │  │
│  │                        │   │                         │  │
│  │  - Entry metadata      │   │  - Receipt images       │  │
│  │  - Line items (JSONB)  │   │  - Presigned URLs       │  │
│  │  - Approval status     │   │                         │  │
│  └────────────────────────┘   └─────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### View Entry Flow
```
User Clicks Entry
     ↓
EntryList.onSelect(entry)
     ↓
setSelectedEntry(entry)
     ↓
useEffect triggers
     ↓
fetch(/api/image-url?file_name=...)
     ↓
MinIO generates presigned URL
     ↓
Display entry details + image
```

### Filter Flow
```
User Changes Filter
     ↓
FilterBar.setFilters(newFilters)
     ↓
useEffect dependency triggers
     ↓
fetch(/api/entries?filters...)
     ↓
PostgreSQL query with WHERE clause
     ↓
setEntries(results)
     ↓
Clear selectedEntry
     ↓
Display filtered list
```

### Edit & Save Flow
```
User Edits Field
     ↓
handleChange(field, value)
     ↓
setLocalEntry({...entry, [field]: value})
     ↓
onEntryChange(localEntry) → setSelectedEntry
     ↓
User Clicks Save
     ↓
handleSave(localEntry)
     ↓
fetch(PUT /api/entries/[id], body)
     ↓
Database UPDATE query
     ↓
Return updated entry
     ↓
setSelectedEntry(updated)
     ↓
setEntries(updated in list)
```

### Line Items Editor Flow
```
User Expands Item
     ↓
setExpandedId(index)
     ↓
Show editable fields
     ↓
User Changes Field
     ↓
handleItemChange(index, field, value)
     ↓
Update local item array
     ↓
onChange(updatedArray)
     ↓
handleChange('line_items', items)
     ↓
Updates are persisted on Save
```

### Approval Flow
```
User Clicks "Save & Approve"
     ↓
handleApprove()
     ↓
handleSave({...entry, approved: true})
     ↓
fetch(PUT /api/entries/[id], {..., approved: true})
     ↓
Database UPDATE sets approved = true
     ↓
setSelectedEntry(updated) → shows approved badge
     ↓
Updates in list
```

## Component Data Flow

```
App (page.tsx)
│
├── State
│   ├── entries: Entry[]
│   ├── selectedEntry: Entry | null
│   ├── filters: Filters
│   └── loading: boolean
│
├── Handlers
│   ├── fetchEntries()
│   ├── handleSave(entry)
│   ├── handleApprove()
│   └── handleChange(field, value)
│
└── Children
    ├── FilterBar
    │   ├── Props: filters, setFilters
    │   └── Events: onChange, onReset
    │
    ├── EntryList
    │   ├── Props: entries, selectedEntry, loading
    │   └── Events: onSelect
    │
    └── EntryDetail (when selectedEntry exists)
        ├── Props: entry, callbacks
        │   ├── onSave(entry)
        │   ├── onApprove()
        │   └── onEntryChange(entry)
        │
        ├── State: localEntry
        │
        └── Children
            └── LineItemsEditor
                ├── Props: lineItems, onChange
                └── State: expandedId
```

## Database Schema Relationships

```
┌─────────────────────────────────────────────────────┐
│                   chrisexp Table                     │
├─────────────────────────────────────────────────────┤
│ id (PK)                                              │
│ created_at ───────────────────┐                     │
│ store_name ◄────────┐          │                     │
│ store_address       │ Filter   │                     │
│ store_phone         │ Options  │                     │
│ date_of_purchase ◄──┤          │ Display on List     │
│ subtotal            │          │                     │
│ gst                 │          │                     │
│ hst                 │          │                     │
│ total ◄─────┐       │          │                     │
│ total_discounts    │          │                     │
│ payment_method      │          │                     │
│                     │          │                     │
│ line_items (JSONB)  │ Complex  │ Edit inline         │
│   [                 │ Object   │                     │
│     {               │          │                     │
│       name: string  │          │                     │
│       price: number │          │                     │
│       quantity: ... │          │                     │
│       ...           │          │                     │
│     }               │          │                     │
│   ]                 │          │                     │
│                     │          │                     │
│ file_name ◄─────┐   │          │ Fetch S3 Image      │
│ approved ◄──┐   │   │          │                     │
│             │   │   │          │                     │
│             │   │   └──────────┼──► UI Display       │
│             │   └──────────────┼──► S3 Presigned URL │
│             └──────────────────┼──► Status Badge     │
│                                │                     │
│                                └─► Full Detail View  │
└─────────────────────────────────────────────────────┘
```

## API Request/Response Flow

### GET /api/entries
```
Request:
  GET /api/entries?store_name=Walmart&approved=false

Processing:
  1. Parse query parameters
  2. Build WHERE clauses for each filter
  3. Execute: SELECT * FROM chrisexp WHERE ...
  4. Order by date DESC

Response:
  [
    {
      id: 1,
      store_name: "Walmart",
      date_of_purchase: "2025-01-15",
      total: 45.99,
      approved: false,
      ...
    },
    ...
  ]
```

### PUT /api/entries/[id]
```
Request:
  PUT /api/entries/123
  Content-Type: application/json
  
  {
    store_name: "Updated Store",
    line_items: [...],
    approved: false,
    ...
  }

Processing:
  1. Extract id from params
  2. Extract all fields from body
  3. Update database: UPDATE chrisexp SET ... WHERE id = 123
  4. Return updated record with RETURNING *

Response:
  {
    id: 123,
    store_name: "Updated Store",
    updated_fields: { ... },
    ...
  }
```

### GET /api/image-url
```
Request:
  GET /api/image-url?file_name=receipt_123.jpg

Processing:
  1. Extract file_name from query
  2. Generate presigned URL via MinIO:
     minioClient.presignedGetObject(
       'chris-expenses',
       'receipt_123.jpg',
       24 * 60 * 60  // 24-hour expiration
     )

Response:
  {
    url: "http://odroidhc4.lan:9000/chris-expenses/receipt_123.jpg?...token..."
  }

UI:
  <img src={url} />
```

## State Management Flow

```
Initial State
    ↓
useEffect on mount
    ↓
fetchEntries() with current filters
    ↓
setEntries([...])
    ↓
Render list with empty selectedEntry
    ↓
User interaction
    ↓
Update filters / Select entry / Edit fields
    ↓
Local state updates
    ↓
Filtered re-render
    ↓
Save triggered
    ↓
API call with updated data
    ↓
State synchronization
    ↓
Final render with updates
```

## Performance Considerations

```
Optimizations:
  ✓ Presigned URLs (no direct S3 access needed)
  ✓ Parameterized queries (SQL injection prevention)
  ✓ Client-side filtering UI response (instant)
  ✓ Lazy image loading (on demand)

Potential Improvements:
  • Add pagination for large datasets
  • Cache presigned URLs (reduce S3 calls)
  • Debounce filter changes
  • Add loading states for async operations
  • Implement virtual scrolling for large lists
```
