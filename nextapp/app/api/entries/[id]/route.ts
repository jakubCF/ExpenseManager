import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await query('SELECT * FROM public.chrisexp WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching entry:', error);
    return NextResponse.json({ error: 'Failed to fetch entry' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      store_name,
      store_address,
      store_phone,
      date_of_purchase,
      subtotal,
      gst,
      hst,
      total,
      total_discounts,
      payment_method,
      line_items,
      approved,
    } = body;

    const result = await query(
      `UPDATE public.chrisexp 
       SET store_name = $1, store_address = $2, store_phone = $3, 
           date_of_purchase = $4, subtotal = $5, gst = $6, hst = $7, 
           total = $8, total_discounts = $9, payment_method = $10, 
           line_items = $11, approved = $12
       WHERE id = $13 RETURNING *`,
      [
        store_name,
        store_address,
        store_phone,
        date_of_purchase,
        subtotal,
        gst,
        hst,
        total,
        total_discounts,
        payment_method,
        JSON.stringify(line_items),
        approved,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating entry:', error);
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }
}
