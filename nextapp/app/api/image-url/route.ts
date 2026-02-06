import { NextRequest, NextResponse } from 'next/server';
import minioClient from '@/lib/minio';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file_name');

    if (!fileName) {
      return NextResponse.json({ error: 'file_name is required' }, { status: 400 });
    }

    const url = await minioClient.presignedGetObject('chris-expenses', fileName, 24 * 60 * 60);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error generating S3 URL:', error);
    return NextResponse.json({ error: 'Failed to generate S3 URL' }, { status: 500 });
  }
}
