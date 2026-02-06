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
