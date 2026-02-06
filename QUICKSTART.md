# Quick Start Guide

## Installation

```bash
cd nextapp
npm install
```

## Configuration

Create or update `.env.local` with your database and S3 credentials:

```env
DATABASE_HOST=127.0.0.1
DATABASE_NAME=personal
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_PORT=5432

MINIO_ENDPOINT=127.0.0.1
MINIO_PORT=9000
MINIO_ACCESS_KEY=minio
MINIO_SECRET_KEY=minio123
MINIO_BUCKET=chris-expenses
MINIO_USE_SSL=false
```

## Running the Application

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features Overview

### 1. List View (Left Side)
- Shows all expense entries sorted by date (newest first)
- Click any entry to load details
- Shows store name, purchase date, total amount
- Status badge (green=Approved, yellow=Pending)

### 2. Filter Bar (Top)
- **Store Name**: Search by store name (case-insensitive)
- **Date of Purchase**: Filter by specific date
- **Status**: Filter by All, Approved, or Pending
- **Reset Filters**: Clear all filters at once

### 3. Detail View (Right Side)
Shows complete entry information:

#### Entry Fields
- Store name, address, phone
- Date of purchase
- Payment method
- Subtotal, GST, HST, total
- Total discounts

#### Line Items Section
- Expandable list of line items
- Click to expand and edit individual items
- Each item has: name, price, quantity, discount, net price, tax, inclusion status
- Add/remove items dynamically
- All changes saved to JSONB field in database

#### Image Display
- Receipt image loads automatically from S3
- Presigned URL ensures secure access
- Displays on right side of detail view

#### Action Buttons
- **Save Changes**: Save all edits (does not change approval status)
- **Save & Approve**: Save edits AND mark entry as approved (one-way operation)

## Database Schema

The application uses the `chrisexp` table with the following structure:

- `id`: integer (primary key)
- `created_at`: date
- `store_name`: varchar(128)
- `store_address`: text
- `store_phone`: text
- `date_of_purchase`: date
- `subtotal`, `gst`, `hst`, `total`: numeric(10,2)
- `total_discounts`: numeric(10,2)
- `payment_method`: text
- `line_items`: jsonb (array of line item objects)
- `file_name`: varchar(256) (S3 filename)
- `approved`: boolean

## API Endpoints

### GET /api/entries
Fetch all entries with optional filters:
```bash
# Get all entries
curl http://localhost:3000/api/entries

# Filter by store name
curl "http://localhost:3000/api/entries?store_name=Walmart"

# Filter by status
curl "http://localhost:3000/api/entries?approved=true"

# Combine filters
curl "http://localhost:3000/api/entries?store_name=walmart&approved=false"
```

### GET /api/entries/[id]
Get a single entry by ID:
```bash
curl http://localhost:3000/api/entries/123
```

### PUT /api/entries/[id]
Update an entry:
```bash
curl -X PUT http://localhost:3000/api/entries/123 \
  -H "Content-Type: application/json" \
  -d '{
    "store_name": "Updated Store",
    "store_address": "...",
    "date_of_purchase": "2025-01-15",
    "subtotal": 100.00,
    "gst": 5.00,
    "hst": 8.00,
    "total": 113.00,
    "total_discounts": 0,
    "payment_method": "Credit Card",
    "line_items": [...],
    "approved": false
  }'
```

### GET /api/image-url
Generate presigned S3 URL:
```bash
curl "http://localhost:3000/api/image-url?file_name=receipt.jpg"
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running on 172.84.20.6:5432
- Check credentials in .env.local
- Verify the `chrisexp` table exists

### S3/MinIO Connection Issues
- Verify MinIO is running on odroidhc4.lan:9000
- Check MinIO access credentials
- Verify `chris-expenses` bucket exists and contains images

### Missing Images
- If image doesn't display, verify `file_name` field in database
- Check if the file exists in S3 bucket
- Verify S3 credentials have read access

## Component Structure

```
app/page.tsx (Main page container)
├── FilterBar (Filter controls)
├── EntryList (Entry selector list)
└── EntryDetail (Edit form)
    ├── LineItemsEditor (Inline JSONB editor)
    └── Image display (S3 presigned URL)
```

## Technologies Used

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Responsive styling
- **PostgreSQL** - Database
- **MinIO** - S3-compatible object storage
- **date-fns** - Date formatting and utilities

## Development Notes

- All state is managed at the page level with React hooks
- API calls are made directly from components using `fetch`
- Database queries use parameterized statements (SQL injection protection)
- Images use presigned URLs (24-hour expiration)
- Line items are stored as JSONB and edited inline

## Performance Considerations

- List loads all entries initially (consider pagination for large datasets)
- S3 presigned URLs are generated on-demand
- Images are not cached; new URLs are generated when viewing an entry
- Database queries use simple filtering without complex joins
