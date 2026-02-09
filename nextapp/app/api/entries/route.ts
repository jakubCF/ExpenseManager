import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storeName = searchParams.get('store_name');
    const dateOfPurchase = searchParams.get('date_of_purchase');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const approved = searchParams.get('approved');

    let sql = 'SELECT * FROM public.chrisexp WHERE 1=1';
    const params: (string | boolean)[] = [];
    let paramIndex = 1;

    if (storeName) {
      sql += ` AND store_name ILIKE $${paramIndex}`;
      params.push(`%${storeName}%`);
      paramIndex++;
    }

    if (dateOfPurchase) {
      sql += ` AND date_of_purchase = $${paramIndex}`;
      params.push(dateOfPurchase);
      paramIndex++;
    }

    if (dateFrom && dateTo) {
      sql += ` AND date_of_purchase >= $${paramIndex} AND date_of_purchase <= $${paramIndex + 1}`;
      params.push(dateFrom, dateTo);
      paramIndex += 2;
    }

    if (approved !== null && approved !== undefined) {
      sql += ` AND approved = $${paramIndex}`;
      params.push(approved === 'true');
      paramIndex++;
    }

    sql += ' ORDER BY date_of_purchase DESC, id DESC';

    const result = await query(sql, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      store_name,
      store_address = null,
      store_phone = null,
      date_of_purchase = null,
      subtotal = 0,
      gst = 0,
      hst = 0,
      total = 0,
      total_discounts = 0,
      payment_method = null,
      line_items = null,
      file_name = null,
      approved = false,
    } = body;

    const result = await query(
      `INSERT INTO public.chrisexp (
        store_name, store_address, store_phone, date_of_purchase, subtotal,
        gst, hst, total, total_discounts, payment_method, line_items, file_name, approved
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
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
        line_items ? JSON.stringify(line_items) : null,
        file_name,
        approved,
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating entry:', error);
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
  }
}
